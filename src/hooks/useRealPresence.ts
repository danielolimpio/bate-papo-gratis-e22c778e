import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface PresenceUser {
  id: string;
  full_name: string;
  avatar_url: string | null;
  city?: string;
  age?: number;
  online_at: string;
}

/**
 * Tracks real online users across devices using Supabase Realtime presence.
 * Each authenticated user joins the shared `online-users` channel and
 * broadcasts their profile snapshot; everyone else receives the roster.
 */
export function useRealPresence(currentUser: {
  id: string;
  full_name: string;
  avatar_url: string | null;
  city?: string;
  age?: number;
} | null) {
  const [online, setOnline] = useState<PresenceUser[]>([]);

  useEffect(() => {
    if (!currentUser?.id) {
      setOnline([]);
      return;
    }

    const channel = supabase.channel("online-users", {
      config: { presence: { key: currentUser.id } },
    });

    const syncState = () => {
      const state = channel.presenceState<PresenceUser>();
      const list: PresenceUser[] = [];
      Object.values(state).forEach((entries) => {
        const entry = entries[0];
        if (entry) list.push(entry);
      });
      list.sort((a, b) => (a.online_at < b.online_at ? 1 : -1));
      setOnline(list);
    };

    channel
      .on("presence", { event: "sync" }, syncState)
      .on("presence", { event: "join" }, syncState)
      .on("presence", { event: "leave" }, syncState)
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          await channel.track({
            id: currentUser.id,
            full_name: currentUser.full_name,
            avatar_url: currentUser.avatar_url,
            city: currentUser.city,
            age: currentUser.age,
            online_at: new Date().toISOString(),
          });
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentUser?.id, currentUser?.full_name, currentUser?.avatar_url, currentUser?.city, currentUser?.age]);

  return online;
}
