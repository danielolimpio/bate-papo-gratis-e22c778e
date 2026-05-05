import { Search, X } from "lucide-react";
import { users } from "@/data/mockData";
import { useState } from "react";

interface Props {
  onProfileClick: (userId: string) => void;
  onlineIds: Set<string>;
}

export default function RightPanel({ onProfileClick, onlineIds }: Props) {
  const [search, setSearch] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);


  const filterFn = (u: typeof users[0]) =>
    u.name.toLowerCase().includes(search.toLowerCase());

  return (
    <div className="flex h-full flex-col bg-chat-right-panel border-l border-chat-divider overflow-y-auto">
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
        {users.filter(filterFn).sort((a, b) => {
          const aOnline = onlineIds.has(a.id);
          const bOnline = onlineIds.has(b.id);
          if (aOnline && !bOnline) return -1;
          if (!aOnline && bOnline) return 1;
          return 0;
        }).map((u) => {
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
      </div>
    </div>
  );
}
