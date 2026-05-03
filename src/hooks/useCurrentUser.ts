import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";

export interface UserProfile {
  id: string;
  full_name: string;
  age: number;
  gender: string;
  relationship_status: string;
  sexual_preference: string;
  city: string;
  avatar_url: string | null;
}

const genderOptions = new Set(["masculino", "feminino", "outro"]);
const relationshipOptions = new Set(["solteiro", "casado", "namorando", "separado", "viúvo", "enrolado"]);
const preferenceOptions = new Set(["homens", "mulheres", "ambos"]);

export function useCurrentUser() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async (currentUser: User) => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", currentUser.id)
      .maybeSingle();

    if (error) {
      setProfile(null);
      return;
    }

    if (data) {
      setProfile(data);
      return;
    }

    const metadata = currentUser.user_metadata ?? {};
    const ageValue = Number(metadata.age);

    const fallbackProfile = {
      id: currentUser.id,
      full_name:
        typeof metadata.full_name === "string" && metadata.full_name.trim().length > 0
          ? metadata.full_name.trim()
          : currentUser.email?.split("@")[0] ?? "Usuário",
      age: Number.isFinite(ageValue) ? Math.max(18, Math.min(99, ageValue)) : 18,
      gender: genderOptions.has(metadata.gender) ? metadata.gender : "outro",
      relationship_status: relationshipOptions.has(metadata.relationship_status)
        ? metadata.relationship_status
        : "solteiro",
      sexual_preference: preferenceOptions.has(metadata.sexual_preference)
        ? metadata.sexual_preference
        : "ambos",
      city: typeof metadata.city === "string" ? metadata.city.trim() : "",
    };

    const { data: createdProfile } = await supabase
      .from("profiles")
      .upsert(fallbackProfile)
      .select("*")
      .maybeSingle();

    setProfile(createdProfile ?? null);
  }, []);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setUser(session?.user ?? null);
        if (session?.user) {
          await fetchProfile(session.user);
        } else {
          setProfile(null);
        }
        setLoading(false);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [fetchProfile]);

  const refreshProfile = async () => {
    if (user) await fetchProfile(user);
  };

  return { user, profile, loading, refreshProfile };
}
