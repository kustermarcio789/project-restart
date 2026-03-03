import { motion } from 'framer-motion';
import { CheckCircle2, Mail, FileText, Smartphone, ArrowRight, Plane } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const BookingSuccess = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const steps = [
    { icon: Mail, text: t('booking.step1') },
    { icon: FileText, text: t('booking.step2') },
    { icon: Smartphone, text: t('booking.step3') },
  ];

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-lg w-full text-center"
      >
        {/* Success Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', delay: 0.2, stiffness: 200 }}
          className="w-24 h-24 mx-auto rounded-full gradient-btn flex items-center justify-center mb-8"
        >
          <CheckCircle2 className="h-12 w-12 text-white" />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <h1 className="text-3xl sm:text-4xl font-bold mb-2 gradient-text">{t('booking.successTitle')}</h1>
          <p className="text-lg text-muted-foreground mb-2">{t('booking.successSubtitle')}</p>
          <p className="text-sm text-muted-foreground mb-8">{t('booking.successMsg')}</p>
        </motion.div>

        {/* Next Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="glass-card p-6 mb-8 text-left"
        >
          <h3 className="text-sm font-semibold text-primary mb-4">{t('booking.nextSteps')}</h3>
          <div className="space-y-4">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 + i * 0.15 }}
                className="flex items-center gap-3"
              >
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <step.icon className="h-4 w-4 text-primary" />
                </div>
                <span className="text-sm">{step.text}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="flex flex-col sm:flex-row gap-3 justify-center"
        >
          <Button onClick={() => navigate('/')} className="gradient-btn border-0 rounded-full px-6 gap-2">
            <Plane className="h-4 w-4" />
            {t('booking.backHome')}
          </Button>
          <Button variant="outline" className="rounded-full px-6 glass-panel border-border gap-2">
            {t('booking.viewDetails')}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default BookingSuccess;
