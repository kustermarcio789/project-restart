import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import type { ServiceFeature } from '@/hooks/useService';

interface Props {
  features: ServiceFeature[];
  serviceName: string;
}

export const ServiceFeatures = ({ features, serviceName }: Props) => {
  if (features.length === 0) return null;

  return (
    <section className="py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-8">
          ✅ Por que escolher nosso serviço de {serviceName}?
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-panel rounded-2xl p-6"
            >
              <CheckCircle2 className="h-6 w-6 text-primary mb-3" />
              <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
