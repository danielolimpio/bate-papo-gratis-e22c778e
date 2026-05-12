CREATE TABLE public.user_matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  target_user_id TEXT NOT NULL,
  match_type TEXT NOT NULL CHECK (match_type IN ('given','received')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, target_user_id)
);

ALTER TABLE public.user_matches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users can view own matches" ON public.user_matches FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "users can insert own matches" ON public.user_matches FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "users can delete own matches" ON public.user_matches FOR DELETE TO authenticated USING (auth.uid() = user_id);

ALTER PUBLICATION supabase_realtime ADD TABLE public.user_matches;