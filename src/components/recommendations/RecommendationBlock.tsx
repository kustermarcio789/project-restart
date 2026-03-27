import { usePopularDestinations } from '@/hooks/useRecommendations';
import { motion } from 'framer-motion';
import { MapPin, ArrowRight, TrendingUp, Sparkles, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface RecommendationBlockProps {
  title?: string;
  subtitle?: string;
  type?: 'popular' | 'cost_benefit' | 'personalized';
  maxItems?: number;
}

const typeConfig = {
  popular: { icon: TrendingUp, badge: 'Mais Procurado', color: 'text-primary' },
  cost_benefit: { icon: DollarSign, badge: 'Melhor Custo-Benefício', color: 'text-accent' },
  personalized: { icon: Sparkles, badge: 'Para Você', color: 'text-primary' },
};

export const RecommendationBlock = ({
  title = 'Destinos Recomendados',
  subtitle = 'Baseado nas tendências e preferências dos viajantes',
  type = 'popular',
  maxItems = 6,
}: RecommendationBlockProps) => {
  const { data: destinations, isLoading } = usePopularDestinations();
  const navigate = useNavigate();
  const config = typeConfig[type];
  const Icon = config.icon;

  if (isLoading) {
    return (
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="h-8 w-64 bg-muted rounded animate-pulse mb-6" />
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Array.from({ length: maxItems }).map((_, i) => (
              <div key={i} className="h-48 bg-muted rounded-2xl animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!destinations?.length) return null;

  return (
    <section className="py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <Icon className={`h-6 w-6 ${config.color}`} />
              {title}
            </h2>
            <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
          </div>
          <Button variant="ghost" onClick={() => navigate('/cotacao')} className="gap-1 text-sm">
            Ver todos <ArrowRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {destinations.slice(0, maxItems).map((dest, i) => (
            <motion.button
              key={dest.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              onClick={() => navigate(`/destino/${dest.slug}`)}
              className="group relative rounded-2xl overflow-hidden h-48 text-left"
            >
              {dest.hero_image ? (
                <img
                  src={dest.hero_image}
                  alt={dest.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

              {/* Badge */}
              <div className="absolute top-3 left-3">
                <span className="text-[10px] font-bold bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
                  {config.badge}
                </span>
              </div>

              {/* Price */}
              {dest.avg_flight_price && (
                <div className="absolute top-3 right-3">
                  <span className="text-xs font-bold bg-black/50 text-white px-2 py-0.5 rounded-full">
                    R$ {dest.avg_flight_price.toLocaleString('pt-BR')}
                  </span>
                </div>
              )}

              {/* Info */}
              <div className="absolute bottom-3 left-3 right-3">
                <div className="flex items-center gap-1 text-white">
                  <MapPin className="h-3 w-3" />
                  <span className="font-bold text-sm">{dest.name}</span>
                </div>
                <span className="text-white/80 text-xs">{dest.country}</span>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
};
