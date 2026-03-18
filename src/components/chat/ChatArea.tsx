import { useState, useRef, useEffect } from "react";
import { Phone, Video, Info, Smile, Image, Mic, Send } from "lucide-react";
import EmojiPicker from "./EmojiPicker";
import { users, messagesByConversation, conversations, generalChatMessages, type Message } from "@/data/mockData";
import StackedAvatars from "./StackedAvatars";

interface Props {
  conversationId: string | null;
  chatMode: "general" | "private";
  onInfoClick: () => void;
  onAvatarClick: (userId: string) => void;
}

export default function ChatArea({ conversationId, chatMode, onInfoClick, onAvatarClick }: Props) {
  const [input, setInput] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const [localMessages, setLocalMessages] = useState<Record<string, Message[]>>({ ...messagesByConversation });
  const [localGeneralMessages, setLocalGeneralMessages] = useState<Message[]>([...generalChatMessages]);
  const bottomRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isGeneral = chatMode === "general";

  const conv = !isGeneral ? conversations.find((c) => c.id === conversationId) : null;
  const tempUserId = !conv && conversationId?.startsWith("temp-") ? conversationId.replace("temp-", "") : null;
  const participant = conv
    ? users.find((u) => u.id === conv.participantId)
    : tempUserId
    ? users.find((u) => u.id === tempUserId)
    : null;
  const messages = isGeneral
    ? localGeneralMessages
    : conversationId
    ? localMessages[conversationId] || []
    : [];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    const newMsg: Message = {
      id: `m-${Date.now()}`,
      conversationId: isGeneral ? "general" : conversationId || "",
      senderId: "me",
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
      isRead: false,
    };
    if (isGeneral) {
      setLocalGeneralMessages((prev) => [...prev, newMsg]);
    } else if (conversationId) {
      setLocalMessages((prev) => ({
        ...prev,
        [conversationId]: [...(prev[conversationId] || []), newMsg],
      }));
    }
  };

  const handleSend = () => {
    if (!input.trim()) return;
    sendMessage(input);
    setInput("");
  };

  const handleThumbsUp = () => {
    sendMessage("👍");
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !conversationId) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      const newMsg: Message = {
        id: `m-${Date.now()}`,
        conversationId: conversationId,
        senderId: "me",
        text: "",
        image: dataUrl,
        timestamp: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
        isRead: false,
      };
      setLocalMessages((prev) => ({
        ...prev,
        [conversationId]: [...(prev[conversationId] || []), newMsg],
      }));
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  // No conversation selected and not general
  if (!isGeneral && (!conversationId || !participant)) {
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

  return (
    <div className="flex flex-1 flex-col bg-chat-bg">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-chat-divider px-4 py-[10px]">
        {isGeneral ? (
          <div className="flex items-center gap-3">
            <StackedAvatars size={40} />
            <div>
              <h3 className="text-sm font-semibold text-foreground">Sala Geral</h3>
              <p className="text-xs text-muted-foreground">
                {users.filter((u) => u.isOnline).length} online agora
              </p>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => onAvatarClick(participant!.id)}>
            <div className="relative">
              <img src={participant!.avatar} alt={participant!.name} className="h-10 w-10 rounded-full object-cover" />
              {participant!.isOnline && (
                <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-chat-bg bg-online" />
              )}
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">{participant!.name}</h3>
              <p className="text-xs text-muted-foreground">
                {participant!.isOnline ? "Online agora" : `Online ${participant!.lastSeen}`}
              </p>
            </div>
          </div>
        )}
        <div className="flex items-center gap-1">
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
          <button className="rounded-full p-2 hover:bg-secondary transition-colors" onClick={onInfoClick}>
            <Info size={20} className="text-primary" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {/* Profile intro - only for private */}
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

        {isGeneral && (
          <div className="mb-4 flex flex-col items-center">
            <StackedAvatars size={64} />
            <h4 className="font-semibold text-foreground">Sala Geral do WoomChat</h4>
            <p className="text-xs text-muted-foreground mt-1">Todos os membros podem ver e enviar mensagens aqui</p>
          </div>
        )}

        {messages.map((msg) => {
          const sender = msg.senderId !== "me" ? users.find((u) => u.id === msg.senderId) : null;
          return (
            <div key={msg.id} className={`mb-2 flex ${msg.senderId === "me" ? "justify-end" : "justify-start"}`}>
              {/* Show avatar in general chat for others */}
              {isGeneral && msg.senderId !== "me" && sender && (
                <img
                  src={sender.avatar}
                  alt={sender.name}
                  className="h-7 w-7 rounded-full object-cover mr-2 mt-1 cursor-pointer flex-shrink-0"
                  onClick={() => onAvatarClick(sender.id)}
                />
              )}
              <div>
                {/* Show name in general chat */}
                {isGeneral && msg.senderId !== "me" && sender && (
                  <p className="text-[11px] text-muted-foreground mb-0.5 ml-1">{sender.name}</p>
                )}
                <div
                  className={`max-w-[65%] rounded-2xl px-3 py-2 text-sm ${
                    msg.senderId === "me"
                      ? "bg-chat-bubble-sent text-chat-bubble-sent-fg rounded-br-sm"
                      : "bg-chat-bubble-received text-chat-bubble-received-fg rounded-bl-sm"
                  }`}
                >
                  {msg.image && (
                    <img src={msg.image} alt="Foto" className="max-w-[240px] rounded-lg mb-1" />
                  )}
                  {msg.text && msg.text}
                  <span className={`ml-2 text-[10px] ${msg.senderId === "me" ? "text-chat-bubble-sent-fg/70" : "text-muted-foreground"}`}>
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
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
          {!isGeneral && (
            <>
              <button onClick={() => fileInputRef.current?.click()} className="rounded-full p-2 hover:bg-secondary transition-colors">
                <Image size={20} className="text-primary" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageSelect}
              />
            </>
          )}
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
