import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';

interface CTASectionProps {
  onStartFlow?: () => void;
}

export const CTASection = ({ onStartFlow }: CTASectionProps) => {
  const { t } = useLanguage();

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
            <div className="absolute inset-0 bg-gradient-to-br from-[hsl(199,89%,30%)] via-[hsl(220,80%,25%)] to-[hsl(260,70%,25%)] opacity-85" />
          </div>

          {/* Content */}
          <div className="relative z-10 py-20 sm:py-24 px-6 sm:px-16 text-center">
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-white mb-5 leading-tight" style={{ fontFamily: "'DM Serif Display', serif" }}>
              {t('cta.title')}
            </h2>
            <p className="text-white/70 text-lg max-w-xl mx-auto mb-10">
              {t('cta.subtitle')}
            </p>
            <Button
              size="lg"
              className="rounded-full px-10 h-14 text-base bg-white text-foreground hover:bg-white/90 font-semibold border-0 shadow-xl shadow-black/20 transition-all duration-300 hover:shadow-2xl hover:-translate-y-0.5"
              onClick={onStartFlow}
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
