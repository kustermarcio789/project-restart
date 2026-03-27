import { useParams, Link } from 'react-router-dom';
import { useDestination } from '@/hooks/useDestination';
import { Header } from '@/components/landing/Header';
import { Footer } from '@/components/landing/Footer';
import { SEOHead } from '@/components/shared/SEOHead';
import { JsonLd, buildDestinationSchema, buildFAQSchema, buildBreadcrumbSchema } from '@/components/shared/JsonLd';
import { StickyWhatsApp } from '@/components/shared/StickyWhatsApp';
import { StickyCTA } from '@/components/shared/StickyCTA';
import { DestinationHero } from '@/components/destination/DestinationHero';
import { DestinationOverview } from '@/components/destination/DestinationOverview';
import { CostOfLivingSection } from '@/components/destination/CostOfLivingSection';
import { VisaSection } from '@/components/destination/VisaSection';
import { ClimateSection } from '@/components/destination/ClimateSection';
import { NeighborhoodsSection } from '@/components/destination/NeighborhoodsSection';
import { HealthInsuranceSection } from '@/components/destination/HealthInsuranceSection';
import { TransportSection } from '@/components/destination/TransportSection';
import { ScamAlertsSection } from '@/components/destination/ScamAlertsSection';
import { DestinationFAQ } from '@/components/destination/DestinationFAQ';
import { DestinationCTA } from '@/components/destination/DestinationCTA';
import { LeadCaptureBlock } from '@/components/destination/LeadCaptureBlock';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft } from 'lucide-react';

const DestinationPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: destination, isLoading, error } = useDestination(slug || '');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-20 space-y-8">
          <Skeleton className="h-[400px] rounded-2xl" />
          <Skeleton className="h-8 w-1/2" />
          <Skeleton className="h-40" />
        </div>
      </div>
    );
  }

  if (error || !destination) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-32 text-center">
          <h1 className="text-3xl font-bold text-foreground mb-4">Destino não encontrado</h1>
          <p className="text-muted-foreground mb-8">O destino que você procura não existe ou não está disponível.</p>
          <Link to="/" className="text-primary hover:underline inline-flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" /> Voltar para a página inicial
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const faqs = (destination.faq as { question: string; answer: string }[]) || [];
  const neighborhoods = (destination.neighborhoods as { name: string; description: string; avg_rent: string; profile: string }[]) || [];
  const scams = (destination.common_scams as { title: string; description: string }[]) || [];

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title={destination.seo_title || `Viajar para ${destination.name}: Guia Completo 2026`}
        description={destination.seo_description || `Tudo sobre ${destination.name}: custo de vida, documentos, visto, bairros, clima e dicas. Planeje sua viagem com segurança.`}
        canonical={`https://decolandoemviagens.com/destino/${destination.slug}`}
        ogImage={destination.hero_image || undefined}
        ogType="article"
      />
      <JsonLd data={buildDestinationSchema({ name: destination.name, country: destination.country, description: destination.description || '', slug: destination.slug })} />
      {faqs.length > 0 && <JsonLd data={buildFAQSchema(faqs)} />}
      <JsonLd data={buildBreadcrumbSchema([
        { name: 'Início', url: 'https://decolandoemviagens.com' },
        { name: 'Destinos', url: 'https://decolandoemviagens.com/#destinos' },
        { name: destination.name, url: `https://decolandoemviagens.com/destino/${destination.slug}` },
      ])} />

      <Header />

      {/* Breadcrumb */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-2" aria-label="Breadcrumb">
        <ol className="flex items-center gap-2 text-sm text-muted-foreground">
          <li><Link to="/" className="hover:text-primary transition-colors">Início</Link></li>
          <li>/</li>
          <li className="text-foreground font-medium">{destination.name}</li>
        </ol>
      </nav>

      <DestinationHero destination={destination} />
      <DestinationOverview destination={destination} />
      
      {destination.visa_required !== null && <VisaSection destination={destination} />}
      <CostOfLivingSection destination={destination} />
      {neighborhoods.length > 0 && <NeighborhoodsSection neighborhoods={neighborhoods} />}
      <ClimateSection destination={destination} />
      <HealthInsuranceSection destination={destination} />
      <TransportSection destination={destination} />
      {destination.internet_info && (
        <section className="py-12 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-6">📶 Internet & Chip</h2>
            <div className="glass-panel rounded-2xl p-6 sm:p-8">
              <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{destination.internet_info}</p>
            </div>
          </div>
        </section>
      )}
      {scams.length > 0 && <ScamAlertsSection scams={scams} />}

      {/* Mid-page CTA */}
      <LeadCaptureBlock destinationSlug={destination.slug} destinationName={destination.name} />

      {faqs.length > 0 && <DestinationFAQ faqs={faqs} />}
      <DestinationCTA destinationName={destination.name} destinationSlug={destination.slug} />

      <Footer />

      <StickyWhatsApp message={`Olá! Quero informações sobre viajar para ${destination.name}.`} />
      <StickyCTA text={`Cotação para ${destination.name}`} />
    </div>
  );
};

export default DestinationPage;
