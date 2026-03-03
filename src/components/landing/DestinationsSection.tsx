import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const destinations = [
  { name: 'Paris', country: 'França', price: 'R$ 4.500', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&q=80' },
  { name: 'Tóquio', country: 'Japão', price: 'R$ 6.200', image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600&q=80' },
  { name: 'Nova York', country: 'EUA', price: 'R$ 3.800', image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=600&q=80' },
  { name: 'Roma', country: 'Itália', price: 'R$ 4.100', image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=600&q=80' },
  { name: 'Cancún', country: 'México', price: 'R$ 3.200', image: 'https://images.unsplash.com/photo-1510097467424-192d713fd8b2?w=600&q=80' },
  { name: 'Santorini', country: 'Grécia', price: 'R$ 5.100', image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=600&q=80' },
];

export const DestinationsSection = () => {
  const { t } = useLanguage();

  return (
    <section id="destinations" className="py-24 sm:py-32 relative">
      <div className="horizon-line absolute top-0 left-0 right-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h2 className="text-3xl sm:text-5xl font-bold mb-5" style={{ fontFamily: "'DM Serif Display', serif" }}>
            {t('dest.title')}
          </h2>
          <p className="text-muted-foreground text-lg">{t('dest.subtitle')}</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {destinations.map((dest, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="glass-card overflow-hidden cursor-pointer group"
            >
              <div className="relative h-56 overflow-hidden">
                <img
                  src={dest.image}
                  alt={dest.name}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
                <div className="absolute bottom-4 left-4 flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-primary" />
                  <span className="text-xs font-medium text-muted-foreground">{dest.country}</span>
                </div>
              </div>
              <div className="p-5">
                <h3 className="text-lg font-semibold mb-1" style={{ fontFamily: "'DM Serif Display', serif" }}>{dest.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {t('dest.from')}{' '}
                  <span className="text-accent font-bold text-base">{dest.price}</span>
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
