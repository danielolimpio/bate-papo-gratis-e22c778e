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

/** Normalize gender labels from auth profile / mock data to "M" | "F" | null. */
function normalizeGender(g?: string | null): "M" | "F" | null {
  if (!g) return null;
  const v = g.toLowerCase();
  if (v.startsWith("masc") || v === "m" || v === "homem") return "M";
  if (v.startsWith("fem") || v === "f" || v === "mulher") return "F";
  return null;
}

/** Opposite-gender filter: only allow M↔F matches. If gender unknown, allow all. */
function isOppositeGender(currentGender: "M" | "F" | null, targetGender?: string | null) {
  const t = normalizeGender(targetGender);
  if (!currentGender || !t) return true;
  return currentGender !== t;
}

/** Seed a few "received" matches from opposite-gender users so the section isn't empty. */
function seedReceivedMatches(currentGender: "M" | "F" | null): MatchEntry[] {
  const pool = users.filter(
    (u) => u.id !== "me" && isOppositeGender(currentGender, u.gender)
  );
  const shuffled = [...pool].sort(() => Math.random() - 0.5).slice(0, 3);
  const now = Date.now();
  return shuffled.map((u, i) => ({
    userId: u.id,
    type: "received" as MatchType,
    timestamp: now - i * 1000 * 60 * 60,
  }));
}

export function useMatches(currentUserId: string | null, currentUserGender?: string | null) {
  const [matches, setMatches] = useState<MatchEntry[]>([]);
  const gender = normalizeGender(currentUserGender);

  useEffect(() => {
    const existing = loadMatches(currentUserId);
    // Filter out any same-gender matches from previously seeded/saved data.
    const cleaned = existing.filter((m) => {
      const target = users.find((u) => u.id === m.userId);
      return isOppositeGender(gender, target?.gender);
    });
    if (cleaned.length !== existing.length) {
      saveMatches(currentUserId, cleaned);
    }
    if (cleaned.length === 0 && currentUserId) {
      const seeded = seedReceivedMatches(gender);
      saveMatches(currentUserId, seeded);
      setMatches(seeded);
    } else {
      setMatches(cleaned);
    }
  }, [currentUserId, gender]);

  const addMatch = useCallback(
    (userId: string, type: MatchType = "given") => {
      const target = users.find((u) => u.id === userId);
      if (!isOppositeGender(gender, target?.gender)) {
        // Block same-gender match (only opposite-gender allowed for fictional matches).
        return false;
      }
      setMatches((prev) => {
        const filtered = prev.filter((m) => m.userId !== userId);
        const next = [{ userId, type, timestamp: Date.now() }, ...filtered];
        saveMatches(currentUserId, next);
        return next;
      });
      return true;
    },
    [currentUserId, gender]
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

  const canMatch = useCallback(
    (userId: string) => {
      const target = users.find((u) => u.id === userId);
      return isOppositeGender(gender, target?.gender);
    },
    [gender]
  );

  return { matches, addMatch, removeMatch, hasMatch, canMatch };
}
