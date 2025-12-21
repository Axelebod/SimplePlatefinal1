-- ============================================
-- Update free audits limit from 50 to 20
-- ============================================

-- Update max_free_audits to 20
UPDATE public.free_audits_counter
SET max_free_audits = 20
WHERE id = 1;

-- If the counter doesn't exist, create it with 20
INSERT INTO public.free_audits_counter (id, current_count, max_free_audits)
VALUES (1, 0, 20)
ON CONFLICT (id) DO UPDATE SET max_free_audits = 20;

-- Update the function to reflect the new limit (though it's dynamic)
-- The function already uses max_free_audits from the table, so no change needed
-- But we'll update it to ensure it's correct
CREATE OR REPLACE FUNCTION public.check_free_audit_available()
RETURNS BOOLEAN AS $$
DECLARE
  v_current_count INTEGER;
  v_max_free INTEGER;
BEGIN
  -- Get current count
  SELECT current_count, max_free_audits
  INTO v_current_count, v_max_free
  FROM public.free_audits_counter
  WHERE id = 1;

  -- Check if we're under the limit
  IF v_current_count < v_max_free THEN
    -- Increment counter
    UPDATE public.free_audits_counter
    SET current_count = current_count + 1,
        updated_at = timezone('utc'::text, now())
    WHERE id = 1;
    
    RETURN TRUE; -- Free audit available
  END IF;

  RETURN FALSE; -- No free audits left
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update get_free_audits_remaining function
CREATE OR REPLACE FUNCTION public.get_free_audits_remaining()
RETURNS INTEGER AS $$
DECLARE
  v_current_count INTEGER;
  v_max_free INTEGER;
BEGIN
  SELECT current_count, max_free_audits
  INTO v_current_count, v_max_free
  FROM public.free_audits_counter
  WHERE id = 1;

  RETURN GREATEST(0, v_max_free - v_current_count);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

