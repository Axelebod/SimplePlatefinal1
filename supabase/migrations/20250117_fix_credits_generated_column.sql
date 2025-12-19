-- ============================================
-- Fix credits column updates for generated column
-- ============================================
-- If credits is a generated column (credits_free + credits_paid),
-- we need to update credits_free and credits_paid instead

-- Fix reset_weekly_free_credits function
CREATE OR REPLACE FUNCTION public.reset_weekly_free_credits(p_user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  v_last_refill TIMESTAMP WITH TIME ZONE;
  v_current_credits INTEGER;
  v_current_free INTEGER;
  v_days_since_refill INTEGER;
BEGIN
  -- Get user's last refill and current credits
  SELECT last_weekly_refill, credits, COALESCE(credits_free, 0) INTO v_last_refill, v_current_credits, v_current_free
  FROM public.profiles
  WHERE id = p_user_id;

  -- If no refill date, set it to now and give credits
  IF v_last_refill IS NULL THEN
    -- Check if credits_free column exists
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_schema = 'public' 
               AND table_name = 'profiles' 
               AND column_name = 'credits_free') THEN
      UPDATE public.profiles
      SET last_weekly_refill = timezone('utc'::text, now()),
          credits_free = GREATEST(5, COALESCE(credits_free, 0))
      WHERE id = p_user_id;
    ELSE
      -- If credits_free doesn't exist, try to update credits directly (for backward compatibility)
      UPDATE public.profiles
      SET last_weekly_refill = timezone('utc'::text, now()),
          credits = GREATEST(5, credits)
      WHERE id = p_user_id;
    END IF;
    RETURN TRUE;
  END IF;

  -- Calculate days since last refill
  v_days_since_refill := EXTRACT(EPOCH FROM (timezone('utc'::text, now()) - v_last_refill)) / 86400;

  -- If 7+ days passed AND credits < 5, top up to 5
  IF v_days_since_refill >= 7 AND v_current_credits < 5 THEN
    -- Check if credits_free column exists
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_schema = 'public' 
               AND table_name = 'profiles' 
               AND column_name = 'credits_free') THEN
      UPDATE public.profiles
      SET last_weekly_refill = timezone('utc'::text, now()),
          credits_free = 5
      WHERE id = p_user_id;
    ELSE
      -- If credits_free doesn't exist, try to update credits directly (for backward compatibility)
      UPDATE public.profiles
      SET last_weekly_refill = timezone('utc'::text, now()),
          credits = 5
      WHERE id = p_user_id;
    END IF;
    RETURN TRUE;
  END IF;

  RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fix earn_credits_from_review function
CREATE OR REPLACE FUNCTION public.earn_credits_from_review(p_user_id UUID)
RETURNS INTEGER AS $$
DECLARE
  v_daily_earned INTEGER;
  v_last_activity TIMESTAMP WITH TIME ZONE;
  v_credits_to_add NUMERIC;
  v_max_daily_earnings INTEGER := 3; -- Max 3 credits per day from reviews
  v_review_credit_value NUMERIC := 0.5; -- 0.5 credits per review (6 reviews = 3 credits max per day)
BEGIN
  -- Get user's daily earnings and last activity
  SELECT daily_earned_credits, last_activity_date INTO v_daily_earned, v_last_activity
  FROM public.profiles
  WHERE id = p_user_id;

  -- Reset daily counter if it's a new day
  IF v_last_activity IS NULL OR v_last_activity::date < timezone('utc'::text, now())::date THEN
    UPDATE public.profiles
    SET daily_earned_credits = 0,
        last_activity_date = timezone('utc'::text, now())
    WHERE id = p_user_id;
    v_daily_earned := 0;
  END IF;

  -- Check if user has reached daily limit
  IF v_daily_earned >= v_max_daily_earnings THEN
    RETURN 0; -- Already at daily limit
  END IF;

  -- Calculate credits to add (0.5 per review, but cap at daily limit)
  v_credits_to_add := LEAST(
    v_review_credit_value,
    v_max_daily_earnings - v_daily_earned
  );

  -- Update credits and daily counter
  -- Check if credits_free column exists
  IF EXISTS (SELECT 1 FROM information_schema.columns 
             WHERE table_schema = 'public' 
             AND table_name = 'profiles' 
             AND column_name = 'credits_free') THEN
    UPDATE public.profiles
    SET credits_free = credits_free + v_credits_to_add,
        daily_earned_credits = daily_earned_credits + v_credits_to_add,
        last_activity_date = timezone('utc'::text, now())
    WHERE id = p_user_id;
  ELSE
    -- If credits_free doesn't exist, try to update credits directly (for backward compatibility)
    UPDATE public.profiles
    SET credits = credits + v_credits_to_add,
        daily_earned_credits = daily_earned_credits + v_credits_to_add,
        last_activity_date = timezone('utc'::text, now())
    WHERE id = p_user_id;
  END IF;

  RETURN v_credits_to_add;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fix unlock_project_audit function
