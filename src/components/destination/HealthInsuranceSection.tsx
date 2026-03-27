import { Heart } from 'lucide-react';
import type { Destination } from '@/hooks/useDestination';

interface Props { destination: Destination }

export const HealthInsuranceSection = ({ destination }: Props) => {
  if (!destination.healthcare_info) return null;

  return (
    <section className="py-12 sm:py-16 bg-secondary/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-6">🏥 Saúde & Seguro Viagem</h2>
        <div className="glass-panel rounded-2xl p-6 sm:p-8">
          <div className="flex items-start gap-3">
            <Heart className="h-6 w-6 text-destructive shrink-0 mt-1" />
            <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{destination.healthcare_info}</p>
          </div>
          {destination.avg_insurance_price && (
            <div className="mt-6 p-4 rounded-xl bg-primary/10 border border-primary/20">
              <p className="text-sm text-foreground">
                💡 Seguro viagem a partir de <strong className="text-primary">R$ {destination.avg_insurance_price.toLocaleString('pt-BR')}</strong> por semana.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
