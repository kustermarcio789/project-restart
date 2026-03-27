import { useParams, Link } from 'react-router-dom';
import { useService } from '@/hooks/useService';
import { Header } from '@/components/landing/Header';
import { Footer } from '@/components/landing/Footer';
import { SEOHead } from '@/components/shared/SEOHead';
import { JsonLd, buildBreadcrumbSchema, buildFAQSchema } from '@/components/shared/JsonLd';
import { StickyWhatsApp } from '@/components/shared/StickyWhatsApp';
import { StickyCTA } from '@/components/shared/StickyCTA';
import { ServiceHero } from '@/components/service/ServiceHero';
import { ServiceFeatures } from '@/components/service/ServiceFeatures';
import { ServiceHowItWorks } from '@/components/service/ServiceHowItWorks';
import { ServiceProofSection } from '@/components/service/ServiceProofSection';
import { ServiceLeadCapture } from '@/components/service/ServiceLeadCapture';
import { ServiceCTA } from '@/components/service/ServiceCTA';
import { DestinationFAQ } from '@/components/destination/DestinationFAQ';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ServicePage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: service, isLoading, error } = useService(slug || '');
  const navigate = useNavigate();

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

  if (error || !service) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-32 text-center">
          <h1 className="text-3xl font-bold text-foreground mb-4">Serviço não encontrado</h1>
          <p className="text-muted-foreground mb-8">O serviço que você procura não existe ou não está disponível.</p>
          <Link to="/" className="text-primary hover:underline inline-flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" /> Voltar para a página inicial
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.name,
    description: service.description || '',
    url: `https://decolandoemviagens.com/servico/${service.slug}`,
    provider: {
      '@type': 'TravelAgency',
      name: 'Decolando em Viagens',
      url: 'https://decolandoemviagens.com',
    },
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title={service.seo_title || `${service.name}: Serviço Profissional para Viajantes`}
        description={service.seo_description || `${service.name} com atendimento personalizado. Cotação gratuita em até 24h. Planeje sua viagem com segurança.`}
        canonical={`https://decolandoemviagens.com/servico/${service.slug}`}
        ogImage={service.hero_image || undefined}
        ogType="article"
      />
      <JsonLd data={serviceSchema} />
      {service.faq.length > 0 && <JsonLd data={buildFAQSchema(service.faq)} />}
      <JsonLd data={buildBreadcrumbSchema([
        { name: 'Início', url: 'https://decolandoemviagens.com' },
        { name: 'Serviços', url: 'https://decolandoemviagens.com/#services' },
        { name: service.name, url: `https://decolandoemviagens.com/servico/${service.slug}` },
      ])} />

      <Header />

      {/* Breadcrumb */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-2" aria-label="Breadcrumb">
        <ol className="flex items-center gap-2 text-sm text-muted-foreground">
          <li><Link to="/" className="hover:text-primary transition-colors">Início</Link></li>
          <li>/</li>
          <li className="text-foreground font-medium">{service.name}</li>
        </ol>
      </nav>

      <ServiceHero service={service} />
      <ServiceFeatures features={service.features} serviceName={service.name.toLowerCase()} />
      <ServiceHowItWorks steps={service.how_it_works} />
      <ServiceProofSection />

      {/* Mid-page Lead Capture */}
      <ServiceLeadCapture serviceSlug={service.slug} serviceName={service.name} />

      {service.faq.length > 0 && <DestinationFAQ faqs={service.faq} />}
      <ServiceCTA serviceName={service.name} serviceSlug={service.slug} />

      <Footer />

      <StickyWhatsApp message={`Olá! Preciso de informações sobre ${service.name}.`} />
      <StickyCTA
        text={`Cotação de ${service.name}`}
        onClick={() => navigate(`/cotacao?service=${service.slug}`)}
      />
    </div>
  );
};

export default ServicePage;
