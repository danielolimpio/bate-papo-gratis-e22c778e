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
  const roomRef = useRef(room);

  // Reset state synchronously when room changes so we never leak
  // messages from a previous room into the new room (and its cache).
  if (roomRef.current !== room) {
    roomRef.current = room;
    const next = roomCache.get(room) ?? [];
    setMessages(next);
    setLoading(next.length === 0);
  }

  // Keep cache in sync with state — but only for the room these messages belong to.
  useEffect(() => {
    if (roomRef.current !== room) return;
    roomCache.set(room, pruneByRetention(room, messages));
  }, [room, messages]);

  // Request notification permission on mount
  useEffect(() => {
    requestPermission();
    supabase.auth.getSession().then(({ data: { session } }) => {
      currentUserIdRef.current = session?.user?.id ?? null;
    });
  }, [requestPermission]);

  // Fetch messages with profile join, merge with cache.
  // Guarded so a late response from a previous room cannot contaminate
  // the current room's state/cache.
  const fetchMessages = useCallback(async () => {
    const fetchRoom = room;
    const cutoffIso = new Date(Date.now() - retentionMs(fetchRoom)).toISOString();
    const { data: msgs, error } = await supabase
      .from("messages")
      .select("id, user_id, room, content, image_url, created_at")
      .eq("room", fetchRoom)
      .gte("created_at", cutoffIso)
      .order("created_at", { ascending: true })
      .limit(500);

    if (roomRef.current !== fetchRoom) return; // room changed mid-flight
    if (error || !msgs) {
      setLoading(false);
      return;
    }

    // Fetch sender profiles in a single query
    const userIds = Array.from(new Set(msgs.map((m: any) => m.user_id)));
    let profilesMap = new Map<string, { full_name: string; avatar_url: string | null }>();
    if (userIds.length > 0) {
      const { data: profs } = await supabase
        .from("profiles")
        .select("id, full_name, avatar_url")
        .in("id", userIds);
      profs?.forEach((p: any) =>
        profilesMap.set(p.id, { full_name: p.full_name, avatar_url: p.avatar_url })
      );
    }
    if (roomRef.current !== fetchRoom) return;

    const fetched: ChatMessage[] = msgs.map((m: any) => {
      const p = profilesMap.get(m.user_id);
      return {
        id: m.id,
        user_id: m.user_id,
        room: m.room,
        content: m.content,
        image_url: m.image_url,
        created_at: m.created_at,
        sender_name: p?.full_name || "Anônimo",
        sender_avatar: p?.avatar_url
          ? `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/avatars/${p.avatar_url}`
          : null,
      };
    });
    setMessages((prev) => pruneByRetention(fetchRoom, mergeUnique(prev, fetched)));
    setLoading(false);
  }, [room]);

  useEffect(() => {
    // Hydrate from cache for the new room (state was already reset above)
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
