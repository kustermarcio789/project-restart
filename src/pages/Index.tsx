import { useState } from 'react';
import { Header } from '@/components/landing/Header';
import { HeroSection } from '@/components/landing/HeroSection';
import { ServicesSection } from '@/components/landing/ServicesSection';
import { HowItWorks } from '@/components/landing/HowItWorks';
import { DestinationsSection } from '@/components/landing/DestinationsSection';
import { TestimonialsSection } from '@/components/landing/TestimonialsSection';
import { CTASection } from '@/components/landing/CTASection';
import { Footer } from '@/components/landing/Footer';
import { TravelerFlow } from '@/components/TravelerFlow';
import { RegistrationForm } from '@/components/RegistrationForm';
import { StickyWhatsApp } from '@/components/shared/StickyWhatsApp';
import { SEOHead } from '@/components/shared/SEOHead';
import { JsonLd, buildOrganizationSchema } from '@/components/shared/JsonLd';
import { RecommendationBlock } from '@/components/recommendations/RecommendationBlock';
import { Button } from '@/components/ui/button';
import { UserPlus, Handshake } from 'lucide-react';

const Index = () => {
  const [flowOpen, setFlowOpen] = useState(false);
  const [providerOpen, setProviderOpen] = useState(false);
  const [partnerOpen, setPartnerOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Decolando em Viagens | Plataforma Completa para Viajantes"
        description="Planeje sua viagem internacional com segurança. Voos, hotéis, seguro viagem, vistos e consultoria. Cotação gratuita em 24h."
      />
      <JsonLd data={buildOrganizationSchema()} />
      <Header />
      <HeroSection onStartFlow={() => setFlowOpen(true)} />
      <ServicesSection />
      <HowItWorks />
      <DestinationsSection />
      <RecommendationBlock
        title="Destinos Recomendados"
        subtitle="Os mais procurados pelos nossos viajantes"
        type="popular"
      />
      <TestimonialsSection />
      <CTASection onStartFlow={() => setFlowOpen(true)} />

      {/* Registration Buttons */}
      <section className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant="outline"
              size="lg"
              onClick={() => setProviderOpen(true)}
              className="glass-panel border-border rounded-full px-8 gap-2 hover:border-primary"
            >
              <UserPlus className="h-5 w-5" /> Cadastro de Prestador
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => setPartnerOpen(true)}
              className="glass-panel border-border rounded-full px-8 gap-2 hover:border-primary"
            >
              <Handshake className="h-5 w-5" /> Cadastro de Parceiro
            </Button>
          </div>
        </div>
      </section>

      <Footer />

      <StickyWhatsApp />

      {/* Modals */}
      <TravelerFlow open={flowOpen} onOpenChange={setFlowOpen} />
      <RegistrationForm open={providerOpen} onOpenChange={setProviderOpen} type="provider" />
      <RegistrationForm open={partnerOpen} onOpenChange={setPartnerOpen} type="partner" />
    </div>
  );
};

export default Index;
