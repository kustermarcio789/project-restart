
-- Fix SECURITY DEFINER view — set to INVOKER
ALTER VIEW public.provider_reviews_public SET (security_invoker = on);
