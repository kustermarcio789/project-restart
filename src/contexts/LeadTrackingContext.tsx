import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { useSearchParams, useLocation } from 'react-router-dom';

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
  trackFormStart: (formId: string) => void;
  trackFormAbandon: (formId: string) => void;
}

const LeadTrackingContext = createContext<LeadTrackingContextType | null>(null);

export const useLeadTracking = () => {
  const ctx = useContext(LeadTrackingContext);
  if (!ctx) throw new Error('useLeadTracking must be used within LeadTrackingProvider');
  return ctx;
};

export const LeadTrackingProvider = ({ children }: { children: ReactNode }) => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
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

  const trackFormStart = useCallback((formId: string) => {
    setActiveFormId(formId);
  }, []);

  const trackFormAbandon = useCallback((formId: string) => {
    setActiveFormId((prev) => (prev === formId ? null : prev));
  }, []);

  // Detect page unload while form is active
  useEffect(() => {
    if (!activeFormId) return;
    const handler = () => {
      // Fire-and-forget beacon for abandonment
      const payload = JSON.stringify({ form_id: activeFormId, ...utmData });
      navigator.sendBeacon?.('/api/track-abandon', payload);
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [activeFormId, utmData]);

  return (
    <LeadTrackingContext.Provider value={{ utmData, trackFormStart, trackFormAbandon }}>
      {children}
    </LeadTrackingContext.Provider>
  );
};
