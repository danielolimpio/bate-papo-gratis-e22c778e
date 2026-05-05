import { useCallback, useEffect, useState } from "react";
import { users } from "@/data/mockData";

export type MatchType = "given" | "received";

export interface MatchEntry {
  userId: string;
  type: MatchType;
  timestamp: number;
}

const STORAGE_PREFIX = "bpg:matches:";

function storageKey(currentUserId: string | null) {
  return `${STORAGE_PREFIX}${currentUserId ?? "guest"}`;
}

function loadMatches(currentUserId: string | null): MatchEntry[] {
  try {
    const raw = localStorage.getItem(storageKey(currentUserId));
    if (!raw) return [];
    const parsed = JSON.parse(raw) as MatchEntry[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveMatches(currentUserId: string | null, matches: MatchEntry[]) {
  try {
    localStorage.setItem(storageKey(currentUserId), JSON.stringify(matches));
  } catch {
    /* ignore */
  }
}

/** Seed a few "received" matches for new users so the section isn't empty. */
function seedReceivedMatches(): MatchEntry[] {
  const pool = users.filter((u) => u.id !== "me");
  const shuffled = [...pool].sort(() => Math.random() - 0.5).slice(0, 3);
  const now = Date.now();
  return shuffled.map((u, i) => ({
    userId: u.id,
    type: "received" as MatchType,
    timestamp: now - i * 1000 * 60 * 60,
  }));
}

export function useMatches(currentUserId: string | null) {
  const [matches, setMatches] = useState<MatchEntry[]>([]);

  useEffect(() => {
    const existing = loadMatches(currentUserId);
    if (existing.length === 0 && currentUserId) {
      const seeded = seedReceivedMatches();
      saveMatches(currentUserId, seeded);
      setMatches(seeded);
    } else {
      setMatches(existing);
    }
  }, [currentUserId]);

  const addMatch = useCallback(
    (userId: string, type: MatchType = "given") => {
      setMatches((prev) => {
        // Avoid duplicates: keep newest entry, prefer "given" over "received" if both
        const filtered = prev.filter((m) => m.userId !== userId);
        const next = [{ userId, type, timestamp: Date.now() }, ...filtered];
        saveMatches(currentUserId, next);
        return next;
      });
    },
    [currentUserId]
  );

  const removeMatch = useCallback(
    (userId: string) => {
      setMatches((prev) => {
        const next = prev.filter((m) => m.userId !== userId);
        saveMatches(currentUserId, next);
        return next;
      });
    },
    [currentUserId]
  );

  const hasMatch = useCallback(
    (userId: string) => matches.some((m) => m.userId === userId),
    [matches]
  );

  return { matches, addMatch, removeMatch, hasMatch };
}
