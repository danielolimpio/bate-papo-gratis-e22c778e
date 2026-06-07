GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_matches TO authenticated;
GRANT ALL ON public.user_matches TO service_role;
CREATE POLICY "users can update own matches" ON public.user_matches FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);