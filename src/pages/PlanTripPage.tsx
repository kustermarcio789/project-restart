import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Globe,
  FileCheck,
  MapPin,
  Briefcase,
  Plane,
  Building2,
  Car,
  Shield,
  Star,
  ClipboardCheck,
  CreditCard,
  ChevronRight,
  ChevronLeft,
  Check,
  Search,
  ExternalLink,
  Info,
  CheckCircle2,
  Send,
  AlertTriangle,
  UserPlus,
  Loader2,
  Lock,
  BadgeCheck,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Header } from '@/components/landing/Header';
import { Footer } from '@/components/landing/Footer';
import { SEOHead } from '@/components/shared/SEOHead';
import { StickyWhatsApp } from '@/components/shared/StickyWhatsApp';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { getPassportOffice } from '@/lib/passportOffices';

function getTravelSearchEndpoint() {
  const url = import.meta.env.VITE_SUPABASE_URL;
  if (!url) return null;
  return `${url}/functions/v1/travel-search`;
}

function getTravelSearchHeaders() {
  const publishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || '';

  return {
    'Content-Type': 'application/json',
    apikey: publishableKey,
    Authorization: `Bearer ${publishableKey}`,
  };
}

async function invokeTravelSearch(body: Record<string, unknown>) {
  const endpoint = getTravelSearchEndpoint();

  if (!endpoint) {
    throw new Error('Supabase URL não configurada para a função travel-search.');
  }

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: getTravelSearchHeaders(),
    body: JSON.stringify(body),
  });

  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      typeof result?.error === 'string'
        ? result.error
        : `Falha ao consultar a função travel-search (${response.status}).`
    );
  }

  return result;
}


const STEPS = [
  { id: 0, label: 'Nacionalidade', icon: Globe },
  { id: 1, label: 'Passaporte', icon: FileCheck },
  { id: 2, label: 'Origem e destino', icon: MapPin },
  { id: 3, label: 'Objetivo e visto', icon: Briefcase },
  { id: 4, label: 'Transporte', icon: Plane },
  { id: 5, label: 'Hospedagem', icon: Building2 },
  { id: 6, label: 'Locomoção', icon: Car },
  { id: 7, label: 'Seguro', icon: Shield },
  { id: 8, label: 'Experiências', icon: Star },
  { id: 9, label: 'Revisão', icon: ClipboardCheck },
  { id: 10, label: 'Criar conta', icon: CreditCard },
] as const;

const TRAVEL_PURPOSES = [
  { value: 'tourism', label: 'Turismo', icon: '🏖️', desc: 'Férias, lazer e passeios.' },
  { value: 'business', label: 'Negócios', icon: '💼', desc: 'Reuniões, eventos e viagens corporativas.' },
  { value: 'study', label: 'Estudo', icon: '📚', desc: 'Curso, intercâmbio ou formação acadêmica.' },
  { value: 'work', label: 'Trabalho', icon: '🧑‍💻', desc: 'Contrato de trabalho ou atividade profissional.' },
  { value: 'relocation', label: 'Mudança', icon: '🏠', desc: 'Residência, reagrupamento ou permanência longa.' },
] as const;

const TRANSPORT_OPTIONS = [
  { value: 'flight', label: 'Avião', icon: '✈️', desc: 'Voos diretos e conexões internacionais.' },
  { value: 'train', label: 'Trem', icon: '🚄', desc: 'Trem de alta velocidade e corredores internacionais.' },
  { value: 'bus', label: 'Ônibus', icon: '🚌', desc: 'Rotas rodoviárias e operadores regionais.' },
] as const;

const ACCOMMODATION_OPTIONS = [
  {
    value: 'hotel',
    label: 'Hotel',
    icon: '🏨',
    desc: 'Conforto, recepção e serviços completos.',
    rating: '4.7/5',
    image: 'https://picsum.photos/seed/travel-hotel/900/520',
  },
  {
    value: 'hostel',
    label: 'Hostel',
    icon: '🛏️',
    desc: 'Econômico e ideal para socializar.',
    rating: '4.5/5',
    image: 'https://picsum.photos/seed/travel-hostel/900/520',
  },
  {
    value: 'apartment',
    label: 'Apartamento / Airbnb',
    icon: '🏡',
    desc: 'Mais privacidade e flexibilidade.',
    rating: '4.6/5',
    image: 'https://picsum.photos/seed/travel-apartment/900/520',
  },
  {
    value: 'resort',
    label: 'Resort',
    icon: '🌴',
    desc: 'Estrutura completa, descanso e lazer.',
    rating: '4.8/5',
    image: 'https://picsum.photos/seed/travel-resort/900/520',
  },
  {
    value: 'none',
    label: 'Não preciso reservar agora',
    icon: '🧳',
    desc: 'Posso seguir sem hospedagem nesta etapa.',
    rating: 'Opcional',
    image: 'https://picsum.photos/seed/travel-no-accommodation/900/520',
  },
] as const;

const LOCAL_TRANSPORT = [
  { value: 'car_rental', label: 'Aluguel de carro', icon: '🚗', desc: 'Maior liberdade no destino.' },
  { value: 'public', label: 'Transporte público', icon: '🚇', desc: 'Metrô, ônibus e trem urbano.' },
  { value: 'rideshare', label: 'Apps de mobilidade', icon: '📱', desc: 'Uber, Bolt e similares.' },
  { value: 'walking', label: 'A pé / Bike', icon: '🚶', desc: 'Para regiões centrais e turismo leve.' },
  { value: 'none', label: 'Decido isso depois', icon: '🧭', desc: 'Sem escolha agora.' },
] as const;

const INSURANCE_OPTIONS = [
  { value: 'basic', label: 'Básico', icon: '🛡️', price: 'R$ 15/dia', desc: 'Cobertura essencial.' },
  { value: 'standard', label: 'Padrão', icon: '✅', price: 'R$ 25/dia', desc: 'Cobertura completa.' },
  { value: 'premium', label: 'Premium', icon: '👑', price: 'R$ 45/dia', desc: 'Cobertura total + cancelamento.' },
  { value: 'none', label: 'Sem seguro', icon: '❌', price: 'Opcional', desc: 'Sem contratação nesta etapa.' },
] as const;

const EXPERIENCE_OPTIONS = [
  { value: 'guided_tour', label: 'Tours guiados', icon: '🗺️' },
  { value: 'restaurants', label: 'Restaurantes', icon: '🍽️' },
  { value: 'adventure', label: 'Aventura', icon: '🧗' },
  { value: 'cultural', label: 'Cultural', icon: '🎭' },
  { value: 'nightlife', label: 'Vida noturna', icon: '🌃' },
  { value: 'wellness', label: 'Bem-estar', icon: '🧘' },
  { value: 'shopping', label: 'Compras', icon: '🛍️' },
  { value: 'free_guides', label: 'Guias locais gratuitos', icon: '🧑‍🤝‍🧑' },
] as const;

const HIGH_RISK_COUNTRY_CODES = new Set(['AF', 'SY', 'YE', 'SD', 'UA', 'MM', 'IQ', 'IR', 'SO', 'LY', 'RU']);
const EURO_RAIL_COUNTRIES = new Set(['GB', 'FR', 'BE', 'NL', 'DE', 'CH']);
const MERCOSUR_FRIENDLY = new Set(['AR', 'BO', 'BR', 'CL', 'CO', 'EC', 'PY', 'PE', 'UY']);
const SCHENGEN_COUNTRIES = new Set([
  'AT', 'BE', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR', 'HU', 'IS', 'IT', 'LV', 'LI', 'LT',
  'LU', 'MT', 'NL', 'NO', 'PL', 'PT', 'SK', 'SI', 'ES', 'SE', 'CH', 'HR',
]);
const STRICT_ENTRY_COUNTRIES = new Set(['US', 'CA', 'GB', 'AU', 'NZ']);

