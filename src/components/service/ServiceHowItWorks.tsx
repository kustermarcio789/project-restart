import { motion } from 'framer-motion';
import type { ServiceHowItWorks as HIW } from '@/hooks/useService';

interface Props {
  steps: HIW[];
}

export const ServiceHowItWorks = ({ steps }: Props) => {
  if (steps.length === 0) return null;

  return (
    <section className="py-12 sm:py-16 bg-secondary/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-8 text-center">
          🚀 Como Funciona
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {steps.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="text-center"
            >
              <div className="w-14 h-14 rounded-full gradient-btn flex items-center justify-center text-xl font-bold text-primary-foreground mx-auto mb-4">
                {s.step}
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">{s.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{s.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
