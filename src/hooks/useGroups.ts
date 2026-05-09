import { useCallback, useEffect, useState } from "react";

export interface Group {
  id: string;
  name: string;
  memberIds: string[];
  createdAt: number;
}

export interface GroupInvite {
  id: string;
  groupName: string;
  fromName: string;
  createdAt: number;
}

const GKEY = "bpg:groups:";
const IKEY = "bpg:groupInvites:";

const gk = (id: string | null) => `${GKEY}${id ?? "guest"}`;
const ik = (id: string | null) => `${IKEY}${id ?? "guest"}`;

function read<T>(k: string): T[] {
  try {
    const raw = localStorage.getItem(k);
    return raw ? (JSON.parse(raw) as T[]) : [];
  } catch {
    return [];
  }
}
function write<T>(k: string, v: T[]) {
  try {
    localStorage.setItem(k, JSON.stringify(v));
  } catch {
    /* ignore */
  }
}

export function useGroups(currentUserId: string | null) {
  const [groups, setGroups] = useState<Group[]>([]);
  const [invites, setInvites] = useState<GroupInvite[]>([]);

  useEffect(() => {
    setGroups(read<Group>(gk(currentUserId)));
    setInvites(read<GroupInvite>(ik(currentUserId)));
  }, [currentUserId]);

  const createGroup = useCallback(
    (name: string, memberIds: string[]) => {
      const g: Group = {
        id: `g-${Date.now()}`,
        name: name.trim() || "Novo Grupo",
        memberIds,
        createdAt: Date.now(),
      };
      setGroups((prev) => {
        const next = [g, ...prev];
        write(gk(currentUserId), next);
        return next;
      });
      return g;
    },
    [currentUserId]
  );

  const removeGroup = useCallback(
    (groupId: string) => {
      setGroups((prev) => {
        const next = prev.filter((g) => g.id !== groupId);
        write(gk(currentUserId), next);
        return next;
      });
    },
    [currentUserId]
  );

  const acceptInvite = useCallback(
    (inviteId: string) => {
      setInvites((prev) => {
        const inv = prev.find((i) => i.id === inviteId);
        const next = prev.filter((i) => i.id !== inviteId);
        write(ik(currentUserId), next);
        if (inv) {
          setGroups((g) => {
            const ng = [
              { id: `g-${Date.now()}`, name: inv.groupName, memberIds: [], createdAt: Date.now() },
              ...g,
            ];
            write(gk(currentUserId), ng);
            return ng;
          });
        }
        return next;
      });
    },
    [currentUserId]
  );

  const declineInvite = useCallback(
    (inviteId: string) => {
      setInvites((prev) => {
        const next = prev.filter((i) => i.id !== inviteId);
        write(ik(currentUserId), next);
        return next;
      });
    },
    [currentUserId]
  );

  return { groups, invites, createGroup, removeGroup, acceptInvite, declineInvite };
}
