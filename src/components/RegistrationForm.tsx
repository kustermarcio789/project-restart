import { useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Check, UserPlus, Handshake } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
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

interface RegistrationState {
  name: string;
  email: string;
  phone: string;
  company: string;
  serviceType: string;
  city: string;
  message: string;
}

const initialState: RegistrationState = {
  name: '',
  email: '',
  phone: '',
  company: '',
  serviceType: '',
  city: '',
  message: '',
};

export const RegistrationForm = ({ open, onOpenChange, type }: RegistrationFormProps) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState<RegistrationState>(initialState);

  const isProvider = type === 'provider';
  const title = isProvider ? t('reg.providerTitle') : t('reg.partnerTitle');
  const desc = isProvider ? t('reg.providerDesc') : t('reg.partnerDesc');
  const Icon = isProvider ? UserPlus : Handshake;

  const updateField = <K extends keyof RegistrationState>(key: K, value: RegistrationState[K]) => {
    setForm(previous => ({ ...previous, [key]: value }));
  };

  const resetForm = () => {
    setForm(initialState);
    setSubmitted(false);
    setSubmitting(false);
  };

  const buildMessage = () => {
    const lines = [
      `Tipo de cadastro: ${isProvider ? 'Prestador de serviço' : 'Parceiro comercial'}`,
      `Empresa: ${form.company}`,
      `Cidade: ${form.city}`,
      `Telefone: ${form.phone}`,
      isProvider ? `Tipo de serviço: ${form.serviceType}` : null,
      form.message ? `Mensagem: ${form.message}` : null,
    ];

    return lines.filter(Boolean).join('\n');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const leadId = crypto.randomUUID();
      const serviceType = isProvider ? 'provider_onboarding' : 'partner_onboarding';
      const eventType = isProvider ? 'provider_registration_submitted' : 'partner_registration_submitted';

      const { error } = await supabase.from('leads').insert({
        id: leadId,
        name: form.name,
        email: form.email,
        phone: form.phone,
        service_type: serviceType,
        source: 'homepage_registration_modal',
        landing_page: '/',
        message: buildMessage(),
      });

      if (error) {
        throw error;
      }

      const { error: trackingError } = await supabase.functions.invoke('track-lead-event', {
        body: {
          lead_id: leadId,
          event_type: eventType,
          channel: 'web',
          description: `${isProvider ? 'Cadastro de prestador' : 'Cadastro de parceiro'} enviado por ${form.company}`,
          metadata: {
            form_type: type,
            company: form.company,
            city: form.city,
            service_type: isProvider ? form.serviceType : null,
            source: 'homepage_registration_modal',
          },
        },
      });

      if (trackingError) {
        throw trackingError;
      }

      setSubmitted(true);
      toast({
        title: t('reg.success'),
        description: isProvider
          ? 'Seu cadastro de prestador foi enviado e nossa equipe poderá analisar sua proposta.'
          : 'Seu cadastro de parceiro foi enviado e nossa equipe poderá entrar em contato.',
      });

      window.setTimeout(() => {
        resetForm();
        onOpenChange(false);
      }, 2200);
    } catch (error) {
      const description = error instanceof Error ? error.message : 'Não foi possível enviar o cadastro agora.';
      toast({
        title: 'Erro ao enviar cadastro',
        description,
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          resetForm();
        }
        onOpenChange(nextOpen);
      }}
    >
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
                <Input
                  required
                  value={form.name}
                  onChange={(e) => updateField('name', e.target.value)}
                  className="mt-1 bg-muted/50 border-border"
                />
              </div>
              <div>
                <Label>{t('reg.email')}</Label>
                <Input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => updateField('email', e.target.value)}
                  className="mt-1 bg-muted/50 border-border"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label>{t('reg.phone')}</Label>
                <Input
                  type="tel"
                  required
                  value={form.phone}
                  onChange={(e) => updateField('phone', e.target.value)}
                  className="mt-1 bg-muted/50 border-border"
                />
              </div>
              <div>
                <Label>{t('reg.company')}</Label>
                <Input
                  required
                  value={form.company}
                  onChange={(e) => updateField('company', e.target.value)}
                  className="mt-1 bg-muted/50 border-border"
                />
              </div>
            </div>
            {isProvider && (
              <div>
                <Label>{t('reg.serviceType')}</Label>
                <Input
                  required
                  value={form.serviceType}
                  onChange={(e) => updateField('serviceType', e.target.value)}
                  className="mt-1 bg-muted/50 border-border"
                />
              </div>
            )}
            <div>
              <Label>{t('reg.city')}</Label>
              <Input
                required
                value={form.city}
                onChange={(e) => updateField('city', e.target.value)}
                className="mt-1 bg-muted/50 border-border"
              />
            </div>
            <div>
              <Label>{t('reg.message')}</Label>
              <Textarea
                value={form.message}
                onChange={(e) => updateField('message', e.target.value)}
                className="mt-1 bg-muted/50 border-border min-h-[80px]"
              />
            </div>
            <Button type="submit" className="w-full gradient-btn border-0" disabled={submitting}>
              {submitting ? 'Enviando...' : t('reg.submit')}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};
