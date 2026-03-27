import { motion } from 'framer-motion';
import { ArrowRight, Play, Shield, Star, Users } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';

interface HeroSectionProps {
  onStartFlow?: () => void;
}

export const HeroSection = ({ onStartFlow }: HeroSectionProps) => {
  const { t } = useLanguage();

  return (
    <section id="hero" className="relative min-h-[100vh] flex items-center justify-center overflow-hidden">
      {/* Cinematic Background */}
      <div className="absolute inset-0">
        <div
          className="ken-burns absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1488085061387-422e29b40080?w=1920&q=80')`,
          }}
        />
        <div className="cinematic-overlay absolute inset-0" />
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="float-particle absolute w-1 h-1 rounded-full bg-primary/40"
            style={{
              left: `${15 + i * 18}%`,
              top: `${20 + (i % 3) * 25}%`,
              animationDelay: `${i * 1.5}s`,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-24 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Trust badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full bg-card/80 backdrop-blur-md border border-border shadow-sm text-sm font-medium text-foreground"
          >
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-3 w-3 fill-accent text-accent" />
              ))}
            </div>
            <span className="text-muted-foreground">•</span>
            <span>50.000+ viajantes satisfeitos</span>
          </motion.div>

          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-bold leading-[0.95] mb-8 text-shadow-cinematic" style={{ fontFamily: "'DM Serif Display', serif" }}>
            {t('hero.title')}
            <br />
            <span className="gradient-text">{t('hero.titleHighlight')}</span>
          </h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-lg sm:text-xl text-muted-foreground max-w-xl mx-auto mb-10 leading-relaxed"
          >
            {t('hero.subtitle')}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button
              size="lg"
              className="gradient-btn rounded-full px-10 h-14 text-base border-0 tracking-wide"
              onClick={onStartFlow}
            >
              {t('hero.cta')}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="rounded-full px-8 h-14 text-base bg-card/60 backdrop-blur-md border-border hover:bg-card/80 hover:border-primary/30 transition-all duration-300"
              onClick={() => document.querySelector('#destinations')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <Play className="mr-2 h-4 w-4" />
              {t('hero.ctaSecondary')}
            </Button>
          </motion.div>

          {/* Trust indicators under CTAs */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="flex flex-wrap items-center justify-center gap-6 mt-8 text-xs text-muted-foreground"
          >
            <span className="flex items-center gap-1.5"><Shield className="h-3.5 w-3.5 text-primary" /> Pagamento seguro</span>
            <span className="flex items-center gap-1.5"><Users className="h-3.5 w-3.5 text-primary" /> Suporte 24/7</span>
            <span className="flex items-center gap-1.5"><Star className="h-3.5 w-3.5 text-accent fill-accent" /> Nota 4.9/5</span>
          </motion.div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1, ease: [0.22, 1, 0.36, 1] }}
          className="mt-20 sm:mt-28 bg-card/80 backdrop-blur-xl border border-border rounded-2xl p-8 sm:p-10 max-w-3xl mx-auto shadow-lg shadow-foreground/[0.03]"
        >
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
            {[
              { value: '50K+', label: t('stats.travelers') },
              { value: '150+', label: t('stats.destinations') },
              { value: '24/7', label: t('stats.support') },
              { value: '4.9', label: t('stats.rating') },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 + i * 0.1 }}
                className="text-center"
              >
                <div className="text-2xl sm:text-3xl font-bold gradient-text" style={{ fontFamily: "'DM Serif Display', serif" }}>{stat.value}</div>
                <div className="text-xs text-muted-foreground mt-1.5 tracking-wide uppercase">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
