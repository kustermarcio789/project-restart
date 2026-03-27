
-- Fix reviewer_email exposure: create a view without email for public access
CREATE OR REPLACE VIEW public.provider_reviews_public AS
SELECT id, provider_id, reviewer_name, comment, destination, rating, is_approved, created_at
FROM public.provider_reviews
WHERE is_approved = true;

-- Fix lead_events: restrict to own leads only
DROP POLICY IF EXISTS "Authenticated users can insert lead events" ON public.lead_events;

CREATE POLICY "Users can insert events for own leads"
ON public.lead_events
FOR INSERT
TO public
WITH CHECK (
  EXISTS (
    SELECT 1 FROM leads
    WHERE leads.id = lead_events.lead_id
    AND (
      leads.user_id = auth.uid()
      OR leads.user_id IS NULL
    )
  )
);
