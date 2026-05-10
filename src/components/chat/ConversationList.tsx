import { Search, MoreHorizontal, Edit, Heart, Plus, X, Check, Users } from "lucide-react";
import { users } from "@/data/mockData";
import StackedAvatars from "./StackedAvatars";
import { useMemo, useState } from "react";
import type { MatchEntry } from "@/hooks/useMatches";
import type { SavedConversation } from "@/hooks/useUserConversations";
import type { Group, GroupInvite } from "@/hooks/useGroups";

type TabType = "tudo" | "nao-lidas" | "grupos" | "matchs";

interface Props {
  activeConversationId: string | null;
  onSelect: (id: string, userId: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  readConversations: Set<string>;
  isGeneralActive?: boolean;
  onSelectGeneral?: () => void;
  matches: MatchEntry[];
  onSelectMatchUser: (userId: string) => void;
  savedConversations: SavedConversation[];
  onRemoveConversation: (userId: string) => void;
  groups: Group[];
  invites: GroupInvite[];
  onCreateGroup: (name: string, memberIds: string[]) => void;
  onAcceptInvite: (id: string) => void;
  onDeclineInvite: (id: string) => void;
  onRemoveGroup: (id: string) => void;
  onSelectGroup: (groupId: string) => void;
}

export default function ConversationList(props: Props) {
  const {
    activeConversationId, onSelect, searchQuery, onSearchChange, activeTab,
    onTabChange, readConversations, isGeneralActive, onSelectGeneral, matches,
    onSelectMatchUser, savedConversations, onRemoveConversation, groups, invites,
    onCreateGroup, onAcceptInvite, onDeclineInvite, onRemoveGroup, onSelectGroup,
  } = props;

  const [creatingGroup, setCreatingGroup] = useState(false);

  const savedFiltered = useMemo(() => {
    if (!searchQuery) return savedConversations;
    const q = searchQuery.toLowerCase();
    return savedConversations.filter((c) => {
      const u = users.find((x) => x.id === c.userId);
      return u?.name.toLowerCase().includes(q);
    });
  }, [savedConversations, searchQuery]);

  const unreadConvs = useMemo(
    () => savedFiltered.filter((c) => !readConversations.has(`temp-${c.userId}`)),
    [savedFiltered, readConversations]
  );

  return (
    <div className="flex h-full flex-col bg-chat-sidebar">
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

      <div className="flex items-center gap-[2px] px-3 pb-1.5 overflow-x-auto">
        {(["tudo", "nao-lidas", "grupos", "matchs"] as TabType[]).map((tab) => {
          const labels: Record<TabType, string> = { tudo: "Tudo", "nao-lidas": "Não lidas", grupos: "Grupos", matchs: "Matchs" };
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => onTabChange(tab)}
              className={`rounded-full px-3 py-[5px] text-xs font-semibold transition-colors whitespace-nowrap ${
                isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-secondary"
              }`}
            >
              {labels[tab]}
            </button>
          );
        })}
      </div>

      <div className="flex-1 overflow-y-auto">
        {activeTab === "matchs" && (
          <MatchesList matches={matches} onSelect={onSelectMatchUser} />
        )}

        {activeTab === "tudo" && (
          <>
            <PinnedSala active={!!isGeneralActive} onClick={onSelectGeneral} />
            {savedFiltered.map((c) => {
              const u = users.find((x) => x.id === c.userId);
              if (!u) return null;
              const convId = `temp-${u.id}`;
              return (
                <SavedConvItem
                  key={c.userId}
                  user={u}
                  isActive={activeConversationId === convId}
                  isRead={readConversations.has(convId)}
                  onSelect={() => onSelect(convId, u.id)}
                  onDelete={() => onRemoveConversation(u.id)}
                />
              );
            })}
            {savedFiltered.length === 0 && (
              <p className="px-4 py-3 text-[12px] text-muted-foreground text-center">
                Nenhuma conversa privada ainda. Inicie um chat para vê-lo aqui.
              </p>
            )}
          </>
        )}

        {activeTab === "nao-lidas" && (
          <>
            {unreadConvs.length === 0 ? (
              <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
                <p className="text-[13px] font-semibold text-foreground">Tudo em dia</p>
                <p className="text-[12px] text-muted-foreground mt-1">
                  Você não tem mensagens privadas não lidas.
                </p>
              </div>
            ) : (
              unreadConvs.map((c) => {
                const u = users.find((x) => x.id === c.userId);
                if (!u) return null;
                const convId = `temp-${u.id}`;
                return (
                  <SavedConvItem
                    key={c.userId}
                    user={u}
                    isActive={activeConversationId === convId}
                    isRead={false}
                    onSelect={() => onSelect(convId, u.id)}
                    onDelete={() => onRemoveConversation(u.id)}
                  />
                );
              })
            )}
          </>
        )}

