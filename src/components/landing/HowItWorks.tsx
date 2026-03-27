import { motion } from 'framer-motion';
import { MapPin, Settings, Rocket, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export const HowItWorks = () => {
  const { t } = useLanguage();

  const steps = [
    { icon: MapPin, title: t('how.step1Title'), desc: t('how.step1Desc'), num: '01' },
    { icon: Settings, title: t('how.step2Title'), desc: t('how.step2Desc'), num: '02' },
    { icon: Rocket, title: t('how.step3Title'), desc: t('how.step3Desc'), num: '03' },
  ];

  return (
    <section className="py-24 sm:py-32 relative bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="section-label">Como funciona</span>
          <h2 className="text-3xl sm:text-5xl font-bold mb-5" style={{ fontFamily: "'DM Serif Display', serif" }}>
            {t('how.title')}
          </h2>
          <p className="text-muted-foreground text-lg">{t('how.subtitle')}</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connecting Line */}
          <div className="hidden md:block absolute top-16 left-[25%] right-[25%] border-t-2 border-dashed border-border" />

          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.5 }}
              className="text-center relative"
            >
              <div className="w-16 h-16 mx-auto rounded-2xl gradient-btn flex items-center justify-center mb-6 relative z-10 shadow-lg">
                <step.icon className="h-7 w-7 text-white" />
              </div>
              <span className="inline-flex items-center gap-1 text-xs font-bold text-primary mb-3 tracking-widest uppercase">
                <CheckCircle2 className="h-3 w-3" /> {step.num}
              </span>
              <h3 className="text-xl font-semibold mb-3" style={{ fontFamily: "'DM Serif Display', serif" }}>{step.title}</h3>
              <p className="text-sm text-muted-foreground max-w-xs mx-auto leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
