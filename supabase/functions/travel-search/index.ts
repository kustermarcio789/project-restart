import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': Deno.env.get('ALLOWED_ORIGIN') || '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
};

// Travel API proxy - isolates API keys from frontend
// Supports Amadeus API for flights and hotels
// Add more providers by extending the PROVIDERS map

interface SearchParams {
  type: 'flights' | 'hotels';
  origin?: string;
  destination: string;
  departDate: string;
  returnDate?: string;
  adults?: number;
  currency?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const params: SearchParams = await req.json();

    if (!params.destination || !params.departDate || !params.type) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: type, destination, departDate' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const AMADEUS_KEY = Deno.env.get('AMADEUS_API_KEY');
    const AMADEUS_SECRET = Deno.env.get('AMADEUS_API_SECRET');

    if (!AMADEUS_KEY || !AMADEUS_SECRET) {
      // Return mock data when API keys are not configured
      const mockData = getMockData(params);
      return new Response(
        JSON.stringify({
          source: 'mock',
          message: 'API keys not configured. Returning sample data.',
          data: mockData,
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Amadeus OAuth token
    const tokenRes = await fetch('https://api.amadeus.com/v1/security/oauth2/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `grant_type=client_credentials&client_id=${AMADEUS_KEY}&client_secret=${AMADEUS_SECRET}`,
    });
    const tokenData = await tokenRes.json();

    if (!tokenData.access_token) {
      throw new Error('Failed to authenticate with Amadeus API');
    }

    const token = tokenData.access_token;
    let apiUrl: string;

    if (params.type === 'flights') {
      const searchParams = new URLSearchParams({
        originLocationCode: params.origin || 'GRU',
        destinationLocationCode: params.destination,
        departureDate: params.departDate,
        adults: String(params.adults || 1),
        currencyCode: params.currency || 'BRL',
        max: '10',
      });
      if (params.returnDate) searchParams.set('returnDate', params.returnDate);
      apiUrl = `https://api.amadeus.com/v2/shopping/flight-offers?${searchParams}`;
    } else {
      const searchParams = new URLSearchParams({
        cityCode: params.destination,
        checkInDate: params.departDate,
        adults: String(params.adults || 1),
        currency: params.currency || 'BRL',
      });
      if (params.returnDate) searchParams.set('checkOutDate', params.returnDate);
      apiUrl = `https://api.amadeus.com/v3/shopping/hotel-offers?${searchParams}`;
    }

    const apiRes = await fetch(apiUrl, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const apiData = await apiRes.json();

    if (!apiRes.ok) {
      return new Response(
        JSON.stringify({ error: 'API error', details: apiData }),
        { status: apiRes.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ source: 'amadeus', data: apiData.data || [] }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: msg }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

function getMockData(params: SearchParams) {
  if (params.type === 'flights') {
    return [
      { id: '1', airline: 'LATAM', price: 2450, currency: 'BRL', departure: params.departDate, duration: '10h30', stops: 1 },
      { id: '2', airline: 'GOL', price: 1890, currency: 'BRL', departure: params.departDate, duration: '12h15', stops: 2 },
      { id: '3', airline: 'Azul', price: 3200, currency: 'BRL', departure: params.departDate, duration: '9h45', stops: 0 },
    ];
  }
  return [
    { id: '1', name: 'Hotel Central', stars: 4, price: 350, currency: 'BRL', location: params.destination },
    { id: '2', name: 'Hostel Backpacker', stars: 2, price: 120, currency: 'BRL', location: params.destination },
    { id: '3', name: 'Resort Premium', stars: 5, price: 890, currency: 'BRL', location: params.destination },
  ];
}
