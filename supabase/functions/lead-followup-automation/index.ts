import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": Deno.env.get("ALLOWED_ORIGIN") || "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // 1. Get overdue follow-ups
    const { data: overdueLeads } = await supabase
      .from("leads")
      .select(
        "id, name, email, phone, destination_slug, service_type, score, temperature, stage, next_followup_at, created_at"
      )
      .lt("next_followup_at", new Date().toISOString())
      .not("stage", "in", "(converted,lost)")
      .order("score", { ascending: false });

    // 2. New leads without contact (> 1 hour)
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const { data: noContactLeads } = await supabase
      .from("leads")
      .select(
        "id, name, email, phone, destination_slug, service_type, score, temperature, created_at"
      )
      .eq("stage", "new")
      .lt("created_at", oneHourAgo)
      .order("score", { ascending: false })
      .limit(20);

    // 3. Abandoned leads (have abandon_quote events, still new/contacted)
    const { data: abandonEvents } = await supabase
      .from("lead_events")
      .select("lead_id")
      .eq("event_type", "abandon_quote")
      .order("created_at", { ascending: false })
      .limit(50);

    const abandonLeadIds = [
      ...new Set((abandonEvents || []).map((e: any) => e.lead_id)),
    ];
    let abandonedLeads: any[] = [];
    if (abandonLeadIds.length > 0) {
      const { data } = await supabase
        .from("leads")
        .select(
          "id, name, email, phone, destination_slug, service_type, score, temperature, stage"
        )
        .in("id", abandonLeadIds.slice(0, 20))
        .in("stage", ["new", "contacted"])
        .order("score", { ascending: false });
      abandonedLeads = data || [];
    }

    const actions: {
      lead_id: string;
      name: string;
      action: string;
      channel: string;
      priority: string;
      contact: string;
      context: string;
      type: string;
    }[] = [];

    // Process overdue follow-ups
    for (const lead of overdueLeads || []) {
      const channel = lead.phone ? "whatsapp" : "email";
      const contact = lead.phone || lead.email || "sem contato";
      const dest = lead.destination_slug
        ? lead.destination_slug.replace(/-/g, " ")
        : "";
      const svc = lead.service_type
        ? lead.service_type.replace(/-/g, " ")
        : "";

      actions.push({
        lead_id: lead.id,
        name: lead.name,
        action: `Follow-up atrasado — ${lead.stage}`,
        channel,
        priority: lead.temperature === "hot" ? "urgente" : "alto",
        contact,
        context: [dest, svc].filter(Boolean).join(" / ") || "geral",
        type: "overdue",
      });
    }

    // Process new leads needing first contact
    for (const lead of noContactLeads || []) {
      const channel = lead.phone ? "whatsapp" : "email";
      const contact = lead.phone || lead.email || "sem contato";

      actions.push({
        lead_id: lead.id,
        name: lead.name,
        action: "Primeiro contato pendente",
        channel,
        priority:
          lead.score >= 70
            ? "urgente"
            : lead.score >= 40
            ? "alto"
            : "normal",
        contact,
        context: lead.destination_slug?.replace(/-/g, " ") || "geral",
        type: "first_contact",
      });
    }

    // Process abandoned leads (recovery)
    for (const lead of abandonedLeads) {
      const channel = lead.phone ? "whatsapp" : "email";
      const contact = lead.phone || lead.email || "sem contato";

      actions.push({
        lead_id: lead.id,
        name: lead.name,
        action: "Recuperação de abandono",
        channel,
        priority: lead.score >= 50 ? "urgente" : "alto",
        contact,
        context: lead.destination_slug?.replace(/-/g, " ") || "geral",
        type: "abandonment_recovery",
      });
    }

    // Generate WhatsApp templates
    const whatsappTemplates = actions
      .filter((a) => a.channel === "whatsapp")
      .slice(0, 15)
      .map((a) => {
        const phone = a.contact.replace(/\D/g, "");
        let msg: string;

        if (a.type === "first_contact") {
          msg = `Olá ${a.name}! 😊 Vi que você tem interesse em ${a.context}. Sou da equipe Decolando e adoraria ajudar a planejar sua viagem. Posso enviar algumas opções?`;
        } else if (a.type === "abandonment_recovery") {
          msg = `Olá ${a.name}! Vi que você estava pesquisando sobre ${a.context}. Preparei algumas opções especiais para você! Posso te enviar?`;
        } else {
          msg = `Olá ${a.name}! Tudo bem? Estou dando continuidade ao seu interesse em ${a.context}. Tem alguma dúvida ou posso ajudar com algo?`;
        }

        return {
          lead_id: a.lead_id,
          name: a.name,
          phone,
          message: msg,
          whatsapp_url: `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`,
          priority: a.priority,
          type: a.type,
        };
      });

    // Generate email templates
    const emailTemplates = actions
      .filter((a) => a.channel === "email")
      .slice(0, 15)
      .map((a) => {
        let subject: string;

        if (a.type === "first_contact") {
          subject = `${a.name}, sua viagem para ${a.context} está mais perto!`;
        } else if (a.type === "abandonment_recovery") {
          subject = `${a.name}, não perca! Opções especiais para ${a.context}`;
        } else {
          subject = `${a.name}, novidades sobre sua viagem para ${a.context}`;
        }

        return {
          lead_id: a.lead_id,
          name: a.name,
          email: a.contact,
          subject,
          priority: a.priority,
          type: a.type,
        };
      });

    // Log automation in automation_logs
    const logsToInsert = actions.slice(0, 20).map((a) => ({
      lead_id: a.lead_id,
      automation_type: a.type,
      channel: a.channel,
      status: "suggested",
      payload: {
        action: a.action,
        priority: a.priority,
        context: a.context,
        contact: a.contact,
      },
    }));

    if (logsToInsert.length > 0) {
      await supabase.from("automation_logs").insert(logsToInsert);
    }

    // Log events for top priority
    const eventsToInsert = actions.slice(0, 5).map((a) => ({
      lead_id: a.lead_id,
      event_type: "automation_flagged",
      channel: a.channel,
      description: `Automação: ${a.action} (${a.priority})`,
      metadata: { priority: a.priority, context: a.context, type: a.type },
    }));

    if (eventsToInsert.length > 0) {
      await supabase.from("lead_events").insert(eventsToInsert);
    }

    return new Response(
      JSON.stringify({
        success: true,
        summary: {
          total_actions: actions.length,
          overdue: (overdueLeads || []).length,
          no_contact: (noContactLeads || []).length,
          abandoned: abandonedLeads.length,
          whatsapp_actions: whatsappTemplates.length,
          email_actions: emailTemplates.length,
        },
        actions: actions.slice(0, 30),
        whatsapp_templates: whatsappTemplates,
        email_templates: emailTemplates,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Follow-up automation error:", error);
    return new Response(
      JSON.stringify({ success: false, error: (error as Error).message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
