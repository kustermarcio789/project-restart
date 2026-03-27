import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Globe, FileCheck, MapPin, Briefcase, Plane, Building2, Car, Shield,
  Star, ClipboardCheck, CreditCard, ChevronRight, ChevronLeft, Check,
  Search, ExternalLink, Info, CheckCircle2, ArrowRight, Send
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Header } from '@/components/landing/Header';
import { Footer } from '@/components/landing/Footer';
import { SEOHead } from '@/components/shared/SEOHead';
import { StickyWhatsApp } from '@/components/shared/StickyWhatsApp';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAllDestinations } from '@/hooks/useDestination';
import { getPassportOffice } from '@/lib/passportOffices';

const STEPS = [
  { id: 0, label: 'Nacionalidade', icon: Globe },
  { id: 1, label: 'Passaporte', icon: FileCheck },
  { id: 2, label: 'Destino', icon: MapPin },
  { id: 3, label: 'Objetivo', icon: Briefcase },
  { id: 4, label: 'Transporte', icon: Plane },
  { id: 5, label: 'Hospedagem', icon: Building2 },
  { id: 6, label: 'Locomoção', icon: Car },
  { id: 7, label: 'Seguro', icon: Shield },
  { id: 8, label: 'Experiências', icon: Star },
  { id: 9, label: 'Revisão', icon: ClipboardCheck },
  { id: 10, label: 'Finalizar', icon: CreditCard },
];

const NATIONALITIES = [
  { code: 'BR', flag: '🇧🇷', name: 'Brasileiro(a)' },
  { code: 'PT', flag: '🇵🇹', name: 'Português(a)' },
  { code: 'US', flag: '🇺🇸', name: 'Americano(a)' },
  { code: 'AR', flag: '🇦🇷', name: 'Argentino(a)' },
  { code: 'IT', flag: '🇮🇹', name: 'Italiano(a)' },
  { code: 'DE', flag: '🇩🇪', name: 'Alemão(ã)' },
  { code: 'FR', flag: '🇫🇷', name: 'Francês(a)' },
  { code: 'JP', flag: '🇯🇵', name: 'Japonês(a)' },
  { code: 'CO', flag: '🇨🇴', name: 'Colombiano(a)' },
  { code: 'MX', flag: '🇲🇽', name: 'Mexicano(a)' },
  { code: 'CL', flag: '🇨🇱', name: 'Chileno(a)' },
  { code: 'PE', flag: '🇵🇪', name: 'Peruano(a)' },
];

const TRAVEL_PURPOSES = [
  { value: 'tourism', label: 'Turismo', icon: '🏖️', desc: 'Férias e lazer' },
  { value: 'business', label: 'Negócios', icon: '💼', desc: 'Reuniões e trabalho' },
  { value: 'study', label: 'Estudo', icon: '📚', desc: 'Intercâmbio e cursos' },
  { value: 'relocation', label: 'Mudança', icon: '🏠', desc: 'Morar no exterior' },
];

const TRANSPORT_OPTIONS = [
  { value: 'flight', label: 'Avião', icon: '✈️', desc: 'Voos diretos e conexões' },
  { value: 'train', label: 'Trem', icon: '🚄', desc: 'Rotas de trem disponíveis' },
  { value: 'bus', label: 'Ônibus', icon: '🚌', desc: 'Transporte rodoviário' },
];

const ACCOMMODATION_OPTIONS = [
  { value: 'hotel', label: 'Hotel', icon: '🏨', desc: 'Conforto e serviço completo' },
  { value: 'hostel', label: 'Hostel', icon: '🛏️', desc: 'Econômico e social' },
  { value: 'airbnb', label: 'Airbnb', icon: '🏡', desc: 'Apartamentos e casas' },
  { value: 'resort', label: 'Resort', icon: '🏖️', desc: 'All-inclusive e luxo' },
];

