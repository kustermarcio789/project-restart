import { motion } from 'framer-motion';
import { Star, Quote, BadgeCheck } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const testimonials = [
  { name: 'Maria Silva', location: 'São Paulo, BR', rating: 5, text: 'Experiência incrível! A equipe cuidou de tudo, desde o voo até o hotel. Recomendo demais!', avatar: 'https://i.pravatar.cc/100?img=1', verified: true },
  { name: 'John Smith', location: 'New York, US', rating: 5, text: 'Best travel agency I\'ve ever used. The attention to detail was amazing. Will definitely book again!', avatar: 'https://i.pravatar.cc/100?img=3', verified: true },
  { name: 'Ana García', location: 'Madrid, ES', rating: 5, text: '¡Servicio excepcional! Todo fue perfecto, desde la planificación hasta el regreso. Muy recomendable.', avatar: 'https://i.pravatar.cc/100?img=5', verified: true },
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
          className="text-center mb-16"
        >
          <span className="section-label">Depoimentos</span>
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
              className="glass-card p-7 relative"
            >
              <Quote className="absolute top-5 right-5 h-8 w-8 text-primary/[0.07]" />

              <div className="flex gap-0.5 mb-5">
                {Array.from({ length: item.rating }).map((_, j) => (
                  <Star key={j} className="h-4 w-4 fill-accent text-accent" />
                ))}
              </div>

              <p className="text-sm text-foreground/80 mb-7 leading-relaxed">
                "{item.text}"
              </p>

              <div className="flex items-center gap-3">
                <img
                  src={item.avatar}
                  alt={item.name}
                  className="w-11 h-11 rounded-full object-cover ring-2 ring-border"
                  loading="lazy"
                />
                <div>
                  <div className="text-sm font-semibold flex items-center gap-1.5">
                    {item.name}
                    {item.verified && <BadgeCheck className="h-3.5 w-3.5 text-primary" />}
                  </div>
                  <div className="text-xs text-muted-foreground">{item.location}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Aggregate rating */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <div className="inline-flex items-center gap-3 bg-card border border-border rounded-full px-6 py-3 shadow-sm">
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-accent text-accent" />
              ))}
            </div>
            <span className="text-sm font-semibold">4.9/5</span>
            <span className="text-xs text-muted-foreground">baseado em 2.500+ avaliações</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
