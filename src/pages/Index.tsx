import { useState } from "react";
import { Moon, Sun } from "lucide-react";
import ConversationList from "@/components/chat/ConversationList";
import ChatArea from "@/components/chat/ChatArea";
import RightPanel from "@/components/chat/RightPanel";
import ProfileModal from "@/components/chat/ProfileModal";
import NewUserCard from "@/components/chat/NewUserCard";
import { useTheme } from "@/hooks/useTheme";
import { useOnlineUsers } from "@/hooks/useOnlineUsers";
import logoDark from "@/assets/logo-dark.png";
import logoLight from "@/assets/logo-light.png";

type TabType = "tudo" | "nao-lidas" | "grupos";

export default function Index() {
  const { isDark, toggle } = useTheme();
  const onlineIds = useOnlineUsers();
  const [activeTab, setActiveTab] = useState<TabType>("tudo");
  const [activeConversation, setActiveConversation] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [profileUserId, setProfileUserId] = useState<string | null>(null);

  // When "Tudo" tab is active and no conversation selected, show general chat
  const chatMode = activeTab === "tudo" && !activeConversation ? "general" : "private";

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    if (tab === "tudo") {
      setActiveConversation(null); // go back to general chat
    }
  };

  const handleSelectConversation = (id: string) => {
    setActiveConversation(id);
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-chat-bg">
      {/* Left sidebar - conversations */}
      <div className="flex w-[340px] flex-shrink-0 flex-col border-r border-chat-divider bg-chat-sidebar">
        {/* Logo bar */}
        <div className="flex items-center justify-between px-4 py-2.5">
          <div className="flex items-center">
            <img src={isDark ? logoDark : logoLight} alt="WoomChat" className="h-8" />
          </div>
          <button onClick={toggle} className="rounded-full p-2 hover:bg-secondary transition-colors">
            {isDark ? <Sun size={18} className="text-foreground" /> : <Moon size={18} className="text-foreground" />}
          </button>
        </div>
        <ConversationList
          activeConversationId={activeConversation}
          onSelect={handleSelectConversation}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />
      </div>

      {/* Center - chat */}
      <ChatArea
        conversationId={activeConversation}
        chatMode={chatMode}
        onInfoClick={() => {}}
        onAvatarClick={setProfileUserId}
      />

      {/* Right panel */}
      <div className="w-[300px] flex-shrink-0 hidden lg:block">
        <RightPanel
          onProfileClick={setProfileUserId}
          onlineIds={onlineIds}
        />
      </div>

      {/* New user card */}
      <NewUserCard />

      {/* Profile modal */}
      {profileUserId && (
        <ProfileModal
          userId={profileUserId}
          onClose={() => setProfileUserId(null)}
          onStartChat={(id) => {
            setActiveConversation(id);
            setProfileUserId(null);
          }}
        />
      )}
    </div>
  );
}
