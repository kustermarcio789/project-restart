import { AlertTriangle } from 'lucide-react';

interface Scam { title: string; description: string }
interface Props { scams: Scam[] }

export const ScamAlertsSection = ({ scams }: Props) => (
  <section className="py-12 sm:py-16">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-6">⚠️ Golpes Comuns</h2>
      <div className="space-y-4">
        {scams.map((scam) => (
          <div key={scam.title} className="glass-panel rounded-2xl p-5 border-destructive/20 hover:border-destructive/40 transition-colors">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-foreground mb-1">{scam.title}</h3>
                <p className="text-sm text-muted-foreground">{scam.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);
