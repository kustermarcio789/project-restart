
-- Auto lead scoring function
CREATE OR REPLACE FUNCTION public.calculate_lead_score(p_lead_id uuid)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_score INTEGER := 0;
  v_lead RECORD;
  v_event_count INTEGER;
BEGIN
  SELECT * INTO v_lead FROM leads WHERE id = p_lead_id;
  IF NOT FOUND THEN RETURN 0; END IF;

  IF v_lead.email IS NOT NULL AND v_lead.email != '' THEN v_score := v_score + 10; END IF;
  IF v_lead.phone IS NOT NULL AND v_lead.phone != '' THEN v_score := v_score + 15; END IF;
  IF v_lead.destination_slug IS NOT NULL THEN v_score := v_score + 10; END IF;
  IF v_lead.service_type IS NOT NULL THEN v_score := v_score + 10; END IF;
  IF v_lead.travel_date_from IS NOT NULL THEN v_score := v_score + 10; END IF;
  IF v_lead.travelers_count > 1 THEN v_score := v_score + 5; END IF;

  IF v_lead.budget_range IS NOT NULL THEN
    v_score := v_score + 10;
    IF v_lead.budget_range IN ('20k-50k', 'acima-50k') THEN v_score := v_score + 10; END IF;
  END IF;

  IF v_lead.source = 'quote_form' THEN v_score := v_score + 15;
  ELSIF v_lead.source = 'service_page' THEN v_score := v_score + 10;
  ELSIF v_lead.source = 'destination_page' THEN v_score := v_score + 8;
  END IF;

  SELECT COUNT(*) INTO v_event_count FROM lead_events WHERE lead_id = p_lead_id;
  v_score := v_score + LEAST(v_event_count * 3, 15);

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

-- Trigger auto-score on lead insert
CREATE OR REPLACE FUNCTION public.trigger_auto_score_lead()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $$ BEGIN PERFORM calculate_lead_score(NEW.id); RETURN NEW; END; $$;

DROP TRIGGER IF EXISTS trg_auto_score_lead ON leads;
CREATE TRIGGER trg_auto_score_lead AFTER INSERT ON leads FOR EACH ROW EXECUTE FUNCTION trigger_auto_score_lead();

-- Re-score on new lead event
CREATE OR REPLACE FUNCTION public.trigger_rescore_on_event()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $$ BEGIN PERFORM calculate_lead_score(NEW.lead_id); RETURN NEW; END; $$;

DROP TRIGGER IF EXISTS trg_rescore_on_event ON lead_events;
CREATE TRIGGER trg_rescore_on_event AFTER INSERT ON lead_events FOR EACH ROW EXECUTE FUNCTION trigger_rescore_on_event();

-- Batch score all active leads
CREATE OR REPLACE FUNCTION public.admin_batch_score_leads(p_session_token text)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $$
DECLARE v_valid BOOLEAN; v_count INTEGER := 0; v_lead RECORD;
BEGIN
  SELECT (admin_validate_session(p_session_token)->>'valid')::BOOLEAN INTO v_valid;
  IF NOT v_valid THEN RETURN jsonb_build_object('success', false, 'error', 'Sessão inválida'); END IF;
  FOR v_lead IN SELECT id FROM leads WHERE stage NOT IN ('converted', 'lost') LOOP
    PERFORM calculate_lead_score(v_lead.id);
    v_count := v_count + 1;
  END LOOP;
  RETURN jsonb_build_object('success', true, 'scored', v_count);
END;
$$;

