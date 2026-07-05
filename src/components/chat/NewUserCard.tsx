import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { users, getGenderFallbackAvatar } from "@/data/mockData";
import { motion, AnimatePresence } from "framer-motion";
import { useRealNewUsers, resolveProfileAvatarUrl } from "@/hooks/useRealNewUsers";


type CardType = "register" | "online";

interface DisplayUser {
  id?: string;
  name: string;
  age: number;
  city: string;
  avatar: string;
  gender?: string | null;
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

function pickRandomDisplayUser(onlineIds?: Set<string>): DisplayUser {
  const onlinePool = users.filter((u) => onlineIds?.has(u.id));
  const pool = onlinePool.length > 0 ? onlinePool : users;
  const women = pool.filter((u) => u.gender === "Feminino");
  const source = women.length > 0 && Math.random() < 0.7 ? women : pool;
  const u = source[Math.floor(Math.random() * source.length)];
  return { id: u.id, name: u.name, age: u.age, city: u.city, avatar: u.avatar, gender: u.gender };
}

export default function NewUserCard({ onlineIds }: { onlineIds?: Set<string> }) {
  const [user, setUser] = useState<DisplayUser | null>(null);
  const [cardType, setCardType] = useState<CardType>("register");
  const [visible, setVisible] = useState(false);
  const onlineIdsRef = useRef(onlineIds);
  onlineIdsRef.current = onlineIds;

  const realProfiles = useRealNewUsers(20);
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
        id: brandNew.id,
        name: firstName(brandNew.full_name),
        age: brandNew.age || 18,
        city: brandNew.city || "Brasil",
        avatar: resolveProfileAvatarUrl(brandNew.avatar_url) || getGenderFallbackAvatar(brandNew.id, brandNew.gender),
        gender: brandNew.gender,
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
      const visibleReal = [
        ...realProfiles.slice(0, 4),
        ...realProfiles.filter((p) => p.avatar_url).slice(0, 6),
      ].filter((p, index, arr) => arr.findIndex((x) => x.id === p.id) === index).slice(0, 8);
      const pool = visibleReal.filter((p) => !shownRealIds.current.has(p.id));
      if (pool.length === 0) return null;
      const p = pool[Math.floor(Math.random() * pool.length)];
      shownRealIds.current.add(p.id);
      return {
        id: p.id,
        name: firstName(p.full_name),
        age: p.age || 18,
        city: p.city || "Brasil",
        avatar: resolveProfileAvatarUrl(p.avatar_url) || getGenderFallbackAvatar(p.id, p.gender),
        gender: p.gender,
        real: true,
      };

    };

    const show = () => {
      const type: CardType = Math.random() > 0.5 ? "register" : "online";
      // Prefer real users ~60% of the time when available
      const real = Math.random() < 0.6 ? pickReal() : null;
      setUser(real ?? pickRandomDisplayUser(onlineIdsRef.current));
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
          <img
            src={user.avatar}
            alt={user.name}
            className="h-11 w-11 rounded-full object-cover flex-shrink-0 bg-secondary"
            onError={(e) => {
              const img = e.currentTarget;
              const fallback = getGenderFallbackAvatar(user.id || user.name, user.gender);
              if (img.src !== fallback) img.src = fallback;
            }}
          />
          <div className="min-w-0 flex-1">
            <p className="text-xs text-muted-foreground">
              {cardType === "register" ? "Novo registro ✨" : "Acabou de entrar 🟢"}
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
