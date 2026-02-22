import { User, BellOff, Search, ChevronDown } from "lucide-react";
import { users, conversations } from "@/data/mockData";

interface Props {
  conversationId: string | null;
  onProfileClick: (userId: string) => void;
}

export default function RightPanel({ conversationId, onProfileClick }: Props) {
  const conv = conversations.find((c) => c.id === conversationId);
  const participant = conv ? users.find((u) => u.id === conv.participantId) : null;

  if (!participant) {
    // Show online users when no conversation selected
    const onlineUsers = users.filter((u) => u.isOnline);
    const offlineUsers = users.filter((u) => !u.isOnline);
    return (
      <div className="flex h-full flex-col bg-chat-right-panel border-l border-chat-divider overflow-y-auto">
        <div className="p-4">
          <h3 className="text-sm font-semibold text-foreground mb-3">Pessoas Online</h3>
          <div className="space-y-3">
            {onlineUsers.map((u) => (
              <div key={u.id} className="flex items-center gap-3 cursor-pointer hover:bg-chat-hover rounded-lg p-2 transition-colors" onClick={() => onProfileClick(u.id)}>
                <div className="relative">
                  <img src={u.avatar} alt={u.name} className="h-9 w-9 rounded-full object-cover" />
                  <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-chat-right-panel bg-online" />
                </div>
                <span className="text-sm text-foreground">{u.name}</span>
              </div>
            ))}
          </div>
          <h3 className="text-sm font-semibold text-foreground mb-3 mt-6">Todas as pessoas</h3>
          <div className="space-y-3">
            {offlineUsers.map((u) => (
              <div key={u.id} className="flex items-center gap-3 cursor-pointer hover:bg-chat-hover rounded-lg p-2 transition-colors" onClick={() => onProfileClick(u.id)}>
                <img src={u.avatar} alt={u.name} className="h-9 w-9 rounded-full object-cover" />
                <div>
                  <span className="text-sm text-foreground">{u.name}</span>
                  <p className="text-xs text-muted-foreground">{u.lastSeen || "Offline"}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col bg-chat-right-panel border-l border-chat-divider overflow-y-auto">
      <div className="flex flex-col items-center px-4 py-6">
        <img
          src={participant.avatar}
          alt={participant.name}
          className="h-20 w-20 rounded-full object-cover cursor-pointer"
          onClick={() => onProfileClick(participant.id)}
        />
        <h3 className="mt-3 text-lg font-semibold text-foreground">{participant.name}</h3>
        <p className="text-xs text-muted-foreground">
          {participant.isOnline ? "Online agora" : `Online ${participant.lastSeen}`}
        </p>
      </div>

      <div className="mx-auto mb-4 rounded-full border border-chat-divider px-3 py-1 text-xs text-muted-foreground">
        🔒 Criptografia de ponta a ponta
      </div>

      <div className="flex justify-center gap-6 mb-4">
        <button className="flex flex-col items-center gap-1" onClick={() => onProfileClick(participant.id)}>
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary">
            <User size={16} className="text-foreground" />
          </div>
          <span className="text-xs text-muted-foreground">Perfil</span>
        </button>
        <button className="flex flex-col items-center gap-1">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary">
            <BellOff size={16} className="text-foreground" />
          </div>
          <span className="text-xs text-muted-foreground">Silenciar</span>
        </button>
        <button className="flex flex-col items-center gap-1">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary">
            <Search size={16} className="text-foreground" />
          </div>
          <span className="text-xs text-muted-foreground">Pesquisar</span>
        </button>
      </div>

      <div className="border-t border-chat-divider">
        {["Informações da conversa", "Personalizar conversa", "Mídia e arquivos", "Privacidade e suporte"].map((item) => (
          <button key={item} className="flex w-full items-center justify-between px-4 py-3 hover:bg-chat-hover transition-colors">
            <span className="text-sm text-foreground">{item}</span>
            <ChevronDown size={16} className="text-muted-foreground" />
          </button>
        ))}
      </div>
    </div>
  );
}
