
-- ============================================
-- TABELA: leads (Pipeline comercial)
-- ============================================
CREATE TABLE public.leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  destination_slug TEXT,
  service_type TEXT,
  travel_date_from DATE,
  travel_date_to DATE,
  travelers_count INT DEFAULT 1,
  budget_range TEXT,
  message TEXT,
  stage TEXT NOT NULL DEFAULT 'new',
  score INT DEFAULT 0,
  temperature TEXT DEFAULT 'warm',
  source TEXT DEFAULT 'organic',
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_content TEXT,
  utm_term TEXT,
  landing_page TEXT,
  referrer TEXT,
  assigned_to UUID,
  notes TEXT,
  last_interaction_at TIMESTAMPTZ DEFAULT now(),
  next_followup_at TIMESTAMPTZ,
  lost_reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Permitir INSERT anônimo (formulários públicos)
CREATE POLICY "Anyone can create leads"
  ON public.leads FOR INSERT
  WITH CHECK (true);

-- Leitura/update somente via RPC admin (sem policy SELECT pública)

-- ============================================
-- TABELA: lead_events (Histórico de interações)
-- ============================================
CREATE TABLE public.lead_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  channel TEXT,
  description TEXT,
  metadata JSONB DEFAULT '{}',
  created_by TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_lead_events_lead_id ON public.lead_events(lead_id);
CREATE INDEX idx_lead_events_type ON public.lead_events(event_type);

ALTER TABLE public.lead_events ENABLE ROW LEVEL SECURITY;

-- Permitir INSERT anônimo (sistema registra eventos automaticamente)
CREATE POLICY "Anyone can insert lead events"
  ON public.lead_events FOR INSERT
  WITH CHECK (true);

-- ============================================
-- TABELA: quotes (Cotações)
-- ============================================
CREATE TABLE public.quotes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  provider_id UUID REFERENCES public.providers(id),
  total_amount NUMERIC NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'BRL',
  status TEXT NOT NULL DEFAULT 'draft',
  valid_until DATE,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_quotes_lead_id ON public.quotes(lead_id);

ALTER TABLE public.quotes ENABLE ROW LEVEL SECURITY;

-- Acesso somente via RPC admin (sem policies públicas)

-- ============================================
-- TABELA: quote_items (Itens da cotação)
-- ============================================
CREATE TABLE public.quote_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_id UUID NOT NULL REFERENCES public.quotes(id) ON DELETE CASCADE,
  service_type TEXT NOT NULL,
  description TEXT NOT NULL,
  quantity INT DEFAULT 1,
  unit_price NUMERIC NOT NULL DEFAULT 0,
  total_price NUMERIC NOT NULL DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_quote_items_quote_id ON public.quote_items(quote_id);

ALTER TABLE public.quote_items ENABLE ROW LEVEL SECURITY;

-- Acesso somente via RPC admin

-- ============================================
-- TABELA: provider_services (Serviços por prestador)
-- ============================================
CREATE TABLE public.provider_services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID NOT NULL REFERENCES public.providers(id) ON DELETE CASCADE,
  service_slug TEXT NOT NULL,
  destination_slug TEXT,
  price_range TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_provider_services_provider ON public.provider_services(provider_id);

ALTER TABLE public.provider_services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read active provider services"
  ON public.provider_services FOR SELECT
  USING (is_active = true);

-- ============================================
-- TABELA: provider_reviews (Avaliações de prestadores)
-- ============================================
CREATE TABLE public.provider_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID NOT NULL REFERENCES public.providers(id) ON DELETE CASCADE,
  reviewer_name TEXT NOT NULL,
  reviewer_email TEXT,
  rating INT NOT NULL DEFAULT 5,
  comment TEXT,
  destination TEXT,
  is_approved BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_provider_reviews_provider ON public.provider_reviews(provider_id);

ALTER TABLE public.provider_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read approved reviews"
  ON public.provider_reviews FOR SELECT
  USING (is_approved = true);

CREATE POLICY "Anyone can submit reviews"
  ON public.provider_reviews FOR INSERT
  WITH CHECK (true);
