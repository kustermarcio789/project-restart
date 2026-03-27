import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useBlogPosts, useBlogCategories } from '@/hooks/useBlog';
import { Header } from '@/components/landing/Header';
import { Footer } from '@/components/landing/Footer';
import { SEOHead } from '@/components/shared/SEOHead';
import { JsonLd, buildBreadcrumbSchema } from '@/components/shared/JsonLd';
import { Skeleton } from '@/components/ui/skeleton';
import { Calendar, User, Tag } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const BlogPage = () => {
  const [activeCategory, setActiveCategory] = useState<string | undefined>();
  const { data: posts, isLoading } = useBlogPosts(activeCategory);
  const { data: categories } = useBlogCategories();

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Blog de Viagens: Dicas, Guias e Roteiros"
        description="Dicas de viagem, guias de destinos, roteiros, documentação e tudo para planejar sua viagem. Conteúdo atualizado semanalmente."
        canonical="https://decolandoemviagens.com/blog"
      />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Blog',
          name: 'Blog Decolando em Viagens',
          description: 'Dicas, guias e roteiros de viagem para brasileiros.',
          url: 'https://decolandoemviagens.com/blog',
          publisher: {
            '@type': 'TravelAgency',
            name: 'Decolando em Viagens',
            url: 'https://decolandoemviagens.com',
          },
        }}
      />
      <JsonLd
        data={buildBreadcrumbSchema([
          { name: 'Início', url: 'https://decolandoemviagens.com' },
          { name: 'Blog', url: 'https://decolandoemviagens.com/blog' },
        ])}
      />

      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl sm:text-5xl font-bold text-foreground mb-4">
            Blog de <span className="gradient-text">Viagens</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Dicas, guias, roteiros e tudo que você precisa para planejar sua próxima viagem.
          </p>
        </motion.div>

        {/* Category Filter */}
        {categories && categories.length > 0 && (
          <div className="flex flex-wrap gap-2 justify-center mb-10">
            <button
              onClick={() => setActiveCategory(undefined)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                !activeCategory
                  ? 'gradient-btn text-primary-foreground'
                  : 'bg-secondary text-muted-foreground hover:text-foreground'
              }`}
            >
              Todos
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all capitalize ${
                  activeCategory === cat
                    ? 'gradient-btn text-primary-foreground'
                    : 'bg-secondary text-muted-foreground hover:text-foreground'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Posts Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="h-48 rounded-2xl" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
              </div>
            ))}
          </div>
        ) : posts && posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post, i) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link
                  to={`/blog/${post.slug}`}
                  className="group block glass-panel rounded-2xl overflow-hidden hover:border-primary/30 transition-all"
                >
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={post.cover_image || 'https://images.unsplash.com/photo-1488085061387-422e29b40080?w=600&q=80'}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-5">
                    {post.category && (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-primary uppercase tracking-wider mb-2">
                        <Tag className="h-3 w-3" />
                        {post.category}
                      </span>
                    )}
                    <h2 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
                      {post.title}
                    </h2>
                    {post.excerpt && (
                      <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
                        {post.excerpt}
                      </p>
                    )}
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      {post.author_name && (
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {post.author_name}
                        </span>
                      )}
                      {post.published_at && (
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {format(new Date(post.published_at), "d 'de' MMM, yyyy", { locale: ptBR })}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              </motion.article>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg">Nenhum artigo encontrado.</p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default BlogPage;
