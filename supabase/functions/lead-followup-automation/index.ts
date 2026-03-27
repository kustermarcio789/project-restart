import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
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

    // Get leads needing follow-up
    const { data: overdueLeads } = await supabase
      .from("leads")
      .select("id, name, email, phone, destination_slug, service_type, score, temperature, stage, next_followup_at, created_at")
      .lt("next_followup_at", new Date().toISOString())
      .not("stage", "in", "(converted,lost)")
      .order("score", { ascending: false });

    // Get new leads without any contact (older than 1 hour)
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const { data: noContactLeads } = await supabase
      .from("leads")
      .select("id, name, email, phone, destination_slug, service_type, score, temperature, created_at")
      .eq("stage", "new")
      .lt("created_at", oneHourAgo)
      .order("score", { ascending: false })
      .limit(20);

    const actions: { lead_id: string; name: string; action: string; channel: string; priority: string; contact: string; context: string }[] = [];

    // Process overdue follow-ups
    for (const lead of overdueLeads || []) {
      const channel = lead.phone ? "whatsapp" : "email";
      const contact = lead.phone || lead.email || "sem contato";
      const dest = lead.destination_slug ? lead.destination_slug.replace(/-/g, " ") : "";
      const svc = lead.service_type ? lead.service_type.replace(/-/g, " ") : "";

      actions.push({
        lead_id: lead.id,
        name: lead.name,
        action: `Follow-up atrasado — ${lead.stage}`,
        channel,
        priority: lead.temperature === "hot" ? "urgente" : "alto",
        contact,
        context: [dest, svc].filter(Boolean).join(" / ") || "geral",
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
        priority: lead.score >= 70 ? "urgente" : lead.score >= 40 ? "alto" : "normal",
        contact,
        context: lead.destination_slug?.replace(/-/g, " ") || "geral",
      });
    }

    // Generate WhatsApp message templates
    const whatsappTemplates = actions
      .filter((a) => a.channel === "whatsapp")
      .slice(0, 10)
      .map((a) => {
        const phone = a.contact.replace(/\D/g, "");
        const isFirstContact = a.action.includes("Primeiro contato");
        const msg = isFirstContact
          ? `Olá ${a.name}! 😊 Vi que você tem interesse em ${a.context}. Sou da equipe Decolando em Viagens e adoraria ajudar a planejar sua viagem. Posso enviar algumas opções?`
          : `Olá ${a.name}! Tudo bem? Estou passando para dar continuidade ao seu interesse em ${a.context}. Tem novidades ou posso ajudar com algo mais?`;

        return {
          lead_id: a.lead_id,
          name: a.name,
          phone,
          message: msg,
          whatsapp_url: `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`,
          priority: a.priority,
        };
      });

    // Generate email templates
    const emailTemplates = actions
      .filter((a) => a.channel === "email")
      .slice(0, 10)
      .map((a) => {
        const isFirstContact = a.action.includes("Primeiro contato");
        return {
          lead_id: a.lead_id,
          name: a.name,
          email: a.contact,
          subject: isFirstContact
            ? `${a.name}, sua viagem para ${a.context} está mais perto!`
            : `${a.name}, novidades sobre sua viagem`,
          priority: a.priority,
        };
      });

    // Log automation run
    await supabase.from("lead_events").insert(
      actions.slice(0, 5).map((a) => ({
        lead_id: a.lead_id,
        event_type: "automation_flagged",
        channel: a.channel,
        description: `Automação: ${a.action} (${a.priority})`,
        metadata: { priority: a.priority, context: a.context },
      }))
    );

    return new Response(
      JSON.stringify({
        success: true,
        summary: {
          total_actions: actions.length,
          overdue: (overdueLeads || []).length,
          no_contact: (noContactLeads || []).length,
        },
        actions: actions.slice(0, 20),
        whatsapp_templates: whatsappTemplates,
        email_templates: emailTemplates,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Follow-up automation error:", error);
    return new Response(
      JSON.stringify({ success: false, error: (error as Error).message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
