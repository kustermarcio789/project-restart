import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
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
  trackEvent: (eventType: string, metadata?: Record<string, unknown>) => void;
  trackFormStart: (formId: string) => void;
  trackFormAbandon: (formId: string) => void;
  setLeadId: (id: string) => void;
}

type LeadEventPayload = {
  lead_id: string;
  event_type: string;
  channel: 'web';
  description: string;
  metadata: Record<string, unknown>;
};

const LeadTrackingContext = createContext<LeadTrackingContextType | null>(null);

export const useLeadTracking = () => {
  const ctx = useContext(LeadTrackingContext);
  if (!ctx) throw new Error('useLeadTracking must be used within LeadTrackingProvider');
  return ctx;
};

const SESSION_KEY = 'lt_session';
const LEAD_KEY = 'lt_lead_id';
const TRACK_EVENT_FUNCTION = 'track-lead-event';

function getSessionId() {
  let sid = sessionStorage.getItem(SESSION_KEY);
  if (!sid) {
    sid = crypto.randomUUID();
    sessionStorage.setItem(SESSION_KEY, sid);
  }
  return sid;
}

function getFunctionEndpoint() {
  const url = import.meta.env.VITE_SUPABASE_URL;
  if (!url) return null;
  return `${url}/functions/v1/${TRACK_EVENT_FUNCTION}`;
}

function getFunctionHeaders() {
  return {
    'Content-Type': 'application/json',
    apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || '',
  };
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

  const buildPayload = useCallback(
    (eventType: string, metadata?: Record<string, unknown>): LeadEventPayload | null => {
      if (!leadIdRef.current) return null;

      const description =
        typeof metadata?.description === 'string' && metadata.description.trim().length > 0
          ? metadata.description
          : eventType;

      return {
        lead_id: leadIdRef.current,
        event_type: eventType,
        channel: 'web',
        description,
        metadata: {
          ...metadata,
          session_id: sessionId.current,
          page: location.pathname,
          timestamp: new Date().toISOString(),
        },
      };
    },
    [location.pathname]
  );

  const sendPayload = useCallback(async (payload: LeadEventPayload) => {
    const { error } = await supabase.functions.invoke(TRACK_EVENT_FUNCTION, {
      body: payload,
    });

    if (error) {
      throw error;
    }
  }, []);

  const trackEvent = useCallback(
    async (eventType: string, metadata?: Record<string, unknown>) => {
      const payload = buildPayload(eventType, metadata);
      if (!payload) return;

      try {
        await sendPayload(payload);
      } catch (e) {
        console.debug('[LeadTracking] Event failed:', e);
      }
    },
    [buildPayload, sendPayload]
  );

  const trackFormStart = useCallback(
    (formId: string) => {
      setActiveFormId(formId);
      trackEvent('start_quote', {
        form_id: formId,
        description: `Iniciou formulário: ${formId}`,
      });
    },
    [trackEvent]
  );

  const trackFormAbandon = useCallback(
    (formId: string) => {
      setActiveFormId((prev) => {
        if (prev === formId) {
          trackEvent('abandon_quote', {
            form_id: formId,
            description: `Abandonou formulário: ${formId}`,
          });
          return null;
        }
        return prev;
      });
    },
    [trackEvent]
  );

  useEffect(() => {
    if (location.pathname === lastPathRef.current) return;
    lastPathRef.current = location.pathname;
    pageViewsRef.current++;

    if (!leadIdRef.current) return;

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

    if (pageViewsRef.current === 3) {
      trackEvent('return_visit', {
        description: 'Sessão engajada (3+ páginas)',
        pages: pageViewsRef.current,
      });
    }
  }, [location.pathname, trackEvent]);

  useEffect(() => {
    if (!activeFormId) return;

    const handler = () => {
      const payload = buildPayload('abandon_quote', {
        form_id: activeFormId,
        description: `Abandonou formulário ao sair: ${activeFormId}`,
      });

      const endpoint = getFunctionEndpoint();
      if (!payload || !endpoint) return;

      fetch(endpoint, {
        method: 'POST',
        headers: getFunctionHeaders(),
        body: JSON.stringify(payload),
        keepalive: true,
      }).catch(() => undefined);
    };

    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [activeFormId, buildPayload]);

  return (
    <LeadTrackingContext.Provider
      value={{ utmData, trackEvent, trackFormStart, trackFormAbandon, setLeadId }}
    >
      {children}
    </LeadTrackingContext.Provider>
  );
};
