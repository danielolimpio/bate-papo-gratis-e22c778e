import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface SavedConversation {
  userId: string;
  lastInteraction: number;
}

const TTL = 7 * 24 * 60 * 60 * 1000; // 7 days

export function useUserConversations(currentUserId: string | null) {
  const [list, setList] = useState<SavedConversation[]>([]);

  const load = useCallback(async () => {
    if (!currentUserId) {
      setList([]);
      return;
    }
    const { data, error } = await supabase
      .from("user_conversations")
      .select("target_user_id, last_interaction")
      .eq("user_id", currentUserId)
      .order("last_interaction", { ascending: false });

    if (error || !data) return;

    const cutoff = Date.now() - TTL;
    const mapped: SavedConversation[] = data
      .map((r) => ({
        userId: r.target_user_id as string,
        lastInteraction: new Date(r.last_interaction as string).getTime(),
      }))
      .filter((c) => c.lastInteraction >= cutoff);

    setList(mapped);
  }, [currentUserId]);

  useEffect(() => {
    load();
    if (!currentUserId) return;

    const channel = supabase
      .channel(`user_conversations:${currentUserId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "user_conversations",
          filter: `user_id=eq.${currentUserId}`,
        },
        () => load()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentUserId, load]);

  const upsert = useCallback(
    async (userId: string) => {
      if (!currentUserId) return;
      // Optimistic
      setList((prev) => {
        const filtered = prev.filter((c) => c.userId !== userId);
        return [{ userId, lastInteraction: Date.now() }, ...filtered];
      });
      await supabase
        .from("user_conversations")
        .upsert(
          {
            user_id: currentUserId,
            target_user_id: userId,
            last_interaction: new Date().toISOString(),
          },
          { onConflict: "user_id,target_user_id" }
        );
    },
    [currentUserId]
  );

  const remove = useCallback(
    async (userId: string) => {
      if (!currentUserId) return;
      setList((prev) => prev.filter((c) => c.userId !== userId));
      await supabase
        .from("user_conversations")
        .delete()
        .eq("user_id", currentUserId)
        .eq("target_user_id", userId);
    },
    [currentUserId]
  );

  return { conversations: list, upsertConversation: upsert, removeConversation: remove };
}
