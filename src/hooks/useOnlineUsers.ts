import { useState, useEffect, useCallback } from "react";
import { users } from "@/data/mockData";

const nonMeUsers = users.filter(u => u.id !== "me");
const ONLINE_COUNT = Math.max(3, Math.round(nonMeUsers.length * 0.40));
const FEMALE_ONLINE_SHARE = 0.68;
const ROTATION_MS = 15 * 1000;

function shuffle<T>(items: T[]): T[] {
  return [...items].sort(() => Math.random() - 0.5);
}

function getInitialOnlineIds(): Set<string> {
  const women = shuffle(nonMeUsers.filter((u) => u.gender === "Feminino"));
  const men = shuffle(nonMeUsers.filter((u) => u.gender === "Masculino"));
  const targetWomen = Math.min(women.length, Math.ceil(ONLINE_COUNT * FEMALE_ONLINE_SHARE));
  const picked = [...women.slice(0, targetWomen), ...men.slice(0, ONLINE_COUNT - targetWomen)];
  const filled = picked.length >= ONLINE_COUNT
    ? picked
    : [...picked, ...shuffle(nonMeUsers.filter((u) => !picked.some((p) => p.id === u.id))).slice(0, ONLINE_COUNT - picked.length)];
  return new Set(shuffle(filled).map(u => u.id));
}

export function useOnlineUsers() {
  const [onlineIds, setOnlineIds] = useState<Set<string>>(() => getInitialOnlineIds());

  const rotateOne = useCallback(() => {
    setOnlineIds(getInitialOnlineIds());
  }, []);

  useEffect(() => {
    const timerRef = setInterval(rotateOne, ROTATION_MS);
    return () => clearInterval(timerRef);
  }, [rotateOne]);

  return onlineIds;
}
