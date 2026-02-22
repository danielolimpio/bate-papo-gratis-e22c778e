import { useState } from "react";
import { Moon, Sun, MessageCircle } from "lucide-react";
import ConversationList from "@/components/chat/ConversationList";
import ChatArea from "@/components/chat/ChatArea";
import RightPanel from "@/components/chat/RightPanel";
import ProfileModal from "@/components/chat/ProfileModal";
import NewUserCard from "@/components/chat/NewUserCard";
import { useTheme } from "@/hooks/useTheme";

export default function Index() {
  const { isDark, toggle } = useTheme();
  const [activeConversation, setActiveConversation] = useState<string | null>("c1");
  const [searchQuery, setSearchQuery] = useState("");
  const [profileUserId, setProfileUserId] = useState<string | null>(null);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-chat-bg">
      {/* Left sidebar - conversations */}
      <div className="flex w-[340px] flex-shrink-0 flex-col border-r border-chat-divider">
        {/* Logo bar */}
        <div className="flex items-center justify-between border-b border-chat-divider px-4 py-2">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
              <MessageCircle size={16} className="text-primary-foreground" />
            </div>
            <span className="text-sm font-bold text-foreground">woomchat.com</span>
          </div>
          <button onClick={toggle} className="rounded-full p-2 hover:bg-secondary transition-colors">
            {isDark ? <Sun size={18} className="text-foreground" /> : <Moon size={18} className="text-foreground" />}
          </button>
        </div>
        <ConversationList
          activeConversationId={activeConversation}
          onSelect={setActiveConversation}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
      </div>

      {/* Center - chat */}
      <ChatArea
        conversationId={activeConversation}
        onInfoClick={() => {}}
        onAvatarClick={setProfileUserId}
      />

      {/* Right panel */}
      <div className="w-[300px] flex-shrink-0 hidden lg:block">
        <RightPanel
          onProfileClick={setProfileUserId}
        />
      </div>

      {/* New user card */}
      <NewUserCard />

      {/* Profile modal */}
      {profileUserId && (
        <ProfileModal userId={profileUserId} onClose={() => setProfileUserId(null)} />
      )}
    </div>
  );
}