const LOCAL_TRANSPORT = [
  { value: 'car_rental', label: 'Aluguel de Carro', icon: '🚗', desc: 'Liberdade total' },
  { value: 'public', label: 'Transporte Público', icon: '🚇', desc: 'Metrô e ônibus' },
  { value: 'rideshare', label: 'Apps de Carona', icon: '📱', desc: 'Uber, Bolt, etc.' },
  { value: 'walking', label: 'A pé / Bike', icon: '🚶', desc: 'Explorar caminhando' },
];

const INSURANCE_OPTIONS = [
  { value: 'basic', label: 'Básico', icon: '🛡️', price: 'R$ 15/dia', desc: 'Cobertura essencial' },
  { value: 'standard', label: 'Padrão', icon: '✅', price: 'R$ 25/dia', desc: 'Cobertura completa' },
  { value: 'premium', label: 'Premium', icon: '👑', price: 'R$ 45/dia', desc: 'Cobertura total + cancelamento' },
  { value: 'none', label: 'Sem seguro', icon: '❌', price: 'Grátis', desc: 'Por sua conta e risco' },
];

const EXPERIENCE_OPTIONS = [
  { value: 'guided_tour', label: 'Tour Guiado', icon: '🗺️' },
  { value: 'restaurants', label: 'Gastronomia', icon: '🍽️' },
  { value: 'adventure', label: 'Aventura', icon: '🧗' },
  { value: 'cultural', label: 'Cultural', icon: '🎭' },
  { value: 'nightlife', label: 'Vida Noturna', icon: '🌃' },
  { value: 'wellness', label: 'Bem-estar', icon: '🧘' },
];

interface FlowState {
  nationality: string;
  hasPassport: boolean | null;
  destinationSlug: string;
  purpose: string;
  transport: string;
  accommodation: string;
  localTransport: string[];
  insurance: string;
  experiences: string[];
  departDate: string;
  returnDate: string;
  travelers: number;
  name: string;
  email: string;
  phone: string;
  notes: string;
}

const initialState: FlowState = {
  nationality: '', hasPassport: null, destinationSlug: '', purpose: '',
  transport: 'flight', accommodation: '', localTransport: [], insurance: '',
  experiences: [], departDate: '', returnDate: '', travelers: 1,
  name: '', email: '', phone: '', notes: '',
};

