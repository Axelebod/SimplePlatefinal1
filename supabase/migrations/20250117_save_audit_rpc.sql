-- ============================================
-- Add RPC function to save audit result
-- ============================================
-- This function saves the audit result to the database
-- Accepts the audit data as JSONB directly

CREATE OR REPLACE FUNCTION public.save_audit_result(
  p_project_id UUID,
  p_user_id UUID,
  p_audit_data JSONB
)
RETURNS JSON AS $$
DECLARE
  v_project RECORD;
BEGIN
  -- Verify project ownership
  SELECT * INTO v_project
  FROM public.projects
  WHERE id = p_project_id AND user_id = p_user_id;

  IF NOT FOUND THEN
    RETURN json_build_object('success', false, 'error', 'Project not found or not owned by user');
  END IF;

  -- Update project with audit result
  UPDATE public.projects
  SET is_audit_unlocked = TRUE,
      ai_score = p_audit_data
  WHERE id = p_project_id;

  RETURN json_build_object('success', true);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

