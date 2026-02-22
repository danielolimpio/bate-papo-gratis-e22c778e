import { Search } from "lucide-react";
import { users } from "@/data/mockData";
import { useState } from "react";

interface Props {
  onProfileClick: (userId: string) => void;
}

export default function RightPanel({ onProfileClick }: Props) {
  const [search, setSearch] = useState("");
  const onlineUsers = users.filter((u) => u.isOnline);
  const offlineUsers = users.filter((u) => !u.isOnline);

  const filterFn = (u: typeof users[0]) =>
    u.name.toLowerCase().includes(search.toLowerCase());

  return (
    <div className="flex h-full flex-col bg-chat-right-panel border-l border-chat-divider overflow-y-auto">
      <div className="flex items-center justify-between px-4 py-[10px] border-b border-chat-divider">
        <h3 className="text-[13px] font-semibold text-muted-foreground uppercase tracking-wide">Contatos</h3>
        <button className="rounded-full p-1.5 hover:bg-secondary transition-colors">
          <Search size={15} className="text-muted-foreground" />
        </button>
      </div>

      <div className="py-1 px-1">
        {onlineUsers.filter(filterFn).map((u) => (
          <div
            key={u.id}
            className="flex items-center gap-[10px] cursor-pointer hover:bg-chat-hover rounded-md px-[10px] py-[6px] transition-colors"
            onClick={() => onProfileClick(u.id)}
          >
            <div className="relative flex-shrink-0">
              <img src={u.avatar} alt={u.name} className="h-8 w-8 rounded-full object-cover" />
              <span className="absolute bottom-0 right-0 h-[9px] w-[9px] rounded-full border-[1.5px] border-chat-right-panel bg-online" />
            </div>
            <span className="text-[13px] text-foreground truncate">{u.name}</span>
          </div>
        ))}

        {offlineUsers.filter(filterFn).map((u) => (
          <div
            key={u.id}
            className="flex items-center gap-[10px] cursor-pointer hover:bg-chat-hover rounded-md px-[10px] py-[6px] transition-colors"
            onClick={() => onProfileClick(u.id)}
          >
            <div className="relative flex-shrink-0">
              <img src={u.avatar} alt={u.name} className="h-8 w-8 rounded-full object-cover opacity-60" />
            </div>
            <span className="text-[13px] text-muted-foreground truncate">{u.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
