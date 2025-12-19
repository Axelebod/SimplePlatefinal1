-- ============================================
-- Update free audits to be per user (50 per user)
-- ============================================

-- Drop the old global counter table
DROP TABLE IF EXISTS public.free_audits_counter CASCADE;

-- Add free_audits_used column to profiles table
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS free_audits_used INTEGER DEFAULT 0 NOT NULL;

-- Update the function to check per-user free audits
CREATE OR REPLACE FUNCTION public.check_free_audit_available(p_user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  v_audits_used INTEGER;
  v_max_free INTEGER := 50; -- 50 free audits per user
BEGIN
  -- Get user's free audits used count
  SELECT COALESCE(free_audits_used, 0)
  INTO v_audits_used
  FROM public.profiles
  WHERE id = p_user_id;

  -- Check if user is under the limit
  IF v_audits_used < v_max_free THEN
    -- Increment user's free audits counter
    UPDATE public.profiles
    SET free_audits_used = free_audits_used + 1
    WHERE id = p_user_id;
    
    RETURN TRUE; -- Free audit available for this user
  END IF;

  RETURN FALSE; -- User has used all their free audits
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get remaining free audits for a user
CREATE OR REPLACE FUNCTION public.get_free_audits_remaining(p_user_id UUID)
RETURNS INTEGER AS $$
DECLARE
  v_audits_used INTEGER;
  v_max_free INTEGER := 50;
BEGIN
  SELECT COALESCE(free_audits_used, 0)
  INTO v_audits_used
  FROM public.profiles
  WHERE id = p_user_id;

  RETURN GREATEST(0, v_max_free - v_audits_used);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

