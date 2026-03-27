
-- Restrict lead_events to authenticated users ONLY (no anonymous inserts)
DROP POLICY IF EXISTS "Users can insert events for own leads" ON public.lead_events;

CREATE POLICY "Authenticated users insert events for own leads"
ON public.lead_events
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM leads
    WHERE leads.id = lead_events.lead_id
    AND (leads.user_id = auth.uid() OR leads.user_id IS NULL)
  )
);

-- Drop the public SELECT on provider_reviews (force use of view)
DROP POLICY IF EXISTS "Public can read approved reviews no email" ON public.provider_reviews;

-- Only admin (via RPC) can read provider_reviews with email
CREATE POLICY "No public select on provider_reviews"
ON public.provider_reviews
FOR SELECT
TO public
USING (false);

-- Grant SELECT on the safe view to anon and authenticated
GRANT SELECT ON public.provider_reviews_public TO anon, authenticated;
