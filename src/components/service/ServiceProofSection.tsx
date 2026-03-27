import { motion } from 'framer-motion';

export const ServiceProofSection = () => (
  <section className="py-12 sm:py-16">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
        {[
          { value: '50K+', label: 'Viajantes atendidos' },
          { value: '4.9★', label: 'Avaliação média' },
          { value: '24h', label: 'Tempo de resposta' },
          { value: '98%', label: 'Satisfação' },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="glass-panel rounded-2xl p-5"
          >
            <p className="text-2xl sm:text-3xl font-bold text-primary">{stat.value}</p>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);
