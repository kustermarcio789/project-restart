import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface ServiceFAQ {
  question: string;
  answer: string;
}

export interface ServiceFeature {
  title: string;
  description: string;
  icon?: string;
}

export interface ServiceHowItWorks {
  step: number;
  title: string;
  description: string;
}

export interface Service {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  icon: string | null;
  hero_image: string | null;
  features: ServiceFeature[];
  how_it_works: ServiceHowItWorks[];
  faq: ServiceFAQ[];
  display_order: number | null;
  seo_title: string | null;
  seo_description: string | null;
  status: string;
}

export const useService = (slug: string) => {
  return useQuery({
    queryKey: ['service', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'published')
        .maybeSingle();

      if (error) throw error;
      if (!data) return null;

      return {
        ...data,
        features: (data.features as unknown as ServiceFeature[]) || [],
        how_it_works: (data.how_it_works as unknown as ServiceHowItWorks[]) || [],
        faq: (data.faq as unknown as ServiceFAQ[]) || [],
      } as Service;
    },
    enabled: !!slug,
  });
};

export const useAllServices = () => {
  return useQuery({
    queryKey: ['services', 'all'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('services')
        .select('slug, name, description, icon, hero_image, display_order')
        .eq('status', 'published')
        .order('display_order');

      if (error) throw error;
      return (data ?? []) as Partial<Service>[];
    },
  });
};
