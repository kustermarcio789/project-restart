import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Send, CheckCircle2 } from 'lucide-react';
import { useLeadTracking } from '@/contexts/LeadTrackingContext';

interface Props {
  serviceSlug: string;
  serviceName: string;
}

export const ServiceLeadCapture = ({ serviceSlug, serviceName }: Props) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { utmData, trackFormStart } = useLeadTracking();

  const handleFocus = () => trackFormStart(`service-lead-${serviceSlug}`);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || (!email.trim() && !phone.trim())) {
      toast.error('Preencha seu nome e pelo menos email ou WhatsApp.');
      return;
    }

    setLoading(true);
    try {
      const leadId = crypto.randomUUID();
      const { error } = await supabase.from('leads').insert({
        id: leadId,
        name: name.trim(),
        email: email.trim() || null,
        phone: phone.trim() || null,
        service_type: serviceSlug,
        source: 'service_page',
        landing_page: `/servico/${serviceSlug}`,
        utm_source: utmData.utm_source,
        utm_medium: utmData.utm_medium,
        utm_campaign: utmData.utm_campaign,
        utm_content: utmData.utm_content,
        utm_term: utmData.utm_term,
        referrer: utmData.referrer || null,
      });

      if (error) throw error;

      await supabase.from('lead_events').insert({
        lead_id: leadId,
        event_type: 'form_submitted',
        channel: 'web',
        description: `Lead capturado na página de serviço: ${serviceName}`,
        metadata: { service_slug: serviceSlug },
      });

      setSubmitted(true);
      toast.success('Recebemos seu interesse! Entraremos em contato em breve.');
    } catch {
      toast.error('Erro ao enviar. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <section className="py-12 sm:py-16">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass-panel rounded-2xl p-8 sm:p-12 border-green-500/30">
            <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-foreground mb-2">Interesse registrado!</h3>
            <p className="text-muted-foreground">Nossa equipe entrará em contato com informações sobre {serviceName}.</p>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 sm:py-16">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-panel rounded-2xl p-6 sm:p-10 border-primary/20 text-center"
        >
          <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-2">
            🎯 Solicite uma cotação de {serviceName}
          </h3>
          <p className="text-muted-foreground mb-6">
            Preencha seus dados e receba uma proposta personalizada em até 24h.
          </p>
          <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
            <Input placeholder="Seu nome" value={name} onChange={(e) => setName(e.target.value)} onFocus={handleFocus} required className="rounded-xl" />
            <Input type="email" placeholder="Seu e-mail" value={email} onChange={(e) => setEmail(e.target.value)} className="rounded-xl" />
            <Input placeholder="WhatsApp (opcional)" value={phone} onChange={(e) => setPhone(e.target.value)} className="rounded-xl" />
            <Button type="submit" disabled={loading} className="w-full gradient-btn rounded-full gap-2 text-base font-semibold" size="lg">
              {loading ? 'Enviando...' : <><Send className="h-4 w-4" /> Quero minha cotação</>}
            </Button>
            <p className="text-xs text-muted-foreground">Seus dados estão seguros. Não enviamos spam.</p>
          </form>
        </motion.div>
      </div>
    </section>
  );
};
