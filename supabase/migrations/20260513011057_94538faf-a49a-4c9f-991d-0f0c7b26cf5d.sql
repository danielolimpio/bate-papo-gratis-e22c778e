CREATE TABLE public.message_reactions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  message_id text NOT NULL,
  emoji text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE (user_id, message_id)
);

ALTER TABLE public.message_reactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "auth view all reactions"
  ON public.message_reactions FOR SELECT
  TO authenticated USING (true);

CREATE POLICY "users insert own reactions"
  ON public.message_reactions FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "users update own reactions"
  ON public.message_reactions FOR UPDATE
  TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "users delete own reactions"
  ON public.message_reactions FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

ALTER PUBLICATION supabase_realtime ADD TABLE public.message_reactions;
ALTER TABLE public.message_reactions REPLICA IDENTITY FULL;

CREATE INDEX idx_message_reactions_msg ON public.message_reactions(message_id);
CREATE INDEX idx_message_reactions_user ON public.message_reactions(user_id);