import { motion } from 'framer-motion';
import { MapPin, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCurrency, allDestinations } from '@/lib/destinations';
import { Link } from 'react-router-dom';

export const DestinationsSection = () => {
  const { t, language } = useLanguage();
  const { format } = useCurrency();

  const featured = allDestinations.filter(d => d.featured);

  return (
    <section id="destinations" className="py-24 sm:py-32 relative bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="section-label">Destinos populares</span>
          <h2 className="text-3xl sm:text-5xl font-bold mb-5" style={{ fontFamily: "'DM Serif Display', serif" }}>
            {t('dest.title')}
          </h2>
          <p className="text-muted-foreground text-lg">{t('dest.subtitle')}</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {featured.map((dest, i) => (
            <motion.div
              key={dest.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="glass-card overflow-hidden cursor-pointer group"
            >
              <div className="relative h-52 overflow-hidden">
                <img
                  src={dest.image}
                  alt={dest.name}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent" />
                <div className="absolute bottom-4 left-4 flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-primary" />
                  <span className="text-xs font-medium text-muted-foreground">{dest.country[language]}</span>
                </div>
              </div>
              <div className="p-5">
                <h3 className="text-lg font-semibold mb-1" style={{ fontFamily: "'DM Serif Display', serif" }}>{dest.name}</h3>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    {t('dest.from')}{' '}
                    <span className="text-primary font-bold text-base">{format(dest.priceBRL)}</span>
                  </p>
                  <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link
            to="/comparar"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
          >
            Ver todos os 150+ destinos <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};