-- Enhanced commercial stats
CREATE OR REPLACE FUNCTION public.admin_get_commercial_stats(p_session_token text)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $$
DECLARE v_valid BOOLEAN;
BEGIN
  SELECT (admin_validate_session(p_session_token)->>'valid')::BOOLEAN INTO v_valid;
  IF NOT v_valid THEN RETURN jsonb_build_object('success', false, 'error', 'Sessão inválida'); END IF;
  RETURN jsonb_build_object(
    'success', true,
    'total_leads', (SELECT COUNT(*) FROM leads),
    'new_today', (SELECT COUNT(*) FROM leads WHERE created_at >= CURRENT_DATE),
    'new_week', (SELECT COUNT(*) FROM leads WHERE created_at >= CURRENT_DATE - INTERVAL '7 days'),
    'hot_leads', (SELECT COUNT(*) FROM leads WHERE temperature = 'hot' AND stage NOT IN ('converted', 'lost')),
    'warm_leads', (SELECT COUNT(*) FROM leads WHERE temperature = 'warm' AND stage NOT IN ('converted', 'lost')),
    'avg_score', (SELECT ROUND(AVG(score)::NUMERIC, 1) FROM leads WHERE stage NOT IN ('converted', 'lost')),
    'overdue_followups', (SELECT COUNT(*) FROM leads WHERE next_followup_at < NOW() AND stage NOT IN ('converted', 'lost')),
    'today_followups', (SELECT COUNT(*) FROM leads WHERE next_followup_at::DATE = CURRENT_DATE AND stage NOT IN ('converted', 'lost')),
    'conversion_rate', (SELECT ROUND(COUNT(*) FILTER (WHERE stage = 'converted')::NUMERIC / NULLIF(COUNT(*), 0) * 100, 1) FROM leads),
    'by_stage', (SELECT COALESCE(jsonb_object_agg(stage, cnt), '{}'::jsonb) FROM (SELECT stage, COUNT(*) as cnt FROM leads GROUP BY stage) s),
    'by_source', (SELECT COALESCE(jsonb_object_agg(COALESCE(source, 'direto'), cnt), '{}'::jsonb) FROM (SELECT source, COUNT(*) as cnt FROM leads GROUP BY source) s),
    'by_service', (SELECT COALESCE(jsonb_object_agg(COALESCE(service_type, 'geral'), cnt), '{}'::jsonb) FROM (SELECT service_type, COUNT(*) as cnt FROM leads WHERE service_type IS NOT NULL GROUP BY service_type) s),
    'score_distribution', jsonb_build_object(
      'high', (SELECT COUNT(*) FROM leads WHERE score >= 70 AND stage NOT IN ('converted', 'lost')),
      'medium', (SELECT COUNT(*) FROM leads WHERE score >= 40 AND score < 70 AND stage NOT IN ('converted', 'lost')),
      'low', (SELECT COUNT(*) FROM leads WHERE score < 40 AND stage NOT IN ('converted', 'lost'))
    )
  );
END;
$$;

-- Follow-up queue
CREATE OR REPLACE FUNCTION public.admin_get_followup_queue(p_session_token text)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $$
DECLARE v_valid BOOLEAN;
BEGIN
  SELECT (admin_validate_session(p_session_token)->>'valid')::BOOLEAN INTO v_valid;
  IF NOT v_valid THEN RETURN jsonb_build_object('success', false, 'error', 'Sessão inválida'); END IF;
  RETURN jsonb_build_object(
    'success', true,
    'overdue', COALESCE((SELECT jsonb_agg(row_to_json(l.*) ORDER BY l.next_followup_at ASC) FROM leads l WHERE l.next_followup_at < NOW() AND l.stage NOT IN ('converted', 'lost')), '[]'::jsonb),
    'today', COALESCE((SELECT jsonb_agg(row_to_json(l.*) ORDER BY l.next_followup_at ASC) FROM leads l WHERE l.next_followup_at::DATE = CURRENT_DATE AND l.next_followup_at >= NOW() AND l.stage NOT IN ('converted', 'lost')), '[]'::jsonb),
    'no_contact', COALESCE((SELECT jsonb_agg(row_to_json(l.*) ORDER BY l.score DESC NULLS LAST) FROM leads l WHERE l.stage = 'new' AND l.created_at < NOW() - INTERVAL '2 hours'), '[]'::jsonb)
  );
END;
$$;
