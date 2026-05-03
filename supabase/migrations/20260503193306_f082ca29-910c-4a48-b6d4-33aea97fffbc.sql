-- Add foreign key from messages.user_id to profiles.id so PostgREST can embed sender profile
ALTER TABLE public.messages
  ADD CONSTRAINT messages_user_id_profiles_fkey
  FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- Ensure realtime delivers full row payloads
ALTER TABLE public.messages REPLICA IDENTITY FULL;

-- Make sure trigger to auto-create profiles is in place
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
