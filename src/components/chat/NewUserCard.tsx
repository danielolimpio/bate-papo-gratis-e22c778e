import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { generateRandomNewUser } from "@/data/mockData";
import { motion, AnimatePresence } from "framer-motion";

export default function NewUserCard() {
  const [user, setUser] = useState<ReturnType<typeof generateRandomNewUser> | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const show = () => {
      const newUser = generateRandomNewUser();
      setUser(newUser);
      setVisible(true);
      setTimeout(() => setVisible(false), 5000);
    };

    const firstTimeout = setTimeout(show, 5000);
    const interval = setInterval(show, 17000);

    return () => {
      clearTimeout(firstTimeout);
      clearInterval(interval);
    };
  }, []);

  return (
    <AnimatePresence>
      {visible && user && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
          className="fixed bottom-4 left-4 z-40 flex items-center gap-3 rounded-xl bg-new-user-card px-4 py-3 shadow-lg border border-chat-divider max-w-[280px]"
        >
          <img src={user.avatar} alt={user.name} className="h-11 w-11 rounded-full object-cover flex-shrink-0" />
          <div className="min-w-0 flex-1">
            <p className="text-xs text-muted-foreground">Novo registro ✨</p>
            <p className="text-sm font-semibold text-foreground truncate">{user.name}</p>
            <p className="text-xs text-muted-foreground">{user.age} anos • {user.city}</p>
          </div>
          <button onClick={() => setVisible(false)} className="flex-shrink-0 rounded-full p-1 hover:bg-secondary transition-colors">
            <X size={14} className="text-muted-foreground" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
