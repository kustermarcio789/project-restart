import type { Destination } from '@/hooks/useDestination';

interface Props { destination: Destination }

export const CostOfLivingSection = ({ destination }: Props) => {
  if (!destination.cost_of_living_index) return null;

  return (
    <section className="py-12 sm:py-16 bg-secondary/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-6">🏠 Custo de Vida</h2>
        <div className="glass-panel rounded-2xl p-6 sm:p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="text-4xl font-bold text-primary">{destination.cost_of_living_index}</div>
            <div>
              <p className="text-sm text-muted-foreground">Índice de custo de vida</p>
              <p className="text-xs text-muted-foreground">(Brasil = 100)</p>
            </div>
          </div>
          <div className="w-full bg-muted rounded-full h-3 mb-4">
            <div
              className="h-3 rounded-full bg-gradient-to-r from-primary to-accent transition-all duration-1000"
              style={{ width: `${Math.min(destination.cost_of_living_index, 200) / 2}%` }}
            />
          </div>
          <p className="text-sm text-muted-foreground">
            {destination.cost_of_living_index > 100
              ? `${destination.name} é ${Math.round(destination.cost_of_living_index - 100)}% mais caro que o Brasil em média.`
              : `${destination.name} é ${Math.round(100 - destination.cost_of_living_index)}% mais barato que o Brasil em média.`}
          </p>
        </div>
      </div>
    </section>
  );
};
