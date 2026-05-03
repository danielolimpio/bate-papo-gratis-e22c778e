DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();

DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;

CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.profiles (id, full_name, age, gender, relationship_status, sexual_preference, city)
SELECT
  u.id,
  COALESCE(NULLIF(u.raw_user_meta_data->>'full_name', ''), split_part(COALESCE(u.email, ''), '@', 1), 'Usuário'),
  GREATEST(18, LEAST(99, COALESCE(NULLIF(u.raw_user_meta_data->>'age', '')::integer, 18))),
  COALESCE(NULLIF(u.raw_user_meta_data->>'gender', ''), 'outro'),
  COALESCE(NULLIF(u.raw_user_meta_data->>'relationship_status', ''), 'solteiro'),
  COALESCE(NULLIF(u.raw_user_meta_data->>'sexual_preference', ''), 'ambos'),
  COALESCE(u.raw_user_meta_data->>'city', '')
FROM auth.users u
LEFT JOIN public.profiles p ON p.id = u.id
WHERE p.id IS NULL;