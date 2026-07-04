import { Search, X, Send } from "lucide-react";
import { users, getUniqueGenderFallbackAvatar } from "@/data/mockData";
import { useState } from "react";
import type { PresenceUser } from "@/hooks/useRealPresence";
import { useRealNewUsers, resolveProfileAvatarUrl } from "@/hooks/useRealNewUsers";

interface Props {
  onProfileClick: (userId: string) => void;
  onlineIds: Set<string>;
  realOnline?: PresenceUser[];
  currentUserId?: string | null;
  onStartRealChat?: (userId: string) => void;
}

interface MergedRealUser {
  id: string;
  full_name: string;
  avatar_url: string | null;
  gender: string | null;
  city: string;
  created_at?: string;
}

const invalidSingleNames = new Set(["natural", "masculino", "feminino", "homem", "mulher", "teste", "usuario", "usuário"]);

function displayRealName(fullName: string | null | undefined, city?: string) {
  const cleaned = (fullName || "").trim().replace(/\s+/g, " ");
  const isInvalidSingle = !cleaned.includes(" ") && invalidSingleNames.has(cleaned.toLowerCase());
  return cleaned.length > 1 && !isInvalidSingle ? cleaned : `Usuário${city ? ` de ${city}` : ""}`;
}

export default function RightPanel({ onProfileClick, onlineIds, realOnline = [], currentUserId, onStartRealChat }: Props) {
  const [search, setSearch] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const recentReal = useRealNewUsers(20);

  // Merge presence users with recently registered real profiles (dedup by id)
  const mergedReal: MergedRealUser[] = [];
  const seen = new Set<string>();
  for (const u of realOnline) {
    if (u.id === currentUserId) continue;
    if (seen.has(u.id)) continue;
    seen.add(u.id);
    mergedReal.push({
      id: u.id,
      full_name: u.full_name,
      avatar_url: u.avatar_url,
      gender: (u as unknown as { gender?: string }).gender ?? null,
      city: u.city ?? "",
    });
  }
  const recentPrioritized = [
    ...recentReal.slice(0, 4),
    ...recentReal.filter((p) => p.avatar_url).slice(0, 6),
  ];
  for (const p of recentPrioritized) {
    if (p.id === currentUserId) continue;
    if (seen.has(p.id)) continue;
    seen.add(p.id);
    mergedReal.push({
      id: p.id,
      full_name: p.full_name,
      avatar_url: p.avatar_url,
      gender: p.gender,
      city: p.city ?? "",
      created_at: p.created_at,
    });
    if (mergedReal.length >= 8) break;
  }




  const filterFn = (u: typeof users[0]) =>
    u.name.toLowerCase().includes(search.toLowerCase());

  return (
    <div className="flex h-full flex-col bg-chat-right-panel border-l border-chat-divider overflow-y-auto">
      <div className="px-3 pt-2 pb-3 border-b border-chat-divider">
        <p className="text-[9px] uppercase tracking-wider text-muted-foreground/70 mb-1 text-right">Patrocinado</p>
        <a
          href="https://t.me/onlyfever"
          target="_blank"
          rel="noopener noreferrer sponsored"
          className="group relative block w-full overflow-hidden rounded-lg shadow-md"
        >
          <img
            src="/telegram-vip-banner.webp"
            alt="Grupo VIP Telegram"
            className="w-full h-auto object-cover aspect-square transition-transform duration-[1200ms] ease-out group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
            <div
              className="flex items-center justify-center gap-2 w-full rounded-md py-2 px-3 text-white text-[12px] font-semibold shadow-lg ring-1 ring-white/20 animate-[telegram-glow_4.5s_ease-in-out_infinite] transition-all duration-300 group-hover:brightness-110 group-hover:-translate-y-0.5"
              style={{ background: "linear-gradient(135deg, #229ED9 0%, #2AABEE 100%)" }}

            >
              <Send size={14} fill="white" className="-rotate-12" />
              <span>Entrar no Grupo Vip</span>
            </div>
          </div>
        </a>
      </div>

      <div className="flex items-center justify-between px-4 py-[10px] border-b border-chat-divider gap-2">
        {searchOpen ? (
          <div className="flex items-center gap-2 flex-1 rounded-full bg-secondary px-3 py-[6px]">
            <Search size={14} className="text-muted-foreground flex-shrink-0" />
            <input
              autoFocus
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar contatos"
              className="w-full bg-transparent text-[13px] text-foreground placeholder:text-muted-foreground outline-none"
            />
            <button
              onClick={() => { setSearch(""); setSearchOpen(false); }}
              className="rounded-full p-1 hover:bg-chat-hover transition-colors"
              aria-label="Fechar busca"
            >
              <X size={14} className="text-muted-foreground" />
            </button>
          </div>
        ) : (
          <>
            <h3 className="text-[13px] font-semibold text-muted-foreground uppercase tracking-wide">Contatos</h3>
            <button
              onClick={() => setSearchOpen(true)}
              className="rounded-full p-1.5 hover:bg-secondary transition-colors"
              aria-label="Buscar contatos"
            >
              <Search size={15} className="text-muted-foreground" />
            </button>
          </>
        )}
      </div>

      <div className="py-1 px-1">
        {(() => {
          const usedAvatars = new Set<string>();
          const realRows = mergedReal
            .filter((u) => displayRealName(u.full_name, u.city).toLowerCase().includes(search.toLowerCase()))
            .map((u) => {
              const fallback = getUniqueGenderFallbackAvatar(u.id, u.gender, usedAvatars, u.full_name);
              const uploaded = resolveProfileAvatarUrl(u.avatar_url);
              const primary = uploaded || fallback;
              usedAvatars.add(primary);
              return { ...u, displayName: displayRealName(u.full_name, u.city), primary, fallback };
            });

          const onlineOrder = Array.from(onlineIds);
          const syntheticRows = users
            .filter(filterFn)
            .filter((u) => !usedAvatars.has(u.avatar))
            .sort((a, b) => {
              const aOnline = onlineIds.has(a.id);
              const bOnline = onlineIds.has(b.id);
              if (aOnline && bOnline) return onlineOrder.indexOf(a.id) - onlineOrder.indexOf(b.id);
              if (aOnline && !bOnline) return -1;
              if (!aOnline && bOnline) return 1;
              return 0;
            });

          return (
            <>
              {realRows.map((u) => {
            return (
              <div
                key={`real-${u.id}`}
                className="flex items-center gap-[10px] cursor-pointer hover:bg-chat-hover rounded-md px-[10px] py-[6px] transition-colors"
                onClick={() => onStartRealChat?.(u.id)}
                title={u.city || undefined}
              >
                <div className="relative flex-shrink-0">
                  <img
                    src={u.primary}
                    alt={u.displayName}
                    className="h-8 w-8 rounded-full object-cover bg-secondary"
                    onError={(e) => {
                      const img = e.currentTarget;
                      if (img.src !== u.fallback) img.src = u.fallback;
                    }}
                  />
                  <span className="absolute bottom-0 right-0 h-[9px] w-[9px] rounded-full border-[1.5px] border-chat-right-panel bg-online" />
                </div>
                <div className="min-w-0 flex-1 flex items-center gap-1.5">
                  <span className="text-[13px] truncate text-foreground font-medium">{u.displayName}</span>
                  <span className="rounded-full bg-online/15 text-online px-1.5 py-[1px] text-[9px] font-semibold uppercase tracking-wide flex-shrink-0">
                    Online
                  </span>
                </div>
              </div>
            );
          })}


        {realRows.length > 0 && (

          <div className="my-1 mx-2 border-t border-chat-divider" />
        )}

        {syntheticRows.map((u) => {
          const isOnline = onlineIds.has(u.id);
          return (
            <div
              key={u.id}
              className="flex items-center gap-[10px] cursor-pointer hover:bg-chat-hover rounded-md px-[10px] py-[6px] transition-all duration-700 ease-in-out"
              onClick={() => onProfileClick(u.id)}
            >
              <div className="relative flex-shrink-0">
                <img
                  src={u.avatar}
                  alt={u.name}
                  className="h-8 w-8 rounded-full object-cover transition-opacity duration-700 ease-in-out"
                  style={{ opacity: isOnline ? 1 : 0.6 }}
                />
                <span
                  className="absolute bottom-0 right-0 h-[9px] w-[9px] rounded-full border-[1.5px] border-chat-right-panel bg-online transition-all duration-700 ease-in-out"
                  style={{ opacity: isOnline ? 1 : 0, transform: isOnline ? 'scale(1)' : 'scale(0)' }}
                />
              </div>
              <span className={`text-[13px] truncate transition-colors duration-700 ease-in-out ${isOnline ? 'text-foreground' : 'text-muted-foreground'}`}>
                {u.name}
              </span>
            </div>
          );
        })}
            </>
          );
        })()}
      </div>

    </div>
  );
}
