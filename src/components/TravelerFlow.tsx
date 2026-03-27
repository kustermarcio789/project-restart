import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin, Calendar, Users, Plane, Building2, Shield, ChevronRight, ChevronLeft,
  Check, Search, ExternalLink, Globe, FileText, ChevronDown, ChevronUp,
  Info, CheckCircle2, ArrowRight
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCurrency, allDestinations } from '@/lib/destinations';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { getPassportOffice } from '@/lib/passportOffices';

interface TravelerFlowProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const NATIONALITIES = [
  { code: 'BR', flag: '🇧🇷', name: { pt: 'Brasileiro(a)', en: 'Brazilian', es: 'Brasileño(a)' } },
  { code: 'PT', flag: '🇵🇹', name: { pt: 'Português(a)', en: 'Portuguese', es: 'Portugués(a)' } },
  { code: 'US', flag: '🇺🇸', name: { pt: 'Americano(a)', en: 'American', es: 'Americano(a)' } },
  { code: 'AR', flag: '🇦🇷', name: { pt: 'Argentino(a)', en: 'Argentine', es: 'Argentino(a)' } },
  { code: 'IT', flag: '🇮🇹', name: { pt: 'Italiano(a)', en: 'Italian', es: 'Italiano(a)' } },
  { code: 'DE', flag: '🇩🇪', name: { pt: 'Alemão(ã)', en: 'German', es: 'Alemán(a)' } },
  { code: 'FR', flag: '🇫🇷', name: { pt: 'Francês(a)', en: 'French', es: 'Francés(a)' } },
  { code: 'JP', flag: '🇯🇵', name: { pt: 'Japonês(a)', en: 'Japanese', es: 'Japonés(a)' } },
  { code: 'CO', flag: '🇨🇴', name: { pt: 'Colombiano(a)', en: 'Colombian', es: 'Colombiano(a)' } },
  { code: 'MX', flag: '🇲🇽', name: { pt: 'Mexicano(a)', en: 'Mexican', es: 'Mexicano(a)' } },
  { code: 'CL', flag: '🇨🇱', name: { pt: 'Chileno(a)', en: 'Chilean', es: 'Chileno(a)' } },
  { code: 'PE', flag: '🇵🇪', name: { pt: 'Peruano(a)', en: 'Peruvian', es: 'Peruano(a)' } },
];

const passportLabels = {
  pt: {
    nationalityTitle: 'Qual é a sua nacionalidade?',
    passportTitle: 'Você possui passaporte válido?',
    yes: 'Sim, tenho passaporte',
    no: 'Não tenho passaporte',
    noPassportTitle: 'Você precisa de um passaporte para viajar internacionalmente',
    noPassportDesc: 'Veja abaixo como solicitar o seu passaporte:',
    website: 'Site oficial',
    phone: 'Telefone',
    address: 'Endereço',
    documents: 'Documentos necessários',
    processingTime: 'Prazo de emissão',
    cost: 'Custo',
    tips: 'Dicas importantes',
    visitWebsite: 'Acessar site oficial',
    domesticNote: 'Para destinos nacionais (dentro do Brasil), você pode viajar apenas com RG.',
    continueWithDomestic: 'Continuar para destinos nacionais',
  },
  en: {
    nationalityTitle: 'What is your nationality?',
    passportTitle: 'Do you have a valid passport?',
    yes: 'Yes, I have a passport',
    no: "No, I don't have a passport",
    noPassportTitle: 'You need a passport to travel internationally',
    noPassportDesc: 'See below how to apply for your passport:',
    website: 'Official website',
    phone: 'Phone',
    address: 'Address',
    documents: 'Required documents',
    processingTime: 'Processing time',
    cost: 'Cost',
    tips: 'Important tips',
    visitWebsite: 'Visit official website',
    domesticNote: 'For domestic destinations (within Brazil), you can travel with just your ID.',
    continueWithDomestic: 'Continue to domestic destinations',
  },
  es: {
    nationalityTitle: '¿Cuál es su nacionalidad?',
    passportTitle: '¿Tiene un pasaporte válido?',
    yes: 'Sí, tengo pasaporte',
    no: 'No tengo pasaporte',
    noPassportTitle: 'Necesitas un pasaporte para viajar internacionalmente',
    noPassportDesc: 'Vea abajo cómo solicitar su pasaporte:',
    website: 'Sitio oficial',
    phone: 'Teléfono',
    address: 'Dirección',
    documents: 'Documentos necesarios',
    processingTime: 'Tiempo de emisión',
    cost: 'Costo',
    tips: 'Consejos importantes',
    visitWebsite: 'Visitar sitio oficial',
    domesticNote: 'Para destinos nacionales (dentro de Brasil), puede viajar solo con su DNI.',
    continueWithDomestic: 'Continuar a destinos nacionales',
  },
};

