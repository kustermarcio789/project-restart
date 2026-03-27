
-- ============================================
-- TABELA: destinations (Destinos de viagem)
-- ============================================
CREATE TABLE public.destinations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  country TEXT NOT NULL,
  continent TEXT NOT NULL DEFAULT 'south-america',
  hero_image TEXT,
  description TEXT,
  cost_of_living_index NUMERIC,
  visa_required BOOLEAN DEFAULT false,
  visa_info JSONB DEFAULT '{}',
  climate JSONB DEFAULT '{}',
  currency TEXT,
  language TEXT,
  timezone TEXT,
  safety_index NUMERIC,
  healthcare_info TEXT,
  transport_info TEXT,
  internet_info TEXT,
  neighborhoods JSONB DEFAULT '[]',
  common_scams JSONB DEFAULT '[]',
  documents_required JSONB DEFAULT '{}',
  faq JSONB DEFAULT '[]',
  avg_flight_price NUMERIC,
  avg_hotel_price NUMERIC,
  avg_insurance_price NUMERIC,
  is_featured BOOLEAN DEFAULT false,
  seo_title TEXT,
  seo_description TEXT,
  status TEXT NOT NULL DEFAULT 'draft',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.destinations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read published destinations"
  ON public.destinations FOR SELECT
  USING (status = 'published');

-- ============================================
-- TABELA: services (Serviços oferecidos)
-- ============================================
CREATE TABLE public.services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  hero_image TEXT,
  features JSONB DEFAULT '[]',
  how_it_works JSONB DEFAULT '[]',
  faq JSONB DEFAULT '[]',
  seo_title TEXT,
  seo_description TEXT,
  display_order INT DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'draft',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read published services"
  ON public.services FOR SELECT
  USING (status = 'published');

-- ============================================
-- TABELA: blog_posts (Posts do blog)
-- ============================================
CREATE TABLE public.blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT,
  content TEXT,
  cover_image TEXT,
  category TEXT,
  tags JSONB DEFAULT '[]',
  author_name TEXT DEFAULT 'Equipe Decolando',
  destination_slug TEXT,
  service_slug TEXT,
  seo_title TEXT,
  seo_description TEXT,
  status TEXT NOT NULL DEFAULT 'draft',
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read published blog posts"
  ON public.blog_posts FOR SELECT
  USING (status = 'published');

-- ============================================
-- TABELA: testimonials (Depoimentos)
-- ============================================
CREATE TABLE public.testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  avatar_url TEXT,
  destination TEXT,
  rating INT NOT NULL DEFAULT 5,
  comment TEXT NOT NULL,
  is_featured BOOLEAN DEFAULT false,
  is_approved BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read approved testimonials"
  ON public.testimonials FOR SELECT
  USING (is_approved = true);

-- ============================================
-- TABELA: content_pages (Páginas de conteúdo estático)
-- ============================================
CREATE TABLE public.content_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  content TEXT,
  seo_title TEXT,
  seo_description TEXT,
  status TEXT NOT NULL DEFAULT 'draft',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.content_pages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read published content pages"
  ON public.content_pages FOR SELECT
  USING (status = 'published');
