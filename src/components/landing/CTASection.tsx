import { motion } from 'framer-motion';
import { ArrowRight, Shield, Clock, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface CTASectionProps {
  onStartFlow?: () => void;
}

export const CTASection = ({ onStartFlow }: CTASectionProps) => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  return (
    <section id="cta" className="py-24 sm:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="relative rounded-3xl overflow-hidden"
        >
          {/* Background */}
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80"
              alt=""
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-[hsl(200,80%,25%)] via-[hsl(215,72%,22%)] to-[hsl(230,65%,20%)] opacity-90" />
          </div>

          {/* Content */}
          <div className="relative z-10 py-20 sm:py-24 px-6 sm:px-16 text-center">
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-white mb-5 leading-tight" style={{ fontFamily: "'DM Serif Display', serif" }}>
              {t('cta.title')}
            </h2>
            <p className="text-white/70 text-lg max-w-xl mx-auto mb-8">
              {t('cta.subtitle')}
            </p>

            {/* Trust points */}
            <div className="flex flex-wrap items-center justify-center gap-6 mb-10 text-white/60 text-xs">
              <span className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5" /> Cotação gratuita</span>
              <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /> Resposta em 24h</span>
              <span className="flex items-center gap-1.5"><Shield className="h-3.5 w-3.5" /> Sem compromisso</span>
            </div>

            <Button
              size="lg"
              className="rounded-full px-10 h-14 text-base bg-white text-foreground hover:bg-white/90 font-semibold border-0 shadow-xl shadow-black/20 transition-all duration-300 hover:shadow-2xl hover:-translate-y-0.5"
              onClick={() => navigate('/cotacao')}
            >
              {t('cta.button')}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
