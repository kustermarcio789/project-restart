
-- Recreate admin_login to ensure pgcrypto is available
CREATE OR REPLACE FUNCTION public.admin_login(p_username text, p_password text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public', 'extensions'
AS $$
DECLARE
  v_admin_id UUID;
  v_display_name TEXT;
  v_session_token TEXT;
  v_expires_at TIMESTAMPTZ;
BEGIN
  SELECT id, display_name INTO v_admin_id, v_display_name
  FROM public.admins
  WHERE username = p_username AND password_hash = extensions.crypt(p_password, password_hash);

  IF v_admin_id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Credenciais inválidas');
  END IF;

  v_session_token := gen_random_uuid()::TEXT;
  v_expires_at := NOW() + INTERVAL '8 hours';

  INSERT INTO public.admin_sessions (admin_id, session_token, expires_at)
  VALUES (v_admin_id, v_session_token, v_expires_at)
  ON CONFLICT (admin_id) DO UPDATE SET
    session_token = EXCLUDED.session_token,
    expires_at = EXCLUDED.expires_at;

  RETURN jsonb_build_object(
    'success', true,
    'session_token', v_session_token,
    'display_name', v_display_name,
    'expires_at', v_expires_at
  );
END;
$$;

-- Also need to re-insert admin with proper crypt call
DELETE FROM public.admins WHERE username = 'admin@decolando.com';
INSERT INTO public.admins (username, password_hash, display_name)
VALUES ('admin@decolando.com', extensions.crypt('admin123', extensions.gen_salt('bf')), 'Administrador');
