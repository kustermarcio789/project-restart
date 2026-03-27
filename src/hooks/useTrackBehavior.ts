import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface TrackOptions {
  entityType: 'destination' | 'service';
  entitySlug: string;
  eventType?: string;
}

export const useTrackBehavior = ({ entityType, entitySlug, eventType = 'page_view' }: TrackOptions) => {
  const { user } = useAuth();

  useEffect(() => {
    if (!entitySlug) return;

    const sessionId = sessionStorage.getItem('session_id') || crypto.randomUUID();
    sessionStorage.setItem('session_id', sessionId);

    supabase.from('user_behavior').insert({
      user_id: user?.id || null,
      session_id: sessionId,
      event_type: eventType,
      entity_type: entityType,
      entity_slug: entitySlug,
      metadata: {
        referrer: document.referrer || null,
        url: window.location.href,
      },
    }).then(({ error }) => {
      if (error) console.error('Track behavior error:', error);
    });
  }, [entitySlug, entityType, eventType, user?.id]);
};

export const trackEvent = async (
  eventType: string,
  entityType?: string,
  entitySlug?: string,
  metadata?: Record<string, string | number | boolean | null>
) => {
  const sessionId = sessionStorage.getItem('session_id') || crypto.randomUUID();
  sessionStorage.setItem('session_id', sessionId);

  await supabase.from('user_behavior').insert([{
    session_id: sessionId,
    event_type: eventType,
    entity_type: entityType || null,
    entity_slug: entitySlug || null,
    metadata: metadata || {},
  }]);
};
