import { Plane, Hotel, Shield as ShieldIcon } from 'lucide-react';
import type { Destination } from '@/hooks/useDestination';

interface Props { destination: Destination }

export const DestinationOverview = ({ destination }: Props) => {
  const prices = [
    { label: 'Passagem aérea (ida e volta)', value: destination.avg_flight_price, icon: Plane },
    { label: 'Hotel (diária média)', value: destination.avg_hotel_price, icon: Hotel },
    { label: 'Seguro viagem (semanal)', value: destination.avg_insurance_price, icon: ShieldIcon },
  ].filter(p => p.value !== null);

  if (prices.length === 0) return null;

  return (
    <section className="py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-8">💰 Preços Médios</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          {prices.map(({ label, value, icon: Icon }) => (
            <div key={label} className="glass-panel rounded-2xl p-6 text-center hover:border-primary/30 transition-colors">
              <Icon className="h-8 w-8 text-primary mx-auto mb-3" />
              <p className="text-sm text-muted-foreground mb-2">{label}</p>
              <p className="text-2xl font-bold text-foreground">
                R$ {value?.toLocaleString('pt-BR', { minimumFractionDigits: 0 })}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
