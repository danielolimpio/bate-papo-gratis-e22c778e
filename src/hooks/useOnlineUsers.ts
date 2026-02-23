import { useState, useEffect, useCallback, useRef } from "react";
import { users } from "@/data/mockData";

const nonMeUsers = users.filter(u => u.id !== "me");
const ONLINE_COUNT = Math.max(2, Math.floor(nonMeUsers.length * 0.10));

function getInitialOnlineIds(): Set<string> {
  const shuffled = [...nonMeUsers].sort(() => Math.random() - 0.5);
  return new Set(shuffled.slice(0, ONLINE_COUNT).map(u => u.id));
}

export function useOnlineUsers() {
  const [onlineIds, setOnlineIds] = useState<Set<string>>(() => getInitialOnlineIds());
  const onlineIdsRef = useRef(onlineIds);
  onlineIdsRef.current = onlineIds;

  const rotateOne = useCallback(() => {
    setOnlineIds(prev => {
      const onlineArr = Array.from(prev);
      const offlineArr = nonMeUsers
        .filter(u => !prev.has(u.id))
        .map(u => u.id);

      if (offlineArr.length === 0 || onlineArr.length === 0) return prev;

      // Pick random user to go offline
      const removeIdx = Math.floor(Math.random() * onlineArr.length);
      const removeId = onlineArr[removeIdx];

      // Pick random user to come online
      const addIdx = Math.floor(Math.random() * offlineArr.length);
      const addId = offlineArr[addIdx];

      const next = new Set(prev);
      next.delete(removeId);
      next.add(addId);
      return next;
    });
  }, []);

  useEffect(() => {
    const scheduleNext = () => {
      const delay = (60 + Math.random() * 60) * 1000; // 1-2 min
      return setTimeout(() => {
        rotateOne();
        timerRef = scheduleNext();
      }, delay);
    };

    let timerRef = scheduleNext();
    return () => clearTimeout(timerRef);
  }, [rotateOne]);

  return onlineIds;
}
