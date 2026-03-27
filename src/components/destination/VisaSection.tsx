import { FileText, CheckCircle2, XCircle } from 'lucide-react';
import type { Destination } from '@/hooks/useDestination';

interface Props { destination: Destination }

export const VisaSection = ({ destination }: Props) => (
  <section className="py-12 sm:py-16">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-6">📄 Visto e Documentos</h2>
      <div className="glass-panel rounded-2xl p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-6">
          {destination.visa_required ? (
            <>
              <XCircle className="h-6 w-6 text-destructive" />
              <span className="text-lg font-semibold text-foreground">Visto obrigatório para brasileiros</span>
            </>
          ) : (
            <>
              <CheckCircle2 className="h-6 w-6 text-green-500" />
              <span className="text-lg font-semibold text-foreground">Brasileiros não precisam de visto para turismo</span>
            </>
          )}
        </div>
        {destination.documents_required && typeof destination.documents_required === 'object' && (
          <div className="space-y-3">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" /> Documentos necessários
            </h3>
            {Object.entries(destination.documents_required as Record<string, string>).map(([key, value]) => (
              <div key={key} className="flex items-start gap-3 p-3 rounded-lg bg-secondary/50">
                <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                <div>
                  <span className="font-medium text-foreground capitalize">{key.replace(/_/g, ' ')}</span>
                  <p className="text-sm text-muted-foreground">{value}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  </section>
);
