import { motion } from 'framer-motion';
import { XCircle, RefreshCw, Headphones, ArrowRight, Plane } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const BookingCancel = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-lg w-full text-center"
      >
        {/* Cancel Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', delay: 0.2, stiffness: 200 }}
          className="w-24 h-24 mx-auto rounded-full bg-destructive/20 flex items-center justify-center mb-8"
        >
          <XCircle className="h-12 w-12 text-destructive" />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">{t('booking.cancelTitle')}</h1>
          <p className="text-lg text-muted-foreground mb-2">{t('booking.cancelSubtitle')}</p>
          <p className="text-sm text-muted-foreground mb-8">{t('booking.cancelMsg')}</p>
        </motion.div>

        {/* Help Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="glass-card p-6 mb-8"
        >
          <div className="flex items-center gap-3 justify-center mb-3">
            <Headphones className="h-5 w-5 text-primary" />
            <h3 className="text-sm font-semibold">{t('booking.needHelp')}</h3>
          </div>
          <p className="text-sm text-muted-foreground">{t('booking.contactSupport')}</p>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-3 justify-center"
        >
          <Button onClick={() => navigate('/')} className="gradient-btn border-0 rounded-full px-6 gap-2">
            <RefreshCw className="h-4 w-4" />
            {t('booking.tryAgain')}
          </Button>
          <Button variant="outline" onClick={() => navigate('/')} className="rounded-full px-6 glass-panel border-border gap-2">
            <Plane className="h-4 w-4" />
            {t('booking.backHome')}
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default BookingCancel;
