-- ============================================
-- Update boost duration from 24h to 7 days
-- ============================================

CREATE OR REPLACE FUNCTION public.boost_project(p_project_id UUID, p_user_id UUID)
RETURNS JSON AS $$
DECLARE
  v_project RECORD;
  v_user_credits INTEGER;
  v_boost_cost INTEGER := 100;
  v_boost_duration INTERVAL := '7 days'; -- Changed from 24 hours to 7 days
BEGIN
  -- Get project and verify ownership
  SELECT * INTO v_project
  FROM public.projects
  WHERE id = p_project_id AND user_id = p_user_id;

  IF NOT FOUND THEN
    RETURN json_build_object('success', false, 'error', 'Project not found or not owned by user');
  END IF;

  -- Get user credits
  SELECT credits INTO v_user_credits
  FROM public.profiles
  WHERE id = p_user_id;

  -- Check if user has enough credits
  IF v_user_credits < v_boost_cost THEN
    RETURN json_build_object('success', false, 'error', 'Insufficient credits', 'required', v_boost_cost, 'available', v_user_credits);
  END IF;

  -- Check if already boosted and still active
  IF v_project.boosted_until IS NOT NULL AND v_project.boosted_until > timezone('utc'::text, now()) THEN
    RETURN json_build_object('success', false, 'error', 'Project is already boosted');
  END IF;

  -- Deduct credits
  UPDATE public.profiles
  SET credits = credits - v_boost_cost
  WHERE id = p_user_id;

  -- Boost project for 7 days
  UPDATE public.projects
  SET boosted_until = timezone('utc'::text, now()) + v_boost_duration
  WHERE id = p_project_id;

  RETURN json_build_object('success', true, 'credits_remaining', v_user_credits - v_boost_cost, 'boosted_until', timezone('utc'::text, now()) + v_boost_duration);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

