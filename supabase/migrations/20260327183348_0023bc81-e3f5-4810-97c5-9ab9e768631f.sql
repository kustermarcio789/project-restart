
-- RPC for admin to fetch dashboard data (bookings, providers, commissions)
-- bypasses RLS via SECURITY DEFINER
CREATE OR REPLACE FUNCTION public.admin_get_dashboard_data(p_session_token text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE v_valid BOOLEAN;
BEGIN
  SELECT (admin_validate_session(p_session_token)->>'valid')::BOOLEAN INTO v_valid;
  IF NOT v_valid THEN RETURN jsonb_build_object('success', false, 'error', 'Sessão inválida'); END IF;

  RETURN jsonb_build_object(
    'success', true,
    'stats', (SELECT get_dashboard_stats()),
    'bookings', COALESCE((
      SELECT jsonb_agg(row_to_json(b.*) ORDER BY b.created_at DESC)
      FROM bookings b
    ), '[]'::jsonb),
    'providers', COALESCE((
      SELECT jsonb_agg(row_to_json(p.*) ORDER BY p.created_at ASC)
      FROM providers p
    ), '[]'::jsonb),
    'commissions', COALESCE((
      SELECT jsonb_agg(jsonb_build_object(
        'id', c.id, 'rate', c.rate, 'amount', c.amount,
        'provider_name', COALESCE(p.name, 'N/A'),
        'service_type', COALESCE(p.service_type, 'N/A'),
        'booking_code', COALESCE(b.booking_code, 'N/A')
      ) ORDER BY c.created_at DESC)
      FROM commissions c
      LEFT JOIN providers p ON p.id = c.provider_id
      LEFT JOIN bookings b ON b.id = c.booking_id
    ), '[]'::jsonb)
  );
END;
$function$;

-- Also allow providers SELECT for admin (via RPC above, but also needed for admin_update_provider_status)
DROP POLICY IF EXISTS "Allow read for authenticated requests" ON public.providers;
CREATE POLICY "Admin only read providers"
ON public.providers
FOR SELECT
TO public
USING (is_admin_session());
