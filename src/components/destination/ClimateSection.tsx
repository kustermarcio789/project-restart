import type { Destination } from '@/hooks/useDestination';

interface Props { destination: Destination }

export const ClimateSection = ({ destination }: Props) => {
  const climate = destination.climate as Record<string, unknown> | null;
  if (!climate || Object.keys(climate).length === 0) return null;

  const bestTime = (climate as Record<string, string>).best_time;
  const avgTemp = (climate as Record<string, string>).avg_temp;
  const description = (climate as Record<string, string>).description;

  return (
    <section className="py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-6">🌤️ Clima</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {avgTemp && (
            <div className="glass-panel rounded-2xl p-6 text-center">
              <p className="text-3xl font-bold text-primary mb-1">{avgTemp}</p>
              <p className="text-sm text-muted-foreground">Temperatura média anual</p>
            </div>
          )}
          {bestTime && (
            <div className="glass-panel rounded-2xl p-6 text-center">
              <p className="text-lg font-bold text-foreground mb-1">{bestTime}</p>
              <p className="text-sm text-muted-foreground">Melhor época para visitar</p>
            </div>
          )}
          {description && (
            <div className="glass-panel rounded-2xl p-6">
              <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
