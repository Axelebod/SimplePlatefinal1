-- ============================================
-- Add free audits counter for first 50 audits
-- ============================================

-- Create a table to track free audits usage
CREATE TABLE IF NOT EXISTS public.free_audits_counter (
  id SERIAL PRIMARY KEY,
  current_count INTEGER DEFAULT 0 NOT NULL,
  max_free_audits INTEGER DEFAULT 50 NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Initialize counter if it doesn't exist
INSERT INTO public.free_audits_counter (id, current_count, max_free_audits)
VALUES (1, 0, 50)
ON CONFLICT (id) DO NOTHING;

-- Function to check and increment free audits counter
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

-- RLS for free_audits_counter (read-only for everyone, only functions can update)
ALTER TABLE public.free_audits_counter ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view free audits counter" ON public.free_audits_counter;
CREATE POLICY "Anyone can view free audits counter" ON public.free_audits_counter
  FOR SELECT USING (true);

