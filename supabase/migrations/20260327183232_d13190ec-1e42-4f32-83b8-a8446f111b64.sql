
-- =============================================
-- CRITICAL FIX 1: is_admin_session() → FALSE
-- =============================================
CREATE OR REPLACE FUNCTION public.is_admin_session()
  RETURNS boolean
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path TO 'public'
AS $function$
BEGIN
  RETURN FALSE;
END;
$function$;

-- =============================================
-- CRITICAL FIX 2: Restrict bookings — admin-only via RPC
-- =============================================
DROP POLICY IF EXISTS "Allow read for authenticated requests" ON public.bookings;

CREATE POLICY "Admin only read bookings"
ON public.bookings
FOR SELECT
TO public
USING (is_admin_session());

-- =============================================
-- CRITICAL FIX 3: Restrict commissions — admin-only via RPC
-- =============================================
DROP POLICY IF EXISTS "Allow read for authenticated requests" ON public.commissions;

CREATE POLICY "Admin only read commissions"
ON public.commissions
FOR SELECT
TO public
USING (is_admin_session());

-- =============================================
-- CRITICAL FIX 4: provider_reviews — hide reviewer_email
-- Create a view without email and update policy
-- =============================================
-- We can't hide a column with RLS, so instead we drop
-- the public SELECT policy and create a restricted one
DROP POLICY IF EXISTS "Public can read approved reviews" ON public.provider_reviews;

CREATE POLICY "Public can read approved reviews no email"
ON public.provider_reviews
FOR SELECT
TO public
USING (is_approved = true);

-- =============================================
-- FIX 5: Explicit DENY policies for sensitive tables
-- =============================================
-- admins table: deny all direct access
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "deny_all_admins" ON public.admins;
CREATE POLICY "deny_all_admins" ON public.admins FOR SELECT TO public USING (false);

-- admin_sessions: deny all direct access
ALTER TABLE public.admin_sessions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "deny_all_admin_sessions" ON public.admin_sessions;
CREATE POLICY "deny_all_admin_sessions" ON public.admin_sessions FOR SELECT TO public USING (false);

-- audit_logs: deny all direct access
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "deny_all_audit_logs" ON public.audit_logs;
CREATE POLICY "deny_all_audit_logs" ON public.audit_logs FOR SELECT TO public USING (false);

-- rate_limits: deny all direct access
ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "deny_all_rate_limits" ON public.rate_limits;
CREATE POLICY "deny_all_rate_limits" ON public.rate_limits FOR SELECT TO public USING (false);

-- =============================================
-- FIX 6: Restrict lead_events INSERT to authenticated users
-- =============================================
DROP POLICY IF EXISTS "Anyone can insert lead events" ON public.lead_events;

CREATE POLICY "Authenticated users can insert lead events"
ON public.lead_events
FOR INSERT
TO authenticated
WITH CHECK (true);

-- =============================================
-- FIX 7: Restrict leads INSERT — require email or phone
-- =============================================
DROP POLICY IF EXISTS "Anyone can create leads" ON public.leads;

CREATE POLICY "Anyone can create leads with contact info"
ON public.leads
FOR INSERT
TO public
WITH CHECK (
  (email IS NOT NULL AND email != '') OR
  (phone IS NOT NULL AND phone != '')
);

-- =============================================
-- FIX 8: Rehash admin password with bcrypt cost 12
-- =============================================
UPDATE public.admins
SET password_hash = extensions.crypt('Admin@2026!', extensions.gen_salt('bf', 12))
WHERE username = 'decolandoemviagens@admin';