        {activeTab === "grupos" && (
          <>
            <PinnedSala active={!!isGeneralActive} onClick={onSelectGeneral} />

            <button
              onClick={() => setCreatingGroup(true)}
              className="flex w-full items-center gap-3 px-3 py-3 mx-[6px] rounded-md hover:bg-chat-hover transition-colors"
              style={{ width: "calc(100% - 12px)" }}
            >
              <div className="flex h-[48px] w-[48px] items-center justify-center rounded-full bg-primary/10 text-primary">
                <Plus size={22} />
              </div>
              <div className="text-left">
                <p className="text-[13px] font-semibold text-foreground">Criar Grupo</p>
                <p className="text-[12px] text-muted-foreground">Convide amigos para um novo grupo</p>
              </div>
            </button>

            {invites.length > 0 && (
              <div className="px-3 pt-2 pb-1 text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">
                Convites
              </div>
            )}
            {invites.map((inv) => (
              <div key={inv.id} className="flex items-center gap-3 px-2 py-[7px] mx-[6px] rounded-md hover:bg-chat-hover">
                <div className="flex h-[48px] w-[48px] items-center justify-center rounded-full bg-secondary">
                  <Users size={22} className="text-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold text-foreground truncate">{inv.groupName}</p>
                  <p className="text-[11px] text-muted-foreground truncate">Convite de {inv.fromName}</p>
                </div>
                <button onClick={() => onAcceptInvite(inv.id)} className="rounded-full bg-primary p-1.5 text-primary-foreground hover:opacity-90">
                  <Check size={14} />
                </button>
                <button onClick={() => onDeclineInvite(inv.id)} className="rounded-full bg-secondary p-1.5 text-foreground hover:bg-chat-hover">
                  <X size={14} />
                </button>
              </div>
            ))}

            {groups.length > 0 && (
              <div className="px-3 pt-2 pb-1 text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">
                Meus grupos
              </div>
            )}
            {groups.map((g) => {
              const convId = `group-${g.id}`;
              const isActive = activeConversationId === convId;
              return (
                <div
                  key={g.id}
                  onClick={() => onSelectGroup(g.id)}
                  className={`group flex cursor-pointer items-center gap-3 px-2 py-[7px] mx-[6px] rounded-md transition-colors ${
                    isActive ? "bg-chat-active" : "hover:bg-chat-hover"
                  }`}
                >
                  <div className="flex h-[48px] w-[48px] items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Users size={22} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-semibold text-foreground truncate">{g.name}</p>
                    <p className="text-[11px] text-muted-foreground truncate">{g.memberIds.length} membros</p>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); onRemoveGroup(g.id); }}
                    className="opacity-0 group-hover:opacity-100 rounded-full p-1.5 hover:bg-secondary"
                    aria-label="Remover grupo"
                  >
                    <X size={14} className="text-muted-foreground" />
                  </button>
                </div>
              );
            })}
          </>
        )}
      </div>

      {creatingGroup && (
        <CreateGroupModal
          onClose={() => setCreatingGroup(false)}
          onCreate={(name, ids) => {
            onCreateGroup(name, ids);
            setCreatingGroup(false);
            onTabChange("grupos");
          }}
        />
      )}
    </div>
  );
}

