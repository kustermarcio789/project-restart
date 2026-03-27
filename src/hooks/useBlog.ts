import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string | null;
  cover_image: string | null;
  category: string | null;
  tags: string[];
  author_name: string | null;
  destination_slug: string | null;
  service_slug: string | null;
  published_at: string | null;
  seo_title: string | null;
  seo_description: string | null;
  status: string;
}

export const useBlogPost = (slug: string) =>
  useQuery({
    queryKey: ['blog-post', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'published')
        .maybeSingle();
      if (error) throw error;
      return data
        ? ({ ...data, tags: (data.tags as unknown as string[]) || [] } as BlogPost)
        : null;
    },
    enabled: !!slug,
  });

export const useBlogPosts = (category?: string) =>
  useQuery({
    queryKey: ['blog-posts', category],
    queryFn: async () => {
      let q = supabase
        .from('blog_posts')
        .select('id, slug, title, excerpt, cover_image, category, tags, author_name, published_at, destination_slug, service_slug')
        .eq('status', 'published')
        .order('published_at', { ascending: false });

      if (category) q = q.eq('category', category);

      const { data, error } = await q;
      if (error) throw error;
      return (data ?? []).map((p) => ({
        ...p,
        tags: (p.tags as unknown as string[]) || [],
      })) as BlogPost[];
    },
  });

export const useBlogCategories = () =>
  useQuery({
    queryKey: ['blog-categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('category')
        .eq('status', 'published')
        .not('category', 'is', null);
      if (error) throw error;
      const cats = [...new Set((data ?? []).map((d) => d.category).filter(Boolean))] as string[];
      return cats;
    },
  });
