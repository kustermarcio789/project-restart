import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Header } from '@/components/landing/Header';
import { Footer } from '@/components/landing/Footer';
import { SEOHead } from '@/components/shared/SEOHead';
import { JsonLd, buildBreadcrumbSchema } from '@/components/shared/JsonLd';
import { StickyWhatsApp } from '@/components/shared/StickyWhatsApp';
import { StickyCTA } from '@/components/shared/StickyCTA';
import { seoGuideCategories, seoGuidePages } from '@/lib/seoPages';
import { BookOpen, FileText, Globe2, Home, Plane, ArrowRight } from 'lucide-react';

const categoryIcons = {
  vistos: FileText,
  'morar-fora': Home,
  planejamento: BookOpen,
  documentacao: FileText,
  'viagem-internacional': Globe2,
} as const;

const GuidesHubPage = () => {
  const categoryCount = (slug: string) => seoGuidePages.filter((page) => page.category === slug).length;

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Guias de viagem, vistos e morar fora"
        description="Explore guias completos sobre vistos para brasileiros, documentação internacional, primeira viagem ao exterior, morar fora do Brasil e planejamento de viagens."
        canonical="https://www.decolandoemviagens.com.br/guias"
      />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: 'Guias de viagem e documentação',
          description:
            'Hub editorial com conteúdos sobre vistos, documentação, morar fora, planejamento de viagens nacionais e internacionais.',
          url: 'https://www.decolandoemviagens.com.br/guias',
        }}
      />
      <JsonLd
        data={buildBreadcrumbSchema([
          { name: 'Início', url: 'https://www.decolandoemviagens.com.br/' },
          { name: 'Guias', url: 'https://www.decolandoemviagens.com.br/guias' },
        ])}
      />

      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20">
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel rounded-3xl p-8 md:p-12 border-primary/20 overflow-hidden relative"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 pointer-events-none" />
          <div className="relative max-w-4xl">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-5">
              <Plane className="h-4 w-4" />
              Central de conteúdo para viajantes
            </span>
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground leading-tight mb-5">
              Guias estratégicos para <span className="gradient-text">viagens, vistos e vida internacional</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl leading-relaxed mb-8">
              Reunimos conteúdos práticos para brasileiros que estão planejando uma viagem internacional, organizando documentos,
              avaliando vistos ou pensando em morar fora do Brasil. O objetivo é ajudar você a tomar decisões com mais clareza,
              menos risco e melhor preparação.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/planejar" className="gradient-btn rounded-full px-6 py-3 font-semibold text-primary-foreground">
                Planejar viagem
              </Link>
              <Link
                to="/cotacao"
                className="rounded-full px-6 py-3 font-semibold border border-border bg-card hover:border-primary/30 hover:text-primary transition-all"
              >
                Solicitar cotação
              </Link>
            </div>
          </div>
        </motion.section>

        <section className="mt-16">
          <div className="flex items-end justify-between gap-4 mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Temas prioritários</h2>
              <p className="text-muted-foreground max-w-3xl">
                Conteúdos evergreen para capturar buscas de alta intenção e apoiar o planejamento real de viagem do usuário.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
            {seoGuideCategories.map((category, index) => {
              const Icon = categoryIcons[category.slug as keyof typeof categoryIcons] || BookOpen;
              return (
                <motion.div
                  key={category.slug}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.06 }}
                  className="glass-panel rounded-2xl p-6 h-full"
                >
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">{category.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4">{category.description}</p>
                  <span className="text-xs font-medium text-primary">
                    {categoryCount(category.slug)} conteúdo{categoryCount(category.slug) === 1 ? '' : 's'} disponível{categoryCount(category.slug) === 1 ? '' : 'is'}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </section>

        <section className="mt-16">
          <div className="flex items-end justify-between gap-4 mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Guias em destaque</h2>
              <p className="text-muted-foreground max-w-3xl">
                Páginas desenhadas para responder dúvidas recorrentes de quem busca orientação confiável sobre viagens e documentação.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {seoGuidePages.map((page, index) => (
              <motion.article
                key={page.slug}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="glass-panel rounded-2xl p-6 border-border/60 hover:border-primary/30 transition-all"
              >
                <div className="flex items-center justify-between gap-3 mb-4">
                  <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wide">
                    {page.heroTag}
                  </span>
                  <span className="text-xs text-muted-foreground uppercase tracking-wide">{page.category.replace('-', ' ')}</span>
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-3 leading-snug">{page.title}</h3>
                <p className="text-muted-foreground leading-relaxed mb-5">{page.description}</p>
                <div className="flex flex-wrap gap-2 mb-5">
                  {page.keywords.slice(0, 4).map((keyword) => (
                    <span key={keyword} className="px-3 py-1 rounded-full bg-secondary text-xs text-muted-foreground">
                      {keyword}
                    </span>
                  ))}
                </div>
                <Link to={`/guias/${page.slug}`} className="inline-flex items-center gap-2 font-semibold text-primary hover:gap-3 transition-all">
                  Ler guia completo
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </motion.article>
            ))}
          </div>
        </section>

        <section className="mt-16 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 glass-panel rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">Como usar este hub de conteúdo</h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                Se você está começando, vale abrir primeiro os conteúdos de documentação e vistos. Eles ajudam a evitar erros que normalmente
                acontecem antes mesmo da compra da passagem ou da reserva do hotel.
              </p>
              <p>
                Se a sua intenção é morar fora do Brasil, o ideal é combinar leitura de documentação, objetivo migratório, reserva financeira,
                cronograma de mudança e logística de viagem. Já para turismo, os guias de planejamento e primeira viagem internacional costumam
                ser o melhor ponto de partida.
              </p>
            </div>
          </div>
          <div className="glass-panel rounded-2xl p-8">
            <h2 className="text-xl font-bold text-foreground mb-4">Ações rápidas</h2>
            <div className="space-y-3">
              <Link to="/servico/vistos" className="block rounded-xl border border-border px-4 py-3 text-sm font-medium hover:border-primary/30 hover:text-primary transition-all">
                Conhecer o serviço de vistos
              </Link>
              <Link to="/servico/seguro-viagem" className="block rounded-xl border border-border px-4 py-3 text-sm font-medium hover:border-primary/30 hover:text-primary transition-all">
                Ver seguro viagem
              </Link>
              <Link to="/blog" className="block rounded-xl border border-border px-4 py-3 text-sm font-medium hover:border-primary/30 hover:text-primary transition-all">
                Explorar o blog de viagens
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <StickyWhatsApp message="Olá! Quero ajuda para organizar minha viagem ou entender a documentação necessária." />
      <StickyCTA text="Quero planejar minha viagem" onClick={() => (window.location.href = '/planejar')} />
    </div>
  );
};

export default GuidesHubPage;
