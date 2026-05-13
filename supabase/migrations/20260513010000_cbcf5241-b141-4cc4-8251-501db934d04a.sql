
CREATE TABLE public.groups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  created_by uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.groups ENABLE ROW LEVEL SECURITY;

CREATE POLICY "owners view own groups" ON public.groups FOR SELECT TO authenticated USING (auth.uid() = created_by);
CREATE POLICY "owners insert own groups" ON public.groups FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by);
CREATE POLICY "owners update own groups" ON public.groups FOR UPDATE TO authenticated USING (auth.uid() = created_by);
CREATE POLICY "owners delete own groups" ON public.groups FOR DELETE TO authenticated USING (auth.uid() = created_by);

CREATE TRIGGER trg_groups_updated_at BEFORE UPDATE ON public.groups FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.group_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id uuid NOT NULL REFERENCES public.groups(id) ON DELETE CASCADE,
  member_user_id text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (group_id, member_user_id)
);

ALTER TABLE public.group_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "owners view own group members" ON public.group_members FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.groups g WHERE g.id = group_id AND g.created_by = auth.uid()));
CREATE POLICY "owners insert group members" ON public.group_members FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM public.groups g WHERE g.id = group_id AND g.created_by = auth.uid()));
CREATE POLICY "owners delete group members" ON public.group_members FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.groups g WHERE g.id = group_id AND g.created_by = auth.uid()));

ALTER PUBLICATION supabase_realtime ADD TABLE public.groups;
ALTER PUBLICATION supabase_realtime ADD TABLE public.group_members;
