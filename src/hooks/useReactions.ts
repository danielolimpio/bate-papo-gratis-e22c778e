import { useCallback, useEffect, useState } from "react";

export const REACTION_EMOJIS = ["👍", "❤️", "😂", "😮", "😢", "😭", "😡"] as const;
export type ReactionEmoji = (typeof REACTION_EMOJIS)[number];

export interface ReactionMap {
  // emoji -> count (incluindo a do próprio usuário)
  counts: Partial<Record<ReactionEmoji, number>>;
  // emoji escolhido pelo usuário atual (apenas 1)
  mine: ReactionEmoji | null;
}

const KEY = "bpg:reactions:v1";

interface Stored {
  // msgId -> { emoji -> count, mine: emoji|null }
  [msgId: string]: { counts: Partial<Record<ReactionEmoji, number>>; mine: ReactionEmoji | null };
}

function read(): Stored {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "{}") as Stored;
  } catch {
    return {};
  }
}
function write(s: Stored) {
  try {
    localStorage.setItem(KEY, JSON.stringify(s));
    window.dispatchEvent(new CustomEvent("bpg-reactions-changed"));
  } catch {
    /* noop */
  }
}

/** Gera contagem fictícia inicial, determinística por msgId, para parecer que outros já reagiram. */
function seedCounts(msgId: string): Partial<Record<ReactionEmoji, number>> {
  // hash simples
  let h = 0;
  for (let i = 0; i < msgId.length; i++) h = (h * 31 + msgId.charCodeAt(i)) | 0;
  h = Math.abs(h);
  // 60% das mensagens não têm reações iniciais
  if (h % 10 < 6) return {};
  const out: Partial<Record<ReactionEmoji, number>> = {};
  const n = 1 + (h % 3); // 1-3 emojis distintos
  for (let i = 0; i < n; i++) {
    const e = REACTION_EMOJIS[(h >> (i * 3)) % REACTION_EMOJIS.length];
    out[e] = (out[e] || 0) + 1 + (((h >> (i * 5)) % 4));
  }
  return out;
}

export function useReactions() {
  const [, setTick] = useState(0);

  useEffect(() => {
    const handler = () => setTick((t) => t + 1);
    window.addEventListener("bpg-reactions-changed", handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener("bpg-reactions-changed", handler);
      window.removeEventListener("storage", handler);
    };
  }, []);

  const get = useCallback((msgId: string): ReactionMap => {
    const all = read();
    if (!all[msgId]) {
      all[msgId] = { counts: seedCounts(msgId), mine: null };
      write(all);
    }
    return { counts: { ...all[msgId].counts }, mine: all[msgId].mine };
  }, []);

  const toggle = useCallback((msgId: string, emoji: ReactionEmoji) => {
    const all = read();
    const cur = all[msgId] || { counts: seedCounts(msgId), mine: null };
    const counts = { ...cur.counts };

    // remove anterior do usuário (apenas 1 reação por usuário)
    if (cur.mine) {
      const prev = counts[cur.mine] || 0;
      if (prev <= 1) delete counts[cur.mine];
      else counts[cur.mine] = prev - 1;
    }
    let mine: ReactionEmoji | null;
    if (cur.mine === emoji) {
      mine = null; // toggle off
    } else {
      counts[emoji] = (counts[emoji] || 0) + 1;
      mine = emoji;
    }
    all[msgId] = { counts, mine };
    write(all);
  }, []);

  return { get, toggle };
}
