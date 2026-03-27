import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Destination {
  id: string;
  slug: string;
  name: string;
  country: string;
  continent: string;
  hero_image: string | null;
  description: string | null;
  cost_of_living_index: number | null;
  visa_required: boolean | null;
  visa_info: unknown;
  climate: unknown;
  neighborhoods: unknown;
  common_scams: unknown;
  documents_required: unknown;
  faq: unknown;
  avg_flight_price: number | null;
  avg_hotel_price: number | null;
  avg_insurance_price: number | null;
  is_featured: boolean | null;
  seo_title: string | null;
  seo_description: string | null;
  status: string;
}

export const useDestination = (slug: string) => {
  return useQuery({
    queryKey: ['destination', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('destinations')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'published')
        .maybeSingle();

      if (error) throw error;
      return data as unknown as Destination | null;
    },
    enabled: !!slug,
  });
};

export const useFeaturedDestinations = () => {
  return useQuery({
    queryKey: ['destinations', 'featured'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('destinations')
        .select('*')
        .eq('status', 'published')
        .eq('is_featured', true)
        .order('name');

      if (error) throw error;
      return (data ?? []) as unknown as Destination[];
    },
  });
};

export const useAllDestinations = () => {
  return useQuery({
    queryKey: ['destinations', 'all'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('destinations')
        .select('slug, name, country, continent, hero_image, avg_flight_price, is_featured, cost_of_living_index, visa_required')
        .eq('status', 'published')
        .order('name');

      if (error) throw error;
      return (data ?? []) as Partial<Destination>[];
    },
  });
};
