import { useMemo, useState } from "react";
import { X, Search, Trash2, UserPlus } from "lucide-react";
import { users } from "@/data/mockData";
import type { Group } from "@/hooks/useGroups";

interface Props {
  group: Group;
  onClose: () => void;
  onAddMembers: (groupId: string, memberIds: string[]) => void | Promise<void>;
  onRemoveMember: (groupId: string, memberUserId: string) => void | Promise<void>;
  onStartChat?: (userId: string) => void;
}

export default function ManageGroupModal({ group, onClose, onAddMembers, onRemoveMember, onStartChat }: Props) {
  const [adding, setAdding] = useState(false);
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const members = useMemo(
    () => group.memberIds.map((id) => users.find((u) => u.id === id)).filter(Boolean) as typeof users,
    [group.memberIds]
  );

  const candidates = useMemo(() => {
    const term = q.toLowerCase();
    const taken = new Set(group.memberIds);
    return users
      .filter((u) => u.id !== "me" && !taken.has(u.id))
      .filter((u) => !term || u.name.toLowerCase().includes(term))
      .slice(0, 50);
  }, [q, group.memberIds]);

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const confirmAdd = async () => {
    if (selected.size === 0) return;
    await onAddMembers(group.id, Array.from(selected));
    setSelected(new Set());
    setAdding(false);
    setQ("");
  };

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
          <div className="min-w-0">
            <h3 className="text-base font-semibold text-foreground truncate">{group.name}</h3>
            <p className="text-xs text-muted-foreground">{members.length} membro(s)</p>
          </div>
          <button onClick={onClose} className="rounded-full p-1.5 hover:bg-secondary">
            <X size={16} className="text-foreground" />
          </button>
        </div>

        {!adding ? (
          <>
            <div className="px-4 py-2 border-b border-chat-divider">
              <button
                onClick={() => setAdding(true)}
                className="flex w-full items-center gap-2 rounded-lg bg-primary/10 px-3 py-2 text-sm font-semibold text-primary hover:bg-primary/15"
              >
                <UserPlus size={16} /> Adicionar pessoas
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-2">
              {members.length === 0 && (
                <p className="px-2 py-6 text-center text-[12px] text-muted-foreground">
                  Nenhum membro no grupo ainda.
                </p>
              )}
              {members.map((u) => (
                <div key={u.id} className="flex items-center gap-3 rounded-md px-2 py-2 hover:bg-chat-hover">
                  <button
                    type="button"
                    onClick={() => onStartChat?.(u.id)}
                    className="flex flex-1 items-center gap-3 min-w-0 text-left"
                    aria-label={`Conversar com ${u.name}`}
                  >
                    <img src={u.avatar} alt={u.name} className="h-9 w-9 rounded-full object-cover" />
                    <p className="flex-1 truncate text-[13px] font-semibold text-foreground hover:underline">{u.name}</p>
                  </button>
                  <button
                    onClick={() => onRemoveMember(group.id, u.id)}
                    className="rounded-full p-1.5 text-muted-foreground hover:bg-secondary hover:text-destructive"
                    aria-label="Remover"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="p-3 border-b border-chat-divider space-y-2">
              <div className="flex items-center gap-2 rounded-full bg-secondary px-3 py-2">
                <Search size={14} className="text-muted-foreground" />
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Buscar pessoas"
                  className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
                />
              </div>
              {selected.size > 0 && (
                <p className="text-[12px] text-muted-foreground">{selected.size} selecionada(s)</p>
              )}
            </div>
            <div className="flex-1 overflow-y-auto p-2">
              {candidates.map((u) => {
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
                    <p className="flex-1 truncate text-[13px] font-semibold text-foreground">{u.name}</p>
                    <span
                      className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                        isSel ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground/40"
                      }`}
                    >
                      {isSel && <span className="text-[10px]">✓</span>}
                    </span>
                  </button>
                );
              })}
            </div>
            <div className="flex items-center justify-between gap-2 border-t border-chat-divider p-3">
              <button
                onClick={() => { setAdding(false); setSelected(new Set()); setQ(""); }}
                className="rounded-lg px-3 py-2 text-sm font-semibold text-foreground hover:bg-secondary"
              >
                Cancelar
              </button>
              <button
                onClick={confirmAdd}
                disabled={selected.size === 0}
                className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-50"
              >
                Adicionar
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
