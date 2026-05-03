DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();

INSERT INTO public.profiles (id, full_name, age, gender, relationship_status, sexual_preference, city)
SELECT
  u.id,
  COALESCE(u.raw_user_meta_data->>'full_name', ''),
  COALESCE((u.raw_user_meta_data->>'age')::integer, 18),
  COALESCE(u.raw_user_meta_data->>'gender', ''),
  COALESCE(u.raw_user_meta_data->>'relationship_status', ''),
  COALESCE(u.raw_user_meta_data->>'sexual_preference', ''),
  COALESCE(u.raw_user_meta_data->>'city', '')
FROM auth.users u
LEFT JOIN public.profiles p ON p.id = u.id
WHERE p.id IS NULL
  AND COALESCE(u.raw_user_meta_data->>'full_name','') <> ''
  AND COALESCE(u.raw_user_meta_data->>'gender','') <> ''
  AND COALESCE(u.raw_user_meta_data->>'relationship_status','') <> ''
  AND COALESCE(u.raw_user_meta_data->>'sexual_preference','') <> ''
  AND COALESCE(u.raw_user_meta_data->>'city','') <> '';