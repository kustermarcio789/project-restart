import { createContext, useContext, useEffect, useState, useCallback, useRef, ReactNode } from 'react';
import { useSearchParams, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

interface UTMData {
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_content: string | null;
  utm_term: string | null;
  landing_page: string;
  referrer: string;
}

interface LeadTrackingContextType {
  utmData: UTMData;
  trackEvent: (eventType: string, metadata?: Record<string, any>) => void;
  trackFormStart: (formId: string) => void;
  trackFormAbandon: (formId: string) => void;
  setLeadId: (id: string) => void;
}

const LeadTrackingContext = createContext<LeadTrackingContextType | null>(null);

export const useLeadTracking = () => {
  const ctx = useContext(LeadTrackingContext);
  if (!ctx) throw new Error('useLeadTracking must be used within LeadTrackingProvider');
  return ctx;
};

// Session storage key for anonymous tracking
const SESSION_KEY = 'lt_session';
const LEAD_KEY = 'lt_lead_id';

function getSessionId() {
  let sid = sessionStorage.getItem(SESSION_KEY);
  if (!sid) {
    sid = crypto.randomUUID();
    sessionStorage.setItem(SESSION_KEY, sid);
  }
  return sid;
}

export const LeadTrackingProvider = ({ children }: { children: ReactNode }) => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const leadIdRef = useRef<string | null>(sessionStorage.getItem(LEAD_KEY));
  const lastPathRef = useRef(location.pathname);
  const sessionId = useRef(getSessionId());
  const pageViewsRef = useRef(0);

  const [utmData] = useState<UTMData>(() => ({
    utm_source: searchParams.get('utm_source'),
    utm_medium: searchParams.get('utm_medium'),
    utm_campaign: searchParams.get('utm_campaign'),
    utm_content: searchParams.get('utm_content'),
    utm_term: searchParams.get('utm_term'),
    landing_page: location.pathname,
    referrer: document.referrer || '',
  }));

  const [activeFormId, setActiveFormId] = useState<string | null>(null);

  const setLeadId = useCallback((id: string) => {
    leadIdRef.current = id;
    sessionStorage.setItem(LEAD_KEY, id);
  }, []);

  // Track event to lead_events table
  const trackEvent = useCallback(async (eventType: string, metadata?: Record<string, any>) => {
    if (!leadIdRef.current) return;
    try {
      await supabase.from('lead_events').insert({
        lead_id: leadIdRef.current,
        event_type: eventType,
        channel: 'web',
        description: metadata?.description || eventType,
        metadata: {
          ...metadata,
          session_id: sessionId.current,
          page: location.pathname,
          timestamp: new Date().toISOString(),
        },
      });
    } catch (e) {
      console.debug('[LeadTracking] Event failed:', e);
    }
  }, [location.pathname]);

  const trackFormStart = useCallback((formId: string) => {
    setActiveFormId(formId);
    trackEvent('start_quote', { form_id: formId, description: `Iniciou formulário: ${formId}` });
  }, [trackEvent]);

  const trackFormAbandon = useCallback((formId: string) => {
    setActiveFormId((prev) => {
      if (prev === formId) {
        trackEvent('abandon_quote', { form_id: formId, description: `Abandonou formulário: ${formId}` });
        return null;
      }
      return prev;
    });
  }, [trackEvent]);

  // Track page views and detect patterns
  useEffect(() => {
    if (location.pathname === lastPathRef.current) return;
    lastPathRef.current = location.pathname;
    pageViewsRef.current++;

    if (!leadIdRef.current) return;

    // Track specific page types
    if (location.pathname.startsWith('/destino/')) {
      const slug = location.pathname.split('/destino/')[1];
      trackEvent('view_destino', { slug, description: `Visualizou destino: ${slug}` });
    } else if (location.pathname.startsWith('/servico/')) {
      const slug = location.pathname.split('/servico/')[1];
      trackEvent('view_servico', { slug, description: `Visualizou serviço: ${slug}` });
    } else if (location.pathname === '/cotacao') {
      trackEvent('start_quote', { description: 'Acessou página de cotação' });
    } else if (location.pathname === '/blog') {
      trackEvent('page_view', { page: 'blog', description: 'Visualizou blog' });
    }

    // Detect return visit (3+ page views in session = engaged)
    if (pageViewsRef.current === 3) {
      trackEvent('return_visit', { description: 'Sessão engajada (3+ páginas)', pages: pageViewsRef.current });
    }
  }, [location.pathname, trackEvent]);

  // Detect page unload while form is active
  useEffect(() => {
    if (!activeFormId) return;
    const handler = () => {
      if (leadIdRef.current) {
        // Use sendBeacon for reliability on unload
        const payload = JSON.stringify({
          lead_id: leadIdRef.current,
          event_type: 'abandon_quote',
          channel: 'web',
          description: `Abandonou formulário ao sair: ${activeFormId}`,
          metadata: { form_id: activeFormId, session_id: sessionId.current },
        });
        // Best-effort beacon
        navigator.sendBeacon?.(
          `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/lead_events`,
          new Blob([payload], { type: 'application/json' })
        );
      }
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [activeFormId]);

  return (
    <LeadTrackingContext.Provider value={{ utmData, trackEvent, trackFormStart, trackFormAbandon, setLeadId }}>
      {children}
    </LeadTrackingContext.Provider>
  );
};
