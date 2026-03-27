import { motion } from 'framer-motion';
import { MapPin, Globe, DollarSign, Shield, Thermometer } from 'lucide-react';
import type { Destination } from '@/hooks/useDestination';

interface Props { destination: Destination }

export const DestinationHero = ({ destination }: Props) => (
  <section className="relative overflow-hidden">
    <div className="absolute inset-0">
      <img
        src={destination.hero_image || 'https://images.unsplash.com/photo-1488085061387-422e29b40080?w=1920&q=80'}
        alt={`${destination.name} - paisagem`}
        className="w-full h-full object-cover"
        loading="eager"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
    </div>
    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 sm:pt-20 sm:pb-28">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <div className="flex items-center gap-2 text-primary mb-4">
          <MapPin className="h-5 w-5" />
          <span className="text-sm font-medium uppercase tracking-wider">{destination.continent}</span>
        </div>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-4">
          Viajar para <span className="gradient-text">{destination.name}</span>
        </h1>
        <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mb-8">
          {destination.description || `Guia completo para viajar para ${destination.name}: custos, documentos, dicas e muito mais.`}
        </p>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-3xl">
          {destination.currency && (
            <div className="glass-panel rounded-xl p-3 sm:p-4 text-center">
              <DollarSign className="h-5 w-5 text-primary mx-auto mb-1" />
              <p className="text-xs text-muted-foreground">Moeda</p>
              <p className="text-sm font-semibold text-foreground">{destination.currency}</p>
            </div>
          )}
          {destination.language && (
            <div className="glass-panel rounded-xl p-3 sm:p-4 text-center">
              <Globe className="h-5 w-5 text-primary mx-auto mb-1" />
              <p className="text-xs text-muted-foreground">Idioma</p>
              <p className="text-sm font-semibold text-foreground">{destination.language}</p>
            </div>
          )}
          {destination.safety_index !== null && (
            <div className="glass-panel rounded-xl p-3 sm:p-4 text-center">
              <Shield className="h-5 w-5 text-primary mx-auto mb-1" />
              <p className="text-xs text-muted-foreground">Segurança</p>
              <p className="text-sm font-semibold text-foreground">{destination.safety_index}/10</p>
            </div>
          )}
          {destination.visa_required !== null && (
            <div className="glass-panel rounded-xl p-3 sm:p-4 text-center">
              <Thermometer className="h-5 w-5 text-primary mx-auto mb-1" />
              <p className="text-xs text-muted-foreground">Visto</p>
              <p className="text-sm font-semibold text-foreground">{destination.visa_required ? 'Necessário' : 'Isento'}</p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  </section>
);
