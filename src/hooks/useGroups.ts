import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { onSync } from "@/lib/syncBus";

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

export function useGroups(currentUserId: string | null) {
  const [groups, setGroups] = useState<Group[]>([]);
  const [invites] = useState<GroupInvite[]>([]);

  const load = useCallback(async () => {
    if (!currentUserId) {
      setGroups([]);
      return;
    }
    const { data: gs } = await supabase
      .from("groups")
      .select("id, name, created_at")
      .eq("created_by", currentUserId)
      .order("created_at", { ascending: false });
    if (!gs) {
      setGroups([]);
      return;
    }
    const ids = gs.map((g) => g.id);
    let membersByGroup: Record<string, string[]> = {};
    if (ids.length) {
      const { data: ms } = await supabase
        .from("group_members")
        .select("group_id, member_user_id")
        .in("group_id", ids);
      (ms ?? []).forEach((m: any) => {
        (membersByGroup[m.group_id] ??= []).push(m.member_user_id);
      });
    }
    setGroups(
      gs.map((g) => ({
        id: g.id,
        name: g.name,
        memberIds: membersByGroup[g.id] ?? [],
        createdAt: new Date(g.created_at).getTime(),
      }))
    );
  }, [currentUserId]);

  useEffect(() => {
    load();
    if (!currentUserId) return;
    const ch = supabase
      .channel(`groups-${currentUserId}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "groups" }, () => load())
      .on("postgres_changes", { event: "*", schema: "public", table: "group_members" }, () => load())
      .subscribe();
    const off = onSync(() => load());
    return () => {
      supabase.removeChannel(ch);
      off();
    };
  }, [currentUserId, load]);

  const createGroup = useCallback(
    async (name: string, memberIds: string[]) => {
      if (!currentUserId) return null;
      const { data, error } = await supabase
        .from("groups")
        .insert({ name: name.trim() || "Novo Grupo", created_by: currentUserId })
        .select("id, name, created_at")
        .single();
      if (error || !data) return null;
      if (memberIds.length) {
        await supabase.from("group_members").insert(
          memberIds.map((m) => ({ group_id: data.id, member_user_id: m }))
        );
      }
      await load();
      return { id: data.id, name: data.name, memberIds, createdAt: Date.now() } as Group;
    },
    [currentUserId, load]
  );

  const removeGroup = useCallback(
    async (groupId: string) => {
      await supabase.from("groups").delete().eq("id", groupId);
      await load();
    },
    [load]
  );

  const addMembers = useCallback(
    async (groupId: string, memberIds: string[]) => {
      if (!memberIds.length) return;
      await supabase
        .from("group_members")
        .insert(memberIds.map((m) => ({ group_id: groupId, member_user_id: m })));
      await load();
    },
    [load]
  );

  const removeMember = useCallback(
    async (groupId: string, memberUserId: string) => {
      await supabase
        .from("group_members")
        .delete()
        .eq("group_id", groupId)
        .eq("member_user_id", memberUserId);
      await load();
    },
    [load]
  );

  const acceptInvite = useCallback((_id: string) => {}, []);
  const declineInvite = useCallback((_id: string) => {}, []);

  return { groups, invites, createGroup, removeGroup, addMembers, removeMember, acceptInvite, declineInvite };
}
