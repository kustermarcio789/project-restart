import { motion } from 'framer-motion';
import { Plane, Building2, Car, Shield, Map, FileText, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const iconMap = [Plane, Building2, Car, Shield, Map, FileText];

export const ServicesSection = () => {
  const { t } = useLanguage();

  const services = [
    { icon: 0, title: t('services.flights'), desc: t('services.flightsDesc') },
    { icon: 1, title: t('services.hotels'), desc: t('services.hotelsDesc') },
    { icon: 2, title: t('services.cars'), desc: t('services.carsDesc') },
    { icon: 3, title: t('services.insurance'), desc: t('services.insuranceDesc') },
    { icon: 4, title: t('services.tours'), desc: t('services.toursDesc') },
    { icon: 5, title: t('services.visas'), desc: t('services.visasDesc') },
  ];

  return (
    <section id="services" className="py-24 sm:py-32 relative">
      <div className="horizon-line absolute top-0 left-0 right-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="section-label">Nossos serviços</span>
          <h2 className="text-3xl sm:text-5xl font-bold mb-5" style={{ fontFamily: "'DM Serif Display', serif" }}>
            {t('services.title')}
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">{t('services.subtitle')}</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((service, i) => {
            const Icon = iconMap[service.icon];
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="glass-card p-7 cursor-pointer group"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/15 group-hover:scale-105 transition-all duration-300">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2" style={{ fontFamily: "'DM Serif Display', serif" }}>{service.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">{service.desc}</p>
                <span className="inline-flex items-center gap-1 text-xs font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Saiba mais <ArrowRight className="h-3 w-3" />
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