export const TravelerFlow = ({ open, onOpenChange }: TravelerFlowProps) => {
  const { t, language } = useLanguage();
  const { format } = useCurrency();
  const navigate = useNavigate();
  const pl = passportLabels[language];

  // State
  const [step, setStep] = useState(0);
  const [nationality, setNationality] = useState('');
  const [hasPassport, setHasPassport] = useState<boolean | null>(null);
  const [selectedDest, setSelectedDest] = useState('');
  const [departDate, setDepartDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [travelers, setTravelers] = useState(1);
  const [style, setStyle] = useState<'economic' | 'comfort' | 'luxury'>('comfort');
  const [includeHotel, setIncludeHotel] = useState(true);
  const [includeFlight, setIncludeFlight] = useState(true);
  const [includeInsurance, setIncludeInsurance] = useState(false);
  const [search, setSearch] = useState('');
  const [direction, setDirection] = useState(1);
  const [showDocs, setShowDocs] = useState(false);
  const [showTips, setShowTips] = useState(false);

  // Steps: 0=nationality, 1=passport, 2=destination, 3=dates, 4=preferences, 5=summary
  const stepLabels = [
    language === 'pt' ? 'Nacionalidade' : language === 'en' ? 'Nationality' : 'Nacionalidad',
    language === 'pt' ? 'Passaporte' : language === 'en' ? 'Passport' : 'Pasaporte',
    t('flow.step1'),
    t('flow.step2'),
    t('flow.step3'),
    t('flow.step4'),
  ];

  const dest = allDestinations.find(d => d.id === selectedDest);
  const office = nationality ? getPassportOffice(nationality) : null;

  const normalizeStr = (s: string) =>
    s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  const filteredDests = allDestinations.filter(d => {
    if (!search.trim()) return true;
    const q = normalizeStr(search);
    return normalizeStr(d.name).includes(q) ||
      normalizeStr(d.country[language]).includes(q) ||
      normalizeStr(d.region).includes(q);
  });

  const canNext = () => {
    if (step === 0) return !!nationality;
    if (step === 1) return hasPassport === true;
    if (step === 2) return !!selectedDest;
    if (step === 3) return !!departDate && !!returnDate;
    return true;
  };

  const handleConfirm = () => {
    onOpenChange(false);
    navigate('/booking/success');
  };

  const slideVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? 200 : -200, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -200 : 200, opacity: 0 }),
  };

  const goNext = () => { setDirection(1); setStep(s => Math.min(s + 1, 5)); };
  const goPrev = () => { setDirection(-1); setStep(s => Math.max(s - 1, 0)); };

  const reset = () => {
    setStep(0);
    setNationality('');
    setHasPassport(null);
    setSelectedDest('');
    setDepartDate('');
    setReturnDate('');
    setTravelers(1);
    setShowDocs(false);
    setShowTips(false);
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { onOpenChange(o); if (!o) reset(); }}>
      <DialogContent className="sm:max-w-2xl glass-panel border-border bg-card max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold gradient-text" style={{ fontFamily: "'DM Serif Display', serif" }}>{t('flow.title')}</DialogTitle>
        </DialogHeader>

        {/* Step Indicator */}
        <div className="flex items-center justify-between mb-6 overflow-x-auto">
          {stepLabels.map((label, i) => (
            <div key={i} className="flex items-center gap-1.5 shrink-0">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                i <= step ? 'gradient-btn text-white' : 'bg-muted text-muted-foreground'
              }`}>
                {i < step ? <Check className="h-3 w-3" /> : i + 1}
              </div>
              <span className="hidden lg:inline text-[10px] text-muted-foreground">{label}</span>
              {i < stepLabels.length - 1 && <div className={`hidden sm:block w-4 h-px ${i < step ? 'bg-primary' : 'bg-border'}`} />}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={step}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.25 }}
            className="min-h-[280px]"
          >
            {/* Step 0: Nationality */}
            {step === 0 && (
              <div>
                <h3 className="text-base font-semibold mb-4 text-foreground">{pl.nationalityTitle}</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-[300px] overflow-y-auto pr-1">
                  {NATIONALITIES.map(n => (
                    <button
                      key={n.code}
                      onClick={() => { setNationality(n.code); setHasPassport(null); }}
                      className={`flex items-center gap-2.5 p-3 rounded-xl border transition-all text-left ${
                        nationality === n.code
                          ? 'border-primary bg-primary/10 ring-1 ring-primary'
                          : 'border-border bg-muted/30 hover:bg-muted/50'
                      }`}
                    >
                      <span className="text-xl">{n.flag}</span>
                      <span className="text-sm font-medium">{n.name[language]}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 1: Passport */}
            {step === 1 && (
              <div>
                <h3 className="text-base font-semibold mb-4 text-foreground">{pl.passportTitle}</h3>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <button
                    onClick={() => setHasPassport(true)}
                    className={`p-4 rounded-xl border text-center transition-all ${
                      hasPassport === true ? 'border-primary bg-primary/10 ring-1 ring-primary' : 'border-border bg-muted/30 hover:bg-muted/50'
                    }`}
                  >
                    <div className="text-2xl mb-1">✅</div>
                    <div className="font-medium text-sm">{pl.yes}</div>
                  </button>
                  <button
                    onClick={() => setHasPassport(false)}
                    className={`p-4 rounded-xl border text-center transition-all ${
                      hasPassport === false ? 'border-amber-500 bg-amber-500/10 ring-1 ring-amber-500' : 'border-border bg-muted/30 hover:bg-muted/50'
                    }`}
                  >
                    <div className="text-2xl mb-1">❌</div>
                    <div className="font-medium text-sm">{pl.no}</div>
                  </button>
                </div>

                {/* Passport office info */}
                {hasPassport === false && office && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-3">
                    <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl">
                      <div className="flex items-start gap-3">
                        <span className="text-xl">{office.flag}</span>
                        <div>
                          <h4 className="text-amber-400 font-semibold text-sm mb-1">{pl.noPassportTitle}</h4>
                          <p className="text-muted-foreground text-xs">{pl.noPassportDesc}</p>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-muted/30 border border-border rounded-xl space-y-3">
                      <h4 className="font-semibold text-sm flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-primary" /> {office.name[language]}
                      </h4>
                      <div className="flex items-start gap-3">
                        <ExternalLink className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                        <div>
                          <span className="text-xs text-muted-foreground block">{pl.website}</span>
                          <a href={office.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-sm">{pl.visitWebsite}</a>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Globe className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                        <div>
                          <span className="text-xs text-muted-foreground block">{pl.phone}</span>
                          <span className="text-sm">{office.phone}</span>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                        <div>
                          <span className="text-xs text-muted-foreground block">{pl.address}</span>
                          <span className="text-sm">{office.address[language]}</span>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="bg-muted/50 rounded-lg p-2.5">
                          <span className="text-xs text-muted-foreground block mb-0.5">{pl.processingTime}</span>
                          <span className="font-semibold text-sm">{office.processingTime[language]}</span>
                        </div>
                        <div className="bg-muted/50 rounded-lg p-2.5">
                          <span className="text-xs text-muted-foreground block mb-0.5">{pl.cost}</span>
                          <span className="font-semibold text-sm">{office.cost[language]}</span>
                        </div>
                      </div>
                    </div>

                    {/* Documents */}
                    <button onClick={() => setShowDocs(!showDocs)} className="w-full flex items-center justify-between p-3 bg-muted/30 border border-border rounded-xl hover:bg-muted/50 transition-colors">
                      <span className="flex items-center gap-2 text-sm font-medium"><FileText className="w-4 h-4 text-primary" /> {pl.documents}</span>
                      {showDocs ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                    </button>
                    <AnimatePresence>
                      {showDocs && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden -mt-1">
                          <div className="p-3 bg-muted/20 rounded-xl space-y-1.5">
                            {office.documents[language].map((doc, i) => (
                              <div key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" /> {doc}
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Tips */}
                    <button onClick={() => setShowTips(!showTips)} className="w-full flex items-center justify-between p-3 bg-muted/30 border border-border rounded-xl hover:bg-muted/50 transition-colors">
                      <span className="flex items-center gap-2 text-sm font-medium"><Info className="w-4 h-4 text-amber-400" /> {pl.tips}</span>
                      {showTips ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                    </button>
                    <AnimatePresence>
                      {showTips && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden -mt-1">
                          <div className="p-3 bg-amber-500/5 border border-amber-500/20 rounded-xl space-y-1.5">
                            {office.tips[language].map((tip, i) => (
                              <div key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                                <span className="text-amber-400 shrink-0">💡</span> {tip}
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Domestic travel for Brazilians */}
                    {nationality === 'BR' && (
                      <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
                        <p className="text-emerald-400 text-sm mb-2">{pl.domesticNote}</p>
                        <button onClick={goNext} className="gradient-btn text-white font-semibold px-4 py-2 rounded-xl flex items-center gap-2 text-sm">
                          {pl.continueWithDomestic} <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </motion.div>
                )}
              </div>
            )}

            {/* Step 2: Destination */}
            {step === 2 && (
              <div>
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder={t('flow.selectDest')} value={search} onChange={e => setSearch(e.target.value)} className="pl-10 bg-muted/50 border-border" />
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[300px] overflow-y-auto pr-1">
                  {filteredDests.map(d => (
                    <button key={d.id} onClick={() => setSelectedDest(d.id)} className={`relative rounded-xl overflow-hidden h-28 group transition-all ${selectedDest === d.id ? 'ring-2 ring-primary scale-[1.02]' : 'hover:scale-[1.02]'}`}>
                      <img src={d.image} alt={d.name} className="w-full h-full object-cover" loading="lazy" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                      <div className="absolute bottom-2 left-2 text-white text-left">
                        <div className="text-sm font-semibold">{d.name}</div>
                        <div className="text-xs opacity-80">{d.country[language]}</div>
                      </div>
                      <div className="absolute top-2 left-2 text-[10px] font-bold text-accent bg-black/50 rounded-full px-2 py-0.5">{format(d.priceBRL)}</div>
                      {selectedDest === d.id && (
                        <div className="absolute top-2 right-2 w-6 h-6 rounded-full gradient-btn flex items-center justify-center"><Check className="h-3 w-3 text-white" /></div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3: Dates */}
            {step === 3 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm text-muted-foreground">{t('flow.departDate')}</Label>
                    <Input type="date" value={departDate} onChange={e => setDepartDate(e.target.value)} className="mt-1 bg-muted/50 border-border" />
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">{t('flow.returnDate')}</Label>
                    <Input type="date" value={returnDate} onChange={e => setReturnDate(e.target.value)} className="mt-1 bg-muted/50 border-border" />
                  </div>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">{t('flow.travelers')}</Label>
                  <div className="flex items-center gap-3 mt-2">
                    <Button variant="outline" size="icon" onClick={() => setTravelers(Math.max(1, travelers - 1))}>-</Button>
                    <span className="text-xl font-bold w-8 text-center">{travelers}</span>
                    <Button variant="outline" size="icon" onClick={() => setTravelers(Math.min(10, travelers + 1))}>+</Button>
                    <Users className="h-5 w-5 text-muted-foreground ml-2" />
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Preferences */}
            {step === 4 && (
              <div className="space-y-6">
                <div>
                  <Label className="text-sm text-muted-foreground mb-3 block">{t('flow.travelStyle')}</Label>
                  <div className="grid grid-cols-3 gap-3">
                    {(['economic', 'comfort', 'luxury'] as const).map(s => (
                      <button key={s} onClick={() => setStyle(s)} className={`glass-card p-4 text-center transition-all ${style === s ? 'ring-2 ring-primary' : ''}`}>
                        <div className="text-2xl mb-1">{s === 'economic' ? '💰' : s === 'comfort' ? '✨' : '👑'}</div>
                        <div className="text-sm font-medium">{t(`flow.${s}`)}</div>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-3">
                  {[
                    { key: 'flow.includeFlight' as const, icon: Plane, value: includeFlight, set: setIncludeFlight },
                    { key: 'flow.includeHotel' as const, icon: Building2, value: includeHotel, set: setIncludeHotel },
                    { key: 'flow.includeInsurance' as const, icon: Shield, value: includeInsurance, set: setIncludeInsurance },
                  ].map(item => (
                    <button key={item.key} onClick={() => item.set(!item.value)} className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all ${item.value ? 'border-primary bg-primary/10' : 'border-border bg-muted/30'}`}>
                      <item.icon className={`h-5 w-5 ${item.value ? 'text-primary' : 'text-muted-foreground'}`} />
                      <span className="text-sm font-medium flex-1 text-left">{t(item.key)}</span>
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center ${item.value ? 'gradient-btn' : 'bg-muted'}`}>
                        {item.value && <Check className="h-3 w-3 text-white" />}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 5: Summary */}
            {step === 5 && (
              <div className="glass-card p-6 space-y-4">
                <h3 className="text-lg font-semibold gradient-text" style={{ fontFamily: "'DM Serif Display', serif" }}>{t('flow.summary')}</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground flex items-center gap-2"><Globe className="h-4 w-4" />{stepLabels[0]}</span>
                    <span className="font-medium">{NATIONALITIES.find(n => n.code === nationality)?.name[language] || '-'}</span>
                  </div>
                  <div className="flex justify-between"><span className="text-muted-foreground flex items-center gap-2"><MapPin className="h-4 w-4" />{t('flow.step1')}</span><span className="font-medium">{dest?.name || '-'}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground flex items-center gap-2"><Calendar className="h-4 w-4" />{t('flow.departDate')}</span><span className="font-medium">{departDate || '-'}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground flex items-center gap-2"><Calendar className="h-4 w-4" />{t('flow.returnDate')}</span><span className="font-medium">{returnDate || '-'}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground flex items-center gap-2"><Users className="h-4 w-4" />{t('flow.travelers')}</span><span className="font-medium">{travelers}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">{t('flow.travelStyle')}</span><span className="font-medium">{t(`flow.${style}`)}</span></div>
                  {dest && (
                    <div className="flex justify-between border-t border-border pt-3">
                      <span className="text-muted-foreground font-medium">{t('dest.from')}</span>
                      <span className="text-accent font-bold text-lg">{format(dest.priceBRL * travelers)}</span>
                    </div>
                  )}
                  <div className="flex flex-wrap gap-2 pt-2">
                    {includeFlight && <span className="px-2 py-1 rounded-full text-xs gradient-btn">✈️ {t('flow.includeFlight')}</span>}
                    {includeHotel && <span className="px-2 py-1 rounded-full text-xs gradient-btn">🏨 {t('flow.includeHotel')}</span>}
                    {includeInsurance && <span className="px-2 py-1 rounded-full text-xs gradient-btn">🛡️ {t('flow.includeInsurance')}</span>}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="flex justify-between mt-4">
          <Button variant="outline" onClick={goPrev} disabled={step === 0} className="gap-2">
            <ChevronLeft className="h-4 w-4" /> {t('flow.prev')}
          </Button>
          {step < 5 ? (
            <Button onClick={goNext} disabled={!canNext()} className="gradient-btn border-0 gap-2">
              {t('flow.next')} <ChevronRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={handleConfirm} className="gradient-btn border-0 gap-2">
              <Check className="h-4 w-4" /> {t('flow.confirm')}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
