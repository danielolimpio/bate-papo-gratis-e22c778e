import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useChatNotification } from "./useChatNotification";

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

// Module-level cache keeps history per room across navigation.
// - "general": kept for last 24h
// - private rooms: kept for last 7 days
const roomCache: Map<string, ChatMessage[]> = new Map();

const retentionMs = (room: string) =>
  room === "general" ? 24 * 60 * 60 * 1000 : 7 * 24 * 60 * 60 * 1000;

const pruneByRetention = (room: string, list: ChatMessage[]) => {
  const cutoff = Date.now() - retentionMs(room);
  return list
    .filter((m) => new Date(m.created_at).getTime() >= cutoff)
    .sort(
      (a, b) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );
};

const mergeUnique = (a: ChatMessage[], b: ChatMessage[]) => {
  const map = new Map<string, ChatMessage>();
  [...a, ...b].forEach((m) => map.set(m.id, m));
  return Array.from(map.values());
};

export function useMessages(room: string) {
  const cached = roomCache.get(room) ?? [];
  const [messages, setMessages] = useState<ChatMessage[]>(cached);
  const [loading, setLoading] = useState(cached.length === 0);
  const { playSound, showVisualNotification, requestPermission } = useChatNotification();
  const currentUserIdRef = useRef<string | null>(null);

  // Keep cache in sync with state for this room
  useEffect(() => {
    roomCache.set(room, pruneByRetention(room, messages));
  }, [room, messages]);

  // Request notification permission on mount
  useEffect(() => {
    requestPermission();
    supabase.auth.getSession().then(({ data: { session } }) => {
      currentUserIdRef.current = session?.user?.id ?? null;
    });
  }, [requestPermission]);

  // Fetch messages with profile join, merge with cache
  const fetchMessages = useCallback(async () => {
    const { data } = await supabase
      .from("messages")
      .select("*, profiles:user_id(full_name, avatar_url)")
      .eq("room", room)
      .order("created_at", { ascending: true })
      .limit(200);

    if (data) {
      const fetched: ChatMessage[] = data.map((m: any) => ({
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
      }));
      setMessages((prev) => pruneByRetention(room, mergeUnique(prev, fetched)));
    }
    setLoading(false);
  }, [room]);

  useEffect(() => {
    // Hydrate from cache (already done in initial state); only show loading if empty
    const initial = roomCache.get(room) ?? [];
    setMessages(pruneByRetention(room, initial));
    setLoading(initial.length === 0);
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
            return pruneByRetention(room, [...prev, enriched]);
          });

          // Notify only for messages from others
          if (enriched.user_id !== currentUserIdRef.current) {
            playSound();
            if (document.hidden) {
              showVisualNotification(enriched.sender_name || "Novo", enriched.content);
            }
          }
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

  const injectLocalMessage = useCallback(
    (msg: ChatMessage, opts?: { silent?: boolean }) => {
      setMessages((prev) => {
        if (prev.some((m) => m.id === msg.id)) return prev;
        if (!opts?.silent) {
          playSound();
          if (document.hidden) {
            showVisualNotification(msg.sender_name || "Mensagem", msg.content);
          }
        }
        return pruneByRetention(room, [...prev, msg]);
      });
    },
    [room, playSound, showVisualNotification]
  );

  return { messages, loading, sendMessage, injectLocalMessage };
}
