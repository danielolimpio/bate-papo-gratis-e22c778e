import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { users } from "@/data/mockData";

export type MatchType = "given" | "received";

export interface MatchEntry {
  userId: string;
  type: MatchType;
  timestamp: number;
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

  // Load from DB and subscribe to realtime changes for cross-device sync
  useEffect(() => {
    if (!currentUserId) {
      setMatches([]);
      return;
    }

    let cancelled = false;

    const load = async () => {
      const { data, error } = await supabase
        .from("user_matches")
        .select("target_user_id, match_type, created_at")
        .eq("user_id", currentUserId)
        .order("created_at", { ascending: false });
      if (cancelled || error || !data) return;

      let entries: MatchEntry[] = data
        .map((r: any) => ({
          userId: r.target_user_id,
          type: r.match_type as MatchType,
          timestamp: new Date(r.created_at).getTime(),
        }))
        // drop any same-gender legacy rows
        .filter((m) => {
          const target = users.find((u) => u.id === m.userId);
          return isOppositeGender(gender, target?.gender);
        });

      // Seed initial received matches once if user has none
      if (entries.length === 0) {
        const seeded = seedReceivedMatches(gender);
        if (seeded.length > 0) {
          await supabase.from("user_matches").insert(
            seeded.map((s) => ({
              user_id: currentUserId,
              target_user_id: s.userId,
              match_type: s.type,
              created_at: new Date(s.timestamp).toISOString(),
            }))
          );
          entries = seeded;
        }
      }

      if (!cancelled) setMatches(entries);
    };

    load();

    const channel = supabase
      .channel(`user_matches-${currentUserId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "user_matches", filter: `user_id=eq.${currentUserId}` },
        () => {
          load();
        }
      )
      .subscribe();

    return () => {
      cancelled = true;
      supabase.removeChannel(channel);
    };
  }, [currentUserId, gender]);

  const addMatch = useCallback(
    (userId: string, type: MatchType = "given") => {
      if (!currentUserId) return false;
      const target = users.find((u) => u.id === userId);
      if (!isOppositeGender(gender, target?.gender)) return false;

      const entry: MatchEntry = { userId, type, timestamp: Date.now() };
      setMatches((prev) => [entry, ...prev.filter((m) => m.userId !== userId)]);

      supabase
        .from("user_matches")
        .upsert(
          {
            user_id: currentUserId,
            target_user_id: userId,
            match_type: type,
            created_at: new Date(entry.timestamp).toISOString(),
          },
          { onConflict: "user_id,target_user_id" }
        )
        .then(({ error }) => {
          if (error) console.error("addMatch error", error);
        });

      return true;
    },
    [currentUserId, gender]
  );

  const removeMatch = useCallback(
    (userId: string) => {
      if (!currentUserId) return;
      setMatches((prev) => prev.filter((m) => m.userId !== userId));
      supabase
        .from("user_matches")
        .delete()
        .eq("user_id", currentUserId)
        .eq("target_user_id", userId)
        .then(({ error }) => {
          if (error) console.error("removeMatch error", error);
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
