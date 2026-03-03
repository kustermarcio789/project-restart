import { motion } from 'framer-motion';
import { MapPin, Settings, Rocket } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export const HowItWorks = () => {
  const { t } = useLanguage();

  const steps = [
    { icon: MapPin, title: t('how.step1Title'), desc: t('how.step1Desc'), num: '01' },
    { icon: Settings, title: t('how.step2Title'), desc: t('how.step2Desc'), num: '02' },
    { icon: Rocket, title: t('how.step3Title'), desc: t('how.step3Desc'), num: '03' },
  ];

  return (
    <section className="py-20 sm:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">{t('how.title')}</h2>
          <p className="text-muted-foreground text-lg">{t('how.subtitle')}</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connecting line */}
          <div className="hidden md:block absolute top-16 left-1/6 right-1/6 h-px bg-gradient-to-r from-primary/0 via-primary/30 to-primary/0" />

          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="text-center relative"
            >
              <div className="w-16 h-16 mx-auto rounded-2xl gradient-btn flex items-center justify-center mb-6 relative z-10">
                <step.icon className="h-7 w-7 text-white" />
              </div>
              <span className="text-xs font-bold text-primary mb-2 block">{step.num}</span>
              <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
              <p className="text-sm text-muted-foreground max-w-xs mx-auto">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
