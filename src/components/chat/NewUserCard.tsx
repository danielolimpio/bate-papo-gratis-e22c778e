import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { users, getRandomFreshUser } from "@/data/mockData";
import { motion, AnimatePresence } from "framer-motion";
import { useRealNewUsers } from "@/hooks/useRealNewUsers";

type CardType = "register" | "online";

interface DisplayUser {
  name: string;
  age: number;
  city: string;
  avatar: string;
  real?: boolean;
}

const cities = [
  "São Paulo", "Rio de Janeiro", "Belo Horizonte", "Salvador", "Brasília",
  "Curitiba", "Fortaleza", "Recife", "Porto Alegre", "Manaus",
  "Goiânia", "Campinas", "Florianópolis", "Vitória", "Belém",
  "Niterói", "Santos", "Ribeirão Preto", "Sorocaba", "Joinville",
];

function firstName(full?: string) {
  if (!full) return "Usuário";
  return full.trim().split(/\s+/)[0];
}

function pickRandomDisplayUser(type: CardType): DisplayUser {
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

  const realProfiles = useRealNewUsers(30);
  const shownRealIds = useRef<Set<string>>(new Set());
  const seenRealIds = useRef<Set<string>>(new Set());
  const isFirstRealSync = useRef(true);

  // When a brand new real profile appears via realtime, show it immediately.
  useEffect(() => {
    if (isFirstRealSync.current) {
      realProfiles.forEach((p) => seenRealIds.current.add(p.id));
      isFirstRealSync.current = false;
      return;
    }
    const brandNew = realProfiles.find((p) => !seenRealIds.current.has(p.id));
    if (brandNew) {
      seenRealIds.current.add(brandNew.id);
      shownRealIds.current.add(brandNew.id);
      setUser({
        name: firstName(brandNew.full_name),
        age: brandNew.age || 18,
        city: brandNew.city || "Brasil",
        avatar: brandNew.avatar_url || getRandomFreshUser().avatar,
        real: true,
      });
      setCardType("register");
      setVisible(true);
    }
  }, [realProfiles]);

  useEffect(() => {
    let hideTimer: ReturnType<typeof setTimeout>;
    let nextTimer: ReturnType<typeof setTimeout>;

    const pickReal = (): DisplayUser | null => {
      const pool = realProfiles.filter((p) => !shownRealIds.current.has(p.id));
      if (pool.length === 0) return null;
      const p = pool[Math.floor(Math.random() * pool.length)];
      shownRealIds.current.add(p.id);
      return {
        name: firstName(p.full_name),
        age: p.age || 18,
        city: p.city || "Brasil",
        avatar: p.avatar_url || getRandomFreshUser().avatar,
        real: true,
      };
    };

    const show = () => {
      const type: CardType = Math.random() > 0.5 ? "register" : "online";
      // Prefer real users ~60% of the time when available
      const real = Math.random() < 0.6 ? pickReal() : null;
      setUser(real ?? pickRandomDisplayUser(type));
      setCardType(type);
      setVisible(true);
      hideTimer = setTimeout(() => setVisible(false), 5000);
    };

    const scheduleNext = () => {
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
  }, [realProfiles]);

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
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              {cardType === "register" ? "Novo registro ✨" : "Acabou de entrar 🟢"}
              {user.real && (
                <span className="ml-1 rounded-full bg-primary/15 text-primary px-1.5 py-[1px] text-[9px] font-semibold uppercase tracking-wide">
                  Real
                </span>
              )}
            </p>
            <p className="text-sm font-semibold text-foreground truncate">{user.name}</p>
            <p className="text-xs text-muted-foreground">{user.age} anos • {user.city}</p>
          </div>
          <button onClick={() => setVisible(false)} className="flex-shrink-0 rounded-full p-1 hover:bg-secondary transition-colors" aria-label="Fechar">
            <X size={14} className="text-muted-foreground" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
