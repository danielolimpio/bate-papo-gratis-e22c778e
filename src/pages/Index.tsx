import { useState } from "react";
import { Moon, Sun } from "lucide-react";
import ConversationList from "@/components/chat/ConversationList";
import ChatArea from "@/components/chat/ChatArea";
import RightPanel from "@/components/chat/RightPanel";
import ProfileModal from "@/components/chat/ProfileModal";
import NewUserCard from "@/components/chat/NewUserCard";
import UserProfileMenu from "@/components/chat/UserProfileMenu";
import { useTheme } from "@/hooks/useTheme";
import { useOnlineUsers } from "@/hooks/useOnlineUsers";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { conversations } from "@/data/mockData";
import logo from "@/assets/logo-batepapo.png";

type TabType = "tudo" | "nao-lidas" | "grupos";

export default function Index() {
  const { isDark, toggle } = useTheme();
  const onlineIds = useOnlineUsers();
  const [activeTab, setActiveTab] = useState<TabType>("tudo");
  const [activeConversation, setActiveConversation] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [readConversations, setReadConversations] = useState<Set<string>>(new Set());
  const [profileUserId, setProfileUserId] = useState<string | null>(null);

  const chatMode = activeTab === "tudo" && !activeConversation ? "general" : "private";

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    if (tab === "tudo") {
      setActiveConversation(null);
    }
  };

  const handleSelectConversation = (id: string) => {
    setActiveConversation(id);
    setReadConversations((prev) => new Set(prev).add(id));
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-chat-bg">
      <div className="flex w-[340px] flex-shrink-0 flex-col border-r border-chat-divider bg-chat-sidebar">
        <div className="flex items-center justify-between px-4 py-2.5">
          <div className="flex items-center">
            <img src={logo} alt="Bate-Papo Grátis" className="h-8" />
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
          readConversations={readConversations}
        />
      </div>

      <ChatArea
        conversationId={activeConversation}
        chatMode={chatMode}
        onInfoClick={() => {}}
        onAvatarClick={setProfileUserId}
      />

      <div className="w-[300px] flex-shrink-0 hidden lg:block">
        <RightPanel
          onProfileClick={setProfileUserId}
          onlineIds={onlineIds}
        />
      </div>

      <NewUserCard />

      {profileUserId && (
        <ProfileModal
          userId={profileUserId}
          onClose={() => setProfileUserId(null)}
          onStartChat={(userId) => {
            const conv = conversations.find((c) => c.participantId === userId);
            if (conv) {
              setActiveConversation(conv.id);
            } else {
              setActiveConversation(`temp-${userId}`);
            }
            setProfileUserId(null);
          }}
        />
      )}
    </div>
  );
}