function PinnedSala({ active, onClick }: { active: boolean; onClick?: () => void }) {
  return (
    <div
      onClick={onClick}
      className={`flex cursor-pointer flex-col items-center gap-2 px-3 py-3 mx-[6px] mb-1 rounded-md transition-colors ${
        active ? "bg-chat-active" : "hover:bg-chat-hover"
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
  );
}

function SavedConvItem({
  user, isActive, isRead, onSelect, onDelete,
}: {
  user: typeof users[number];
  isActive: boolean;
  isRead: boolean;
  onSelect: () => void;
  onDelete: () => void;
}) {
  return (
    <div
      onClick={onSelect}
      className={`group flex cursor-pointer items-center gap-3 px-2 py-[7px] mx-[6px] rounded-md transition-colors ${
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
        <span className="text-[13px] font-semibold text-foreground truncate block">{user.name}</span>
        <p className="text-[12px] text-muted-foreground truncate mt-[1px]">
          {user.isOnline ? "Online agora" : "Toque para conversar"}
        </p>
      </div>
      {!isRead && (
        <span className="h-2.5 w-2.5 flex-shrink-0 rounded-full bg-primary" />
      )}
      <button
        onClick={(e) => { e.stopPropagation(); onDelete(); }}
        className="opacity-0 group-hover:opacity-100 rounded-full p-1.5 hover:bg-secondary transition-opacity"
        aria-label="Apagar conversa"
      >
        <X size={14} className="text-muted-foreground" />
      </button>
    </div>
  );
}

function MatchesList({ matches, onSelect }: { matches: MatchEntry[]; onSelect: (userId: string) => void }) {
  if (matches.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
        <div className="rounded-full bg-primary/10 p-4 mb-3">
          <Heart size={28} className="text-primary" />
        </div>
        <p className="text-[13px] font-semibold text-foreground">Nenhum match ainda</p>
        <p className="text-[12px] text-muted-foreground mt-1">
          Curta perfis para começar a fazer matches.
        </p>
      </div>
    );
  }

  return (
    <div className="py-1">
      {matches.map((m) => {
        const u = users.find((x) => x.id === m.userId);
        if (!u) return null;
        const isGiven = m.type === "given";
        return (
          <div
            key={m.userId}
            onClick={() => onSelect(m.userId)}
            className="flex cursor-pointer items-center gap-3 px-2 py-[7px] mx-[6px] rounded-md hover:bg-chat-hover transition-colors"
          >
            <div className="relative flex-shrink-0">
              <img src={u.avatar} alt={u.name} className="h-[48px] w-[48px] rounded-full object-cover" />
              <span
                className={`absolute -bottom-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full border-2 border-chat-sidebar ${
                  isGiven ? "bg-primary" : "bg-pink-500"
                }`}
              >
                <Heart size={10} className="text-white" fill="currentColor" />
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[13px] font-semibold text-foreground truncate block">{u.name}</span>
              <span
                className={`inline-block mt-0.5 rounded-full px-2 py-[2px] text-[10px] font-semibold ${
                  isGiven
                    ? "bg-primary/15 text-primary"
                    : "bg-pink-500/15 text-pink-600 dark:text-pink-400"
                }`}
              >
                {isGiven ? "Você deu Match" : "Você recebeu Match"}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function CreateGroupModal({
  onClose, onCreate,
}: {
  onClose: () => void;
  onCreate: (name: string, memberIds: string[]) => void;
}) {
  const [name, setName] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [q, setQ] = useState("");

  const list = useMemo(() => {
    const term = q.toLowerCase();
    return users
      .filter((u) => u.id !== "me")
      .filter((u) => !term || u.name.toLowerCase().includes(term))
      .slice(0, 50);
  }, [q]);

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const canCreate = name.trim().length > 0 && selected.size > 0;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl bg-card shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-chat-divider">
          <h3 className="text-base font-semibold text-foreground">Criar novo grupo</h3>
          <button onClick={onClose} className="rounded-full p-1.5 hover:bg-secondary">
            <X size={16} className="text-foreground" />
          </button>
        </div>

        <div className="p-4 space-y-3 border-b border-chat-divider">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nome do grupo"
            className="w-full rounded-lg bg-secondary px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none"
          />
          <div className="flex items-center gap-2 rounded-full bg-secondary px-3 py-2">
            <Search size={14} className="text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar pessoas para convidar"
              className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
            />
          </div>
          {selected.size > 0 && (
            <p className="text-[12px] text-muted-foreground">{selected.size} pessoa(s) selecionada(s)</p>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          {list.map((u) => {
            const isSel = selected.has(u.id);
            return (
              <button
                key={u.id}
                onClick={() => toggle(u.id)}
                className={`flex w-full items-center gap-3 rounded-md px-2 py-2 text-left transition-colors ${
                  isSel ? "bg-primary/10" : "hover:bg-chat-hover"
                }`}
              >
                <img src={u.avatar} alt={u.name} className="h-9 w-9 rounded-full object-cover" />
                <span className="flex-1 text-sm text-foreground truncate">{u.name}</span>
                <span className={`flex h-5 w-5 items-center justify-center rounded-full border ${
                  isSel ? "bg-primary border-primary text-primary-foreground" : "border-muted-foreground/40"
                }`}>
                  {isSel && <Check size={12} />}
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex justify-end gap-2 p-3 border-t border-chat-divider">
          <button type="button" onClick={onClose} className="rounded-full px-4 py-2 text-sm font-semibold text-foreground hover:bg-secondary">
            Cancelar
          </button>
          <button
            type="button"
            disabled={!canCreate}
            onClick={() => {
              if (!canCreate) return;
              onCreate(name.trim(), Array.from(selected));
            }}
            className={`rounded-full px-4 py-2 text-sm font-semibold ${
              canCreate ? "bg-primary text-primary-foreground hover:opacity-90" : "bg-secondary text-muted-foreground cursor-not-allowed"
            }`}
          >
            Criar grupo
          </button>
        </div>
      </div>
    </div>
  );
}
