import { useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Check, UserPlus, Handshake } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

interface RegistrationFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: 'provider' | 'partner';
}

export const RegistrationForm = ({ open, onOpenChange, type }: RegistrationFormProps) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);

  const isProvider = type === 'provider';
  const title = isProvider ? t('reg.providerTitle') : t('reg.partnerTitle');
  const desc = isProvider ? t('reg.providerDesc') : t('reg.partnerDesc');
  const Icon = isProvider ? UserPlus : Handshake;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    toast({ title: t('reg.success'), description: title });
    setTimeout(() => {
      setSubmitted(false);
      onOpenChange(false);
    }, 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg glass-panel border-border bg-card">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-btn flex items-center justify-center">
              <Icon className="h-5 w-5 text-white" />
            </div>
            <div>
              <DialogTitle className="gradient-text">{title}</DialogTitle>
              <DialogDescription>{desc}</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {submitted ? (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex flex-col items-center py-8"
          >
            <div className="w-16 h-16 rounded-full gradient-btn flex items-center justify-center mb-4">
              <Check className="h-8 w-8 text-white" />
            </div>
            <p className="text-lg font-semibold">{t('reg.success')}</p>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label>{t('reg.name')}</Label>
                <Input required className="mt-1 bg-muted/50 border-border" />
              </div>
              <div>
                <Label>{t('reg.email')}</Label>
                <Input type="email" required className="mt-1 bg-muted/50 border-border" />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label>{t('reg.phone')}</Label>
                <Input type="tel" required className="mt-1 bg-muted/50 border-border" />
              </div>
              <div>
                <Label>{t('reg.company')}</Label>
                <Input required className="mt-1 bg-muted/50 border-border" />
              </div>
            </div>
            {isProvider && (
              <div>
                <Label>{t('reg.serviceType')}</Label>
                <Input required className="mt-1 bg-muted/50 border-border" />
              </div>
            )}
            <div>
              <Label>{t('reg.city')}</Label>
              <Input required className="mt-1 bg-muted/50 border-border" />
            </div>
            <div>
              <Label>{t('reg.message')}</Label>
              <Textarea className="mt-1 bg-muted/50 border-border min-h-[80px]" />
            </div>
            <Button type="submit" className="w-full gradient-btn border-0">
              {t('reg.submit')}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};
