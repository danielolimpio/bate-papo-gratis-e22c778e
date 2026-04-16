import { useEffect, useRef } from "react";
import type { ChatMessage } from "./useMessages";
import { users } from "@/data/mockData";

const REPLIES = [
  "Olá", "Oi", "td bem", "Oiee", "Oie", "como vai", "oi", "oieee", "ola", "olaa",
  "td bemm", "como vai vc", "oi td bem?", "oi tudo bem", "oi como vai", "como vai vc",
  "hello", "heloo", "oi rs", "oie rs", "como esta", "cmo está", "cmo vai", "tdo bem",
  "Tudi bem", "tdo bom", "Tudo bom", "oi sumido 😊", "oie tdo bem?", "olaa rs",
  "oi, td certo por aí?", "e aí, td bem?", "oi ✨", "oi, como vc tá?", "oiii",
  "tudo ótimo e vc?", "oi, prazer 😄", "olá, td certo?", "oie, blz?", "oi, td certinho?",
];

function pickReply(): string {
  return REPLIES[Math.floor(Math.random() * REPLIES.length)];
}

/**
 * Simulates replies from fictional users in private chats.
 * When the real user sends a message to a fictional participant,
 * schedules a local reply between 10-30 minutes later (or shorter for demo).
 *
 * Returns local injected messages to be merged with real messages.
 */
export function useFakeReplies(
  participantId: string | null,
  realMessages: ChatMessage[],
  currentUserId: string | null,
  injectMessage: (msg: ChatMessage) => void
) {
  const scheduledRef = useRef<Set<string>>(new Set());
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    // Reset on participant change
    scheduledRef.current = new Set();
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  }, [participantId]);

  useEffect(() => {
    if (!participantId || !currentUserId) return;

    // Only fictional participants (those in mockData users list, not real DB users)
    const fictional = users.find((u) => u.id === participantId);
    if (!fictional) return;

    // Find user's last message that hasn't been scheduled for reply
    const myMessages = realMessages.filter((m) => m.user_id === currentUserId);
    const lastMine = myMessages[myMessages.length - 1];
    if (!lastMine) return;
    if (scheduledRef.current.has(lastMine.id)) return;

    scheduledRef.current.add(lastMine.id);

    // Random delay: 10–30 minutes in production. For better UX in demo, use 30s–90s.
    // Following user spec: "pode levar uns 10 a 30 minutos"
    const delayMs = (10 + Math.random() * 20) * 60 * 1000;

    const timer = setTimeout(() => {
      const reply: ChatMessage = {
        id: `fake-reply-${participantId}-${Date.now()}`,
        user_id: participantId,
        room: lastMine.room,
        content: pickReply(),
        image_url: null,
        created_at: new Date().toISOString(),
        sender_name: fictional.name,
        sender_avatar: fictional.avatar,
      };
      injectMessage(reply);
    }, delayMs);

    timersRef.current.push(timer);
  }, [participantId, realMessages, currentUserId, injectMessage]);

  useEffect(() => {
    return () => {
      timersRef.current.forEach(clearTimeout);
    };
  }, []);
}
