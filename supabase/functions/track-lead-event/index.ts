import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': Deno.env.get('ALLOWED_ORIGIN') || '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
};

const ALLOWED_EVENT_TYPES = new Set([
  'start_quote',
  'abandon_quote',
  'view_destino',
  'view_servico',
  'page_view',
  'return_visit',
  'quote_requested',
  'smart_flow_completed_global_v2',
  'provider_registration_submitted',
  'partner_registration_submitted',
]);

type LeadEventPayload = {
  lead_id?: string;
  event_type?: string;
  channel?: string;
  description?: string;
  metadata?: Record<string, unknown>;
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    const payload: LeadEventPayload = await req.json();

    if (!payload.lead_id || !payload.event_type) {
      return new Response(JSON.stringify({ error: 'lead_id and event_type are required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!ALLOWED_EVENT_TYPES.has(payload.event_type)) {
      return new Response(JSON.stringify({ error: 'Unsupported event_type' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !serviceRoleKey) {
      throw new Error('Supabase environment variables are not configured');
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const authHeader = req.headers.get('Authorization');
    let requesterUserId: string | null = null;

    if (authHeader?.startsWith('Bearer ')) {
      const jwt = authHeader.replace('Bearer ', '').trim();
      if (jwt) {
        const {
          data: { user },
        } = await supabase.auth.getUser(jwt);
        requesterUserId = user?.id ?? null;
      }
    }

    const { data: lead, error: leadError } = await supabase
      .from('leads')
      .select('id, user_id')
      .eq('id', payload.lead_id)
      .maybeSingle();

    if (leadError) {
      throw leadError;
    }

    if (!lead) {
      return new Response(JSON.stringify({ error: 'Lead not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (lead.user_id && lead.user_id !== requesterUserId) {
      return new Response(JSON.stringify({ error: 'Forbidden for this lead' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const sanitizedDescription =
      typeof payload.description === 'string' && payload.description.trim().length > 0
        ? payload.description.trim().slice(0, 280)
        : payload.event_type;

    const incomingMetadata =
      payload.metadata && typeof payload.metadata === 'object' && !Array.isArray(payload.metadata)
        ? payload.metadata
        : {};

    const { error: insertError } = await supabase.from('lead_events').insert({
      lead_id: payload.lead_id,
      event_type: payload.event_type,
      channel: payload.channel === 'web' ? 'web' : 'web',
      description: sanitizedDescription,
      metadata: {
        ...incomingMetadata,
        ingested_by: 'edge_function',
        received_at: new Date().toISOString(),
      },
    });

    if (insertError) {
      throw insertError;
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
