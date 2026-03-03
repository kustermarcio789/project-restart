import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const testimonials = [
  { name: 'Maria Silva', location: 'São Paulo, BR', rating: 5, text: 'Experiência incrível! A equipe cuidou de tudo, desde o voo até o hotel. Recomendo demais!', avatar: 'https://i.pravatar.cc/100?img=1' },
  { name: 'John Smith', location: 'New York, US', rating: 5, text: 'Best travel agency I\'ve ever used. The attention to detail was amazing. Will definitely book again!', avatar: 'https://i.pravatar.cc/100?img=3' },
  { name: 'Ana García', location: 'Madrid, ES', rating: 5, text: '¡Servicio excepcional! Todo fue perfecto, desde la planificación hasta el regreso. Muy recomendable.', avatar: 'https://i.pravatar.cc/100?img=5' },
];

export const TestimonialsSection = () => {
  const { t } = useLanguage();

  return (
    <section className="py-20 sm:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">{t('test.title')}</h2>
          <p className="text-muted-foreground text-lg">{t('test.subtitle')}</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="glass-card p-6"
            >
              <div className="flex gap-1 mb-4">
                {Array.from({ length: item.rating }).map((_, j) => (
                  <Star key={j} className="h-4 w-4 fill-primary text-primary" />
                ))}
              </div>
              <p className="text-sm text-muted-foreground mb-6 leading-relaxed">"{item.text}"</p>
              <div className="flex items-center gap-3">
                <img src={item.avatar} alt={item.name} className="w-10 h-10 rounded-full object-cover" loading="lazy" />
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
