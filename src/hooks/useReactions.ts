import { useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { onSync } from "@/lib/syncBus";

export const REACTION_EMOJIS = ["👍", "❤️", "😂", "😮", "😢", "😭", "😡"] as const;
export type ReactionEmoji = (typeof REACTION_EMOJIS)[number];

export interface ReactionMap {
  counts: Partial<Record<ReactionEmoji, number>>;
  mine: ReactionEmoji | null;
}

interface Row {
  user_id: string;
  message_id: string;
  emoji: ReactionEmoji;
}

/** Deterministic simulated reactions for fictional General Room messages. */
function simulatedCounts(msgId: string): Partial<Record<ReactionEmoji, number>> {
  let h = 0;
  for (let i = 0; i < msgId.length; i++) h = (h * 31 + msgId.charCodeAt(i)) | 0;
  h = Math.abs(h);
  if (h % 10 < 7) return {};
  const out: Partial<Record<ReactionEmoji, number>> = {};
  const n = 1 + (h % 2);
  for (let i = 0; i < n; i++) {
    const e = REACTION_EMOJIS[(h >> (i * 3)) % REACTION_EMOJIS.length];
    out[e] = (out[e] || 0) + 1 + (((h >> (i * 5)) % 3));
  }
  return out;
}

// Module-level shared cache so all hook instances stay in sync
const cache = new Map<string, Row[]>(); // message_id -> rows
let currentUserId: string | null = null;
const listeners = new Set<() => void>();
let initialized = false;

function notify() {
  listeners.forEach((l) => l());
}

function applyRow(row: Row) {
  const list = cache.get(row.message_id) || [];
  const filtered = list.filter((r) => r.user_id !== row.user_id);
  filtered.push(row);
  cache.set(row.message_id, filtered);
}

function removeRow(message_id: string, user_id: string) {
  const list = cache.get(message_id);
  if (!list) return;
  const filtered = list.filter((r) => r.user_id !== user_id);
  if (filtered.length) cache.set(message_id, filtered);
  else cache.delete(message_id);
}

async function init() {
  if (initialized) return;
  initialized = true;

  const refresh = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    currentUserId = user?.id ?? null;
    cache.clear();
    const { data } = await supabase
      .from("message_reactions")
      .select("user_id, message_id, emoji");
    if (data) {
      data.forEach((r) =>
        applyRow({ user_id: r.user_id as string, message_id: r.message_id as string, emoji: r.emoji as ReactionEmoji })
      );
    }
    notify();
  };

  await refresh();

  supabase.auth.onAuthStateChange(() => {
    refresh();
  });

  onSync(() => {
    refresh();
  });

  supabase
    .channel("message_reactions:all")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "message_reactions" },
      (payload) => {
        if (payload.eventType === "DELETE") {
          const old = payload.old as Row;
          if (old?.message_id && old?.user_id) removeRow(old.message_id, old.user_id);
        } else {
          const r = payload.new as Row;
          if (r?.message_id) applyRow(r);
        }
        notify();
      }
    )
    .subscribe();
}

export function useReactions() {
  const [, setTick] = useState(0);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    init();
    const l = () => mountedRef.current && setTick((t) => t + 1);
    listeners.add(l);
    return () => {
      mountedRef.current = false;
      listeners.delete(l);
    };
  }, []);

  const get = useCallback((msgId: string, simulate = false): ReactionMap => {
    const rows = cache.get(msgId);
    if (rows && rows.length) {
      const counts: Partial<Record<ReactionEmoji, number>> = {};
      let mine: ReactionEmoji | null = null;
      rows.forEach((r) => {
        counts[r.emoji] = (counts[r.emoji] || 0) + 1;
        if (currentUserId && r.user_id === currentUserId) mine = r.emoji;
      });
      return { counts, mine };
    }
    if (simulate) return { counts: simulatedCounts(msgId), mine: null };
    return { counts: {}, mine: null };
  }, []);

  const toggle = useCallback(async (msgId: string, emoji: ReactionEmoji, _simulate = false) => {
    if (!currentUserId) {
      const { data: { user } } = await supabase.auth.getUser();
      currentUserId = user?.id ?? null;
      if (!currentUserId) return;
    }
    const rows = cache.get(msgId) || [];
    const mineRow = rows.find((r) => r.user_id === currentUserId);

    if (mineRow && mineRow.emoji === emoji) {
      // Remove
      removeRow(msgId, currentUserId);
      notify();
      await supabase
        .from("message_reactions")
        .delete()
        .eq("user_id", currentUserId)
        .eq("message_id", msgId);
    } else {
      // Upsert
      applyRow({ user_id: currentUserId, message_id: msgId, emoji });
      notify();
      await supabase
        .from("message_reactions")
        .upsert(
          { user_id: currentUserId, message_id: msgId, emoji },
          { onConflict: "user_id,message_id" }
        );
    }
  }, []);

  return { get, toggle };
}
