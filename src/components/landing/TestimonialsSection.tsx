import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const testimonials = [
  { name: 'Maria Silva', location: 'São Paulo, BR', rating: 5, text: 'Experiência incrível! A equipe cuidou de tudo, desde o voo até o hotel. Recomendo demais!', avatar: 'https://i.pravatar.cc/100?img=1' },
  { name: 'John Smith', location: 'New York, US', rating: 5, text: 'Best travel agency I\'ve ever used. The attention to detail was amazing. Will definitely book again!', avatar: 'https://i.pravatar.cc/100?img=3' },
  { name: 'Ana García', location: 'Madrid, ES', rating: 5, text: '¡Servicio excepcional! Todo fue perfecto, desde la planificación hasta el regreso. Muy recomendable.', avatar: 'https://i.pravatar.cc/100?img=5' },
];

export const TestimonialsSection = () => {
  const { t } = useLanguage();

  return (
    <section className="py-24 sm:py-32 relative">
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
            {t('test.title')}
          </h2>
          <p className="text-muted-foreground text-lg">{t('test.subtitle')}</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.5 }}
              className="glass-card glow-border p-7 relative"
            >
              <Quote className="absolute top-5 right-5 h-8 w-8 text-primary/10" />

              <div className="flex gap-0.5 mb-5">
                {Array.from({ length: item.rating }).map((_, j) => (
                  <Star key={j} className="h-4 w-4 fill-accent text-accent" />
                ))}
              </div>

              <p className="text-sm text-muted-foreground mb-7 leading-relaxed italic">
                "{item.text}"
              </p>

              <div className="flex items-center gap-3">
                <img
                  src={item.avatar}
                  alt={item.name}
                  className="w-11 h-11 rounded-full object-cover ring-2 ring-primary/20"
                  loading="lazy"
                />
                <div>
                  <div className="text-sm font-semibold">{item.name}</div>
                  <div className="text-xs text-muted-foreground">{item.location}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
