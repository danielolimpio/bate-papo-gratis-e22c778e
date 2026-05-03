import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { users, getRandomFreshUser } from "@/data/mockData";
import { motion, AnimatePresence } from "framer-motion";

type CardType = "register" | "online";

interface DisplayUser {
  name: string;
  age: number;
  city: string;
  avatar: string;
}

const cities = [
  "São Paulo", "Rio de Janeiro", "Belo Horizonte", "Salvador", "Brasília",
  "Curitiba", "Fortaleza", "Recife", "Porto Alegre", "Manaus",
  "Goiânia", "Campinas", "Florianópolis", "Vitória", "Belém",
  "Niterói", "Santos", "Ribeirão Preto", "Sorocaba", "Joinville",
];

function pickRandomDisplayUser(type: CardType): DisplayUser {
  // For "register" -> fresh random name + photo of the SAME gender (no mismatches)
  // For "online" -> pick an existing profile coming online
  if (type === "register") {
    const fresh = getRandomFreshUser();
    return {
      name: fresh.name,
      age: Math.floor(Math.random() * 22) + 19,
      city: cities[Math.floor(Math.random() * cities.length)],
      avatar: fresh.avatar,
    };
  }
  const u = users[Math.floor(Math.random() * users.length)];
  return { name: u.name, age: u.age, city: u.city, avatar: u.avatar };
}

export default function NewUserCard() {
  const [user, setUser] = useState<DisplayUser | null>(null);
  const [cardType, setCardType] = useState<CardType>("register");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let hideTimer: ReturnType<typeof setTimeout>;
    let nextTimer: ReturnType<typeof setTimeout>;

    const show = () => {
      const type: CardType = Math.random() > 0.5 ? "register" : "online";
      setUser(pickRandomDisplayUser(type));
      setCardType(type);
      setVisible(true);
      hideTimer = setTimeout(() => setVisible(false), 5000);
    };

    const scheduleNext = () => {
      // Random interval 15-22s for natural feel
      const delay = 15000 + Math.random() * 7000;
      nextTimer = setTimeout(() => {
        show();
        scheduleNext();
      }, delay);
    };

    const firstTimeout = setTimeout(() => {
      show();
      scheduleNext();
    }, 5000);

    return () => {
      clearTimeout(firstTimeout);
      clearTimeout(hideTimer);
      clearTimeout(nextTimer);
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
            <p className="text-xs text-muted-foreground">
              {cardType === "register" ? "Novo registro ✨" : "Acabou de entrar 🟢"}
            </p>
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
