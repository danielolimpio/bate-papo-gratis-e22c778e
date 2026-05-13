CREATE TABLE public.user_conversations (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  target_user_id text NOT NULL,
  last_interaction timestamp with time zone NOT NULL DEFAULT now(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE (user_id, target_user_id)
);

ALTER TABLE public.user_conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users view own conversations"
  ON public.user_conversations FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "users insert own conversations"
  ON public.user_conversations FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "users update own conversations"
  ON public.user_conversations FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "users delete own conversations"
  ON public.user_conversations FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

ALTER PUBLICATION supabase_realtime ADD TABLE public.user_conversations;
ALTER TABLE public.user_conversations REPLICA IDENTITY FULL;

CREATE INDEX idx_user_conversations_user ON public.user_conversations(user_id, last_interaction DESC);