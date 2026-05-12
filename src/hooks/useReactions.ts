import { useCallback, useEffect, useState } from "react";

export const REACTION_EMOJIS = ["👍", "❤️", "😂", "😮", "😢", "😭", "😡"] as const;
export type ReactionEmoji = (typeof REACTION_EMOJIS)[number];

export interface ReactionMap {
  counts: Partial<Record<ReactionEmoji, number>>;
  mine: ReactionEmoji | null;
}

const KEY = "bpg:reactions:v2";

interface Stored {
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

/** Deterministic simulated reactions for fictional General Room messages. */
function simulatedCounts(msgId: string): Partial<Record<ReactionEmoji, number>> {
  let h = 0;
  for (let i = 0; i < msgId.length; i++) h = (h * 31 + msgId.charCodeAt(i)) | 0;
  h = Math.abs(h);
  // ~70% das mensagens sem reação simulada
  if (h % 10 < 7) return {};
  const out: Partial<Record<ReactionEmoji, number>> = {};
  const n = 1 + (h % 2); // 1-2 emojis distintos
  for (let i = 0; i < n; i++) {
    const e = REACTION_EMOJIS[(h >> (i * 3)) % REACTION_EMOJIS.length];
    out[e] = (out[e] || 0) + 1 + (((h >> (i * 5)) % 3));
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

  /** Get reactions. If `simulate` is true and there is no real entry,
   *  return deterministic simulated counts (used only in the General Room). */
  const get = useCallback((msgId: string, simulate = false): ReactionMap => {
    const all = read();
    const real = all[msgId];
    if (real) return { counts: { ...real.counts }, mine: real.mine };
    if (simulate) return { counts: simulatedCounts(msgId), mine: null };
    return { counts: {}, mine: null };
  }, []);

  const toggle = useCallback((msgId: string, emoji: ReactionEmoji, simulate = false) => {
    const all = read();
    const cur =
      all[msgId] ||
      { counts: simulate ? simulatedCounts(msgId) : {}, mine: null as ReactionEmoji | null };
    const counts = { ...cur.counts };

    if (cur.mine) {
      const prev = counts[cur.mine] || 0;
      if (prev <= 1) delete counts[cur.mine];
      else counts[cur.mine] = prev - 1;
    }
    let mine: ReactionEmoji | null;
    if (cur.mine === emoji) {
      mine = null;
    } else {
      counts[emoji] = (counts[emoji] || 0) + 1;
      mine = emoji;
    }
    all[msgId] = { counts, mine };
    write(all);
  }, []);

  return { get, toggle };
}
