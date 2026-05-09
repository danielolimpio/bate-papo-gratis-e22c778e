import { useCallback, useEffect, useState } from "react";

export interface SavedConversation {
  userId: string;
  lastInteraction: number;
}

const PREFIX = "bpg:userconvs:";
const TTL = 7 * 24 * 60 * 60 * 1000; // 7 days

const key = (id: string | null) => `${PREFIX}${id ?? "guest"}`;

function load(id: string | null): SavedConversation[] {
  try {
    const raw = localStorage.getItem(key(id));
    if (!raw) return [];
    const arr = JSON.parse(raw) as SavedConversation[];
    const cutoff = Date.now() - TTL;
    return arr.filter((c) => c.lastInteraction >= cutoff);
  } catch {
    return [];
  }
}

function save(id: string | null, list: SavedConversation[]) {
  try {
    localStorage.setItem(key(id), JSON.stringify(list));
  } catch {
    /* ignore */
  }
}

export function useUserConversations(currentUserId: string | null) {
  const [list, setList] = useState<SavedConversation[]>([]);

  useEffect(() => {
    const cleaned = load(currentUserId);
    save(currentUserId, cleaned);
    setList(cleaned);
  }, [currentUserId]);

  const upsert = useCallback(
    (userId: string) => {
      setList((prev) => {
        const filtered = prev.filter((c) => c.userId !== userId);
        const next = [{ userId, lastInteraction: Date.now() }, ...filtered];
        save(currentUserId, next);
        return next;
      });
    },
    [currentUserId]
  );

  const remove = useCallback(
    (userId: string) => {
      setList((prev) => {
        const next = prev.filter((c) => c.userId !== userId);
        save(currentUserId, next);
        return next;
      });
    },
    [currentUserId]
  );

  return { conversations: list, upsertConversation: upsert, removeConversation: remove };
}
