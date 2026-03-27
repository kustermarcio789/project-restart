import { MapPin } from 'lucide-react';

interface Neighborhood {
  name: string;
  description: string;
  avg_rent: string;
  profile: string;
}

interface Props { neighborhoods: Neighborhood[] }

export const NeighborhoodsSection = ({ neighborhoods }: Props) => (
  <section className="py-12 sm:py-16 bg-secondary/30">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-8">🏘️ Bairros Recomendados</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {neighborhoods.map((n) => (
          <div key={n.name} className="glass-panel rounded-2xl p-6 hover:border-primary/30 transition-colors">
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-foreground">{n.name}</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-3">{n.description}</p>
            <div className="flex items-center justify-between text-xs">
              <span className="bg-primary/10 text-primary px-2 py-1 rounded-full">{n.profile}</span>
              {n.avg_rent && <span className="text-muted-foreground">Aluguel: {n.avg_rent}</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);