const COUNTRY_TO_IATA: Record<string, string> = {
  BR: 'GRU',
  PT: 'LIS',
  ES: 'MAD',
  FR: 'PAR',
  GB: 'LON',
  DE: 'FRA',
  IT: 'ROM',
  NL: 'AMS',
  BE: 'BRU',
  CH: 'ZRH',
  US: 'NYC',
  CA: 'YTO',
  MX: 'MEX',
  AR: 'BUE',
  CL: 'SCL',
  CO: 'BOG',
  PE: 'LIM',
  UY: 'MVD',
  PY: 'ASU',
  JP: 'TYO',
  CN: 'BJS',
  KR: 'SEL',
  AU: 'SYD',
  NZ: 'AKL',
  AE: 'DXB',
  TR: 'IST',
  EG: 'CAI',
  ZA: 'JNB',
  IN: 'DEL',
  TH: 'BKK',
  SG: 'SIN',
};

interface CountryOption {
  code: string;
  name: string;
  flag: string;
  demonym: string;
  region: string;
  subregion: string;
  searchText: string;
}

interface VisaAssessment {
  status: 'ok' | 'attention' | 'blocked';
  title: string;
  visaType: string;
  summary: string;
  nextSteps: string[];
}

interface FlowState {
  nationality: string;
  hasPassport: boolean | null;
  originCountry: string;
  destinationCode: string;
  purpose: string;
  transport: string;
  accommodation: string;
  localTransport: string[];
  insurance: string;
  experiences: string[];
  departDate: string;
  returnDate: string;
  travelers: number;
  name: string;
  email: string;
  phone: string;
  notes: string;
}

interface FlightResult {
  id: string;
  airline: string;
  price: number;
  currency: string;
  departure: string;
  duration: string;
  stops: number;
}

interface HotelResult {
  id: string;
  name: string;
  stars: number;
  price: number;
  currency: string;
  location: string;
}

const initialState: FlowState = {
  nationality: '',
  hasPassport: null,
  originCountry: '',
  destinationCode: '',
  purpose: '',
  transport: 'flight',
  accommodation: 'none',
  localTransport: ['none'],
  insurance: 'none',
  experiences: [],
  departDate: '',
  returnDate: '',
  travelers: 1,
  name: '',
  email: '',
  phone: '',
  notes: '',
};

const normalize = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();

const isDomesticRoute = (origin?: string, destination?: string) => !!origin && !!destination && origin === destination;

const formatCurrency = (value: number, currency = 'BRL') =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency }).format(value || 0);

const getIataCodeForCountry = (countryCode?: string) => {
  if (!countryCode) return undefined;
  return COUNTRY_TO_IATA[countryCode];
};

const getAvailableTransportOptions = (origin?: CountryOption, destination?: CountryOption) => {
  if (!origin || !destination) {
    return TRANSPORT_OPTIONS.filter(option => option.value === 'flight');
  }

  if (origin.code === 'BR' && destination.code !== 'BR') {
    return TRANSPORT_OPTIONS.filter(option => option.value === 'flight');
  }

  if (origin.code === destination.code) {
    return TRANSPORT_OPTIONS.filter(option => ['flight', 'train', 'bus'].includes(option.value));
  }

  const bothInEuroRail = EURO_RAIL_COUNTRIES.has(origin.code) && EURO_RAIL_COUNTRIES.has(destination.code);
  if (bothInEuroRail) {
    return TRANSPORT_OPTIONS.filter(option => ['flight', 'train', 'bus'].includes(option.value));
  }

  const sameEuropeanBlock = origin.region === 'Europe' && destination.region === 'Europe';
  if (sameEuropeanBlock) {
    return TRANSPORT_OPTIONS.filter(option => ['flight', 'bus'].includes(option.value));
  }

  return TRANSPORT_OPTIONS.filter(option => option.value === 'flight');
};

const getVisaAssessment = ({
  nationality,
  hasPassport,
  originCountry,
  destinationCode,
  purpose,
}: {
  nationality: string;
  hasPassport: boolean | null;
  originCountry: string;
  destinationCode: string;
  purpose: string;
}): VisaAssessment | null => {
  if (!nationality || !destinationCode || !purpose || !originCountry) return null;

  if (HIGH_RISK_COUNTRY_CODES.has(destinationCode)) {
    return {
      status: 'blocked',
      title: 'Destino temporariamente indisponível para venda online',
      visaType: 'Emissão bloqueada por risco geopolítico',
      summary: 'Este destino está marcado na regra operacional do produto como país de alto risco, conflito ou guerra. A plataforma deve impedir venda automática de passagens e serviços para esse caso.',
      nextSteps: [
        'Escolha outro destino para continuar no planejador.',
        'Se necessário, trate este caso apenas em fluxo manual de consultoria especializada.',
      ],
    };
  }

  if (isDomesticRoute(originCountry, destinationCode)) {
    return {
      status: 'ok',
      title: 'Viagem doméstica',
      visaType: 'Sem visto',
      summary: 'Como a origem e o destino estão no mesmo país, não há exigência de visto internacional para este fluxo.',
      nextSteps: ['Você pode seguir para transporte, hospedagem e serviços adicionais.'],
    };
  }

  if (hasPassport === false) {
    return {
      status: 'blocked',
      title: 'Passaporte obrigatório para esta rota internacional',
      visaType: 'Não é possível validar o visto sem passaporte',
      summary: 'Para uma viagem internacional, o passaporte deve ser providenciado antes da confirmação documental e antes da emissão online.',
      nextSteps: [
        'Solicite ou regularize seu passaporte no órgão oficial do seu país.',
        'Depois disso, volte ao fluxo para validar o tipo de visto e documentos de entrada.',
      ],
    };
  }

  if (purpose === 'study') {
    return {
      status: 'attention',
      title: 'Viagem com objetivo de estudo',
      visaType: 'Visto de estudante ou permissão acadêmica',
      summary: 'Para estudo, intercâmbio ou curso, o cenário operacional mais seguro é assumir necessidade de visto ou permissão específica com validação oficial obrigatória antes da venda.',
      nextSteps: [
        'Validar na fonte oficial do país de destino o visto acadêmico correto.',
        'Confirmar carta de aceitação, prazo e regras de permanência.',
      ],
    };
  }

  if (purpose === 'work' || purpose === 'relocation') {
    return {
      status: 'attention',
      title: 'Viagem com trabalho, mudança ou residência',
      visaType: purpose === 'work' ? 'Visto de trabalho' : 'Visto de residência / reunificação / residência temporária',
      summary: 'Quando o objetivo é trabalho ou mudança, o produto deve tratar o caso como documentação migratória especializada. Em operação séria, isso nunca deve ser presumido como turismo simples.',
      nextSteps: [
        'Validar a categoria migratória correta antes de oferecer emissão final.',
        'Solicitar documentação adicional, contrato, patrocínio ou comprovações quando aplicável.',
      ],
    };
  }

  if (nationality === 'BR' && MERCOSUR_FRIENDLY.has(destinationCode) && (purpose === 'tourism' || purpose === 'business')) {
    return {
      status: 'ok',
      title: 'Fluxo regional com facilidade documental',
      visaType: 'Geralmente sem visto para curta permanência',
      summary: 'Para brasileiros em parte do entorno regional e em viagens curtas de turismo ou negócios, a tendência operacional é de processo mais simples. Ainda assim, o sistema deve confirmar a regra oficial antes da emissão.',
      nextSteps: [
        'Confirmar regra oficial de entrada e permanência antes do checkout.',
        'Checar se RG, passaporte ou comprovantes adicionais serão aceitos para a rota escolhida.',
      ],
    };
  }

  if (nationality === 'BR' && SCHENGEN_COUNTRIES.has(destinationCode) && purpose === 'tourism') {
    return {
      status: 'attention',
      title: 'Turismo em destino europeu com regra própria',
      visaType: 'Dispensa provável para curta permanência, com validação oficial obrigatória',
      summary: 'Para turismo de curta duração em parte da Europa, pode haver dispensa de visto dependendo do passaporte, mas o produto deve validar a regra oficial antes de vender.',
      nextSteps: [
        'Confirmar exigências oficiais atualizadas antes da emissão.',
        'Checar seguro, comprovação financeira e documentação de hospedagem quando aplicável.',
      ],
    };
  }

  if (STRICT_ENTRY_COUNTRIES.has(destinationCode) && (purpose === 'tourism' || purpose === 'business')) {
    return {
      status: 'attention',
      title: 'Destino com controle migratório rigoroso',
      visaType: 'Autorização eletrônica, isenção condicionada ou visto consular',
      summary: 'Este destino exige validação oficial mais criteriosa. Dependendo do passaporte, pode haver eTA, ESTA, eVisa ou exigência consular formal.',
      nextSteps: [
        'Consultar a base oficial de requisitos antes do checkout.',
        'Somente liberar a emissão quando a elegibilidade estiver confirmada.',
      ],
    };
  }

  return {
    status: 'attention',
    title: 'Validação oficial necessária',
    visaType: purpose === 'tourism' || purpose === 'business'
      ? 'Pode variar entre isenção, autorização eletrônica ou visto consular'
      : 'Categoria migratória específica a confirmar',
    summary: 'Como este planejador ainda não está conectado a uma base oficial de elegibilidade migratória em tempo real, o sistema deve assumir validação obrigatória antes da venda final.',
    nextSteps: [
      'Consultar fonte oficial de passaporte, visto e entrada antes da emissão.',
      'Usar a resposta oficial para decidir se o checkout pode ser liberado automaticamente.',
    ],
  };
};

