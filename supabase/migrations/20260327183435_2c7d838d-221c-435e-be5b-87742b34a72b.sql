
-- Admin RPC to insert providers (bypasses RLS)
CREATE OR REPLACE FUNCTION public.admin_add_provider(
  p_session_token text,
  p_name text,
  p_service_type text,
  p_commission_rate numeric
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE v_valid BOOLEAN; v_id UUID;
BEGIN
  SELECT (admin_validate_session(p_session_token)->>'valid')::BOOLEAN INTO v_valid;
  IF NOT v_valid THEN RETURN jsonb_build_object('success', false, 'error', 'Sessão inválida'); END IF;

  INSERT INTO providers (name, service_type, commission_rate, status)
  VALUES (p_name, p_service_type, p_commission_rate, 'pending')
  RETURNING id INTO v_id;

  RETURN jsonb_build_object('success', true, 'id', v_id);
END;
$function$;

-- Admin RPC to insert bookings (bypasses RLS)
CREATE OR REPLACE FUNCTION public.admin_add_booking(
  p_session_token text,
  p_booking_code text,
  p_traveler_name text,
  p_traveler_email text,
  p_destination text,
  p_travel_date text,
  p_amount numeric,
  p_provider_id text
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE v_valid BOOLEAN; v_id UUID;
BEGIN
  SELECT (admin_validate_session(p_session_token)->>'valid')::BOOLEAN INTO v_valid;
  IF NOT v_valid THEN RETURN jsonb_build_object('success', false, 'error', 'Sessão inválida'); END IF;

  INSERT INTO bookings (booking_code, traveler_name, traveler_email, destination, travel_date, amount, provider_id, status)
  VALUES (
    p_booking_code,
    p_traveler_name,
    NULLIF(p_traveler_email, ''),
    p_destination,
    NULLIF(p_travel_date, '')::date,
    p_amount,
    NULLIF(p_provider_id, '')::uuid,
    'pending'
  )
  RETURNING id INTO v_id;

  RETURN jsonb_build_object('success', true, 'id', v_id);
END;
$function$;
