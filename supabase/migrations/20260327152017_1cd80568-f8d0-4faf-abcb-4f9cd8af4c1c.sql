
-- ============================================
-- RPCs ADMIN para acesso seguro às novas tabelas
-- ============================================

-- Listar leads com filtros
CREATE OR REPLACE FUNCTION public.admin_get_leads(
  p_session_token TEXT,
  p_stage TEXT DEFAULT NULL,
  p_source TEXT DEFAULT NULL,
  p_destination TEXT DEFAULT NULL,
  p_limit INT DEFAULT 50,
  p_offset INT DEFAULT 0
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_valid BOOLEAN;
  v_result JSONB;
BEGIN
  SELECT (admin_validate_session(p_session_token)->>'valid')::BOOLEAN INTO v_valid;
  IF NOT v_valid THEN RETURN jsonb_build_object('success', false, 'error', 'Sessão inválida'); END IF;

  SELECT jsonb_build_object(
    'success', true,
    'data', COALESCE(jsonb_agg(row_to_json(l.*) ORDER BY l.created_at DESC), '[]'::jsonb),
    'total', (SELECT COUNT(*) FROM leads
              WHERE (p_stage IS NULL OR stage = p_stage)
                AND (p_source IS NULL OR source = p_source)
                AND (p_destination IS NULL OR destination_slug = p_destination))
  ) INTO v_result
  FROM (
    SELECT * FROM leads
    WHERE (p_stage IS NULL OR stage = p_stage)
      AND (p_source IS NULL OR source = p_source)
      AND (p_destination IS NULL OR destination_slug = p_destination)
    ORDER BY created_at DESC
    LIMIT p_limit OFFSET p_offset
  ) l;

  RETURN v_result;
END;
$$;

-- Atualizar lead
CREATE OR REPLACE FUNCTION public.admin_update_lead(
  p_session_token TEXT,
  p_lead_id UUID,
  p_data JSONB
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_valid BOOLEAN;
  v_old_stage TEXT;
BEGIN
  SELECT (admin_validate_session(p_session_token)->>'valid')::BOOLEAN INTO v_valid;
  IF NOT v_valid THEN RETURN jsonb_build_object('success', false, 'error', 'Sessão inválida'); END IF;

  SELECT stage INTO v_old_stage FROM leads WHERE id = p_lead_id;

  UPDATE leads SET
    stage = COALESCE(p_data->>'stage', stage),
    temperature = COALESCE(p_data->>'temperature', temperature),
    score = COALESCE((p_data->>'score')::INT, score),
    assigned_to = CASE WHEN p_data ? 'assigned_to' THEN (p_data->>'assigned_to')::UUID ELSE assigned_to END,
    notes = COALESCE(p_data->>'notes', notes),
    next_followup_at = CASE WHEN p_data ? 'next_followup_at' THEN (p_data->>'next_followup_at')::TIMESTAMPTZ ELSE next_followup_at END,
    lost_reason = COALESCE(p_data->>'lost_reason', lost_reason),
    last_interaction_at = now(),
    updated_at = now()
  WHERE id = p_lead_id;

  -- Registrar evento de mudança de stage
  IF p_data->>'stage' IS NOT NULL AND p_data->>'stage' != v_old_stage THEN
    INSERT INTO lead_events (lead_id, event_type, channel, description, metadata)
    VALUES (p_lead_id, 'stage_changed', 'system',
            'Stage alterado de ' || v_old_stage || ' para ' || (p_data->>'stage'),
            jsonb_build_object('old_stage', v_old_stage, 'new_stage', p_data->>'stage'));
  END IF;

  RETURN jsonb_build_object('success', true);
END;
$$;

-- Obter eventos de um lead
CREATE OR REPLACE FUNCTION public.admin_get_lead_events(
  p_session_token TEXT,
  p_lead_id UUID
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE v_valid BOOLEAN;
BEGIN
  SELECT (admin_validate_session(p_session_token)->>'valid')::BOOLEAN INTO v_valid;
  IF NOT v_valid THEN RETURN jsonb_build_object('success', false, 'error', 'Sessão inválida'); END IF;

  RETURN jsonb_build_object(
    'success', true,
    'data', COALESCE((
      SELECT jsonb_agg(row_to_json(e.*) ORDER BY e.created_at DESC)
      FROM lead_events e WHERE e.lead_id = p_lead_id
    ), '[]'::jsonb)
  );
END;
$$;

-- Métricas do pipeline
CREATE OR REPLACE FUNCTION public.admin_get_pipeline_stats(p_session_token TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE v_valid BOOLEAN;
BEGIN
  SELECT (admin_validate_session(p_session_token)->>'valid')::BOOLEAN INTO v_valid;
  IF NOT v_valid THEN RETURN jsonb_build_object('success', false, 'error', 'Sessão inválida'); END IF;

  RETURN jsonb_build_object(
    'success', true,
    'by_stage', (SELECT jsonb_object_agg(stage, cnt) FROM (SELECT stage, COUNT(*) as cnt FROM leads GROUP BY stage) s),
    'by_source', (SELECT jsonb_object_agg(source, cnt) FROM (SELECT source, COUNT(*) as cnt FROM leads GROUP BY source) s),
    'by_destination', (SELECT jsonb_object_agg(COALESCE(destination_slug, 'sem_destino'), cnt) FROM (SELECT destination_slug, COUNT(*) as cnt FROM leads GROUP BY destination_slug) s),
    'total_leads', (SELECT COUNT(*) FROM leads),
    'hot_leads', (SELECT COUNT(*) FROM leads WHERE temperature = 'hot' AND stage NOT IN ('converted', 'lost')),
    'conversion_rate', (SELECT ROUND(COUNT(*) FILTER (WHERE stage = 'converted')::NUMERIC / NULLIF(COUNT(*), 0) * 100, 1) FROM leads)
  );
END;
$$;

-- Obter logs de auditoria
CREATE OR REPLACE FUNCTION public.admin_get_audit_logs(
  p_session_token TEXT,
  p_limit INT DEFAULT 50,
  p_offset INT DEFAULT 0
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE v_valid BOOLEAN;
BEGIN
  SELECT (admin_validate_session(p_session_token)->>'valid')::BOOLEAN INTO v_valid;
  IF NOT v_valid THEN RETURN jsonb_build_object('success', false, 'error', 'Sessão inválida'); END IF;

  RETURN jsonb_build_object(
    'success', true,
    'data', COALESCE((
      SELECT jsonb_agg(row_to_json(a.*))
      FROM (SELECT * FROM audit_logs ORDER BY created_at DESC LIMIT p_limit OFFSET p_offset) a
    ), '[]'::jsonb)
  );
END;
$$;