const PlanTripPage = () => {
  const [step, setStep] = useState(0);
  const [state, setState] = useState<FlowState>(initialState);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [countries, setCountries] = useState<CountryOption[]>([]);
  const [countriesLoading, setCountriesLoading] = useState(true);
  const [natSearch, setNatSearch] = useState('');
  const [originSearch, setOriginSearch] = useState('');
  const [destSearch, setDestSearch] = useState('');
  const [flightResults, setFlightResults] = useState<FlightResult[]>([]);
  const [hotelResults, setHotelResults] = useState<HotelResult[]>([]);
  const [searchingFlights, setSearchingFlights] = useState(false);
  const [searchingHotels, setSearchingHotels] = useState(false);
  const [flightSource, setFlightSource] = useState<'amadeus' | 'mock' | null>(null);
  const [hotelSource, setHotelSource] = useState<'amadeus' | 'mock' | null>(null);

  const set = <K extends keyof FlowState>(key: K, value: FlowState[K]) =>
    setState(previous => ({ ...previous, [key]: value }));

  const toggleArray = (key: 'localTransport' | 'experiences', value: string) =>
    setState(previous => {
      const currentValues = previous[key];
      const nextValues = currentValues.includes(value)
        ? currentValues.filter(item => item !== value)
        : [...currentValues.filter(item => item !== 'none'), value];

      return {
        ...previous,
        [key]: nextValues.length === 0 && key === 'localTransport' ? ['none'] : nextValues,
      };
    });

  useEffect(() => {
    const saved = localStorage.getItem('smart_flow_state');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setState({ ...initialState, ...parsed });
      } catch {
        // ignore corrupted data
      }
    }
  }, []);

  useEffect(() => {
    const loadCountries = async () => {
      try {
        setCountriesLoading(true);
        const response = await fetch('/countries.json');
        const data = await response.json();

        const normalizedCountries: CountryOption[] = (Array.isArray(data) ? data : [])
          .filter((country: any) => country?.cca2 && country?.name?.common)
          .map((country: any) => {
            const demonym = country?.demonyms?.eng?.m || country?.demonyms?.eng?.f || country?.name?.common;
            const portugueseName = country?.translations?.por?.common || country?.translations?.bre?.common || '';
            const commonName = country?.name?.common || '';

            return {
              code: country.cca2,
              name: commonName,
              flag: country.flag || '🏳️',
              demonym,
              region: country.region || 'Other',
              subregion: country.subregion || '',
              searchText: normalize(`${commonName} ${portugueseName} ${demonym} ${country.cca2}`),
            };
          })
          .sort((a, b) => a.name.localeCompare(b.name));

        setCountries(normalizedCountries);
      } catch {
        toast.error('Não foi possível carregar a lista global de países agora.');
      } finally {
        setCountriesLoading(false);
      }
    };

    loadCountries();
  }, []);

  useEffect(() => {
    if (!submitted) {
      localStorage.setItem('smart_flow_state', JSON.stringify(state));
    }
  }, [state, submitted]);

  const selectedNationality = useMemo(
    () => countries.find(country => country.code === state.nationality),
    [countries, state.nationality],
  );

  const selectedOrigin = useMemo(
    () => countries.find(country => country.code === state.originCountry),
    [countries, state.originCountry],
  );

  const selectedDestination = useMemo(
    () => countries.find(country => country.code === state.destinationCode),
    [countries, state.destinationCode],
  );

  const office = state.nationality ? getPassportOffice(state.nationality) : null;
  const riskBlocked = !!state.destinationCode && HIGH_RISK_COUNTRY_CODES.has(state.destinationCode);
  const visaAssessment = getVisaAssessment({
    nationality: state.nationality,
    hasPassport: state.hasPassport,
    originCountry: state.originCountry,
    destinationCode: state.destinationCode,
    purpose: state.purpose,
  });
  const availableTransportOptions = getAvailableTransportOptions(selectedOrigin, selectedDestination);
  const progress = ((step + 1) / STEPS.length) * 100;

  const filteredNationalities = useMemo(() => {
    const query = normalize(natSearch);
    return countries.filter(country => !query || country.searchText.includes(query)).slice(0, 80);
  }, [countries, natSearch]);

  const filteredOrigins = useMemo(() => {
    const query = normalize(originSearch);
    return countries.filter(country => !query || country.searchText.includes(query)).slice(0, 60);
  }, [countries, originSearch]);

  const filteredDestinations = useMemo(() => {
    const query = normalize(destSearch);
    return countries.filter(country => !query || country.searchText.includes(query)).slice(0, 80);
  }, [countries, destSearch]);

  const plannerHighlights = useMemo(() => {
    const items: string[] = [];
    if (selectedNationality) items.push(`Nacionalidade: ${selectedNationality.demonym}`);
    if (selectedDestination) items.push(`Destino: ${selectedDestination.name}`);
    if (visaAssessment?.visaType) items.push(`Visto: ${visaAssessment.visaType}`);
    if (flightResults.length > 0) items.push(`Voos encontrados: ${flightResults.length}`);
    if (hotelResults.length > 0) items.push(`Hospedagens sugeridas: ${hotelResults.length}`);
    return items;
  }, [selectedNationality, selectedDestination, visaAssessment, flightResults.length, hotelResults.length]);

  const topFlight = flightResults[0];
  const topHotel = hotelResults[0];

  const canProceed = (): boolean => {
    switch (step) {
      case 0:
        return !!state.nationality;
      case 1:
        return state.hasPassport !== null;
      case 2:
        return !!state.originCountry && !!state.destinationCode && !riskBlocked;
      case 3:
        return !!state.purpose && visaAssessment?.status !== 'blocked';
      case 4:
        return !!state.transport;
      case 5:
        return !!state.accommodation;
      case 6:
        return state.localTransport.length > 0;
      case 7:
        return !!state.insurance;
      case 8:
        return true;
      case 9:
        return true;
      case 10:
        return !!state.name && !!state.email;
      default:
        return true;
    }
  };

  const goNext = () => {
    if (step === 0 && state.nationality && !state.originCountry) {
      set('originCountry', state.nationality);
    }
    setStep(current => Math.min(current + 1, STEPS.length - 1));
  };

  const goPrev = () => setStep(current => Math.max(current - 1, 0));

  const searchFlights = async () => {
    const originIata = getIataCodeForCountry(state.originCountry);
    const destinationIata = getIataCodeForCountry(state.destinationCode);

    if (!originIata || !destinationIata || !state.departDate) {
      setFlightResults([]);
      return;
    }

    try {
      setSearchingFlights(true);
      const data = await invokeTravelSearch({
        type: 'flights',
        origin: originIata,
        destination: destinationIata,
        departDate: state.departDate,
        returnDate: state.returnDate || undefined,
        adults: state.travelers,
        currency: 'BRL',
      });

      const source = data?.source === 'amadeus' ? 'amadeus' : 'mock';
      const normalized = Array.isArray(data?.data)
        ? data.data.slice(0, 6).map((item: any, index: number) => {
            if (source === 'amadeus') {
              const firstItinerary = item?.itineraries?.[0];
              const firstSegment = firstItinerary?.segments?.[0];
              const carrier = item?.validatingAirlineCodes?.[0] || firstSegment?.carrierCode || 'Companhia aérea';
              const stops = Math.max(0, (firstItinerary?.segments?.length || 1) - 1);
              return {
                id: item.id || String(index + 1),
                airline: carrier,
                price: Number(item?.price?.grandTotal || 0),
                currency: item?.price?.currency || 'BRL',
                departure: firstSegment?.departure?.at || state.departDate,
                duration: firstItinerary?.duration || 'A confirmar',
                stops,
              } as FlightResult;
            }

            return {
              id: item.id || String(index + 1),
              airline: item.airline || 'Companhia aérea',
              price: Number(item.price || 0),
              currency: item.currency || 'BRL',
              departure: item.departure || state.departDate,
              duration: item.duration || 'A confirmar',
              stops: Number(item.stops || 0),
            } as FlightResult;
          })
        : [];

      setFlightSource(source);
      setFlightResults(normalized);
    } catch {
      toast.error('Não foi possível carregar ofertas de voo agora.');
      setFlightResults([]);
    } finally {
      setSearchingFlights(false);
    }
  };

  const searchHotels = async () => {
    const destinationIata = getIataCodeForCountry(state.destinationCode);

    if (!destinationIata || !state.departDate || state.accommodation === 'none') {
      setHotelResults([]);
      return;
    }

    try {
      setSearchingHotels(true);
      const data = await invokeTravelSearch({
        type: 'hotels',
        destination: destinationIata,
        departDate: state.departDate,
        returnDate: state.returnDate || undefined,
        adults: state.travelers,
        currency: 'BRL',
      });

      const source = data?.source === 'amadeus' ? 'amadeus' : 'mock';
      const normalized = Array.isArray(data?.data)
        ? data.data.slice(0, 6).map((item: any, index: number) => {
            if (source === 'amadeus') {
              const offer = item?.offers?.[0];
              return {
                id: item.hotel?.hotelId || item.id || String(index + 1),
                name: item.hotel?.name || 'Hospedagem',
                stars: Number(item.hotel?.rating || 4),
                price: Number(offer?.price?.total || 0),
                currency: offer?.price?.currency || 'BRL',
                location: item.hotel?.cityCode || destinationIata,
              } as HotelResult;
            }

            return {
              id: item.id || String(index + 1),
              name: item.name || 'Hospedagem',
              stars: Number(item.stars || 4),
              price: Number(item.price || 0),
              currency: item.currency || 'BRL',
              location: item.location || destinationIata,
            } as HotelResult;
          })
        : [];

      setHotelSource(source);
      setHotelResults(normalized);
    } catch {
      toast.error('Não foi possível carregar opções de hospedagem agora.');
      setHotelResults([]);
    } finally {
      setSearchingHotels(false);
    }
  };

  useEffect(() => {
    if (step === 4 && state.transport === 'flight') {
      void searchFlights();
    }
  }, [step, state.transport, state.originCountry, state.destinationCode, state.departDate, state.returnDate, state.travelers]);

  useEffect(() => {
    if (step === 5 && state.accommodation !== 'none') {
      void searchHotels();
    }
  }, [step, state.accommodation, state.destinationCode, state.departDate, state.returnDate, state.travelers]);

  const buildMessage = () => {
    const accommodationLabel = ACCOMMODATION_OPTIONS.find(item => item.value === state.accommodation)?.label || 'Não definido';
    const transportLabel = TRANSPORT_OPTIONS.find(item => item.value === state.transport)?.label || 'Não definido';
    const insuranceLabel = INSURANCE_OPTIONS.find(item => item.value === state.insurance)?.label || 'Não definido';
    const purposeLabel = TRAVEL_PURPOSES.find(item => item.value === state.purpose)?.label || 'Não definido';

    return [
      `Nacionalidade: ${selectedNationality ? `${selectedNationality.flag} ${selectedNationality.demonym}` : '-'}`,
      `Origem: ${selectedOrigin ? `${selectedOrigin.flag} ${selectedOrigin.name}` : '-'}`,
      `Destino: ${selectedDestination ? `${selectedDestination.flag} ${selectedDestination.name}` : '-'}`,
      `Objetivo: ${purposeLabel}`,
      `Passaporte: ${state.hasPassport ? 'Sim' : 'Não'}`,
      `Avaliação de visto: ${visaAssessment?.visaType || 'A confirmar'}`,
      `Transporte principal: ${transportLabel}`,
      topFlight ? `Melhor voo: ${topFlight.airline} por ${formatCurrency(topFlight.price, topFlight.currency)}` : null,
      `Hospedagem: ${accommodationLabel}`,
      topHotel ? `Melhor hospedagem: ${topHotel.name} por ${formatCurrency(topHotel.price, topHotel.currency)}` : null,
      `Locomoção local: ${state.localTransport.map(item => LOCAL_TRANSPORT.find(option => option.value === item)?.label).filter(Boolean).join(', ') || 'Não definida'}`,
      `Seguro: ${insuranceLabel}`,
      `Experiências: ${state.experiences.map(item => EXPERIENCE_OPTIONS.find(option => option.value === item)?.label).filter(Boolean).join(', ') || 'Nenhuma'}`,
      `Viajantes: ${state.travelers}`,
      state.departDate ? `Ida: ${state.departDate}` : null,
      state.returnDate ? `Volta: ${state.returnDate}` : null,
      state.notes ? `Observações: ${state.notes}` : null,
    ].filter(Boolean).join('\n');
  };

  const handleSubmit = async () => {
    setSubmitting(true);

    try {
      const leadId = crypto.randomUUID();
      const params = new URLSearchParams(window.location.search);

      await supabase.from('leads').insert({
        id: leadId,
        name: state.name,
        email: state.email,
        phone: state.phone || null,
        destination_slug: selectedDestination?.code?.toLowerCase() || null,
        service_type: `planner_${state.purpose || 'travel'}`,
        travel_date_from: state.departDate || null,
        travel_date_to: state.returnDate || null,
        travelers_count: state.travelers,
        message: buildMessage(),
        source: 'smart_flow_global_v3_amadeus',
        landing_page: '/planejar',
        utm_source: params.get('utm_source'),
        utm_medium: params.get('utm_medium'),
        utm_campaign: params.get('utm_campaign'),
        utm_content: params.get('utm_content'),
        utm_term: params.get('utm_term'),
      });

      await supabase.functions.invoke('track-lead-event', {
        body: {
          lead_id: leadId,
          event_type: 'smart_flow_completed_global_v3',
          channel: 'web',
          description: `Planejamento concluído para ${selectedDestination?.name || 'destino não informado'}`,
          metadata: {
            nationality: state.nationality,
            origin_country: state.originCountry,
            destination_country: state.destinationCode,
            purpose: state.purpose,
            transport: state.transport,
            accommodation: state.accommodation,
            local_transport: state.localTransport,
            insurance: state.insurance,
            experiences: state.experiences,
            visa_assessment: visaAssessment,
            flight_source: flightSource,
            hotel_source: hotelSource,
            top_flight: topFlight,
            top_hotel: topHotel,
          },
        },
      });

      localStorage.removeItem('smart_flow_state');
      setSubmitted(true);
      toast.success('Planejamento salvo. Vamos levar você para criar sua conta.');
      window.setTimeout(() => {
        const redirect = `/entrar?mode=signup&planner=1&email=${encodeURIComponent(state.email)}&name=${encodeURIComponent(state.name)}`;
        window.location.href = redirect;
      }, 1500);
    } catch {
      toast.error('Erro ao concluir seu planejamento. Tente novamente.');
    } finally {
      setSubmitting(false);
    }
  };

  const slideVariants = {
    enter: { x: 50, opacity: 0 },
    center: { x: 0, opacity: 1 },
    exit: { x: -50, opacity: 0 },
  };

  const OptionCard = ({ selected, onClick, icon, label, desc, extra }: {
    selected: boolean;
    onClick: () => void;
    icon: string;
    label: string;
    desc?: string;
    extra?: string;
  }) => (
    <button
      onClick={onClick}
      className={`text-left p-4 rounded-xl border transition-all ${
        selected
          ? 'border-primary bg-primary/10 ring-1 ring-primary shadow-lg shadow-primary/10'
          : 'border-border bg-card hover:border-primary/50 hover:bg-muted/50'
      }`}
    >
      <div className="flex items-start gap-3">
        <span className="text-2xl">{icon}</span>
        <div className="flex-1">
          <p className="font-semibold text-sm text-foreground">{label}</p>
          {desc && <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>}
          {extra && <p className="text-xs text-primary font-medium mt-1">{extra}</p>}
        </div>
        {selected && <Check className="h-4 w-4 text-primary shrink-0 mt-1" />}
      </div>
    </button>
  );

  const SummaryRow = ({ label, value }: { label: string; value?: string }) => (
    <div className="flex items-center justify-between p-3 bg-muted/30 rounded-xl gap-4">
      <span className="text-muted-foreground text-sm">{label}</span>
      <span className="font-medium text-foreground text-right text-sm">{value || '-'}</span>
    </div>
  );

  const OfferCard = ({ title, subtitle, price, badge, footer }: { title: string; subtitle: string; price: string; badge: string; footer: string }) => (
    <div className="rounded-2xl border border-border bg-card p-4 space-y-3 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-semibold text-foreground text-sm">{title}</p>
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        </div>
        <span className="text-[11px] px-2 py-1 rounded-full bg-primary/10 text-primary font-semibold">{badge}</span>
      </div>
      <div className="text-2xl font-bold text-foreground">{price}</div>
      <p className="text-xs text-muted-foreground">{footer}</p>
    </div>
  );

  if (submitted) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-2xl mx-auto px-4 pt-32 pb-20 text-center">
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
            <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-foreground mb-4">Planejamento salvo com sucesso</h1>
            <p className="text-lg text-muted-foreground mb-8">
              Seu fluxo foi registrado. Agora você será direcionado para criar a sua conta e acompanhar sua jornada de viagem.
            </p>
            <Button
              onClick={() => {
                window.location.href = `/entrar?mode=signup&planner=1&email=${encodeURIComponent(state.email)}&name=${encodeURIComponent(state.name)}`;
              }}
              className="gradient-btn rounded-full px-8 gap-2"
            >
              <UserPlus className="h-4 w-4" /> Criar minha conta agora
            </Button>
          </motion.div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Planeje sua Viagem | Assistente Inteligente Global"
        description="Planeje sua viagem com nacionalidade, passaporte, visto, destino global, alertas de risco, transporte, hospedagem, resultados reais de busca e criação de conta ao final."
      />
      <Header />

      <div className="max-w-7xl mx-auto px-4 pt-28 pb-20">
        <div className="grid grid-cols-1 xl:grid-cols-[1.25fr_400px] gap-8 items-start">
          <div>
            <div className="relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/10 via-background to-background p-6 sm:p-8 mb-8">
              <div className="absolute -top-12 -right-12 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />
              <div className="relative">
                <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-background/80 px-3 py-1 text-xs text-primary font-semibold mb-4">
                  <Sparkles className="h-3.5 w-3.5" /> Plataforma de planejamento com foco em vendas reais
                </div>
                <h1 className="text-3xl sm:text-5xl font-bold text-foreground mb-3 leading-tight">
                  Planeje sua <span className="gradient-text">viagem global</span> com mais inteligência
                </h1>
                <p className="text-muted-foreground max-w-3xl text-sm sm:text-base">
                  A jornada agora ficou mais próxima de um funil comercial premium: nacionalidade, documentos, destino, validação de visto, transporte compatível com a rota, hospedagem opcional, seguro, experiências e criação de conta no fim.
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {plannerHighlights.length > 0 ? plannerHighlights.map(item => (
                    <span key={item} className="px-3 py-1 rounded-full bg-background/80 border border-border text-xs text-foreground">
                      {item}
                    </span>
                  )) : (
                    <span className="px-3 py-1 rounded-full bg-background/80 border border-border text-xs text-muted-foreground">
                      Preencha o fluxo para gerar recomendações mais precisas.
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-muted-foreground font-medium">
                  Etapa {step + 1} de {STEPS.length}: {STEPS[step].label}
                </span>
                <span className="text-xs text-primary font-bold">{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            <div className="flex items-center justify-center gap-1 mb-8 flex-wrap">
              {STEPS.map(item => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => item.id < step && setStep(item.id)}
                    className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                      step === item.id
                        ? 'gradient-btn text-primary-foreground scale-110'
                        : step > item.id
                          ? 'bg-primary/20 text-primary'
                          : 'bg-muted text-muted-foreground'
                    }`}
                    title={item.label}
                  >
                    {step > item.id ? <Check className="h-3 w-3" /> : <Icon className="h-3.5 w-3.5" />}
                  </button>
                );
              })}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.2 }}
              >
                <div className="glass-panel rounded-2xl p-6 sm:p-8 min-h-[420px] shadow-xl shadow-primary/5">
                  {step === 0 && (
                    <div>
                      <h2 className="text-xl font-semibold text-foreground mb-1">Qual é a sua nacionalidade?</h2>
                      <p className="text-sm text-muted-foreground mb-4">
                        Você pode pesquisar por país, gentílico ou sigla. Ao escolher sua nacionalidade, o sistema sugere automaticamente seu país de origem inicial.
                      </p>
                      <div className="relative mb-4">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Ex.: brasileiro, português, Japão, US..."
                          value={natSearch}
                          onChange={event => setNatSearch(event.target.value)}
                          className="pl-10 rounded-xl"
                        />
                      </div>
                      {countriesLoading ? (
                        <div className="p-6 rounded-xl border border-border bg-card text-sm text-muted-foreground">
                          Carregando a lista global de nacionalidades e países...
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 max-h-[360px] overflow-y-auto pr-1">
                          {filteredNationalities.map(country => (
                            <button
                              key={country.code}
                              onClick={() => {
                                set('nationality', country.code);
                                if (!state.originCountry) set('originCountry', country.code);
                              }}
                              className={`flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${
                                state.nationality === country.code
                                  ? 'border-primary bg-primary/10 ring-1 ring-primary'
                                  : 'border-border bg-card hover:bg-muted/50'
                              }`}
                            >
                              <span className="text-xl">{country.flag}</span>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-foreground truncate">{country.demonym}</p>
                                <p className="text-xs text-muted-foreground truncate">{country.name}</p>
                              </div>
                              {state.nationality === country.code && <Check className="h-3.5 w-3.5 text-primary" />}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {step === 1 && (
                    <div>
                      <h2 className="text-xl font-semibold text-foreground mb-1">Você possui passaporte válido?</h2>
                      <p className="text-sm text-muted-foreground mb-4">
                        Para rotas internacionais, o passaporte é parte central da validação documental antes da emissão.
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                        <button
                          onClick={() => set('hasPassport', true)}
                          className={`p-5 rounded-xl border text-center transition-all ${
                            state.hasPassport === true
                              ? 'border-primary bg-primary/10 ring-1 ring-primary'
                              : 'border-border bg-card hover:bg-muted/50'
                          }`}
                        >
                          <span className="text-3xl block mb-2">✅</span>
                          <span className="font-semibold text-sm">Sim, tenho passaporte</span>
                        </button>
                        <button
                          onClick={() => set('hasPassport', false)}
                          className={`p-5 rounded-xl border text-center transition-all ${
                            state.hasPassport === false
                              ? 'border-destructive bg-destructive/10 ring-1 ring-destructive'
                              : 'border-border bg-card hover:bg-muted/50'
                          }`}
                        >
                          <span className="text-3xl block mb-2">❌</span>
                          <span className="font-semibold text-sm">Ainda não tenho passaporte</span>
                        </button>
                      </div>

                      {state.hasPassport === false && office && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
                          <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl">
                            <h4 className="text-amber-500 font-semibold text-sm mb-1 flex items-center gap-2">
                              <Info className="h-4 w-4" /> Onde solicitar seu passaporte
                            </h4>
                            <p className="text-muted-foreground text-xs">
                              Com base na nacionalidade selecionada, este é o órgão oficial sugerido para emissão ou regularização.
                            </p>
                          </div>
                          <div className="p-4 bg-card border border-border rounded-xl space-y-2">
                            <h4 className="font-semibold text-sm flex items-center gap-2">
                              <span>{office.flag}</span> {office.name.pt}
                            </h4>
                            <a
                              href={office.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary hover:underline text-sm flex items-center gap-1"
                            >
                              <ExternalLink className="h-3 w-3" /> Acessar site oficial
                            </a>
                            <div className="grid grid-cols-2 gap-2 mt-2">
                              <div className="bg-muted/50 rounded-lg p-2">
                                <span className="text-xs text-muted-foreground block">Prazo</span>
                                <span className="font-semibold text-xs">{office.processingTime.pt}</span>
                              </div>
                              <div className="bg-muted/50 rounded-lg p-2">
                                <span className="text-xs text-muted-foreground block">Custo</span>
                                <span className="font-semibold text-xs">{office.cost.pt}</span>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  )}

                  {step === 2 && (
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-xl font-semibold text-foreground mb-1">De onde você vai sair?</h2>
                        <p className="text-sm text-muted-foreground mb-4">
                          Esta informação é necessária para definir transporte, regras de rota e elegibilidade da jornada.
                        </p>
                        <div className="relative mb-3">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            placeholder="Pesquisar país de origem..."
                            value={originSearch}
                            onChange={event => setOriginSearch(event.target.value)}
                            className="pl-10 rounded-xl"
                          />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[220px] overflow-y-auto pr-1">
                          {filteredOrigins.map(country => (
                            <button
                              key={`origin-${country.code}`}
                              onClick={() => set('originCountry', country.code)}
                              className={`flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${
                                state.originCountry === country.code
                                  ? 'border-primary bg-primary/10 ring-1 ring-primary'
                                  : 'border-border bg-card hover:bg-muted/50'
                              }`}
                            >
                              <span className="text-xl">{country.flag}</span>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-foreground truncate">{country.name}</p>
                                <p className="text-xs text-muted-foreground truncate">{country.region}</p>
                              </div>
                              {state.originCountry === country.code && <Check className="h-3.5 w-3.5 text-primary" />}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h2 className="text-xl font-semibold text-foreground mb-1">Para onde você quer ir?</h2>
                        <p className="text-sm text-muted-foreground mb-4">
                          Todos os países disponíveis no catálogo global. Destinos de alto risco são bloqueados para venda online.
                        </p>
                        <div className="relative mb-3">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            placeholder="Pesquisar país de destino..."
                            value={destSearch}
                            onChange={event => setDestSearch(event.target.value)}
                            className="pl-10 rounded-xl"
                          />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[260px] overflow-y-auto pr-1">
                          {filteredDestinations.map(country => {
                            const countryIsBlocked = HIGH_RISK_COUNTRY_CODES.has(country.code);
                            return (
                              <button
                                key={`dest-${country.code}`}
                                onClick={() => set('destinationCode', country.code)}
                                className={`flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${
                                  state.destinationCode === country.code
                                    ? 'border-primary bg-primary/10 ring-1 ring-primary'
                                    : 'border-border bg-card hover:bg-muted/50'
                                }`}
                              >
                                <span className="text-xl">{country.flag}</span>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-foreground truncate">{country.name}</p>
                                  <p className="text-xs text-muted-foreground truncate">
                                    {country.region}
                                    {countryIsBlocked ? ' • venda bloqueada por risco' : ''}
                                  </p>
                                </div>
                                {countryIsBlocked && <AlertTriangle className="h-4 w-4 text-destructive" />}
                                {state.destinationCode === country.code && <Check className="h-3.5 w-3.5 text-primary" />}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {riskBlocked && selectedDestination && (
                        <div className="p-4 bg-destructive/10 border border-destructive/30 rounded-xl">
                          <h4 className="text-destructive font-semibold text-sm mb-1 flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4" /> Destino com venda online bloqueada
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {selectedDestination.flag} {selectedDestination.name} está marcado na regra atual do produto como destino de alto risco ou conflito. O sistema impede a continuidade automática para emissão e venda online.
                          </p>
                        </div>
                      )}

                      <div>
                        <Label className="text-xs text-muted-foreground">Datas de viagem</Label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1">
                          <Input type="date" value={state.departDate} onChange={event => set('departDate', event.target.value)} className="rounded-xl text-sm" />
                          <Input type="date" value={state.returnDate} onChange={event => set('returnDate', event.target.value)} className="rounded-xl text-sm" />
                        </div>
                      </div>

                      <div>
                        <Label className="text-xs text-muted-foreground">Número de viajantes</Label>
                        <div className="flex items-center gap-3 mt-1">
                          <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => set('travelers', Math.max(1, state.travelers - 1))}>-</Button>
                          <span className="text-lg font-bold w-8 text-center">{state.travelers}</span>
                          <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => set('travelers', Math.min(20, state.travelers + 1))}>+</Button>
                        </div>
                      </div>
                    </div>
                  )}

                  {step === 3 && (
                    <div>
                      <h2 className="text-xl font-semibold text-foreground mb-1">Qual é o objetivo da viagem?</h2>
                      <p className="text-sm text-muted-foreground mb-4">
                        O objetivo influencia diretamente o tipo de visto, a documentação exigida e o nível de validação antes da venda.
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {TRAVEL_PURPOSES.map(item => (
                          <OptionCard
                            key={item.value}
                            selected={state.purpose === item.value}
                            onClick={() => set('purpose', item.value)}
                            icon={item.icon}
                            label={item.label}
                            desc={item.desc}
                          />
                        ))}
                      </div>

                      {visaAssessment && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`mt-4 p-4 rounded-xl border ${
                            visaAssessment.status === 'ok'
                              ? 'bg-emerald-500/10 border-emerald-500/30'
                              : visaAssessment.status === 'blocked'
                                ? 'bg-destructive/10 border-destructive/30'
                                : 'bg-primary/5 border-primary/20'
                          }`}
                        >
                          <h4 className="font-semibold text-sm text-foreground mb-2 flex items-center gap-2">
                            <FileCheck className="h-4 w-4 text-primary" /> {visaAssessment.title}
                          </h4>
                          <div className="space-y-2 text-sm text-muted-foreground">
                            <p><strong className="text-foreground">Tipo de visto:</strong> {visaAssessment.visaType}</p>
                            <p>{visaAssessment.summary}</p>
                            <div className="bg-background/60 rounded-lg p-3 space-y-1">
                              {visaAssessment.nextSteps.map(item => (
                                <p key={item}>• {item}</p>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  )}

                  {step === 4 && (
                    <div className="space-y-5">
                      <div>
                        <h2 className="text-xl font-semibold text-foreground mb-1">Como você quer chegar?</h2>
                        <p className="text-sm text-muted-foreground mb-4">
                          A plataforma libera apenas opções compatíveis com a rota. Exemplo: saindo do Brasil para outro país, a opção padrão é avião. Em corredores europeus reais, trem e ônibus podem aparecer.
                        </p>
                        <div className="grid grid-cols-1 gap-3">
                          {availableTransportOptions.map(option => (
                            <OptionCard
                              key={option.value}
                              selected={state.transport === option.value}
                              onClick={() => set('transport', option.value)}
                              icon={option.icon}
                              label={option.label}
                              desc={option.desc}
                            />
                          ))}
                        </div>
                      </div>

                      <div className="p-4 bg-muted/30 rounded-xl text-sm text-muted-foreground">
                        <p>
                          <strong className="text-foreground">Rota analisada:</strong>{' '}
                          {selectedOrigin ? `${selectedOrigin.flag} ${selectedOrigin.name}` : 'Origem não definida'} →{' '}
                          {selectedDestination ? `${selectedDestination.flag} ${selectedDestination.name}` : 'Destino não definido'}
                        </p>
                        <p className="mt-2">
                          Regra aplicada: {selectedOrigin?.code === 'BR' && selectedDestination?.code !== 'BR'
                            ? 'rota internacional saindo do Brasil: somente avião disponível.'
                            : EURO_RAIL_COUNTRIES.has(selectedOrigin?.code || '') && EURO_RAIL_COUNTRIES.has(selectedDestination?.code || '')
                              ? 'corredor europeu elegível para trem e ônibus, além de voo.'
                              : 'rota sem corredor ferroviário internacional relevante: foco em avião.'}
                        </p>
                      </div>

                      {state.transport === 'flight' && (
                        <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
                          <div className="flex items-start justify-between gap-4 flex-wrap">
                            <div>
                              <h3 className="font-semibold text-foreground flex items-center gap-2">
                                <Plane className="h-4 w-4 text-primary" /> Ofertas de voo visíveis no funil
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                O frontend agora tenta buscar resultados reais pela função segura do backend. Quando as chaves ainda não estiverem ativas no backend, o sistema exibe dados demonstrativos para não quebrar a experiência.
                              </p>
                            </div>
                            <Button onClick={() => void searchFlights()} variant="outline" className="rounded-full gap-2">
                              {searchingFlights ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />} Atualizar voos
                            </Button>
                          </div>

                          {flightSource && (
                            <div className={`rounded-xl px-3 py-2 text-xs font-medium inline-flex items-center gap-2 ${flightSource === 'amadeus' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-amber-500/10 text-amber-600'}`}>
                              {flightSource === 'amadeus' ? <BadgeCheck className="h-3.5 w-3.5" /> : <Info className="h-3.5 w-3.5" />}
                              {flightSource === 'amadeus' ? 'Resultados reais via Amadeus' : 'Resultados demonstrativos enquanto o backend não retorna credenciais ativas'}
                            </div>
                          )}

                          {flightResults.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                              {flightResults.map(item => (
                                <OfferCard
                                  key={item.id}
                                  title={item.airline}
                                  subtitle={`${item.stops} parada(s) • ${item.duration}`}
                                  price={formatCurrency(item.price, item.currency)}
                                  badge={item.stops === 0 ? 'Melhor conforto' : 'Mais opções'}
                                  footer={`Saída: ${String(item.departure).slice(0, 10)}`}
                                />
                              ))}
                            </div>
                          ) : (
                            <div className="rounded-xl border border-dashed border-border p-5 text-sm text-muted-foreground">
                              Informe origem, destino e data para carregar as ofertas de voo.
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {step === 5 && (
                    <div className="space-y-5">
                      <div>
                        <h2 className="text-xl font-semibold text-foreground mb-1">Onde você quer ficar?</h2>
                        <p className="text-sm text-muted-foreground mb-4">
                          Você pode escolher hotel, hostel, apartamento ou simplesmente seguir sem reservar hospedagem nesta etapa.
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {ACCOMMODATION_OPTIONS.map(option => (
                            <button
                              key={option.value}
                              onClick={() => set('accommodation', option.value)}
                              className={`overflow-hidden rounded-2xl border transition-all text-left ${
                                state.accommodation === option.value
                                  ? 'border-primary ring-2 ring-primary bg-primary/5'
                                  : 'border-border bg-card hover:border-primary/40'
                              }`}
                            >
                              <img src={option.image} alt={option.label} className="w-full h-36 object-cover" />
                              <div className="p-4">
                                <div className="flex items-center justify-between gap-3 mb-1">
                                  <h3 className="font-semibold text-sm text-foreground">{option.icon} {option.label}</h3>
                                  <span className="text-xs text-amber-500 font-semibold">⭐ {option.rating}</span>
                                </div>
                                <p className="text-xs text-muted-foreground">{option.desc}</p>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>

                      {state.accommodation !== 'none' && (
                        <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
                          <div className="flex items-start justify-between gap-4 flex-wrap">
                            <div>
                              <h3 className="font-semibold text-foreground flex items-center gap-2">
                                <Building2 className="h-4 w-4 text-primary" /> Sugestões de hospedagem visíveis no fluxo
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                As sugestões abaixo usam a mesma estratégia de backend seguro: retornam dados reais quando a integração responde e mantêm fallback demonstrativo quando necessário.
                              </p>
                            </div>
                            <Button onClick={() => void searchHotels()} variant="outline" className="rounded-full gap-2">
                              {searchingHotels ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />} Atualizar hospedagens
                            </Button>
                          </div>

                          {hotelSource && (
                            <div className={`rounded-xl px-3 py-2 text-xs font-medium inline-flex items-center gap-2 ${hotelSource === 'amadeus' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-amber-500/10 text-amber-600'}`}>
                              {hotelSource === 'amadeus' ? <BadgeCheck className="h-3.5 w-3.5" /> : <Info className="h-3.5 w-3.5" />}
                              {hotelSource === 'amadeus' ? 'Resultados reais de hospedagem via Amadeus' : 'Resultados demonstrativos de hospedagem enquanto o backend não retorna credenciais ativas'}
                            </div>
                          )}

                          {hotelResults.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                              {hotelResults.map(item => (
                                <OfferCard
                                  key={item.id}
                                  title={item.name}
                                  subtitle={`${item.stars} estrela(s) • ${item.location}`}
                                  price={formatCurrency(item.price, item.currency)}
                                  badge="Melhor custo"
                                  footer="Preço estimado por diária ou oferta disponível"
                                />
                              ))}
                            </div>
                          ) : (
                            <div className="rounded-xl border border-dashed border-border p-5 text-sm text-muted-foreground">
                              Defina a hospedagem e as datas para carregar sugestões disponíveis.
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {step === 6 && (
                    <div>
                      <h2 className="text-xl font-semibold text-foreground mb-1">Como você quer se locomover no destino?</h2>
                      <p className="text-sm text-muted-foreground mb-4">
                        Você pode selecionar mais de uma opção ou deixar para decidir depois.
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {LOCAL_TRANSPORT.map(option => (
                          <OptionCard
                            key={option.value}
                            selected={state.localTransport.includes(option.value)}
                            onClick={() => {
                              if (option.value === 'none') {
                                set('localTransport', ['none']);
                                return;
                              }
                              toggleArray('localTransport', option.value);
                            }}
                            icon={option.icon}
                            label={option.label}
                            desc={option.desc}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {step === 7 && (
                    <div>
                      <h2 className="text-xl font-semibold text-foreground mb-1">Seguro viagem</h2>
                      <p className="text-sm text-muted-foreground mb-4">
                        O seguro pode ser obrigatório dependendo da rota e das regras documentais. Mesmo quando opcional, ele é uma das frentes centrais de monetização do produto.
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {INSURANCE_OPTIONS.map(option => (
                          <OptionCard
                            key={option.value}
                            selected={state.insurance === option.value}
                            onClick={() => set('insurance', option.value)}
                            icon={option.icon}
                            label={option.label}
                            desc={option.desc}
                            extra={option.price}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {step === 8 && (
                    <div>
                      <h2 className="text-xl font-semibold text-foreground mb-1">O que você quer fazer?</h2>
                      <p className="text-sm text-muted-foreground mb-4">
                        Selecione experiências, restaurantes, tours e até guias locais gratuitos para enriquecer a jornada.
                      </p>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {EXPERIENCE_OPTIONS.map(option => (
                          <button
                            key={option.value}
                            onClick={() => toggleArray('experiences', option.value)}
                            className={`p-4 rounded-xl border text-center transition-all ${
                              state.experiences.includes(option.value)
                                ? 'border-primary bg-primary/10 ring-1 ring-primary'
                                : 'border-border bg-card hover:bg-muted/50'
                            }`}
                          >
                            <span className="text-2xl block mb-1">{option.icon}</span>
                            <span className="text-xs font-medium text-foreground">{option.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {step === 9 && (
                    <div>
                      <h2 className="text-xl font-semibold text-foreground mb-4">Revise seu plano antes de continuar</h2>
                      <div className="space-y-3">
                        <SummaryRow label="Nacionalidade" value={selectedNationality ? `${selectedNationality.flag} ${selectedNationality.demonym}` : '-'} />
                        <SummaryRow label="Origem" value={selectedOrigin ? `${selectedOrigin.flag} ${selectedOrigin.name}` : '-'} />
                        <SummaryRow label="Destino" value={selectedDestination ? `${selectedDestination.flag} ${selectedDestination.name}` : '-'} />
                        <SummaryRow label="Passaporte" value={state.hasPassport ? 'Sim' : 'Não'} />
                        <SummaryRow label="Objetivo" value={TRAVEL_PURPOSES.find(item => item.value === state.purpose)?.label} />
                        <SummaryRow label="Tipo de visto / validação" value={visaAssessment?.visaType} />
                        <SummaryRow label="Transporte" value={TRANSPORT_OPTIONS.find(item => item.value === state.transport)?.label} />
                        <SummaryRow label="Melhor oferta de voo" value={topFlight ? `${topFlight.airline} • ${formatCurrency(topFlight.price, topFlight.currency)}` : 'Ainda não carregada'} />
                        <SummaryRow label="Hospedagem" value={ACCOMMODATION_OPTIONS.find(item => item.value === state.accommodation)?.label} />
                        <SummaryRow label="Melhor hospedagem sugerida" value={topHotel ? `${topHotel.name} • ${formatCurrency(topHotel.price, topHotel.currency)}` : 'Ainda não carregada'} />
                        <SummaryRow label="Locomoção local" value={state.localTransport.map(item => LOCAL_TRANSPORT.find(option => option.value === item)?.label).filter(Boolean).join(', ')} />
                        <SummaryRow label="Seguro" value={INSURANCE_OPTIONS.find(item => item.value === state.insurance)?.label} />
                        <SummaryRow label="Experiências" value={state.experiences.map(item => EXPERIENCE_OPTIONS.find(option => option.value === item)?.label).filter(Boolean).join(', ') || 'Nenhuma'} />
                        <SummaryRow label="Viajantes" value={String(state.travelers)} />
                        <SummaryRow label="Período" value={state.departDate ? `${state.departDate} → ${state.returnDate || 'em aberto'}` : 'Não informado'} />
                      </div>

                      {visaAssessment && (
                        <div className={`mt-4 p-4 rounded-xl border ${visaAssessment.status === 'blocked' ? 'border-destructive/30 bg-destructive/10' : 'border-primary/20 bg-primary/5'}`}>
                          <p className="text-sm text-foreground font-semibold mb-1">Resumo documental</p>
                          <p className="text-sm text-muted-foreground">{visaAssessment.summary}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {step === 10 && (
                    <div>
                      <h2 className="text-xl font-semibold text-foreground mb-1">Última etapa: salve e crie sua conta</h2>
                      <p className="text-sm text-muted-foreground mb-4">
                        Após concluir este formulário, você será direcionado para criar sua conta e acompanhar suas próximas etapas de viagem.
                      </p>
                      <div className="space-y-4">
                        <div>
                          <Label>Nome completo *</Label>
                          <Input value={state.name} onChange={event => set('name', event.target.value)} placeholder="Seu nome" className="rounded-xl mt-1" />
                        </div>
                        <div>
                          <Label>E-mail *</Label>
                          <Input value={state.email} onChange={event => set('email', event.target.value)} type="email" placeholder="seu@email.com" className="rounded-xl mt-1" />
                        </div>
                        <div>
                          <Label>WhatsApp</Label>
                          <Input value={state.phone} onChange={event => set('phone', event.target.value)} placeholder="(11) 99999-9999" className="rounded-xl mt-1" />
                        </div>
                        <div>
                          <Label>Observações (opcional)</Label>
                          <Textarea value={state.notes} onChange={event => set('notes', event.target.value)} placeholder="Preferências, restrições ou detalhes adicionais" className="rounded-xl mt-1" rows={3} />
                        </div>
                      </div>

                      <div className="mt-4 p-4 bg-muted/30 rounded-xl text-sm text-muted-foreground">
                        <p className="font-semibold text-foreground mb-1">Próximo passo automático</p>
                        <p>
                          Ao clicar em concluir, o sistema salva seu planejamento, registra o evento comercial e leva você para a página de cadastro ou login para continuar a jornada como usuário autenticado.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="flex justify-between mt-6 gap-3">
              <Button variant="outline" onClick={goPrev} disabled={step === 0} className="rounded-full gap-2">
                <ChevronLeft className="h-4 w-4" /> Voltar
              </Button>
              {step < STEPS.length - 1 ? (
                <Button onClick={goNext} disabled={!canProceed()} className="gradient-btn rounded-full gap-2">
                  Próximo <ChevronRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button onClick={handleSubmit} disabled={submitting || !canProceed()} className="gradient-btn rounded-full gap-2" size="lg">
                  {submitting ? 'Salvando...' : <><Send className="h-4 w-4" /> Concluir e criar conta</>}
                </Button>
              )}
            </div>

            <div className="mt-10 grid grid-cols-1 sm:grid-cols-4 gap-4 text-center">
              <div className="glass-panel rounded-xl p-4">
                <p className="text-2xl font-bold text-primary">🌍</p>
                <p className="text-xs text-muted-foreground">Catálogo global de países</p>
              </div>
              <div className="glass-panel rounded-xl p-4">
                <p className="text-2xl font-bold text-primary">🛂</p>
                <p className="text-xs text-muted-foreground">Fluxo documental mais inteligente</p>
              </div>
              <div className="glass-panel rounded-xl p-4">
                <p className="text-2xl font-bold text-primary">✈️</p>
                <p className="text-xs text-muted-foreground">Busca visível de voo e hospedagem</p>
              </div>
              <div className="glass-panel rounded-xl p-4">
                <p className="text-2xl font-bold text-primary">🧾</p>
                <p className="text-xs text-muted-foreground">Conta criada ao final da jornada</p>
              </div>
            </div>
          </div>

          <aside className="xl:sticky xl:top-28 space-y-4">
            <div className="rounded-3xl border border-border bg-card p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <Lock className="h-4 w-4 text-primary" />
                <p className="font-semibold text-foreground">Resumo inteligente da viagem</p>
              </div>
              <div className="space-y-3">
                <SummaryRow label="Destino" value={selectedDestination ? `${selectedDestination.flag} ${selectedDestination.name}` : 'Escolha um destino'} />
                <SummaryRow label="Documentação" value={visaAssessment?.visaType || 'A definir'} />
                <SummaryRow label="Transporte" value={TRANSPORT_OPTIONS.find(item => item.value === state.transport)?.label || 'A definir'} />
                <SummaryRow label="Hospedagem" value={ACCOMMODATION_OPTIONS.find(item => item.value === state.accommodation)?.label || 'Opcional'} />
                <SummaryRow label="Melhor voo" value={topFlight ? formatCurrency(topFlight.price, topFlight.currency) : 'Sem oferta ainda'} />
                <SummaryRow label="Melhor hospedagem" value={topHotel ? formatCurrency(topHotel.price, topHotel.currency) : 'Sem oferta ainda'} />
              </div>
            </div>

          </aside>
        </div>
      </div>

      <Footer />
      <StickyWhatsApp message="Olá! Preciso de ajuda para planejar minha viagem." />
    </div>
  );
};

export default PlanTripPage;
