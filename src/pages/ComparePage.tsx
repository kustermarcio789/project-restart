import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Header } from '@/components/landing/Header';
import { Footer } from '@/components/landing/Footer';
import { SEOHead } from '@/components/shared/SEOHead';
import { JsonLd, buildBreadcrumbSchema } from '@/components/shared/JsonLd';
import { StickyCTA } from '@/components/shared/StickyCTA';
import { StickyWhatsApp } from '@/components/shared/StickyWhatsApp';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Check, X, ArrowRight, Globe, DollarSign, Shield, Thermometer, Plane } from 'lucide-react';

const useCompareDestinations = (slugA: string, slugB: string) =>
  useQuery({
    queryKey: ['compare', slugA, slugB],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('destinations')
        .select('*')
        .in('slug', [slugA, slugB])
        .eq('status', 'published');
      if (error) throw error;
      const a = data?.find((d) => d.slug === slugA);
      const b = data?.find((d) => d.slug === slugB);
      return { a: a || null, b: b || null };
    },
    enabled: !!slugA && !!slugB,
  });

const ComparePage = () => {
  const { slugs } = useParams<{ slugs: string }>();
  const navigate = useNavigate();
  const parts = (slugs || '').split('-vs-');
  const slugA = parts[0] || '';
  const slugB = parts[1] || '';
  const { data, isLoading } = useCompareDestinations(slugA, slugB);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-5xl mx-auto px-4 pt-28 pb-20 space-y-6">
          <Skeleton className="h-10 w-2/3 mx-auto" />
          <div className="grid grid-cols-2 gap-6">
            <Skeleton className="h-64 rounded-2xl" />
            <Skeleton className="h-64 rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!data?.a || !data?.b) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-5xl mx-auto px-4 pt-28 pb-20 text-center">
          <h1 className="text-3xl font-bold text-foreground mb-4">Comparação não disponível</h1>
          <p className="text-muted-foreground mb-8">Um ou ambos os destinos não foram encontrados.</p>
          <Link to="/" className="text-primary hover:underline">Voltar ao início</Link>
        </div>
        <Footer />
      </div>
    );
  }

  const { a, b } = data;

  const rows = [
    { label: 'País', icon: Globe, valA: a.country, valB: b.country },
    { label: 'Moeda', icon: DollarSign, valA: a.currency || '—', valB: b.currency || '—' },
    { label: 'Idioma', icon: Globe, valA: a.language || '—', valB: b.language || '—' },
    { label: 'Fuso Horário', icon: Globe, valA: a.timezone || '—', valB: b.timezone || '—' },
    { label: 'Custo de Vida (índice)', icon: DollarSign, valA: a.cost_of_living_index ? `${a.cost_of_living_index}/100` : '—', valB: b.cost_of_living_index ? `${b.cost_of_living_index}/100` : '—' },
    { label: 'Segurança (índice)', icon: Shield, valA: a.safety_index ? `${a.safety_index}/100` : '—', valB: b.safety_index ? `${b.safety_index}/100` : '—' },
    { label: 'Visto Necessário', icon: Shield, valA: a.visa_required ? 'Sim' : 'Não', valB: b.visa_required ? 'Sim' : 'Não', highlight: true },
    { label: 'Voo (média R$)', icon: Plane, valA: a.avg_flight_price ? `R$ ${a.avg_flight_price}` : '—', valB: b.avg_flight_price ? `R$ ${b.avg_flight_price}` : '—' },
    { label: 'Hotel/noite (média R$)', icon: DollarSign, valA: a.avg_hotel_price ? `R$ ${a.avg_hotel_price}` : '—', valB: b.avg_hotel_price ? `R$ ${b.avg_hotel_price}` : '—' },
    { label: 'Seguro Viagem (média R$)', icon: Shield, valA: a.avg_insurance_price ? `R$ ${a.avg_insurance_price}` : '—', valB: b.avg_insurance_price ? `R$ ${b.avg_insurance_price}` : '—' },
  ];

  const title = `${a.name} vs ${b.name}: Comparativo Completo`;
  const description = `Compare ${a.name} e ${b.name}. Custo de vida, visto, segurança, clima e mais. Descubra qual destino é ideal para você.`;

  return (
    <div className="min-h-screen bg-background">
      <SEOHead title={title} description={description} canonical={`https://decolandoemviagens.com/comparar/${slugs}`} />
      <JsonLd
        data={buildBreadcrumbSchema([
          { name: 'Início', url: 'https://decolandoemviagens.com' },
          { name: 'Comparar Destinos', url: 'https://decolandoemviagens.com/comparar' },
          { name: `${a.name} vs ${b.name}`, url: `https://decolandoemviagens.com/comparar/${slugs}` },
        ])}
      />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: title,
          description,
          url: `https://decolandoemviagens.com/comparar/${slugs}`,
        }}
      />

      <Header />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20">
        {/* Breadcrumb */}
        <nav className="mb-6" aria-label="Breadcrumb">
          <ol className="flex items-center gap-2 text-sm text-muted-foreground">
            <li><Link to="/" className="hover:text-primary transition-colors">Início</Link></li>
            <li>/</li>
            <li className="text-foreground font-medium">{a.name} vs {b.name}</li>
          </ol>
        </nav>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            <span className="gradient-text">{a.name}</span> vs <span className="gradient-text">{b.name}</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{description}</p>
        </motion.div>

        {/* Comparison Table */}
        <div className="glass-panel rounded-2xl overflow-hidden">
          {/* Header row */}
          <div className="grid grid-cols-3 border-b border-border">
            <div className="p-4 font-semibold text-muted-foreground text-sm">Critério</div>
            <div className="p-4 text-center font-bold text-foreground border-x border-border">
              <Link to={`/destino/${a.slug}`} className="hover:text-primary transition-colors">{a.name}</Link>
            </div>
            <div className="p-4 text-center font-bold text-foreground">
              <Link to={`/destino/${b.slug}`} className="hover:text-primary transition-colors">{b.name}</Link>
            </div>
          </div>
          {rows.map((row, i) => (
            <div key={row.label} className={`grid grid-cols-3 ${i < rows.length - 1 ? 'border-b border-border' : ''}`}>
              <div className="p-4 flex items-center gap-2 text-sm font-medium text-foreground">
                <row.icon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                {row.label}
              </div>
              <div className="p-4 text-center text-sm text-muted-foreground border-x border-border">
                {row.highlight && row.valA === 'Não' ? (
                  <span className="text-primary font-medium flex items-center justify-center gap-1"><Check className="h-4 w-4" /> Dispensado</span>
                ) : row.highlight && row.valA === 'Sim' ? (
                  <span className="text-destructive font-medium flex items-center justify-center gap-1"><X className="h-4 w-4" /> Necessário</span>
                ) : row.valA}
              </div>
              <div className="p-4 text-center text-sm text-muted-foreground">
                {row.highlight && row.valB === 'Não' ? (
                  <span className="text-primary font-medium flex items-center justify-center gap-1"><Check className="h-4 w-4" /> Dispensado</span>
                ) : row.highlight && row.valB === 'Sim' ? (
                  <span className="text-destructive font-medium flex items-center justify-center gap-1"><X className="h-4 w-4" /> Necessário</span>
                ) : row.valB}
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-panel rounded-2xl p-8 text-center mt-12 border-primary/20"
        >
          <h2 className="text-2xl font-bold text-foreground mb-3">Ainda em dúvida? A gente te ajuda!</h2>
          <p className="text-muted-foreground mb-6">Receba uma cotação personalizada para {a.name} ou {b.name}.</p>
          <Link
            to="/cotacao"
            className="inline-flex items-center gap-2 gradient-btn text-primary-foreground px-8 py-3 rounded-full font-semibold"
          >
            Solicitar Cotação Gratuita <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>

        {/* Internal links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-10">
          <Link to={`/destino/${a.slug}`} className="glass-panel rounded-xl p-5 hover:border-primary/30 transition-all group">
            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
              Guia completo: {a.name}
            </h3>
            <p className="text-sm text-muted-foreground mt-1">Visto, custo de vida, bairros, clima e mais.</p>
          </Link>
          <Link to={`/destino/${b.slug}`} className="glass-panel rounded-xl p-5 hover:border-primary/30 transition-all group">
            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
              Guia completo: {b.name}
            </h3>
            <p className="text-sm text-muted-foreground mt-1">Visto, custo de vida, bairros, clima e mais.</p>
          </Link>
        </div>
      </div>

      <Footer />
      <StickyWhatsApp message={`Olá! Estou comparando ${a.name} e ${b.name} e quero ajuda.`} />
      <StickyCTA text="Solicitar Cotação" onClick={() => navigate('/cotacao')} />
    </div>
  );
};

export default ComparePage;
