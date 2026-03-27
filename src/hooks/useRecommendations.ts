import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useEffect, useCallback } from 'react';

// Session ID for anonymous tracking
const getSessionId = () => {
  let id = sessionStorage.getItem('session_id');
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem('session_id', id);
  }
  return id;
};

export const useTrackBehavior = () => {
  const track = useCallback(async (
    eventType: string,
    entityType?: string,
    entitySlug?: string,
    metadata?: Record<string, unknown>
  ) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      await supabase.from('user_behavior').insert({
        user_id: user?.id || null,
        session_id: getSessionId(),
        event_type: eventType,
        entity_type: entityType || null,
        entity_slug: entitySlug || null,
        metadata: metadata || {},
      } as any);
    } catch {
      // Silent fail - tracking should not block UX
    }
  }, []);

  return { track };
};

interface Recommendation {
  id: string;
  rec_type: string;
  entity_type: string;
  entity_slug: string;
  score: number;
  reason: string;
}

export const useRecommendations = (recType?: string, entityType?: string) => {
  return useQuery({
    queryKey: ['recommendations', recType, entityType],
    queryFn: async () => {
      let query = supabase
        .from('recommendations')
        .select('*')
        .gt('expires_at', new Date().toISOString())
        .order('score', { ascending: false })
        .limit(8);

      if (recType) query = query.eq('rec_type', recType);
      if (entityType) query = query.eq('entity_type', entityType);

      const { data, error } = await query;
      if (error) throw error;
      return (data || []) as unknown as Recommendation[];
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const usePopularDestinations = () => {
  return useQuery({
    queryKey: ['popular-destinations'],
    queryFn: async () => {
      // Fallback: get featured destinations ordered by views
      const { data, error } = await supabase
        .from('destinations')
        .select('slug, name, country, hero_image, avg_flight_price, is_featured')
        .eq('status', 'published')
        .eq('is_featured', true)
        .order('name')
        .limit(6);
      if (error) throw error;
      return data || [];
    },
    staleTime: 10 * 60 * 1000,
  });
};
