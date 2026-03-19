import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface ChatMessage {
  id: string;
  user_id: string;
  room: string;
  content: string;
  image_url: string | null;
  created_at: string;
  sender_name?: string;
  sender_avatar?: string;
}

export function useMessages(room: string) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch messages with profile join
  const fetchMessages = useCallback(async () => {
    const { data } = await supabase
      .from("messages")
      .select("*, profiles:user_id(full_name, avatar_url)")
      .eq("room", room)
      .order("created_at", { ascending: true })
      .limit(200);

    if (data) {
      setMessages(
        data.map((m: any) => ({
          id: m.id,
          user_id: m.user_id,
          room: m.room,
          content: m.content,
          image_url: m.image_url,
          created_at: m.created_at,
          sender_name: m.profiles?.full_name || "Anônimo",
          sender_avatar: m.profiles?.avatar_url
            ? `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/avatars/${m.profiles.avatar_url}`
            : null,
        }))
      );
    }
    setLoading(false);
  }, [room]);

  useEffect(() => {
    fetchMessages();

    // Subscribe to real-time inserts
    const channel = supabase
      .channel(`messages-${room}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `room=eq.${room}`,
        },
        async (payload) => {
          const newMsg = payload.new as any;
          // Fetch sender profile
          const { data: profile } = await supabase
            .from("profiles")
            .select("full_name, avatar_url")
            .eq("id", newMsg.user_id)
            .single();

          const enriched: ChatMessage = {
            id: newMsg.id,
            user_id: newMsg.user_id,
            room: newMsg.room,
            content: newMsg.content,
            image_url: newMsg.image_url,
            created_at: newMsg.created_at,
            sender_name: profile?.full_name || "Anônimo",
            sender_avatar: profile?.avatar_url
              ? `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/avatars/${profile.avatar_url}`
              : null,
          };

          setMessages((prev) => {
            if (prev.some((m) => m.id === enriched.id)) return prev;
            return [...prev, enriched];
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [room, fetchMessages]);

  const sendMessage = async (content: string, userId: string) => {
    if (!content.trim()) return;
    await supabase.from("messages").insert({
      user_id: userId,
      room,
      content: content.trim(),
    });
  };

  return { messages, loading, sendMessage };
}
