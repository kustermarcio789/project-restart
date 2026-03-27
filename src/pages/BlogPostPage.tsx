import { useParams, Link } from 'react-router-dom';
import { useBlogPost, useBlogPosts } from '@/hooks/useBlog';
import { Header } from '@/components/landing/Header';
import { Footer } from '@/components/landing/Footer';
import { SEOHead } from '@/components/shared/SEOHead';
import { JsonLd, buildBreadcrumbSchema, buildFAQSchema } from '@/components/shared/JsonLd';
import { StickyWhatsApp } from '@/components/shared/StickyWhatsApp';
import { StickyCTA } from '@/components/shared/StickyCTA';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Calendar, User, Tag, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const estimateReadTime = (content: string | null) => {
  if (!content) return 1;
  return Math.max(1, Math.ceil(content.split(/\s+/).length / 200));
};

const BlogPostPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: post, isLoading, error } = useBlogPost(slug || '');
  const { data: relatedPosts } = useBlogPosts(post?.category || undefined);
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-3xl mx-auto px-4 py-20 space-y-6">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-[300px] rounded-2xl" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-32 text-center">
          <h1 className="text-3xl font-bold text-foreground mb-4">Artigo não encontrado</h1>
          <p className="text-muted-foreground mb-8">O artigo que você procura não existe ou foi removido.</p>
          <Link to="/blog" className="text-primary hover:underline inline-flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" /> Voltar ao Blog
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const readTime = estimateReadTime(post.content);
  const related = (relatedPosts || []).filter((p) => p.slug !== post.slug).slice(0, 3);

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.seo_description || post.excerpt || '',
    image: post.cover_image || 'https://images.unsplash.com/photo-1488085061387-422e29b40080?w=1200&q=80',
    datePublished: post.published_at,
    author: {
      '@type': 'Person',
      name: post.author_name || 'Equipe Decolando',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Decolando em Viagens',
      url: 'https://decolandoemviagens.com',
    },
    mainEntityOfPage: `https://decolandoemviagens.com/blog/${post.slug}`,
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title={post.seo_title || post.title}
        description={post.seo_description || post.excerpt || `Leia ${post.title} no blog Decolando em Viagens.`}
        canonical={`https://decolandoemviagens.com/blog/${post.slug}`}
        ogImage={post.cover_image || undefined}
        ogType="article"
      />
      <JsonLd data={articleSchema} />
      <JsonLd
        data={buildBreadcrumbSchema([
          { name: 'Início', url: 'https://decolandoemviagens.com' },
          { name: 'Blog', url: 'https://decolandoemviagens.com/blog' },
          { name: post.title, url: `https://decolandoemviagens.com/blog/${post.slug}` },
        ])}
      />

      <Header />

      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
        {/* Breadcrumb */}
        <nav className="mb-6" aria-label="Breadcrumb">
          <ol className="flex items-center gap-2 text-sm text-muted-foreground">
            <li><Link to="/" className="hover:text-primary transition-colors">Início</Link></li>
            <li>/</li>
            <li><Link to="/blog" className="hover:text-primary transition-colors">Blog</Link></li>
            <li>/</li>
            <li className="text-foreground font-medium line-clamp-1">{post.title}</li>
          </ol>
        </nav>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          {/* Meta */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
            {post.category && (
              <span className="inline-flex items-center gap-1 text-primary font-medium uppercase tracking-wider text-xs">
                <Tag className="h-3 w-3" />
                {post.category}
              </span>
            )}
            {post.published_at && (
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                {format(new Date(post.published_at), "d 'de' MMMM 'de' yyyy", { locale: ptBR })}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {readTime} min de leitura
            </span>
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
            {post.title}
          </h1>

          {/* Author */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">{post.author_name || 'Equipe Decolando'}</p>
              <p className="text-xs text-muted-foreground">Decolando em Viagens</p>
            </div>
          </div>

          {/* Cover Image */}
          {post.cover_image && (
            <div className="rounded-2xl overflow-hidden mb-10">
              <img
                src={post.cover_image}
                alt={post.title}
                className="w-full aspect-video object-cover"
                loading="eager"
              />
            </div>
          )}

          {/* Content */}
          <div
            className="prose prose-lg max-w-none
              prose-headings:text-foreground prose-headings:font-bold
              prose-p:text-muted-foreground prose-p:leading-relaxed
              prose-a:text-primary prose-a:no-underline hover:prose-a:underline
              prose-strong:text-foreground
              prose-ul:text-muted-foreground prose-ol:text-muted-foreground
              prose-blockquote:border-primary prose-blockquote:text-muted-foreground
              prose-img:rounded-xl"
            dangerouslySetInnerHTML={{ __html: post.content || '' }}
          />

          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-10 pt-6 border-t border-border">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-full bg-secondary text-xs font-medium text-muted-foreground"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </motion.div>

        {/* CTA inline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-panel rounded-2xl p-6 sm:p-8 border-primary/20 text-center mt-12"
        >
          <h3 className="text-xl font-bold text-foreground mb-2">
            ✈️ Planeje sua viagem com a gente
          </h3>
          <p className="text-muted-foreground mb-4">
            Receba uma cotação gratuita e personalizada em até 24h.
          </p>
          <Link
            to="/cotacao"
            className="inline-flex items-center gap-2 gradient-btn text-primary-foreground px-6 py-3 rounded-full font-semibold"
          >
            Solicitar Cotação Gratuita
          </Link>
        </motion.div>

        {/* Related Posts */}
        {related.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl font-bold text-foreground mb-6">Artigos Relacionados</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {related.map((rp) => (
                <Link
                  key={rp.id}
                  to={`/blog/${rp.slug}`}
                  className="group glass-panel rounded-xl overflow-hidden hover:border-primary/30 transition-all"
                >
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={rp.cover_image || 'https://images.unsplash.com/photo-1488085061387-422e29b40080?w=400&q=80'}
                      alt={rp.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                      {rp.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </article>

      <Footer />
      <StickyWhatsApp message="Olá! Li um artigo no blog e quero saber mais." />
      <StickyCTA text="Solicitar Cotação" onClick={() => navigate('/cotacao')} />
    </div>
  );
};

export default BlogPostPage;