CREATE OR REPLACE FUNCTION public.unlock_project_audit(p_project_id UUID, p_user_id UUID)
RETURNS JSON AS $$
DECLARE
  v_project RECORD;
  v_user_credits INTEGER;
  v_current_free INTEGER;
  v_current_paid INTEGER;
  v_audit_cost INTEGER := 50;
  v_result JSON;
BEGIN
  -- Get project and verify ownership
  SELECT * INTO v_project
  FROM public.projects
  WHERE id = p_project_id AND user_id = p_user_id;

  IF NOT FOUND THEN
    RETURN json_build_object('success', false, 'error', 'Project not found or not owned by user');
  END IF;

  -- Check if already unlocked
  IF v_project.is_audit_unlocked THEN
    RETURN json_build_object('success', false, 'error', 'Audit already unlocked');
  END IF;

  -- Get user credits
  SELECT credits, COALESCE(credits_free, 0), COALESCE(credits_paid, 0) 
  INTO v_user_credits, v_current_free, v_current_paid
  FROM public.profiles
  WHERE id = p_user_id;

  -- Check if user has enough credits
  IF v_user_credits < v_audit_cost THEN
    RETURN json_build_object('success', false, 'error', 'Insufficient credits', 'required', v_audit_cost, 'available', v_user_credits);
  END IF;

  -- Deduct credits and unlock audit
  -- Check if credits_free column exists
  IF EXISTS (SELECT 1 FROM information_schema.columns 
             WHERE table_schema = 'public' 
             AND table_name = 'profiles' 
             AND column_name = 'credits_free') THEN
    -- Deduct from free credits first, then paid credits
    IF v_current_free >= v_audit_cost THEN
      UPDATE public.profiles
      SET credits_free = credits_free - v_audit_cost
      WHERE id = p_user_id;
    ELSE
      UPDATE public.profiles
      SET credits_free = 0,
          credits_paid = credits_paid - (v_audit_cost - v_current_free)
      WHERE id = p_user_id;
    END IF;
  ELSE
    -- If credits_free doesn't exist, try to update credits directly (for backward compatibility)
    UPDATE public.profiles
    SET credits = credits - v_audit_cost
    WHERE id = p_user_id;
  END IF;

  -- Generate mock AI audit (replace with real AI later)
  UPDATE public.projects
  SET is_audit_unlocked = TRUE,
      ai_score = json_build_object(
        'overall_score', 75,
        'categories', json_build_array(
          json_build_object('name', 'Design', 'score', 80, 'issues', json_build_array('Consider adding more whitespace')),
          json_build_object('name', 'Copywriting', 'score', 70, 'issues', json_build_array('Headlines could be more compelling'), 'suggested_tools', json_build_array('business-plan-generator')),
          json_build_object('name', 'Technical', 'score', 85, 'issues', json_build_array('JSON structure could be optimized'), 'suggested_tools', json_build_array('formateur-json'))
        ),
        'generated_at', timezone('utc'::text, now())
      )
  WHERE id = p_project_id;

  RETURN json_build_object('success', true, 'credits_remaining', v_user_credits - v_audit_cost);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fix boost_project function
CREATE OR REPLACE FUNCTION public.boost_project(p_project_id UUID, p_user_id UUID)
RETURNS JSON AS $$
DECLARE
  v_project RECORD;
  v_user_credits INTEGER;
  v_current_free INTEGER;
  v_current_paid INTEGER;
  v_boost_cost INTEGER := 100;
  v_boost_duration INTERVAL := '7 days';
BEGIN
  -- Get project and verify ownership
  SELECT * INTO v_project
  FROM public.projects
  WHERE id = p_project_id AND user_id = p_user_id;

  IF NOT FOUND THEN
    RETURN json_build_object('success', false, 'error', 'Project not found or not owned by user');
  END IF;

  -- Get user credits
  SELECT credits, COALESCE(credits_free, 0), COALESCE(credits_paid, 0) 
  INTO v_user_credits, v_current_free, v_current_paid
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
  -- Check if credits_free column exists
  IF EXISTS (SELECT 1 FROM information_schema.columns 
             WHERE table_schema = 'public' 
             AND table_name = 'profiles' 
             AND column_name = 'credits_free') THEN
    -- Deduct from free credits first, then paid credits
    IF v_current_free >= v_boost_cost THEN
      UPDATE public.profiles
      SET credits_free = credits_free - v_boost_cost
      WHERE id = p_user_id;
    ELSE
      UPDATE public.profiles
      SET credits_free = 0,
          credits_paid = credits_paid - (v_boost_cost - v_current_free)
      WHERE id = p_user_id;
    END IF;
  ELSE
    -- If credits_free doesn't exist, try to update credits directly (for backward compatibility)
    UPDATE public.profiles
    SET credits = credits - v_boost_cost
    WHERE id = p_user_id;
  END IF;

  -- Boost project for 7 days
  UPDATE public.projects
  SET boosted_until = timezone('utc'::text, now()) + v_boost_duration
  WHERE id = p_project_id;

  RETURN json_build_object('success', true, 'credits_remaining', v_user_credits - v_boost_cost, 'boosted_until', timezone('utc'::text, now()) + v_boost_duration);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

