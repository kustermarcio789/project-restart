
-- Drop overly permissive write policies and replace with admin-session-validated ones
DROP POLICY "Allow write for admin" ON public.providers;
DROP POLICY "Allow write for admin" ON public.bookings;
DROP POLICY "Allow write for admin" ON public.commissions;

-- Write access only through security definer functions (no direct write via anon)
-- Admin operations will use security definer functions instead
CREATE OR REPLACE FUNCTION public.admin_update_provider_status(p_session_token TEXT, p_provider_id UUID, p_status TEXT)
RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE v_valid BOOLEAN;
BEGIN
  SELECT (admin_validate_session(p_session_token)->>'valid')::BOOLEAN INTO v_valid;
  IF NOT v_valid THEN RETURN jsonb_build_object('success', false, 'error', 'Sessão inválida'); END IF;
  UPDATE public.providers SET status = p_status, updated_at = NOW() WHERE id = p_provider_id;
  RETURN jsonb_build_object('success', true);
END; $$;
