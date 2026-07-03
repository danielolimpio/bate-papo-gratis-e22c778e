import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface RealProfile {
  id: string;
  full_name: string;
  age: number;
  city: string;
  gender: string | null;
  avatar_url: string | null;
  created_at: string;
}

/** Resolves a profiles.avatar_url value to a usable public URL. */
export function resolveProfileAvatarUrl(raw: string | null | undefined): string | null {
  if (!raw) return null;
  if (raw.startsWith("http://") || raw.startsWith("https://") || raw.startsWith("data:")) {
    return raw;
  }
  // Storage path inside the public `avatars` bucket
  const { data } = supabase.storage.from("avatars").getPublicUrl(raw);
  return data.publicUrl || null;
}

/**
 * Fetches the most recent real registered profiles and subscribes to
 * INSERTs on `public.profiles` so freshly-registered users appear live.
 */
export function useRealNewUsers(limit = 20) {
  const [profiles, setProfiles] = useState<RealProfile[]>([]);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      const { data } = await supabase
        .from("profiles")
        .select("id, full_name, age, city, gender, avatar_url, created_at")
        .order("created_at", { ascending: false })
        .limit(limit);
      if (mounted && data) setProfiles(data as RealProfile[]);
    };
    load();

    const channel = supabase
      .channel("profiles-new")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "profiles" },
        (payload) => {
          const p = payload.new as RealProfile;
          setProfiles((prev) => [p, ...prev.filter((x) => x.id !== p.id)].slice(0, limit));
        }
      )
      .subscribe();

    return () => {
      mounted = false;
      supabase.removeChannel(channel);
    };
  }, [limit]);

  return profiles;
}
