import { Bus } from 'lucide-react';
import type { Destination } from '@/hooks/useDestination';

interface Props { destination: Destination }

export const TransportSection = ({ destination }: Props) => {
  if (!destination.transport_info) return null;

  return (
    <section className="py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-6">🚌 Transporte Local</h2>
        <div className="glass-panel rounded-2xl p-6 sm:p-8">
          <div className="flex items-start gap-3">
            <Bus className="h-6 w-6 text-primary shrink-0 mt-1" />
            <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{destination.transport_info}</p>
          </div>
        </div>
      </div>
    </section>
  );
};
