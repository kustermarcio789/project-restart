import { motion } from 'framer-motion';
import type { Service } from '@/hooks/useService';

interface Props {
  service: Service;
}

export const ServiceHero = ({ service }: Props) => (
  <section className="relative overflow-hidden">
    <div className="absolute inset-0">
      <img
        src={service.hero_image || 'https://images.unsplash.com/photo-1488085061387-422e29b40080?w=1920&q=80'}
        alt={`${service.name} - Decolando em Viagens`}
        className="w-full h-full object-cover"
        loading="eager"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/30" />
    </div>
    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 sm:pt-20 sm:pb-28">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <span className="inline-block text-primary text-sm font-semibold uppercase tracking-wider mb-3">
          Serviço
        </span>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-4">
          {service.name}
        </h1>
        <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl">
          {service.description || `Serviço profissional de ${service.name.toLowerCase()} para sua viagem.`}
        </p>
      </motion.div>
    </div>
  </section>
);
