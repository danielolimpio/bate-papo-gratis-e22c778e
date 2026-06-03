import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Moon, Sun } from "lucide-react";
import ConversationList from "@/components/chat/ConversationList";
import ChatArea from "@/components/chat/ChatArea";
import RightPanel from "@/components/chat/RightPanel";
import ProfileModal from "@/components/chat/ProfileModal";
import NewUserCard from "@/components/chat/NewUserCard";
import UserProfileMenu from "@/components/chat/UserProfileMenu";
import ManageGroupModal from "@/components/chat/ManageGroupModal";
import { useTheme } from "@/hooks/useTheme";
import { useOnlineUsers } from "@/hooks/useOnlineUsers";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useMatches } from "@/hooks/useMatches";
import { useUserConversations } from "@/hooks/useUserConversations";
import { useGroups } from "@/hooks/useGroups";
import { toast } from "@/hooks/use-toast";
import logo from "@/assets/logo-batepapo.png";

type TabType = "tudo" | "nao-lidas" | "grupos" | "matchs";

export default function Index() {
  const { isDark, toggle } = useTheme();
  const onlineIds = useOnlineUsers();
  const { user, profile, refreshProfile } = useCurrentUser();
  const { matches, addMatch, removeMatch, getMatchType, canMatch } = useMatches(user?.id ?? null, profile?.gender ?? null);
  const { conversations: savedConvs, upsertConversation, removeConversation } = useUserConversations(user?.id ?? null);
  const { groups, invites, createGroup, removeGroup, addMembers, removeMember, acceptInvite, declineInvite } = useGroups(user?.id ?? null);
  const [manageGroupId, setManageGroupId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>("tudo");
  const [activeConversation, setActiveConversation] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [readConversations, setReadConversations] = useState<Set<string>>(new Set());
  const [profileUserId, setProfileUserId] = useState<string | null>(null);

  const chatMode = !activeConversation ? "general" : activeConversation.startsWith("group-") ? "group" : "private";
  const activeGroup = activeConversation?.startsWith("group-")
    ? groups.find((g) => `group-${g.id}` === activeConversation) ?? null
    : null;

  const [mobileView, setMobileView] = useState<"list" | "chat">("list");

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
  };

  const handleSelectConversation = (id: string, userId: string) => {
    setActiveConversation(id);
    setReadConversations((prev) => new Set(prev).add(id));
    upsertConversation(userId);
    setMobileView("chat");
  };

  const handleSelectGeneral = () => {
    setActiveConversation(null);
    setMobileView("chat");
  };

  const handleBackToList = () => {
    setMobileView("list");
  };

  const handleStartChat = (userId: string) => {
    const convId = `temp-${userId}`;
    setActiveConversation(convId);
    setReadConversations((prev) => new Set(prev).add(convId));
    upsertConversation(userId);
    setProfileUserId(null);
    setMobileView("chat");
  };

  const handleCreateGroup = async (name: string, memberIds: string[]) => {
    await createGroup(name, memberIds);
    toast({
      title: "Grupo criado",
      description: `${memberIds.length} pessoa(s) adicionadas.`,
    });
  };

  const manageGroup = manageGroupId ? groups.find((g) => g.id === manageGroupId) ?? null : null;

  return (
    <div className="flex h-[100dvh] w-screen overflow-hidden bg-chat-bg">
      <Helmet>
        <title>Sala de Bate-Papo — Bate-Papo Grátis</title>
        <meta name="description" content="Converse em tempo real na sala de bate-papo. Chat privado, grupos e matchs para encontrar novas amizades." />
        <link rel="canonical" href="/saladebatepapo" />
        <meta property="og:title" content="Sala de Bate-Papo — Bate-Papo Grátis" />
        <meta property="og:description" content="Converse em tempo real na sala de bate-papo. Chat privado, grupos e matchs para encontrar novas amizades." />
        <meta property="og:url" content="https://bate-papo-gratis.lovable.app/saladebatepapo" />
        <meta property="og:type" content="website" />
      </Helmet>
      <div
        className={`${
          mobileView === "list" ? "flex" : "hidden"
        } md:flex w-full md:w-[300px] lg:w-[340px] flex-shrink-0 flex-col border-r border-chat-divider bg-chat-sidebar`}
      >
        <h1 className="sr-only">Sala de Bate-Papo — Bate-Papo Grátis</h1>
        <div className="flex items-center justify-between px-4 py-2.5">
          <div className="flex items-center">
            <img src={logo} alt="Bate-Papo Grátis" className="h-8" />
          </div>
          <div className="flex items-center gap-1">
            <button onClick={toggle} aria-label="Alternar tema" className="rounded-full p-2 hover:bg-secondary transition-colors">
              {isDark ? <Sun size={18} className="text-foreground" /> : <Moon size={18} className="text-foreground" />}
            </button>
            <UserProfileMenu profile={profile} email={user?.email || ""} onProfileUpdated={refreshProfile} />
          </div>
        </div>
        <ConversationList
          activeConversationId={activeConversation}
          onSelect={handleSelectConversation}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          activeTab={activeTab}
          onTabChange={handleTabChange}
          readConversations={readConversations}
          isGeneralActive={chatMode === "general"}
          onSelectGeneral={handleSelectGeneral}
          matches={matches}
          onSelectMatchUser={(userId) => setProfileUserId(userId)}
          savedConversations={savedConvs}
          onRemoveConversation={(uid) => {
            removeConversation(uid);
            if (activeConversation === `temp-${uid}`) setActiveConversation(null);
          }}
          groups={groups}
          invites={invites}
          onCreateGroup={handleCreateGroup}
          onAcceptInvite={acceptInvite}
          onDeclineInvite={declineInvite}
          onRemoveGroup={(id) => {
            removeGroup(id);
            if (activeConversation === `group-${id}`) setActiveConversation(null);
          }}
          onSelectGroup={(id) => {
            setActiveConversation(`group-${id}`);
            setMobileView("chat");
          }}
        />
      </div>

      <div
        className={`${
          mobileView === "chat" ? "flex" : "hidden"
        } md:flex flex-1 min-w-0`}
      >
        <ChatArea
          conversationId={activeConversation}
          chatMode={chatMode}
          groupInfo={activeGroup ? { name: activeGroup.name, memberCount: activeGroup.memberIds.length } : null}
          onInfoClick={() => {}}
          onAvatarClick={setProfileUserId}
          onBack={handleBackToList}
          onManageGroup={activeGroup ? () => setManageGroupId(activeGroup.id) : undefined}
          onStartChat={handleStartChat}
        />
      </div>

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
          matchType={getMatchType(profileUserId)}
          canMatch={canMatch(profileUserId)}
          onMatch={(userId) => addMatch(userId, "given")}
          onUnmatch={(userId) => removeMatch(userId)}
          onStartChat={handleStartChat}
        />
      )}

      {manageGroup && (
        <ManageGroupModal
          group={manageGroup}
          onClose={() => setManageGroupId(null)}
          onAddMembers={addMembers}
          onRemoveMember={removeMember}
          onStartChat={(userId) => {
            setManageGroupId(null);
            handleStartChat(userId);
          }}
        />
      )}
    </div>
  );
}
