import { Search, MoreHorizontal, Edit } from "lucide-react";
import { conversations, users, type Conversation } from "@/data/mockData";
import StackedAvatars from "./StackedAvatars";
import { useMemo } from "react";

type TabType = "tudo" | "nao-lidas" | "grupos";

interface Props {
  activeConversationId: string | null;
  onSelect: (id: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  readConversations: Set<string>;
  isGeneralActive?: boolean;
  onSelectGeneral?: () => void;
}

export default function ConversationList({ activeConversationId, onSelect, searchQuery, onSearchChange, activeTab, onTabChange, readConversations, isGeneralActive, onSelectGeneral }: Props) {
  const filtered = useMemo(() => {
    if (!searchQuery) return conversations;
    const q = searchQuery.toLowerCase();
    return conversations.filter((c) => {
      const user = users.find((u) => u.id === c.participantId);
      return user?.name.toLowerCase().includes(q);
    });
  }, [searchQuery]);

  return (
    <div className="flex h-full flex-col bg-chat-sidebar">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-1 pb-2">
        <h1 className="text-xl font-bold text-foreground">Conversas</h1>
        <div className="flex items-center gap-1">
          <button className="rounded-full bg-secondary p-[7px] hover:bg-chat-hover transition-colors">
            <MoreHorizontal size={16} className="text-foreground" />
          </button>
          <button className="rounded-full bg-secondary p-[7px] hover:bg-chat-hover transition-colors">
            <Edit size={16} className="text-foreground" />
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="px-3 pb-2">
        <div className="flex items-center gap-2 rounded-full bg-secondary px-3 py-[6px]">
          <Search size={15} className="text-muted-foreground flex-shrink-0" />
          <input
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Pesquisar no Bate-Papo Grátis"
            className="w-full bg-transparent text-[13px] text-foreground placeholder:text-muted-foreground outline-none"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-[2px] px-3 pb-1.5">
        {(["tudo", "nao-lidas", "grupos"] as TabType[]).map((tab) => {
          const labels: Record<TabType, string> = { tudo: "Tudo", "nao-lidas": "Não lidas", grupos: "Grupos" };
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => onTabChange(tab)}
              className={`rounded-full px-3 py-[5px] text-xs font-semibold transition-colors ${
                isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-secondary"
              }`}
            >
              {labels[tab]}
            </button>
          );
        })}
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto">
        {/* Pinned: Sala de Bate Papo */}
        <div
          onClick={onSelectGeneral}
          className={`flex cursor-pointer flex-col items-center gap-2 px-3 py-3 mx-[6px] mb-1 rounded-md transition-colors ${
            isGeneralActive ? "bg-chat-active" : "hover:bg-chat-hover"
          }`}
        >
          <StackedAvatars size={40} />
          <div className="w-full text-center">
            <div className="flex items-center justify-center gap-1.5">
              <span className="text-[13px] font-semibold text-foreground">Sala de Bate Papo</span>
              <span className="text-[11px] text-primary">📌</span>
            </div>
            <p className="text-[12px] text-muted-foreground truncate mt-[1px]">Converse com todos em tempo real</p>
          </div>
        </div>

        {filtered.map((conv) => (
          <ConversationItem
            key={conv.id}
            conversation={conv}
            isActive={activeConversationId === conv.id}
            isRead={readConversations.has(conv.id)}
            onSelect={() => onSelect(conv.id)}
          />
        ))}
      </div>
    </div>
  );
}

function ConversationItem({ conversation, isActive, isRead, onSelect }: { conversation: Conversation; isActive: boolean; isRead: boolean; onSelect: () => void }) {
  const user = users.find((u) => u.id === conversation.participantId);
  if (!user) return null;

  return (
    <div
      onClick={onSelect}
      className={`flex cursor-pointer items-center gap-3 px-2 py-[7px] mx-[6px] rounded-md transition-colors ${
        isActive ? "bg-chat-active" : "hover:bg-chat-hover"
      }`}
    >
      <div className="relative flex-shrink-0">
        <img src={user.avatar} alt={user.name} className="h-[48px] w-[48px] rounded-full object-cover" />
        {user.isOnline && (
          <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-chat-sidebar bg-online" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <span className="text-[13px] font-semibold text-foreground truncate">{user.name}</span>
          <span className="text-[11px] text-muted-foreground flex-shrink-0">· {conversation.lastMessageTime}</span>
        </div>
        <p className="text-[12px] text-muted-foreground truncate mt-[1px]">{conversation.lastMessage}</p>
      </div>
      {!isRead && conversation.unreadCount > 0 && (
        <span className="flex h-[18px] w-[18px] flex-shrink-0 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
          {conversation.unreadCount}
        </span>
      )}
    </div>
  );
}
