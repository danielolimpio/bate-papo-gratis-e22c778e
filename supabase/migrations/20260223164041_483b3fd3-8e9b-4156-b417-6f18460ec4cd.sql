
-- Create profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  age INTEGER NOT NULL,
  gender TEXT NOT NULL CHECK (gender IN ('masculino', 'feminino', 'outro')),
  relationship_status TEXT NOT NULL CHECK (relationship_status IN ('solteiro', 'casado', 'viúvo', 'namorando', 'separado', 'enrolado')),
  sexual_preference TEXT NOT NULL CHECK (sexual_preference IN ('homens', 'mulheres', 'ambos')),
  city TEXT NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Helper function
CREATE OR REPLACE FUNCTION public.is_own_profile(profile_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN auth.uid() = profile_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- RLS Policies
CREATE POLICY "Users can view their own profile"
ON public.profiles FOR SELECT
USING (is_own_profile(id));

CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
USING (is_own_profile(id));

CREATE POLICY "Users can insert their own profile"
ON public.profiles FOR INSERT
WITH CHECK (auth.uid() = id);

-- Allow public read for chat (other users need to see names/avatars)
CREATE POLICY "All authenticated users can view profiles"
ON public.profiles FOR SELECT
TO authenticated
USING (true);

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
