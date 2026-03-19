import { useCallback, useRef } from "react";

const NOTIFICATION_SOUND_URL = "https://assets.mixkit.co/active_storage/sfx/2354/2354-preview.mp3";

export function useChatNotification() {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playSound = useCallback(() => {
    try {
      if (!audioRef.current) {
        audioRef.current = new Audio(NOTIFICATION_SOUND_URL);
        audioRef.current.volume = 0.5;
      }
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
    } catch {}
  }, []);

  const showVisualNotification = useCallback((senderName: string, content: string) => {
    // Browser notification if permitted
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification(`${senderName}`, {
        body: content.length > 80 ? content.slice(0, 80) + "…" : content,
        icon: "/favicon.png",
        tag: "chat-message",
      });
    }
  }, []);

  const requestPermission = useCallback(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  return { playSound, showVisualNotification, requestPermission };
}
