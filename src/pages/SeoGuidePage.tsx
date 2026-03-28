import { Link, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Header } from '@/components/landing/Header';
import { Footer } from '@/components/landing/Footer';
import { SEOHead } from '@/components/shared/SEOHead';
import { JsonLd, buildBreadcrumbSchema, buildFAQSchema } from '@/components/shared/JsonLd';
import { StickyWhatsApp } from '@/components/shared/StickyWhatsApp';
import { StickyCTA } from '@/components/shared/StickyCTA';
import { getSeoGuidePageBySlug } from '@/lib/seoPages';
import { ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';

const SeoGuidePage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const page = getSeoGuidePageBySlug(slug || '');

  if (!page) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 text-center">
          <h1 className="text-4xl font-bold text-foreground mb-4">Guia não encontrado</h1>
          <p className="text-muted-foreground text-lg mb-8">
            O conteúdo que você tentou acessar não está disponível no momento. Volte ao hub de guias para continuar navegando.
          </p>
          <Link
            to="/guias"
            className="inline-flex items-center gap-2 gradient-btn rounded-full px-6 py-3 text-primary-foreground font-semibold"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar para os guias
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: page.title,
    description: page.description,
    author: {
      '@type': 'Organization',
      name: 'Decolando em Viagens',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Decolando em Viagens',
      url: 'https://www.decolandoemviagens.com.br/',
    },
    mainEntityOfPage: page.canonical,
    keywords: page.keywords.join(', '),
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead title={page.title} description={page.description} canonical={page.canonical} ogType="article" />
      <JsonLd data={articleSchema} />
      <JsonLd data={buildFAQSchema(page.faq)} />
      <JsonLd
        data={buildBreadcrumbSchema([
          { name: 'Início', url: 'https://www.decolandoemviagens.com.br/' },
          { name: 'Guias', url: 'https://www.decolandoemviagens.com.br/guias' },
          { name: page.title, url: page.canonical },
        ])}
      />

      <Header />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20">
        <nav className="mb-6" aria-label="Breadcrumb">
          <ol className="flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
            <li>
              <Link to="/" className="hover:text-primary transition-colors">
                Início
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link to="/guias" className="hover:text-primary transition-colors">
                Guias
              </Link>
            </li>
            <li>/</li>
            <li className="text-foreground font-medium line-clamp-1">{page.title}</li>
          </ol>
        </nav>

        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel rounded-3xl p-8 md:p-12 border-primary/20 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 pointer-events-none" />
          <div className="relative max-w-4xl">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-5">
              {page.heroTag}
            </span>
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground leading-tight mb-5">{page.title}</h1>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">{page.description}</p>
            <div className="flex flex-wrap gap-2 mb-8">
              {page.keywords.map((keyword) => (
                <span key={keyword} className="px-3 py-1 rounded-full bg-secondary text-xs text-muted-foreground">
                  {keyword}
                </span>
              ))}
            </div>
            <div className="flex flex-wrap gap-3">
              <Link to={page.ctaPrimaryHref} className="gradient-btn rounded-full px-6 py-3 font-semibold text-primary-foreground">
                {page.ctaPrimaryLabel}
              </Link>
              <Link
                to={page.ctaSecondaryHref}
                className="rounded-full px-6 py-3 font-semibold border border-border bg-card hover:border-primary/30 hover:text-primary transition-all"
              >
                {page.ctaSecondaryLabel}
              </Link>
            </div>
          </div>
        </motion.section>

        <section className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_320px] gap-8 mt-12">
          <article className="space-y-12">
            <section className="glass-panel rounded-2xl p-8">
              <div className="space-y-5 text-muted-foreground leading-relaxed text-base sm:text-lg">
                {page.intro.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </section>

            {page.sections.map((section, index) => (
              <motion.section
                key={section.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ delay: index * 0.05 }}
                className="glass-panel rounded-2xl p-8"
              >
                <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-5">{section.title}</h2>
                <div className="space-y-5 text-muted-foreground leading-relaxed">
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
                {section.bullets && section.bullets.length > 0 && (
                  <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-3">
                    {section.bullets.map((bullet) => (
                      <div key={bullet} className="flex items-start gap-3 rounded-xl border border-border/70 bg-card/50 px-4 py-4">
                        <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-muted-foreground leading-relaxed">{bullet}</p>
                      </div>
                    ))}
                  </div>
                )}
              </motion.section>
            ))}

            <section className="glass-panel rounded-2xl p-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-6">Perguntas frequentes</h2>
              <div className="space-y-4">
                {page.faq.map((item) => (
                  <div key={item.question} className="rounded-2xl border border-border/70 bg-card/50 p-5">
                    <h3 className="text-lg font-semibold text-foreground mb-2">{item.question}</h3>
                    <p className="text-muted-foreground leading-relaxed">{item.answer}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="glass-panel rounded-2xl p-8 border-primary/20">
              <h2 className="text-2xl font-bold text-foreground mb-3">{page.ctaTitle}</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">{page.ctaDescription}</p>
              <div className="flex flex-wrap gap-3">
                <Link to={page.ctaPrimaryHref} className="gradient-btn rounded-full px-6 py-3 font-semibold text-primary-foreground">
                  {page.ctaPrimaryLabel}
                </Link>
                <Link
                  to={page.ctaSecondaryHref}
                  className="inline-flex items-center gap-2 rounded-full px-6 py-3 font-semibold border border-border bg-card hover:border-primary/30 hover:text-primary transition-all"
                >
                  {page.ctaSecondaryLabel}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </section>
          </article>

          <aside className="space-y-6">
            <div className="glass-panel rounded-2xl p-6 sticky top-28">
              <h2 className="text-xl font-bold text-foreground mb-4">Leituras relacionadas</h2>
              <div className="space-y-4">
                {page.relatedLinks.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    className="block rounded-2xl border border-border/70 bg-card/50 p-4 hover:border-primary/30 transition-all"
                  >
                    <h3 className="font-semibold text-foreground mb-1">{link.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{link.description}</p>
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </section>
      </main>

      <Footer />
      <StickyWhatsApp message={`Olá! Quero ajuda com ${page.title.toLowerCase()}.`} />
      <StickyCTA text="Quero planejar minha viagem" onClick={() => navigate('/planejar')} />
    </div>
  );
};

export default SeoGuidePage;
