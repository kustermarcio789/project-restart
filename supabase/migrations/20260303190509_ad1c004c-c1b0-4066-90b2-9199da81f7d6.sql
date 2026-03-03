
-- Enable pgcrypto for password hashing
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Create admins table (not exposed via RLS)
CREATE TABLE public.admins (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  display_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS and deny all direct access
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;

-- No direct access policies - only accessible via SECURITY DEFINER functions

-- Create admin_sessions table
CREATE TABLE public.admin_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_id UUID NOT NULL REFERENCES public.admins(id) ON DELETE CASCADE,
  session_token TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(admin_id)
);

ALTER TABLE public.admin_sessions ENABLE ROW LEVEL SECURITY;

-- No direct access policies - only accessible via SECURITY DEFINER functions

-- Insert default admin user (password: admin123 - should be changed after first login)
INSERT INTO public.admins (username, password_hash, display_name)
VALUES ('admin@decolando.com', crypt('admin123', gen_salt('bf')), 'Administrador');

-- Create login function
CREATE OR REPLACE FUNCTION public.admin_login(
  p_username TEXT,
  p_password TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_admin_id UUID;
  v_display_name TEXT;
  v_session_token TEXT;
  v_expires_at TIMESTAMPTZ;
BEGIN
  SELECT id, display_name INTO v_admin_id, v_display_name
  FROM public.admins
  WHERE username = p_username AND password_hash = crypt(p_password, password_hash);

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

-- Create session validation function
CREATE OR REPLACE FUNCTION public.admin_validate_session(
  p_session_token TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_admin_id UUID;
  v_display_name TEXT;
BEGIN
  SELECT s.admin_id, a.display_name INTO v_admin_id, v_display_name
  FROM public.admin_sessions s
  JOIN public.admins a ON a.id = s.admin_id
  WHERE s.session_token = p_session_token AND s.expires_at > NOW();

  IF v_admin_id IS NULL THEN
    RETURN jsonb_build_object('valid', false);
  END IF;

  RETURN jsonb_build_object('valid', true, 'admin_id', v_admin_id, 'display_name', v_display_name);
END;
$$;

-- Create logout function
CREATE OR REPLACE FUNCTION public.admin_logout(
  p_session_token TEXT
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM public.admin_sessions WHERE session_token = p_session_token;
END;
$$;
