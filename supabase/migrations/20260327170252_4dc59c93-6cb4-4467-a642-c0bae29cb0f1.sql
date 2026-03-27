
-- User behavior tracking table
CREATE TABLE IF NOT EXISTS public.user_behavior (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  session_id text,
  event_type text NOT NULL,
  entity_type text,
  entity_slug text,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.user_behavior ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert behavior" ON public.user_behavior
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can read own behavior" ON public.user_behavior
  FOR SELECT USING (auth.uid() = user_id);

CREATE INDEX idx_behavior_user ON public.user_behavior(user_id);
CREATE INDEX idx_behavior_entity ON public.user_behavior(entity_type, entity_slug);
CREATE INDEX idx_behavior_event ON public.user_behavior(event_type);
CREATE INDEX idx_behavior_session ON public.user_behavior(session_id);

-- Recommendations table (cached/precomputed)
CREATE TABLE IF NOT EXISTS public.recommendations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  rec_type text NOT NULL,
  entity_type text NOT NULL,
  entity_slug text NOT NULL,
  score numeric DEFAULT 0,
  reason text,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  expires_at timestamptz DEFAULT (now() + interval '24 hours')
);

ALTER TABLE public.recommendations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own recommendations" ON public.recommendations
  FOR SELECT USING (user_id IS NULL OR auth.uid() = user_id);

CREATE POLICY "System can insert recommendations" ON public.recommendations
  FOR INSERT WITH CHECK (true);

CREATE INDEX idx_rec_user ON public.recommendations(user_id);
CREATE INDEX idx_rec_type ON public.recommendations(rec_type, entity_type);

-- Function to generate rule-based recommendations
CREATE OR REPLACE FUNCTION public.generate_recommendations(p_user_id uuid DEFAULT NULL)
RETURNS void
LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $$
DECLARE
  v_dest RECORD;
BEGIN
  -- Clear old recommendations for this user
  DELETE FROM recommendations WHERE user_id = p_user_id AND expires_at < now();

  -- 1. Most popular destinations (for all users)
  INSERT INTO recommendations (user_id, rec_type, entity_type, entity_slug, score, reason)
  SELECT
    p_user_id,
    'popular',
    'destination',
    b.entity_slug,
    COUNT(*)::numeric,
    'Mais procurado pelos viajantes'
  FROM user_behavior b
  WHERE b.entity_type = 'destination' AND b.event_type IN ('page_view', 'view_destino')
  GROUP BY b.entity_slug
  ORDER BY COUNT(*) DESC
  LIMIT 6
  ON CONFLICT DO NOTHING;

  -- 2. Based on user's browsing history
  IF p_user_id IS NOT NULL THEN
    INSERT INTO recommendations (user_id, rec_type, entity_type, entity_slug, score, reason)
    SELECT
      p_user_id,
      'history_based',
      'destination',
      d.slug,
      50,
      'Baseado no que você pesquisou'
    FROM destinations d
    WHERE d.status = 'published'
      AND d.continent = (
        SELECT dd.continent FROM user_behavior ub
        JOIN destinations dd ON dd.slug = ub.entity_slug
        WHERE ub.user_id = p_user_id AND ub.entity_type = 'destination'
        ORDER BY ub.created_at DESC LIMIT 1
      )
      AND d.slug NOT IN (
        SELECT entity_slug FROM user_behavior WHERE user_id = p_user_id AND entity_type = 'destination'
      )
    LIMIT 4
    ON CONFLICT DO NOTHING;
  END IF;

  -- 3. Best cost-benefit (cheapest featured destinations)
  INSERT INTO recommendations (user_id, rec_type, entity_type, entity_slug, score, reason)
  SELECT
    p_user_id,
    'cost_benefit',
    'destination',
    d.slug,
    COALESCE(100 - d.cost_of_living_index, 50),
    'Melhor custo-benefício'
  FROM destinations d
  WHERE d.status = 'published' AND d.is_featured = true
  ORDER BY d.avg_flight_price ASC NULLS LAST
  LIMIT 4
  ON CONFLICT DO NOTHING;

  -- 4. Popular services
  INSERT INTO recommendations (user_id, rec_type, entity_type, entity_slug, score, reason)
  SELECT
    p_user_id,
    'popular',
    'service',
    s.slug,
    COALESCE(s.display_order, 0)::numeric,
    'Serviço mais procurado'
  FROM services s
  WHERE s.status = 'published'
  ORDER BY s.display_order ASC
  LIMIT 4
  ON CONFLICT DO NOTHING;
END;
$$;
