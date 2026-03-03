import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Calendar, Users, Plane, Building2, Shield, ChevronRight, ChevronLeft, Check, X } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const destinations = [
  { id: 'paris', name: 'Paris', country: 'França', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=300&q=80' },
  { id: 'tokyo', name: 'Tóquio', country: 'Japão', image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=300&q=80' },
  { id: 'nyc', name: 'Nova York', country: 'EUA', image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=300&q=80' },
  { id: 'rome', name: 'Roma', country: 'Itália', image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=300&q=80' },
  { id: 'cancun', name: 'Cancún', country: 'México', image: 'https://images.unsplash.com/photo-1510097467424-192d713fd8b2?w=300&q=80' },
  { id: 'santorini', name: 'Santorini', country: 'Grécia', image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=300&q=80' },
];

interface TravelerFlowProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const TravelerFlow = ({ open, onOpenChange }: TravelerFlowProps) => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [selectedDest, setSelectedDest] = useState('');
  const [departDate, setDepartDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [travelers, setTravelers] = useState(1);
  const [style, setStyle] = useState<'economic' | 'comfort' | 'luxury'>('comfort');
  const [includeHotel, setIncludeHotel] = useState(true);
  const [includeFlight, setIncludeFlight] = useState(true);
  const [includeInsurance, setIncludeInsurance] = useState(false);

  const steps = [t('flow.step1'), t('flow.step2'), t('flow.step3'), t('flow.step4')];
  const dest = destinations.find(d => d.id === selectedDest);

  const canNext = () => {
    if (step === 0) return !!selectedDest;
    if (step === 1) return !!departDate && !!returnDate;
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

  const [direction, setDirection] = useState(1);

  const goNext = () => { setDirection(1); setStep(s => Math.min(s + 1, 3)); };
  const goPrev = () => { setDirection(-1); setStep(s => Math.max(s - 1, 0)); };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl glass-panel border-border bg-card max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold gradient-text">{t('flow.title')}</DialogTitle>
        </DialogHeader>

        {/* Step Indicator */}
        <div className="flex items-center justify-between mb-6">
          {steps.map((label, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                i <= step ? 'gradient-btn text-white' : 'bg-muted text-muted-foreground'
              }`}>
                {i < step ? <Check className="h-4 w-4" /> : i + 1}
              </div>
              <span className="hidden sm:inline text-xs text-muted-foreground">{label}</span>
              {i < steps.length - 1 && <div className={`hidden sm:block w-8 h-px ${i < step ? 'bg-primary' : 'bg-border'}`} />}
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
            {step === 0 && (
              <div>
                <p className="text-sm text-muted-foreground mb-4">{t('flow.selectDest')}</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {destinations.map(d => (
                    <button
                      key={d.id}
                      onClick={() => setSelectedDest(d.id)}
                      className={`relative rounded-xl overflow-hidden h-28 group transition-all ${
                        selectedDest === d.id ? 'ring-2 ring-primary scale-[1.02]' : 'hover:scale-[1.02]'
                      }`}
                    >
                      <img src={d.image} alt={d.name} className="w-full h-full object-cover" loading="lazy" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                      <div className="absolute bottom-2 left-2 text-white text-left">
                        <div className="text-sm font-semibold">{d.name}</div>
                        <div className="text-xs opacity-80">{d.country}</div>
                      </div>
                      {selectedDest === d.id && (
                        <div className="absolute top-2 right-2 w-6 h-6 rounded-full gradient-btn flex items-center justify-center">
                          <Check className="h-3 w-3 text-white" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm text-muted-foreground">{t('flow.departDate')}</Label>
                    <Input
                      type="date"
                      value={departDate}
                      onChange={e => setDepartDate(e.target.value)}
                      className="mt-1 bg-muted/50 border-border"
                    />
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">{t('flow.returnDate')}</Label>
                    <Input
                      type="date"
                      value={returnDate}
                      onChange={e => setReturnDate(e.target.value)}
                      className="mt-1 bg-muted/50 border-border"
                    />
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

            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <Label className="text-sm text-muted-foreground mb-3 block">{t('flow.travelStyle')}</Label>
                  <div className="grid grid-cols-3 gap-3">
                    {(['economic', 'comfort', 'luxury'] as const).map(s => (
                      <button
                        key={s}
                        onClick={() => setStyle(s)}
                        className={`glass-card p-4 text-center transition-all ${
                          style === s ? 'ring-2 ring-primary' : ''
                        }`}
                      >
                        <div className="text-2xl mb-1">{s === 'economic' ? '💰' : s === 'comfort' ? '✨' : '👑'}</div>
                        <div className="text-sm font-medium">{t(`flow.${s}`)}</div>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-3">
                  {[
                    { key: 'includeFlight', icon: Plane, value: includeFlight, set: setIncludeFlight },
                    { key: 'includeHotel', icon: Building2, value: includeHotel, set: setIncludeHotel },
                    { key: 'includeInsurance', icon: Shield, value: includeInsurance, set: setIncludeInsurance },
                  ].map(item => (
                    <button
                      key={item.key}
                      onClick={() => item.set(!item.value)}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all ${
                        item.value ? 'border-primary bg-primary/10' : 'border-border bg-muted/30'
                      }`}
                    >
                      <item.icon className={`h-5 w-5 ${item.value ? 'text-primary' : 'text-muted-foreground'}`} />
                      <span className="text-sm font-medium flex-1 text-left">{t(item.key as any)}</span>
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                        item.value ? 'gradient-btn' : 'bg-muted'
                      }`}>
                        {item.value && <Check className="h-3 w-3 text-white" />}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="glass-card p-6 space-y-4">
                <h3 className="text-lg font-semibold gradient-text">{t('flow.summary')}</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground flex items-center gap-2"><MapPin className="h-4 w-4" />{t('flow.step1')}</span>
                    <span className="font-medium">{dest?.name || '-'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground flex items-center gap-2"><Calendar className="h-4 w-4" />{t('flow.departDate')}</span>
                    <span className="font-medium">{departDate || '-'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground flex items-center gap-2"><Calendar className="h-4 w-4" />{t('flow.returnDate')}</span>
                    <span className="font-medium">{returnDate || '-'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground flex items-center gap-2"><Users className="h-4 w-4" />{t('flow.travelers')}</span>
                    <span className="font-medium">{travelers}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t('flow.travelStyle')}</span>
                    <span className="font-medium">{t(`flow.${style}`)}</span>
                  </div>
                  <div className="border-t border-border pt-3 flex flex-wrap gap-2">
                    {includeFlight && <span className="px-2 py-1 rounded-full text-xs gradient-btn">✈️ {t('flow.includeFlight')}</span>}
                    {includeHotel && <span className="px-2 py-1 rounded-full text-xs gradient-btn">🏨 {t('flow.includeHotel')}</span>}
                    {includeInsurance && <span className="px-2 py-1 rounded-full text-xs gradient-btn">🛡️ {t('flow.includeInsurance')}</span>}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex justify-between mt-4">
          <Button variant="outline" onClick={goPrev} disabled={step === 0} className="gap-2">
            <ChevronLeft className="h-4 w-4" /> {t('flow.prev')}
          </Button>
          {step < 3 ? (
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
