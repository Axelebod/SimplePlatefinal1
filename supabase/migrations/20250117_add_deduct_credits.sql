-- ============================================
-- Add deduct_credits RPC function
-- ============================================
-- This function deducts credits from a user's account
-- Handles both generated and regular credits columns

CREATE OR REPLACE FUNCTION public.deduct_credits(
  p_user_id UUID,
  p_amount INTEGER
)
RETURNS JSON AS $$
DECLARE
  v_current_credits INTEGER;
  v_current_free INTEGER;
  v_current_paid INTEGER;
  v_new_free INTEGER;
  v_new_paid INTEGER;
BEGIN
  -- Get current credits and breakdown
  SELECT credits, COALESCE(credits_free, 0), COALESCE(credits_paid, 0)
  INTO v_current_credits, v_current_free, v_current_paid
  FROM public.profiles
  WHERE id = p_user_id;

  IF NOT FOUND THEN
    RETURN json_build_object('success', false, 'error', 'User not found');
  END IF;

  -- Check if user has enough credits
  IF v_current_credits < p_amount THEN
    RETURN json_build_object(
      'success', false, 
      'error', 'Insufficient credits',
      'required', p_amount,
      'available', v_current_credits
    );
  END IF;

  -- Deduct from free credits first, then paid credits
  IF v_current_free >= p_amount THEN
    v_new_free := v_current_free - p_amount;
    v_new_paid := v_current_paid;
  ELSE
    v_new_free := 0;
    v_new_paid := v_current_paid - (p_amount - v_current_free);
  END IF;

  -- Try to update credits_free and credits_paid first (if credits is generated from these)
  -- Check if credits_free column exists
  IF EXISTS (SELECT 1 FROM information_schema.columns 
             WHERE table_schema = 'public' 
             AND table_name = 'profiles' 
             AND column_name = 'credits_free') THEN
    UPDATE public.profiles
    SET credits_free = v_new_free,
        credits_paid = v_new_paid
    WHERE id = p_user_id;
  ELSE
    -- If credits_free doesn't exist, try to update credits directly
    UPDATE public.profiles
    SET credits = v_current_credits - p_amount
    WHERE id = p_user_id;
  END IF;

  -- Verify update succeeded
  IF FOUND THEN
    RETURN json_build_object(
      'success', true,
      'credits_before', v_current_credits,
      'credits_after', v_current_credits - p_amount,
      'amount_deducted', p_amount
    );
  ELSE
    RETURN json_build_object('success', false, 'error', 'Failed to update credits');
  END IF;

EXCEPTION
  WHEN OTHERS THEN
    -- If all else fails, return error
    RETURN json_build_object(
      'success', false,
      'error', 'Failed to deduct credits: ' || SQLERRM
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

