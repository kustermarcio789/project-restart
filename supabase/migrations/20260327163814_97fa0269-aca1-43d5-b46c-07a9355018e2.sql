
-- Attach auto-score trigger on leads INSERT/UPDATE
DROP TRIGGER IF EXISTS trg_auto_score_lead ON public.leads;
CREATE TRIGGER trg_auto_score_lead
  AFTER INSERT ON public.leads
  FOR EACH ROW EXECUTE FUNCTION trigger_auto_score_lead();

-- Attach rescore trigger on lead_events INSERT
DROP TRIGGER IF EXISTS trg_rescore_on_event ON public.lead_events;
CREATE TRIGGER trg_rescore_on_event
  AFTER INSERT ON public.lead_events
  FOR EACH ROW EXECUTE FUNCTION trigger_rescore_on_event();

-- Automation logs table
CREATE TABLE IF NOT EXISTS public.automation_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid REFERENCES public.leads(id) ON DELETE SET NULL,
  automation_type text NOT NULL,
  channel text NOT NULL,
  status text DEFAULT 'pending',
  payload jsonb DEFAULT '{}'::jsonb,
  result jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  executed_at timestamptz
);

ALTER TABLE public.automation_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin access automation logs"
ON public.automation_logs FOR SELECT
USING (public.is_admin_session());

CREATE INDEX IF NOT EXISTS idx_automation_logs_lead ON public.automation_logs(lead_id);
CREATE INDEX IF NOT EXISTS idx_automation_logs_type ON public.automation_logs(automation_type, status);

-- Add negotiation stage support - update score function to handle more granular pipeline
-- Enhanced scoring function with abandonment and return visit bonuses
CREATE OR REPLACE FUNCTION public.calculate_lead_score(p_lead_id uuid)
RETURNS integer
LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $$
DECLARE
  v_score INTEGER := 0;
  v_lead RECORD;
  v_event_count INTEGER;
  v_abandon_count INTEGER;
  v_return_count INTEGER;
  v_cta_clicks INTEGER;
BEGIN
  SELECT * INTO v_lead FROM leads WHERE id = p_lead_id;
  IF NOT FOUND THEN RETURN 0; END IF;

  -- Contact info
  IF v_lead.email IS NOT NULL AND v_lead.email != '' THEN v_score := v_score + 10; END IF;
  IF v_lead.phone IS NOT NULL AND v_lead.phone != '' THEN v_score := v_score + 15; END IF;

  -- Interest signals
  IF v_lead.destination_slug IS NOT NULL THEN v_score := v_score + 10; END IF;
  IF v_lead.service_type IS NOT NULL THEN v_score := v_score + 10; END IF;
  IF v_lead.travel_date_from IS NOT NULL THEN v_score := v_score + 10; END IF;
  IF v_lead.travelers_count > 1 THEN v_score := v_score + 5; END IF;

  -- Budget signals
  IF v_lead.budget_range IS NOT NULL THEN
    v_score := v_score + 10;
    IF v_lead.budget_range IN ('20k-50k', 'acima-50k') THEN v_score := v_score + 10; END IF;
  END IF;

  -- Source quality
  IF v_lead.source = 'quote_form' THEN v_score := v_score + 15;
  ELSIF v_lead.source = 'service_page' THEN v_score := v_score + 10;
  ELSIF v_lead.source = 'destination_page' THEN v_score := v_score + 8;
  ELSIF v_lead.source = 'blog' THEN v_score := v_score + 5;
  END IF;

  -- Event-based scoring
  SELECT COUNT(*) INTO v_event_count FROM lead_events WHERE lead_id = p_lead_id;
  v_score := v_score + LEAST(v_event_count * 3, 15);

  -- Abandonment signals (shows intent)
  SELECT COUNT(*) INTO v_abandon_count FROM lead_events WHERE lead_id = p_lead_id AND event_type = 'abandon_quote';
  v_score := v_score + LEAST(v_abandon_count * 20, 20);

  -- Return visits (shows continued interest)
  SELECT COUNT(*) INTO v_return_count FROM lead_events WHERE lead_id = p_lead_id AND event_type = 'return_visit';
  v_score := v_score + LEAST(v_return_count * 25, 25);

  -- CTA clicks
  SELECT COUNT(*) INTO v_cta_clicks FROM lead_events WHERE lead_id = p_lead_id AND event_type = 'click_cta';
  v_score := v_score + LEAST(v_cta_clicks * 20, 20);

  -- Message quality
  IF v_lead.message IS NOT NULL AND length(v_lead.message) > 10 THEN v_score := v_score + 5; END IF;

  v_score := LEAST(v_score, 100);

  UPDATE leads SET
    score = v_score,
    temperature = CASE WHEN v_score >= 70 THEN 'hot' WHEN v_score >= 40 THEN 'warm' ELSE 'cold' END,
    updated_at = now()
  WHERE id = p_lead_id;

  RETURN v_score;
END;
$$;