const PlanTripPage = () => {
  const [step, setStep] = useState(0);
  const [state, setState] = useState<FlowState>(initialState);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [natSearch, setNatSearch] = useState('');
  const [destSearch, setDestSearch] = useState('');
  const { data: destinations } = useAllDestinations();

  const set = <K extends keyof FlowState>(key: K, value: FlowState[K]) =>
    setState(s => ({ ...s, [key]: value }));

  const toggleArray = (key: 'localTransport' | 'experiences', value: string) =>
    setState(s => ({
      ...s,
      [key]: s[key].includes(value)
        ? s[key].filter(v => v !== value)
        : [...s[key], value],
    }));

  const office = state.nationality ? getPassportOffice(state.nationality) : null;
  const selectedDest = destinations?.find(d => d.slug === state.destinationSlug);
  const progress = ((step + 1) / STEPS.length) * 100;

  const filteredNats = NATIONALITIES.filter(n =>
    n.name.toLowerCase().includes(natSearch.toLowerCase())
  );

  const canProceed = (): boolean => {
    switch (step) {
      case 0: return !!state.nationality;
      case 1: return state.hasPassport === true;
      case 2: return !!state.destinationSlug;
      case 3: return !!state.purpose;
      case 4: return !!state.transport;
      case 5: return !!state.accommodation;
      case 6: return state.localTransport.length > 0;
      case 7: return !!state.insurance;
      case 8: return true;
      case 9: return true;
      case 10: return !!state.name && (!!state.email || !!state.phone);
      default: return true;
    }
  };

  const goNext = () => setStep(s => Math.min(s + 1, STEPS.length - 1));
  const goPrev = () => setStep(s => Math.max(s - 1, 0));

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const leadId = crypto.randomUUID();
      const params = new URLSearchParams(window.location.search);

      await supabase.from('leads').insert({
        id: leadId,
        name: state.name,
        email: state.email || null,
        phone: state.phone || null,
        destination_slug: state.destinationSlug || null,
        service_type: state.purpose || null,
        travel_date_from: state.departDate || null,
        travel_date_to: state.returnDate || null,
        travelers_count: state.travelers,
        message: buildMessage(),
        source: 'smart_flow',
        landing_page: '/planejar',
        utm_source: params.get('utm_source'),
        utm_medium: params.get('utm_medium'),
        utm_campaign: params.get('utm_campaign'),
        utm_content: params.get('utm_content'),
        utm_term: params.get('utm_term'),
      });

      await supabase.from('lead_events').insert({
        lead_id: leadId,
        event_type: 'smart_flow_completed',
        channel: 'web',
        description: `Fluxo inteligente completo: ${state.purpose} para ${state.destinationSlug}`,
        metadata: {
          nationality: state.nationality,
          transport: state.transport,
          accommodation: state.accommodation,
          local_transport: state.localTransport,
          insurance: state.insurance,
          experiences: state.experiences,
        } as any,
      });

      setSubmitted(true);
      toast.success('Plano de viagem enviado com sucesso!');
    } catch {
      toast.error('Erro ao enviar. Tente novamente.');
    } finally {
      setSubmitting(false);
    }
  };

  const buildMessage = () => {
    const parts = [
      `Nacionalidade: ${NATIONALITIES.find(n => n.code === state.nationality)?.name}`,
      `Destino: ${selectedDest?.name || state.destinationSlug}`,
      `Objetivo: ${TRAVEL_PURPOSES.find(p => p.value === state.purpose)?.label}`,
      `Transporte: ${TRANSPORT_OPTIONS.find(t => t.value === state.transport)?.label}`,
      `Hospedagem: ${ACCOMMODATION_OPTIONS.find(a => a.value === state.accommodation)?.label}`,
      `Locomoção local: ${state.localTransport.join(', ')}`,
      `Seguro: ${INSURANCE_OPTIONS.find(i => i.value === state.insurance)?.label}`,
      `Experiências: ${state.experiences.join(', ') || 'Nenhuma selecionada'}`,
      `Viajantes: ${state.travelers}`,
      state.departDate && `Ida: ${state.departDate}`,
      state.returnDate && `Volta: ${state.returnDate}`,
      state.notes && `Observações: ${state.notes}`,
    ].filter(Boolean);
    return parts.join('\n');
  };

  // Save progress to localStorage
  useEffect(() => {
    const saved = localStorage.getItem('smart_flow_state');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setState(parsed);
        // Find the furthest valid step
        // Start from 0 to find resume point
      } catch { /* ignore */ }
    }
  }, []);

  useEffect(() => {
    if (!submitted) {
      localStorage.setItem('smart_flow_state', JSON.stringify(state));
    }
  }, [state, submitted]);

  if (submitted) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-2xl mx-auto px-4 pt-32 pb-20 text-center">
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
            <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-foreground mb-4">Plano de Viagem Enviado!</h1>
            <p className="text-lg text-muted-foreground mb-8">
              Nossos especialistas vão montar um plano personalizado baseado nas suas preferências. Resposta em até 24h.
            </p>
            <div className="glass-panel rounded-2xl p-6 text-left space-y-3 mb-8">
              <p className="text-sm text-muted-foreground">📧 Verifique seu e-mail para confirmação</p>
              <p className="text-sm text-muted-foreground">📱 Mantenha o WhatsApp ativo para contato rápido</p>
              <p className="text-sm text-muted-foreground">🎯 Seu plano inclui: {state.transport}, {state.accommodation}, {state.insurance}</p>
            </div>
            <Button onClick={() => { localStorage.removeItem('smart_flow_state'); window.location.href = '/'; }} className="gradient-btn rounded-full px-8">
              Voltar ao Início
            </Button>
          </motion.div>
        </div>
        <Footer />
      </div>
    );
  }

  const slideVariants = {
    enter: { x: 50, opacity: 0 },
    center: { x: 0, opacity: 1 },
    exit: { x: -50, opacity: 0 },
  };

  const OptionCard = ({ selected, onClick, icon, label, desc, extra }: {
    selected: boolean; onClick: () => void; icon: string; label: string; desc?: string; extra?: string;
  }) => (
    <button
      onClick={onClick}
      className={`text-left p-4 rounded-xl border transition-all ${
        selected
          ? 'border-primary bg-primary/10 ring-1 ring-primary'
          : 'border-border bg-card hover:border-primary/50 hover:bg-muted/50'
      }`}
    >
      <div className="flex items-start gap-3">
        <span className="text-2xl">{icon}</span>
        <div className="flex-1">
          <p className="font-semibold text-sm text-foreground">{label}</p>
          {desc && <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>}
          {extra && <p className="text-xs text-primary font-medium mt-1">{extra}</p>}
        </div>
        {selected && <Check className="h-4 w-4 text-primary shrink-0 mt-1" />}
      </div>
    </button>
  );

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Planeje sua Viagem | Assistente Inteligente"
        description="Planeje sua viagem passo a passo com nosso assistente inteligente. Nacionalidade, visto, transporte, hospedagem, seguro e experiências em um só lugar."
      />
      <Header />

      <div className="max-w-3xl mx-auto px-4 pt-28 pb-20">
        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">
            Planeje sua <span className="gradient-text">Viagem Perfeita</span>
          </h1>
          <p className="text-muted-foreground">Nosso assistente inteligente guia você em cada etapa.</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-muted-foreground font-medium">
              Etapa {step + 1} de {STEPS.length}: {STEPS[step].label}
            </span>
            <span className="text-xs text-primary font-bold">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Step Dots */}
        <div className="flex items-center justify-center gap-1 mb-8 flex-wrap">
          {STEPS.map((s) => {
            const Icon = s.icon;
            return (
              <button
                key={s.id}
                onClick={() => s.id < step && setStep(s.id)}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                  step === s.id
                    ? 'gradient-btn text-primary-foreground scale-110'
                    : step > s.id
                    ? 'bg-primary/20 text-primary'
                    : 'bg-muted text-muted-foreground'
                }`}
                title={s.label}
              >
                {step > s.id ? <Check className="h-3 w-3" /> : <Icon className="h-3.5 w-3.5" />}
              </button>
            );
          })}
        </div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.2 }}
          >
            <div className="glass-panel rounded-2xl p-6 sm:p-8 min-h-[320px]">
              {/* Step 0: Nationality */}
              {step === 0 && (
                <div>
                  <h2 className="text-xl font-semibold text-foreground mb-1">Qual é a sua nacionalidade?</h2>
                  <p className="text-sm text-muted-foreground mb-4">Isso nos ajuda a verificar vistos e documentos necessários.</p>
                  <div className="relative mb-4">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar nacionalidade..."
                      value={natSearch}
                      onChange={e => setNatSearch(e.target.value)}
                      className="pl-10 rounded-xl"
                    />
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-[300px] overflow-y-auto">
                    {filteredNats.map(n => (
                      <button
                        key={n.code}
                        onClick={() => set('nationality', n.code)}
                        className={`flex items-center gap-2.5 p-3 rounded-xl border transition-all text-left ${
                          state.nationality === n.code
                            ? 'border-primary bg-primary/10 ring-1 ring-primary'
                            : 'border-border bg-card hover:bg-muted/50'
                        }`}
                      >
                        <span className="text-xl">{n.flag}</span>
                        <span className="text-sm font-medium">{n.name}</span>
                        {state.nationality === n.code && <Check className="h-3 w-3 text-primary ml-auto" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 1: Passport */}
              {step === 1 && (
                <div>
                  <h2 className="text-xl font-semibold text-foreground mb-1">Você possui passaporte válido?</h2>
                  <p className="text-sm text-muted-foreground mb-4">Necessário para viagens internacionais.</p>
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <button
                      onClick={() => set('hasPassport', true)}
                      className={`p-5 rounded-xl border text-center transition-all ${
                        state.hasPassport === true ? 'border-primary bg-primary/10 ring-1 ring-primary' : 'border-border bg-card hover:bg-muted/50'
                      }`}
                    >
                      <span className="text-3xl block mb-2">✅</span>
                      <span className="font-semibold text-sm">Sim, tenho passaporte</span>
                    </button>
                    <button
                      onClick={() => set('hasPassport', false)}
                      className={`p-5 rounded-xl border text-center transition-all ${
                        state.hasPassport === false ? 'border-amber-500 bg-amber-500/10 ring-1 ring-amber-500' : 'border-border bg-card hover:bg-muted/50'
                      }`}
                    >
                      <span className="text-3xl block mb-2">❌</span>
                      <span className="font-semibold text-sm">Não tenho passaporte</span>
                    </button>
                  </div>

                  {state.hasPassport === false && office && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
                      <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl">
                        <h4 className="text-amber-500 font-semibold text-sm mb-1 flex items-center gap-2">
                          <Info className="h-4 w-4" /> Como solicitar seu passaporte
                        </h4>
                        <p className="text-muted-foreground text-xs">Veja as informações do órgão responsável no seu país:</p>
                      </div>
                      <div className="p-4 bg-card border border-border rounded-xl space-y-2">
                        <h4 className="font-semibold text-sm flex items-center gap-2">
                          <span>{office.flag}</span> {office.name.pt}
                        </h4>
                        <a href={office.website} target="_blank" rel="noopener noreferrer"
                          className="text-primary hover:underline text-sm flex items-center gap-1">
                          <ExternalLink className="h-3 w-3" /> Acessar site oficial
                        </a>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          <div className="bg-muted/50 rounded-lg p-2">
                            <span className="text-xs text-muted-foreground block">Prazo</span>
                            <span className="font-semibold text-xs">{office.processingTime.pt}</span>
                          </div>
                          <div className="bg-muted/50 rounded-lg p-2">
                            <span className="text-xs text-muted-foreground block">Custo</span>
                            <span className="font-semibold text-xs">{office.cost.pt}</span>
                          </div>
                        </div>
                      </div>
                      {state.nationality === 'BR' && (
                        <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
                          <p className="text-emerald-500 text-sm mb-2">🇧🇷 Brasileiros podem viajar para países do Mercosul apenas com RG!</p>
                          <Button onClick={() => { set('hasPassport', true); goNext(); }} variant="outline" size="sm" className="gap-1 text-xs">
                            Continuar para destinos nacionais <ArrowRight className="h-3 w-3" />
                          </Button>
                        </div>
                      )}
                    </motion.div>
                  )}
                </div>
              )}

              {/* Step 2: Destination */}
              {step === 2 && (
                <div>
                  <h2 className="text-xl font-semibold text-foreground mb-1">Para onde você quer ir?</h2>
                  <p className="text-sm text-muted-foreground mb-4">Escolha seu destino ou busque por nome.</p>
                  <div className="relative mb-4">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar destino..."
                      value={destSearch}
                      onChange={e => setDestSearch(e.target.value)}
                      className="pl-10 rounded-xl"
                    />
                  </div>
                  <div className="space-y-2 max-h-[300px] overflow-y-auto">
                    {destinations
                      ?.filter(d => d.name.toLowerCase().includes(destSearch.toLowerCase()) || d.country.toLowerCase().includes(destSearch.toLowerCase()))
                      .map(d => (
                        <button
                          key={d.slug}
                          onClick={() => set('destinationSlug', d.slug)}
                          className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${
                            state.destinationSlug === d.slug
                              ? 'border-primary bg-primary/10 ring-1 ring-primary'
                              : 'border-border bg-card hover:bg-muted/50'
                          }`}
                        >
                          <MapPin className="h-4 w-4 text-primary shrink-0" />
                          <div className="flex-1">
                            <span className="font-semibold text-sm">{d.name}</span>
                            <span className="text-xs text-muted-foreground ml-2">{d.country}</span>
                          </div>
                          {state.destinationSlug === d.slug && <Check className="h-4 w-4 text-primary" />}
                        </button>
                      ))}
                  </div>
                  <div className="mt-3">
                    <Label className="text-xs text-muted-foreground">Datas de viagem (opcional)</Label>
                    <div className="grid grid-cols-2 gap-3 mt-1">
                      <Input type="date" value={state.departDate} onChange={e => set('departDate', e.target.value)} className="rounded-xl text-sm" />
                      <Input type="date" value={state.returnDate} onChange={e => set('returnDate', e.target.value)} className="rounded-xl text-sm" />
                    </div>
                  </div>
                  <div className="mt-3">
                    <Label className="text-xs text-muted-foreground">Número de viajantes</Label>
                    <div className="flex items-center gap-3 mt-1">
                      <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => set('travelers', Math.max(1, state.travelers - 1))}>-</Button>
                      <span className="text-lg font-bold w-6 text-center">{state.travelers}</span>
                      <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => set('travelers', Math.min(20, state.travelers + 1))}>+</Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Purpose */}
              {step === 3 && (
                <div>
                  <h2 className="text-xl font-semibold text-foreground mb-1">Qual o objetivo da viagem?</h2>
                  <p className="text-sm text-muted-foreground mb-4">Isso define documentos, visto e recomendações.</p>
                  <div className="grid grid-cols-2 gap-3">
                    {TRAVEL_PURPOSES.map(p => (
                      <OptionCard
                        key={p.value}
                        selected={state.purpose === p.value}
                        onClick={() => set('purpose', p.value)}
                        icon={p.icon}
                        label={p.label}
                        desc={p.desc}
                      />
                    ))}
                  </div>
                  {state.purpose && selectedDest && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 p-4 bg-primary/5 border border-primary/20 rounded-xl">
                      <h4 className="font-semibold text-sm text-foreground mb-2 flex items-center gap-2">
                        <FileCheck className="h-4 w-4 text-primary" /> Informações para {selectedDest.name}
                      </h4>
                      <div className="space-y-1 text-xs text-muted-foreground">
                        <p>• Visto {selectedDest.visa_required ? 'necessário ⚠️' : 'não necessário ✅'}</p>
                        <p>• Moeda: {selectedDest.currency || 'Informação não disponível'}</p>
                        <p>• Idioma: {selectedDest.language || 'Informação não disponível'}</p>
                        <p>• Fuso: {selectedDest.timezone || 'Informação não disponível'}</p>
                      </div>
                    </motion.div>
                  )}
                </div>
              )}

              {/* Step 4: Transport */}
              {step === 4 && (
                <div>
                  <h2 className="text-xl font-semibold text-foreground mb-1">Como você quer chegar?</h2>
                  <p className="text-sm text-muted-foreground mb-4">Escolha o meio de transporte principal.</p>
                  <div className="grid grid-cols-1 gap-3">
                    {TRANSPORT_OPTIONS.map(t => (
                      <OptionCard
                        key={t.value}
                        selected={state.transport === t.value}
                        onClick={() => set('transport', t.value)}
                        icon={t.icon}
                        label={t.label}
                        desc={t.desc}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Step 5: Accommodation */}
              {step === 5 && (
                <div>
                  <h2 className="text-xl font-semibold text-foreground mb-1">Onde você quer ficar?</h2>
                  <p className="text-sm text-muted-foreground mb-4">Escolha o tipo de hospedagem.</p>
                  <div className="grid grid-cols-2 gap-3">
                    {ACCOMMODATION_OPTIONS.map(a => (
                      <OptionCard
                        key={a.value}
                        selected={state.accommodation === a.value}
                        onClick={() => set('accommodation', a.value)}
                        icon={a.icon}
                        label={a.label}
                        desc={a.desc}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Step 6: Local Transport */}
              {step === 6 && (
                <div>
                  <h2 className="text-xl font-semibold text-foreground mb-1">Como se locomover no destino?</h2>
                  <p className="text-sm text-muted-foreground mb-4">Selecione uma ou mais opções.</p>
                  <div className="grid grid-cols-2 gap-3">
                    {LOCAL_TRANSPORT.map(lt => (
                      <OptionCard
                        key={lt.value}
                        selected={state.localTransport.includes(lt.value)}
                        onClick={() => toggleArray('localTransport', lt.value)}
                        icon={lt.icon}
                        label={lt.label}
                        desc={lt.desc}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Step 7: Insurance */}
              {step === 7 && (
                <div>
                  <h2 className="text-xl font-semibold text-foreground mb-1">Seguro Viagem</h2>
                  <p className="text-sm text-muted-foreground mb-4">
                    {selectedDest?.visa_required
                      ? '⚠️ Seguro é obrigatório para este destino.'
                      : 'Recomendado para sua tranquilidade.'}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {INSURANCE_OPTIONS.map(ins => (
                      <OptionCard
                        key={ins.value}
                        selected={state.insurance === ins.value}
                        onClick={() => set('insurance', ins.value)}
                        icon={ins.icon}
                        label={ins.label}
                        desc={ins.desc}
                        extra={ins.price}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Step 8: Experiences */}
              {step === 8 && (
                <div>
                  <h2 className="text-xl font-semibold text-foreground mb-1">O que você quer fazer?</h2>
                  <p className="text-sm text-muted-foreground mb-4">Selecione as experiências de interesse (opcional).</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {EXPERIENCE_OPTIONS.map(exp => (
                      <button
                        key={exp.value}
                        onClick={() => toggleArray('experiences', exp.value)}
                        className={`p-4 rounded-xl border text-center transition-all ${
                          state.experiences.includes(exp.value)
                            ? 'border-primary bg-primary/10 ring-1 ring-primary'
                            : 'border-border bg-card hover:bg-muted/50'
                        }`}
                      >
                        <span className="text-2xl block mb-1">{exp.icon}</span>
                        <span className="text-xs font-medium">{exp.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 9: Review */}
              {step === 9 && (
                <div>
                  <h2 className="text-xl font-semibold text-foreground mb-4">Revisão do seu plano</h2>
                  <div className="space-y-3 text-sm">
                    {[
                      { icon: Globe, label: 'Nacionalidade', value: NATIONALITIES.find(n => n.code === state.nationality)?.name },
                      { icon: MapPin, label: 'Destino', value: selectedDest?.name || state.destinationSlug },
                      { icon: Briefcase, label: 'Objetivo', value: TRAVEL_PURPOSES.find(p => p.value === state.purpose)?.label },
                      { icon: Plane, label: 'Transporte', value: TRANSPORT_OPTIONS.find(t => t.value === state.transport)?.label },
                      { icon: Building2, label: 'Hospedagem', value: ACCOMMODATION_OPTIONS.find(a => a.value === state.accommodation)?.label },
                      { icon: Car, label: 'Locomoção', value: state.localTransport.map(lt => LOCAL_TRANSPORT.find(l => l.value === lt)?.label).join(', ') },
                      { icon: Shield, label: 'Seguro', value: INSURANCE_OPTIONS.find(i => i.value === state.insurance)?.label },
                      { icon: Star, label: 'Experiências', value: state.experiences.map(e => EXPERIENCE_OPTIONS.find(o => o.value === e)?.label).join(', ') || 'Nenhuma' },
                    ].map(item => (
                      <div key={item.label} className="flex items-center justify-between p-3 bg-muted/30 rounded-xl">
                        <span className="text-muted-foreground flex items-center gap-2">
                          <item.icon className="h-4 w-4 text-primary" /> {item.label}
                        </span>
                        <span className="font-medium text-foreground">{item.value || '-'}</span>
                      </div>
                    ))}
                    {state.departDate && (
                      <div className="flex items-center justify-between p-3 bg-muted/30 rounded-xl">
                        <span className="text-muted-foreground">📅 Período</span>
                        <span className="font-medium text-foreground">{state.departDate} → {state.returnDate || '?'}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between p-3 bg-muted/30 rounded-xl">
                      <span className="text-muted-foreground">👥 Viajantes</span>
                      <span className="font-medium text-foreground">{state.travelers}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 10: Contact / Finalize */}
              {step === 10 && (
                <div>
                  <h2 className="text-xl font-semibold text-foreground mb-1">Quase lá! Seus dados</h2>
                  <p className="text-sm text-muted-foreground mb-4">Informe seus dados para receber o plano personalizado.</p>
                  <div className="space-y-4">
                    <div>
                      <Label>Nome completo *</Label>
                      <Input value={state.name} onChange={e => set('name', e.target.value)} placeholder="Seu nome" className="rounded-xl mt-1" />
                    </div>
                    <div>
                      <Label>E-mail</Label>
                      <Input value={state.email} onChange={e => set('email', e.target.value)} type="email" placeholder="seu@email.com" className="rounded-xl mt-1" />
                    </div>
                    <div>
                      <Label>WhatsApp</Label>
                      <Input value={state.phone} onChange={e => set('phone', e.target.value)} placeholder="(11) 99999-9999" className="rounded-xl mt-1" />
                    </div>
                    <div>
                      <Label>Observações (opcional)</Label>
                      <Textarea value={state.notes} onChange={e => set('notes', e.target.value)} placeholder="Alguma preferência especial?" className="rounded-xl mt-1" rows={3} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex justify-between mt-6">
          <Button variant="outline" onClick={goPrev} disabled={step === 0} className="rounded-full gap-2">
            <ChevronLeft className="h-4 w-4" /> Voltar
          </Button>
          {step < STEPS.length - 1 ? (
            <Button onClick={goNext} disabled={!canProceed()} className="gradient-btn rounded-full gap-2">
              Próximo <ChevronRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={submitting || !canProceed()} className="gradient-btn rounded-full gap-2" size="lg">
              {submitting ? 'Enviando...' : <><Send className="h-4 w-4" /> Solicitar Plano</>}
            </Button>
          )}
        </div>

        {/* Trust */}
        <div className="mt-10 grid grid-cols-3 gap-4 text-center">
          <div className="glass-panel rounded-xl p-4">
            <p className="text-2xl font-bold text-primary">🔒</p>
            <p className="text-xs text-muted-foreground">Dados seguros</p>
          </div>
          <div className="glass-panel rounded-xl p-4">
            <p className="text-2xl font-bold text-primary">24h</p>
            <p className="text-xs text-muted-foreground">Resposta rápida</p>
          </div>
          <div className="glass-panel rounded-xl p-4">
            <p className="text-2xl font-bold text-primary">100%</p>
            <p className="text-xs text-muted-foreground">Personalizado</p>
          </div>
        </div>
      </div>

      <Footer />
      <StickyWhatsApp message="Olá! Preciso de ajuda para planejar minha viagem." />
    </div>
  );
};

export default PlanTripPage;
