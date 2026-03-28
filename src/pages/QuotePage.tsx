import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, Send, CheckCircle2, MapPin, Plane, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Header } from '@/components/landing/Header';
import { Footer } from '@/components/landing/Footer';
import { SEOHead } from '@/components/shared/SEOHead';
import { StickyWhatsApp } from '@/components/shared/StickyWhatsApp';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { leadSchema, type LeadFormData, BUDGET_RANGES, SERVICE_TYPES } from '@/lib/validators/lead';
import { useAllDestinations } from '@/hooks/useDestination';

const STEPS = [
  { id: 1, title: 'Seus dados', icon: User },
  { id: 2, title: 'Destino', icon: MapPin },
  { id: 3, title: 'Serviços', icon: Plane },
];

const QuotePage = () => {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { data: destinations } = useAllDestinations();

  const form = useForm<LeadFormData>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      name: '', email: '', phone: '', destination_slug: '', service_type: '',
      travel_date_from: '', travel_date_to: '', travelers_count: 1,
      budget_range: '', message: '',
    },
    mode: 'onBlur',
  });

  const { register, handleSubmit, formState: { errors }, watch, setValue, trigger } = form;

  const goNext = async () => {
    let valid = false;
    if (step === 1) valid = await trigger(['name', 'email', 'phone']);
    else if (step === 2) valid = await trigger(['destination_slug', 'travel_date_from', 'travelers_count']);
    else valid = true;
    if (valid) setStep((s) => Math.min(s + 1, 3));
  };

  const onSubmit = async (data: LeadFormData) => {
    setSubmitting(true);
    try {
      const leadId = crypto.randomUUID();

      // Get UTM from URL params
      const params = new URLSearchParams(window.location.search);

      const { error } = await supabase.from('leads').insert({
        id: leadId,
        name: data.name,
        email: data.email || null,
        phone: data.phone || null,
        destination_slug: data.destination_slug || null,
        service_type: data.service_type || null,
        travel_date_from: data.travel_date_from || null,
        travel_date_to: data.travel_date_to || null,
        travelers_count: data.travelers_count,
        budget_range: data.budget_range || null,
        message: data.message || null,
        source: 'quote_form',
        landing_page: '/cotacao',
        utm_source: params.get('utm_source'),
        utm_medium: params.get('utm_medium'),
        utm_campaign: params.get('utm_campaign'),
        utm_content: params.get('utm_content'),
        utm_term: params.get('utm_term'),
      });

      if (error) throw error;

      const { error: trackingError } = await supabase.functions.invoke('track-lead-event', {
        body: {
          lead_id: leadId,
          event_type: 'quote_requested',
          channel: 'web',
          description: `Cotação solicitada: ${data.service_type || 'geral'} para ${data.destination_slug || 'destino não especificado'}`,
          metadata: {
            source: 'quote_form',
            landing_page: '/cotacao',
            destination_slug: data.destination_slug || null,
            service_type: data.service_type || null,
            travelers_count: data.travelers_count,
            budget_range: data.budget_range || null,
          },
        },
      });

      if (trackingError) {
        throw trackingError;
      }

      setSubmitted(true);
      toast.success('Cotação solicitada com sucesso!');
    } catch {
      toast.error('Erro ao enviar. Tente novamente.');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-2xl mx-auto px-4 pt-32 pb-20 text-center">
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
            <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-foreground mb-4">Cotação Solicitada!</h1>
            <p className="text-lg text-muted-foreground mb-8">
              Nossa equipe analisará seu pedido e entrará em contato em até 24 horas com as melhores opções.
            </p>
            <div className="glass-panel rounded-2xl p-6 text-left space-y-3 mb-8">
              <p className="text-sm text-muted-foreground">📧 Verifique seu e-mail para confirmação</p>
              <p className="text-sm text-muted-foreground">📱 Mantenha o WhatsApp ativo para contato rápido</p>
              <p className="text-sm text-muted-foreground">⏰ Prazo médio de resposta: 2-4 horas</p>
            </div>
            <Button onClick={() => window.location.href = '/'} className="gradient-btn rounded-full px-8">
              Voltar ao Início
            </Button>
          </motion.div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Solicitar Cotação de Viagem Gratuita"
        description="Receba uma cotação personalizada para sua viagem em até 24 horas. Voos, hotéis, seguro, visto e mais."
      />
      <Header />

      <div className="max-w-3xl mx-auto px-4 pt-28 pb-20">
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">
            Solicite sua <span className="gradient-text">Cotação Gratuita</span>
          </h1>
          <p className="text-muted-foreground text-lg">Preencha o formulário e receba seu plano personalizado.</p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-2 mb-10">
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex items-center gap-2">
              <button
                onClick={() => s.id < step && setStep(s.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  step === s.id
                    ? 'gradient-btn text-primary-foreground'
                    : step > s.id
                    ? 'bg-primary/20 text-primary'
                    : 'bg-secondary text-muted-foreground'
                }`}
              >
                <s.icon className="h-4 w-4" />
                <span className="hidden sm:inline">{s.title}</span>
              </button>
              {i < STEPS.length - 1 && <ArrowRight className="h-4 w-4 text-muted-foreground" />}
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="step1" initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -50, opacity: 0 }} className="glass-panel rounded-2xl p-6 sm:p-8 space-y-5">
                <h2 className="text-xl font-semibold text-foreground">Seus Dados</h2>
                <div>
                  <Label>Nome completo *</Label>
                  <Input {...register('name')} placeholder="Seu nome" className="rounded-xl mt-1" />
                  {errors.name && <p className="text-sm text-destructive mt-1">{errors.name.message}</p>}
                </div>
                <div>
                  <Label>E-mail</Label>
                  <Input {...register('email')} type="email" placeholder="seu@email.com" className="rounded-xl mt-1" />
                  {errors.email && <p className="text-sm text-destructive mt-1">{errors.email.message}</p>}
                </div>
                <div>
                  <Label>WhatsApp</Label>
                  <Input {...register('phone')} placeholder="(11) 99999-9999" className="rounded-xl mt-1" />
                </div>
                <Button type="button" onClick={goNext} className="w-full gradient-btn rounded-full gap-2" size="lg">
                  Próximo <ArrowRight className="h-4 w-4" />
                </Button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="step2" initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -50, opacity: 0 }} className="glass-panel rounded-2xl p-6 sm:p-8 space-y-5">
                <h2 className="text-xl font-semibold text-foreground">Destino e Datas</h2>
                <div>
                  <Label>Destino de interesse</Label>
                  <select
                    {...register('destination_slug')}
                    className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm mt-1"
                  >
                    <option value="">Selecione um destino</option>
                    {destinations?.map((d) => (
                      <option key={d.slug} value={d.slug}>{d.name}</option>
                    ))}
                    <option value="outro">Outro</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Data de ida</Label>
                    <Input {...register('travel_date_from')} type="date" className="rounded-xl mt-1" />
                  </div>
                  <div>
                    <Label>Data de volta</Label>
                    <Input {...register('travel_date_to')} type="date" className="rounded-xl mt-1" />
                  </div>
                </div>
                <div>
                  <Label>Número de viajantes</Label>
                  <Input {...register('travelers_count')} type="number" min="1" max="50" className="rounded-xl mt-1" />
                </div>
                <div className="flex gap-3">
                  <Button type="button" variant="outline" onClick={() => setStep(1)} className="flex-1 rounded-full gap-2">
                    <ArrowLeft className="h-4 w-4" /> Voltar
                  </Button>
                  <Button type="button" onClick={goNext} className="flex-1 gradient-btn rounded-full gap-2">
                    Próximo <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="step3" initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -50, opacity: 0 }} className="glass-panel rounded-2xl p-6 sm:p-8 space-y-5">
                <h2 className="text-xl font-semibold text-foreground">Serviços e Orçamento</h2>
                <div>
                  <Label>Tipo de serviço</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {SERVICE_TYPES.map((s) => (
                      <button
                        key={s.value}
                        type="button"
                        onClick={() => setValue('service_type', s.value)}
                        className={`text-left p-3 rounded-xl border text-sm transition-all ${
                          watch('service_type') === s.value
                            ? 'border-primary bg-primary/10 text-foreground'
                            : 'border-border bg-background text-muted-foreground hover:border-primary/50'
                        }`}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <Label>Faixa de orçamento</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                    {BUDGET_RANGES.map((b) => (
                      <button
                        key={b.value}
                        type="button"
                        onClick={() => setValue('budget_range', b.value)}
                        className={`text-left p-3 rounded-xl border text-sm transition-all ${
                          watch('budget_range') === b.value
                            ? 'border-primary bg-primary/10 text-foreground'
                            : 'border-border bg-background text-muted-foreground hover:border-primary/50'
                        }`}
                      >
                        {b.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <Label>Observações (opcional)</Label>
                  <Textarea {...register('message')} placeholder="Descreva suas necessidades, preferências ou dúvidas..." className="rounded-xl mt-1" rows={3} />
                </div>
                <div className="flex gap-3">
                  <Button type="button" variant="outline" onClick={() => setStep(2)} className="flex-1 rounded-full gap-2">
                    <ArrowLeft className="h-4 w-4" /> Voltar
                  </Button>
                  <Button type="submit" disabled={submitting} className="flex-1 gradient-btn rounded-full gap-2" size="lg">
                    {submitting ? 'Enviando...' : <><Send className="h-4 w-4" /> Solicitar Cotação</>}
                  </Button>
                </div>
                <p className="text-xs text-center text-muted-foreground">
                  🔒 Seus dados estão seguros. Resposta em até 24h.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </form>

        {/* Trust Section */}
        <div className="mt-10 grid grid-cols-3 gap-4 text-center">
          <div className="glass-panel rounded-xl p-4">
            <p className="text-2xl font-bold text-primary">50K+</p>
            <p className="text-xs text-muted-foreground">Viajantes atendidos</p>
          </div>
          <div className="glass-panel rounded-xl p-4">
            <p className="text-2xl font-bold text-primary">24h</p>
            <p className="text-xs text-muted-foreground">Tempo de resposta</p>
          </div>
          <div className="glass-panel rounded-xl p-4">
            <p className="text-2xl font-bold text-primary">4.9★</p>
            <p className="text-xs text-muted-foreground">Avaliação média</p>
          </div>
        </div>
      </div>

      <Footer />
      <StickyWhatsApp message="Olá! Preciso de uma cotação para minha viagem." />
    </div>
  );
};

export default QuotePage;
