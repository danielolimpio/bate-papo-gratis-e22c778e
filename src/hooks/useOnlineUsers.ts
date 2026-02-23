import { useState, useEffect, useCallback } from "react";
import { getRandomOnlineUserIds } from "@/data/mockData";

export function useOnlineUsers() {
  const [onlineIds, setOnlineIds] = useState<Set<string>>(() => getRandomOnlineUserIds());

  const rotate = useCallback(() => {
    setOnlineIds(getRandomOnlineUserIds());
  }, []);

  useEffect(() => {
    // Rotate every 3-5 minutes randomly
    const scheduleNext = () => {
      const delay = (3 + Math.random() * 2) * 60 * 1000; // 3-5 min
      return setTimeout(() => {
        rotate();
        timerRef = scheduleNext();
      }, delay);
    };

    let timerRef = scheduleNext();
    return () => clearTimeout(timerRef);
  }, [rotate]);

  return onlineIds;
}
