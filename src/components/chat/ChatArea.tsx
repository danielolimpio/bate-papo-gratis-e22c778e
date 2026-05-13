import { useState, useRef, useEffect, useCallback } from "react";
import { Phone, Video, Smile, Image, Mic, Send, User, ArrowLeft } from "lucide-react";
import EmojiPicker from "./EmojiPicker";
import MessageReactions from "./MessageReactions";
import { useMessages, type ChatMessage } from "@/hooks/useMessages";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useFakeReplies } from "@/hooks/useFakeReplies";
import { useGeneralRoomActivity } from "@/hooks/useGeneralRoomActivity";
import { users, conversations } from "@/data/mockData";
import StackedAvatars from "./StackedAvatars";

interface Props {
  conversationId: string | null;
  chatMode: "general" | "private" | "group";
  groupInfo?: { name: string; memberCount: number } | null;
  onInfoClick: () => void;
  onAvatarClick: (userId: string) => void;
  onBack?: () => void;
  onManageGroup?: () => void;
}

export default function ChatArea({ conversationId, chatMode, groupInfo, onInfoClick, onAvatarClick, onBack, onManageGroup }: Props) {
  const [input, setInput] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const isGeneral = chatMode === "general";
  const isGroup = chatMode === "group";
  const room = isGeneral ? "general" : conversationId || "general";

  const { messages, loading, sendMessage, injectLocalMessage } = useMessages(room);
  const { user, profile } = useCurrentUser();

  const conv = !isGeneral && !isGroup ? conversations.find((c) => c.id === conversationId) : null;
  const tempUserId = !conv && !isGroup && conversationId?.startsWith("temp-") ? conversationId.replace("temp-", "") : null;
  const participant = conv
    ? users.find((u) => u.id === conv.participantId)
    : tempUserId
    ? users.find((u) => u.id === tempUserId)
    : null;

  // Schedule fake replies from fictional participants in private chats
  useFakeReplies(
    !isGeneral && participant ? participant.id : null,
    messages,
    user?.id ?? null,
    injectLocalMessage
  );

  // Synthetic activity in the General Room (seed last 72h + new msg every 5–10 min)
  const injectGeneral = useCallback(
    (msg: ChatMessage) => {
      // Seeded (past) messages shouldn't ping; live ones should.
      const isPast = Date.now() - new Date(msg.created_at).getTime() > 60 * 1000;
      injectLocalMessage(msg, { silent: isPast });
    },
    [injectLocalMessage]
  );
  const { typingUsers } = useGeneralRoomActivity(isGeneral, injectGeneral, {
    currentUserId: user?.id ?? null,
    currentUserName: profile?.full_name ?? null,
    messages,
  });

  // Instantly jump to the bottom whenever the room changes or finishes loading,
  // so users always see the most recent messages first.
  useEffect(() => {
    const id = requestAnimationFrame(() => {
      bottomRef.current?.scrollIntoView({ behavior: "auto", block: "end" });
    });
    return () => cancelAnimationFrame(id);
  }, [room, loading]);

  // Smooth-scroll for incoming messages after the initial render.
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages.length]);

  const handleSend = async () => {
    if (!input.trim() || !user) return;
    await sendMessage(input, user.id);
    setInput("");
  };

  const handleThumbsUp = async () => {
    if (!user) return;
    await sendMessage("👍", user.id);
  };

  // No conversation selected and not general/group
  if (!isGeneral && !isGroup && (!conversationId || !participant)) {
    return (
      <div className="flex flex-1 items-center justify-center bg-chat-bg">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-secondary">
            <Send size={32} className="text-muted-foreground" />
          </div>
          <h2 className="text-xl font-semibold text-foreground">Bate-Papo Grátis</h2>
          <p className="text-sm text-muted-foreground mt-1">Selecione uma conversa para começar</p>
        </div>
      </div>
    );
  }

  const formatTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="flex flex-1 flex-col bg-chat-bg min-w-0 w-full">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-chat-divider px-3 sm:px-4 py-[10px] gap-2">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          {onBack && (
            <button
              onClick={onBack}
              className="md:hidden rounded-full p-2 hover:bg-secondary transition-colors flex-shrink-0"
              aria-label="Voltar"
            >
              <ArrowLeft size={20} className="text-foreground" />
            </button>
          )}
          {isGeneral ? (
            <div className="flex items-center gap-3 min-w-0">
              <StackedAvatars size={40} />
              <div className="min-w-0">
                <h3 className="text-sm font-semibold text-foreground truncate">Sala de Bate Papo</h3>
                <p className="text-xs text-muted-foreground truncate">Chat em tempo real</p>
              </div>
            </div>
          ) : isGroup ? (
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary flex-shrink-0">
                <User size={20} />
              </div>
              <div className="min-w-0">
                <h3 className="text-sm font-semibold text-foreground truncate">{groupInfo?.name ?? "Grupo"}</h3>
                <p className="text-xs text-muted-foreground truncate">{groupInfo?.memberCount ?? 0} membros</p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3 cursor-pointer min-w-0" onClick={() => onAvatarClick(participant!.id)}>
              <div className="relative flex-shrink-0">
                <img src={participant!.avatar} alt={participant!.name} className="h-10 w-10 rounded-full object-cover" />
                {participant!.isOnline && (
                  <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-chat-bg bg-online" />
                )}
              </div>
              <div className="min-w-0">
                <h3 className="text-sm font-semibold text-foreground truncate">{participant!.name}</h3>
                <p className="text-xs text-muted-foreground truncate">
                  {participant!.isOnline ? "Online agora" : `Online ${participant!.lastSeen}`}
                </p>
              </div>
            </div>
          )}
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          {!isGeneral && (
            <>
              <button className="rounded-full p-2 hover:bg-secondary transition-colors">
                <Phone size={20} className="text-primary" />
              </button>
              <button className="rounded-full p-2 hover:bg-secondary transition-colors">
                <Video size={20} className="text-primary" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {isGeneral && (
          <div className="mb-4 flex flex-col items-center">
            <StackedAvatars size={64} />
            <h4 className="font-semibold text-foreground">Sala de Bate-Papo Grátis</h4>
            <p className="text-xs text-muted-foreground mt-1">Todos os membros podem ver e enviar mensagens aqui</p>
            <div className="mt-2 rounded-lg bg-secondary px-3 py-2 text-center">
              <p className="text-xs text-muted-foreground">
                🔒 As mensagens são protegidas com criptografia de ponta a ponta.
              </p>
            </div>
          </div>
        )}

        {!isGeneral && participant && (
          <div className="mb-6 flex flex-col items-center">
            <img
              src={participant.avatar}
              alt={participant.name}
              className="h-16 w-16 rounded-full object-cover mb-2 cursor-pointer"
              onClick={() => onAvatarClick(participant.id)}
            />
            <h4 className="font-semibold text-foreground">{participant.name}</h4>
            <p className="text-xs text-muted-foreground">Bate-Papo Grátis</p>
            <div className="mt-2 rounded-lg bg-secondary px-3 py-2 text-center">
              <p className="text-xs text-muted-foreground">
                🔒 As mensagens são protegidas com criptografia de ponta a ponta.
              </p>
            </div>
          </div>
        )}

        {loading && (
          <div className="flex justify-center py-8">
            <div className="text-sm text-muted-foreground">Carregando mensagens...</div>
          </div>
        )}

        {messages.map((msg) => {
          const isMe = msg.user_id === user?.id;
          return (
            <div key={msg.id} className={`mb-2 flex ${isMe ? "justify-end" : "justify-start"}`}>
              {/* Avatar for others */}
              {!isMe && (
                <div className="h-7 w-7 rounded-full overflow-hidden mr-2 mt-1 flex-shrink-0">
                  {msg.sender_avatar ? (
                    <img src={msg.sender_avatar} alt={msg.sender_name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-primary text-primary-foreground text-[10px] font-bold">
                      {msg.sender_name?.charAt(0)?.toUpperCase() || <User size={12} />}
                    </div>
                  )}
                </div>
              )}
              <div className="max-w-[calc(100vw-6rem)] sm:max-w-[66%] min-w-0">
                {!isMe && (
                  <p className="text-[11px] text-muted-foreground mb-0.5 ml-1">{msg.sender_name}</p>
                )}
                <div
                  className={`inline-block break-words whitespace-pre-wrap rounded-2xl px-3 py-2 text-sm ${
                    isMe
                      ? "bg-chat-bubble-sent text-chat-bubble-sent-fg rounded-br-sm"
                      : "bg-chat-bubble-received text-chat-bubble-received-fg rounded-bl-sm"
                  }`}
                >
                  {msg.content}
                  <span className={`ml-2 text-[10px] ${isMe ? "text-chat-bubble-sent-fg/70" : "text-muted-foreground"}`}>
                    {formatTime(msg.created_at)}
                  </span>
                </div>
                <MessageReactions messageId={msg.id} align={isMe ? "right" : "left"} simulate={isGeneral} />
              </div>
            </div>
          );
        })}
        {isGeneral && typingUsers.length > 0 && (
          <div className="mb-2 flex items-end gap-2">
            <div className="flex -space-x-2">
              {typingUsers.slice(0, 3).map((tu) => (
                <img
                  key={tu.id}
                  src={tu.avatar}
                  alt={tu.name}
                  className="h-6 w-6 rounded-full border-2 border-chat-bg object-cover"
                />
              ))}
            </div>
            <div className="rounded-2xl rounded-bl-sm bg-chat-bubble-received px-3 py-2">
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] text-chat-bubble-received-fg">
                  {typingUsers.length === 1
                    ? `${typingUsers[0].name.split(" ")[0]} está digitando…`
                    : `${typingUsers.length} pessoas estão digitando…`}
                </span>
                <span className="flex gap-0.5">
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.3s]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.15s]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground" />
                </span>
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="relative flex items-center gap-1 border-t border-chat-divider px-3 py-[8px]">
        {showEmoji && (
          <EmojiPicker
            onSelect={(emoji) => setInput((prev) => prev + emoji)}
            onClose={() => setShowEmoji(false)}
          />
        )}
        <div className="flex items-center gap-1">
          <button className="rounded-full p-2 hover:bg-secondary transition-colors">
            <Mic size={20} className="text-primary" />
          </button>
          <button
            onClick={() => setShowEmoji((v) => !v)}
            className="rounded-full p-2 hover:bg-secondary transition-colors"
          >
            <Smile size={20} className="text-primary" />
          </button>
        </div>
        <div className="flex flex-1 items-center rounded-full bg-chat-input-bg px-4 py-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Aa"
            className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
          />
        </div>
        {input.trim() ? (
          <button onClick={handleSend} className="rounded-full p-2 hover:bg-secondary transition-colors">
            <Send size={20} className="text-primary" />
          </button>
        ) : (
          <button onClick={handleThumbsUp} className="rounded-full p-2 hover:bg-secondary transition-colors">
            <span className="text-xl leading-none">👍</span>
          </button>
        )}
      </div>
    </div>
  );
}
