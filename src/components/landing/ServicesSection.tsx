import { motion } from 'framer-motion';
import { Plane, Building2, Car, Shield, Map, FileText } from 'lucide-react';
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
    <section id="services" className="py-20 sm:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">{t('services.title')}</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">{t('services.subtitle')}</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, i) => {
            const Icon = iconMap[service.icon];
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-6 cursor-pointer group"
              >
                <div className="w-12 h-12 rounded-xl gradient-btn flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{service.title}</h3>
                <p className="text-sm text-muted-foreground">{service.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
