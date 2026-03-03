import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';

export const CTASection = () => {
  const { t } = useLanguage();

  return (
    <section id="cta" className="py-20 sm:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative rounded-3xl overflow-hidden"
        >
          <div className="absolute inset-0 gradient-btn opacity-90" />
          <div
            className="absolute inset-0 bg-cover bg-center opacity-20 mix-blend-overlay"
            style={{ backgroundImage: `url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80')` }}
          />
          <div className="relative z-10 py-16 sm:py-20 px-6 sm:px-12 text-center">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
              {t('cta.title')}
            </h2>
            <p className="text-white/80 text-lg max-w-2xl mx-auto mb-8">
              {t('cta.subtitle')}
            </p>
            <Button
              size="lg"
              className="rounded-full px-8 h-12 text-base bg-white text-foreground hover:bg-white/90 font-semibold border-0"
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
