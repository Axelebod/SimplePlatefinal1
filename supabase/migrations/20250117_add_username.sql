-- ============================================
-- Add username/pseudo field to profiles
-- ============================================

-- Add username column (nullable, unique)
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS username TEXT UNIQUE;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_profiles_username ON public.profiles(username) WHERE username IS NOT NULL;

-- Function to generate a default username from email
CREATE OR REPLACE FUNCTION public.generate_default_username(p_email TEXT)
RETURNS TEXT AS $$
DECLARE
  v_base TEXT;
  v_username TEXT;
  v_counter INTEGER := 0;
BEGIN
  -- Extract base from email (part before @)
  v_base := LOWER(SPLIT_PART(p_email, '@', 1));
  -- Remove special characters, keep only alphanumeric
  v_base := REGEXP_REPLACE(v_base, '[^a-z0-9]', '', 'g');
  -- Limit to 20 chars
  v_base := SUBSTRING(v_base, 1, 20);
  
  v_username := v_base;
  
  -- Check if username exists, if so append number
  WHILE EXISTS (SELECT 1 FROM public.profiles WHERE username = v_username) LOOP
    v_counter := v_counter + 1;
    v_username := v_base || v_counter::TEXT;
    -- Prevent infinite loop
    IF v_counter > 9999 THEN
      v_username := v_base || '_' || FLOOR(RANDOM() * 10000)::TEXT;
      EXIT;
    END IF;
  END LOOP;
  
  RETURN v_username;
END;
$$ LANGUAGE plpgsql;

-- Update existing profiles to have a default username if they don't have one
UPDATE public.profiles
SET username = public.generate_default_username(email)
WHERE username IS NULL AND email IS NOT NULL;

-- Function to update username (with validation)
CREATE OR REPLACE FUNCTION public.update_username(p_user_id UUID, p_username TEXT)
RETURNS JSON AS $$
DECLARE
  v_username TEXT;
BEGIN
  -- Validate username
  IF p_username IS NULL OR LENGTH(TRIM(p_username)) = 0 THEN
    RETURN json_build_object('success', false, 'error', 'Username cannot be empty');
  END IF;
  
  -- Clean username: lowercase, alphanumeric + underscore/hyphen, 3-20 chars
  v_username := LOWER(TRIM(p_username));
  v_username := REGEXP_REPLACE(v_username, '[^a-z0-9_-]', '', 'g');
  
  IF LENGTH(v_username) < 3 THEN
    RETURN json_build_object('success', false, 'error', 'Username must be at least 3 characters');
  END IF;
  
  IF LENGTH(v_username) > 20 THEN
    RETURN json_build_object('success', false, 'error', 'Username must be at most 20 characters');
  END IF;
  
  -- Check if username is already taken
  IF EXISTS (SELECT 1 FROM public.profiles WHERE username = v_username AND id != p_user_id) THEN
    RETURN json_build_object('success', false, 'error', 'Username already taken');
  END IF;
  
  -- Update username
  UPDATE public.profiles
  SET username = v_username
  WHERE id = p_user_id;
  
  RETURN json_build_object('success', true, 'username', v_username);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

