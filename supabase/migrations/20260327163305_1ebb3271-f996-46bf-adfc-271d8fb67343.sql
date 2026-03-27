
-- Add user_id to leads table so we can link leads to authenticated users
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL;

-- Create index for user_id lookups
CREATE INDEX IF NOT EXISTS idx_leads_user_id ON public.leads(user_id);

-- RLS: Users can read their own leads
CREATE POLICY "Users can read own leads"
ON public.leads FOR SELECT TO authenticated
USING (auth.uid() = user_id);

-- RLS: Users can read quotes linked to their leads
CREATE POLICY "Users can read own quotes"
ON public.quotes FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.leads
    WHERE leads.id = quotes.lead_id
    AND leads.user_id = auth.uid()
  )
);

-- RLS: Users can read quote items for their quotes
CREATE POLICY "Users can read own quote items"
ON public.quote_items FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.quotes q
    JOIN public.leads l ON l.id = q.lead_id
    WHERE q.id = quote_items.quote_id
    AND l.user_id = auth.uid()
  )
);

-- Add journey_milestones table for traveler journey tracking
CREATE TABLE IF NOT EXISTS public.journey_milestones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  lead_id uuid REFERENCES public.leads(id) ON DELETE SET NULL,
  milestone_key text NOT NULL,
  title text NOT NULL,
  description text,
  completed boolean DEFAULT false,
  completed_at timestamptz,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.journey_milestones ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own milestones"
ON public.journey_milestones FOR SELECT TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can update own milestones"
ON public.journey_milestones FOR UPDATE TO authenticated
USING (auth.uid() = user_id);

-- Document checklist table
CREATE TABLE IF NOT EXISTS public.user_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  document_type text NOT NULL,
  document_name text NOT NULL,
  status text DEFAULT 'pending',
  notes text,
  file_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.user_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own documents"
ON public.user_documents FOR ALL TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);
