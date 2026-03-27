import { useLanguage, type Language } from '@/contexts/LanguageContext';
import { useMemo, useCallback } from 'react';

const currencyMap: Record<Language, { code: string; symbol: string; rate: number }> = {
  pt: { code: 'BRL', symbol: 'R$', rate: 1 },
  en: { code: 'USD', symbol: '$', rate: 0.20 },
  es: { code: 'EUR', symbol: '€', rate: 0.18 },
};

export const useCurrency = () => {
  const { language } = useLanguage();
  const currency = useMemo(() => currencyMap[language], [language]);

  const format = useCallback((brlValue: number): string => {
    const converted = Math.round(brlValue * currency.rate);
    return `${currency.symbol} ${converted.toLocaleString()}`;
  }, [currency]);

  return { ...currency, format };
};

export interface Destination {
  id: string;
  name: string;
  country: Record<Language, string>;
  region: 'brasil' | 'south-america' | 'north-america' | 'central-america' | 'caribbean' | 'europe' | 'asia' | 'middle-east' | 'africa' | 'oceania';
  priceBRL: number;
  image: string;
  featured?: boolean;
}

export const allDestinations: Destination[] = [
  // ═══════════════════ BRASIL ═══════════════════
  { id: 'rio', name: 'Rio de Janeiro', country: { pt: 'Brasil', en: 'Brazil', es: 'Brasil' }, region: 'brasil', priceBRL: 1200, image: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=600&q=80', featured: true },
  { id: 'saopaulo', name: 'São Paulo', country: { pt: 'Brasil', en: 'Brazil', es: 'Brasil' }, region: 'brasil', priceBRL: 600, image: 'https://images.unsplash.com/photo-1543059080-f9b1272213d5?w=600&q=80' },
  { id: 'salvador', name: 'Salvador', country: { pt: 'Brasil', en: 'Brazil', es: 'Brasil' }, region: 'brasil', priceBRL: 1100, image: 'https://images.unsplash.com/photo-1589556264800-08ae9e129a8c?w=600&q=80' },
  { id: 'florianopolis', name: 'Florianópolis', country: { pt: 'Brasil', en: 'Brazil', es: 'Brasil' }, region: 'brasil', priceBRL: 950, image: 'https://images.unsplash.com/photo-1588001832198-c15cff59b078?w=600&q=80' },
  { id: 'gramado', name: 'Gramado', country: { pt: 'Brasil', en: 'Brazil', es: 'Brasil' }, region: 'brasil', priceBRL: 800, image: 'https://images.unsplash.com/photo-1590073844006-33379778ae09?w=600&q=80' },
  { id: 'iguacu', name: 'Foz do Iguaçu', country: { pt: 'Brasil', en: 'Brazil', es: 'Brasil' }, region: 'brasil', priceBRL: 1000, image: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?w=600&q=80' },
  { id: 'natal', name: 'Natal', country: { pt: 'Brasil', en: 'Brazil', es: 'Brasil' }, region: 'brasil', priceBRL: 1100, image: 'https://images.unsplash.com/photo-1590071089561-0aee75996e50?w=600&q=80' },
  { id: 'recife', name: 'Recife', country: { pt: 'Brasil', en: 'Brazil', es: 'Brasil' }, region: 'brasil', priceBRL: 1050, image: 'https://images.unsplash.com/photo-1598301257982-0cf014dabbcd?w=600&q=80' },
  { id: 'fortaleza', name: 'Fortaleza', country: { pt: 'Brasil', en: 'Brazil', es: 'Brasil' }, region: 'brasil', priceBRL: 1150, image: 'https://images.unsplash.com/photo-1611606063065-ee7946f0787a?w=600&q=80' },
  { id: 'manaus', name: 'Manaus', country: { pt: 'Brasil', en: 'Brazil', es: 'Brasil' }, region: 'brasil', priceBRL: 1300, image: 'https://images.unsplash.com/photo-1619546952812-520e98064a52?w=600&q=80' },
  { id: 'curitiba', name: 'Curitiba', country: { pt: 'Brasil', en: 'Brazil', es: 'Brasil' }, region: 'brasil', priceBRL: 700, image: 'https://images.unsplash.com/photo-1597564661879-49dd3c1c8af4?w=600&q=80' },
  { id: 'brasilia', name: 'Brasília', country: { pt: 'Brasil', en: 'Brazil', es: 'Brasil' }, region: 'brasil', priceBRL: 750, image: 'https://images.unsplash.com/photo-1553182977-9a2c78f997c0?w=600&q=80' },
  { id: 'beloHorizonte', name: 'Belo Horizonte', country: { pt: 'Brasil', en: 'Brazil', es: 'Brasil' }, region: 'brasil', priceBRL: 650, image: 'https://images.unsplash.com/photo-1618425437929-9a7f9e1a0e67?w=600&q=80' },
  { id: 'maceio', name: 'Maceió', country: { pt: 'Brasil', en: 'Brazil', es: 'Brasil' }, region: 'brasil', priceBRL: 1080, image: 'https://images.unsplash.com/photo-1590071089561-0aee75996e50?w=600&q=80' },
  { id: 'portoalegre', name: 'Porto Alegre', country: { pt: 'Brasil', en: 'Brazil', es: 'Brasil' }, region: 'brasil', priceBRL: 680, image: 'https://images.unsplash.com/photo-1597564661879-49dd3c1c8af4?w=600&q=80' },
  { id: 'fernandoNoronha', name: 'Fernando de Noronha', country: { pt: 'Brasil', en: 'Brazil', es: 'Brasil' }, region: 'brasil', priceBRL: 2500, image: 'https://images.unsplash.com/photo-1591302418462-eb55463efabb?w=600&q=80', featured: true },
  { id: 'chapadadiamantina', name: 'Chapada Diamantina', country: { pt: 'Brasil', en: 'Brazil', es: 'Brasil' }, region: 'brasil', priceBRL: 900, image: 'https://images.unsplash.com/photo-1590071089561-0aee75996e50?w=600&q=80' },
  { id: 'bonito', name: 'Bonito', country: { pt: 'Brasil', en: 'Brazil', es: 'Brasil' }, region: 'brasil', priceBRL: 1100, image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&q=80' },
  { id: 'jericoacoara', name: 'Jericoacoara', country: { pt: 'Brasil', en: 'Brazil', es: 'Brasil' }, region: 'brasil', priceBRL: 1200, image: 'https://images.unsplash.com/photo-1611606063065-ee7946f0787a?w=600&q=80' },
  { id: 'lencois', name: 'Lençóis Maranhenses', country: { pt: 'Brasil', en: 'Brazil', es: 'Brasil' }, region: 'brasil', priceBRL: 1400, image: 'https://images.unsplash.com/photo-1590071089561-0aee75996e50?w=600&q=80' },

  // ═══════════════════ AMÉRICA DO SUL ═══════════════════
  { id: 'buenosaires', name: 'Buenos Aires', country: { pt: 'Argentina', en: 'Argentina', es: 'Argentina' }, region: 'south-america', priceBRL: 2800, image: 'https://images.unsplash.com/photo-1589909202802-8f4aadce1849?w=600&q=80', featured: true },
  { id: 'bariloche', name: 'Bariloche', country: { pt: 'Argentina', en: 'Argentina', es: 'Argentina' }, region: 'south-america', priceBRL: 3200, image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=600&q=80' },
  { id: 'mendoza', name: 'Mendoza', country: { pt: 'Argentina', en: 'Argentina', es: 'Argentina' }, region: 'south-america', priceBRL: 2900, image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=600&q=80' },
  { id: 'ushuaia', name: 'Ushuaia', country: { pt: 'Argentina', en: 'Argentina', es: 'Argentina' }, region: 'south-america', priceBRL: 3800, image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=600&q=80' },
  { id: 'santiago', name: 'Santiago', country: { pt: 'Chile', en: 'Chile', es: 'Chile' }, region: 'south-america', priceBRL: 2600, image: 'https://images.unsplash.com/photo-1569161031678-19c41e13a1e7?w=600&q=80' },
  { id: 'atacama', name: 'Atacama', country: { pt: 'Chile', en: 'Chile', es: 'Chile' }, region: 'south-america', priceBRL: 3500, image: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=600&q=80' },
  { id: 'torres', name: 'Torres del Paine', country: { pt: 'Chile', en: 'Chile', es: 'Chile' }, region: 'south-america', priceBRL: 4000, image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=600&q=80' },
  { id: 'lima', name: 'Lima', country: { pt: 'Peru', en: 'Peru', es: 'Perú' }, region: 'south-america', priceBRL: 2400, image: 'https://images.unsplash.com/photo-1531968899763-f042a406e18c?w=600&q=80' },
  { id: 'cusco', name: 'Cusco', country: { pt: 'Peru', en: 'Peru', es: 'Perú' }, region: 'south-america', priceBRL: 2800, image: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?w=600&q=80' },
  { id: 'machupicchu', name: 'Machu Picchu', country: { pt: 'Peru', en: 'Peru', es: 'Perú' }, region: 'south-america', priceBRL: 3200, image: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?w=600&q=80', featured: true },
  { id: 'bogota', name: 'Bogotá', country: { pt: 'Colômbia', en: 'Colombia', es: 'Colombia' }, region: 'south-america', priceBRL: 2200, image: 'https://images.unsplash.com/photo-1568632234157-ce7aecd03d0d?w=600&q=80' },
  { id: 'cartagena', name: 'Cartagena', country: { pt: 'Colômbia', en: 'Colombia', es: 'Colombia' }, region: 'south-america', priceBRL: 2700, image: 'https://images.unsplash.com/photo-1583531172005-814042858d2e?w=600&q=80' },
  { id: 'medellin', name: 'Medellín', country: { pt: 'Colômbia', en: 'Colombia', es: 'Colombia' }, region: 'south-america', priceBRL: 2300, image: 'https://images.unsplash.com/photo-1568632234157-ce7aecd03d0d?w=600&q=80' },
  { id: 'montevideo', name: 'Montevidéu', country: { pt: 'Uruguai', en: 'Uruguay', es: 'Uruguay' }, region: 'south-america', priceBRL: 2500, image: 'https://images.unsplash.com/photo-1599420186946-7b6fb4e297f0?w=600&q=80' },
  { id: 'puntadeleste', name: 'Punta del Este', country: { pt: 'Uruguai', en: 'Uruguay', es: 'Uruguay' }, region: 'south-america', priceBRL: 3000, image: 'https://images.unsplash.com/photo-1599420186946-7b6fb4e297f0?w=600&q=80' },
  { id: 'quito', name: 'Quito', country: { pt: 'Equador', en: 'Ecuador', es: 'Ecuador' }, region: 'south-america', priceBRL: 2400, image: 'https://images.unsplash.com/photo-1570789210967-2cac24834d46?w=600&q=80' },
  { id: 'galapagos', name: 'Galápagos', country: { pt: 'Equador', en: 'Ecuador', es: 'Ecuador' }, region: 'south-america', priceBRL: 6000, image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&q=80' },
  { id: 'lapaz', name: 'La Paz', country: { pt: 'Bolívia', en: 'Bolivia', es: 'Bolivia' }, region: 'south-america', priceBRL: 1800, image: 'https://images.unsplash.com/photo-1570789210967-2cac24834d46?w=600&q=80' },
  { id: 'salar', name: 'Salar de Uyuni', country: { pt: 'Bolívia', en: 'Bolivia', es: 'Bolivia' }, region: 'south-america', priceBRL: 2200, image: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=600&q=80' },
  { id: 'asuncion', name: 'Assunção', country: { pt: 'Paraguai', en: 'Paraguay', es: 'Paraguay' }, region: 'south-america', priceBRL: 1500, image: 'https://images.unsplash.com/photo-1570789210967-2cac24834d46?w=600&q=80' },
  { id: 'caracas', name: 'Caracas', country: { pt: 'Venezuela', en: 'Venezuela', es: 'Venezuela' }, region: 'south-america', priceBRL: 2000, image: 'https://images.unsplash.com/photo-1570789210967-2cac24834d46?w=600&q=80' },
  { id: 'georgetown', name: 'Georgetown', country: { pt: 'Guiana', en: 'Guyana', es: 'Guyana' }, region: 'south-america', priceBRL: 2800, image: 'https://images.unsplash.com/photo-1570789210967-2cac24834d46?w=600&q=80' },
  { id: 'paramaribo', name: 'Paramaribo', country: { pt: 'Suriname', en: 'Suriname', es: 'Surinam' }, region: 'south-america', priceBRL: 2600, image: 'https://images.unsplash.com/photo-1570789210967-2cac24834d46?w=600&q=80' },

  // ═══════════════════ AMÉRICA DO NORTE ═══════════════════
  { id: 'nyc', name: 'Nova York', country: { pt: 'EUA', en: 'USA', es: 'EE.UU.' }, region: 'north-america', priceBRL: 3800, image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=600&q=80', featured: true },
  { id: 'miami', name: 'Miami', country: { pt: 'EUA', en: 'USA', es: 'EE.UU.' }, region: 'north-america', priceBRL: 3500, image: 'https://images.unsplash.com/photo-1533106497176-45ae19e68ba2?w=600&q=80' },
  { id: 'orlando', name: 'Orlando', country: { pt: 'EUA', en: 'USA', es: 'EE.UU.' }, region: 'north-america', priceBRL: 3600, image: 'https://images.unsplash.com/photo-1575089976121-8ed7b2a54265?w=600&q=80' },
  { id: 'losangeles', name: 'Los Angeles', country: { pt: 'EUA', en: 'USA', es: 'EE.UU.' }, region: 'north-america', priceBRL: 4000, image: 'https://images.unsplash.com/photo-1534190760961-74e8c1c5c3da?w=600&q=80' },
  { id: 'lasvegas', name: 'Las Vegas', country: { pt: 'EUA', en: 'USA', es: 'EE.UU.' }, region: 'north-america', priceBRL: 3700, image: 'https://images.unsplash.com/photo-1605833556294-ea5c7a74f57d?w=600&q=80' },
  { id: 'sanfrancisco', name: 'San Francisco', country: { pt: 'EUA', en: 'USA', es: 'EE.UU.' }, region: 'north-america', priceBRL: 4200, image: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=600&q=80' },
  { id: 'chicago', name: 'Chicago', country: { pt: 'EUA', en: 'USA', es: 'EE.UU.' }, region: 'north-america', priceBRL: 3600, image: 'https://images.unsplash.com/photo-1494522855154-9297ac14b55f?w=600&q=80' },
  { id: 'washington', name: 'Washington D.C.', country: { pt: 'EUA', en: 'USA', es: 'EE.UU.' }, region: 'north-america', priceBRL: 3500, image: 'https://images.unsplash.com/photo-1501466044931-62695aada8e9?w=600&q=80' },
  { id: 'hawaii', name: 'Havaí', country: { pt: 'EUA', en: 'USA', es: 'EE.UU.' }, region: 'north-america', priceBRL: 5500, image: 'https://images.unsplash.com/photo-1507876466758-bc54f384809c?w=600&q=80' },
  { id: 'boston', name: 'Boston', country: { pt: 'EUA', en: 'USA', es: 'EE.UU.' }, region: 'north-america', priceBRL: 3800, image: 'https://images.unsplash.com/photo-1501979376754-2ff867a4f659?w=600&q=80' },
  { id: 'toronto', name: 'Toronto', country: { pt: 'Canadá', en: 'Canada', es: 'Canadá' }, region: 'north-america', priceBRL: 3800, image: 'https://images.unsplash.com/photo-1517090504332-84f83e3bc024?w=600&q=80' },
  { id: 'vancouver', name: 'Vancouver', country: { pt: 'Canadá', en: 'Canada', es: 'Canadá' }, region: 'north-america', priceBRL: 4000, image: 'https://images.unsplash.com/photo-1559511260-66a68e7e1e68?w=600&q=80' },
  { id: 'montreal', name: 'Montreal', country: { pt: 'Canadá', en: 'Canada', es: 'Canadá' }, region: 'north-america', priceBRL: 3700, image: 'https://images.unsplash.com/photo-1559511260-66a68e7e1e68?w=600&q=80' },
  { id: 'banff', name: 'Banff', country: { pt: 'Canadá', en: 'Canada', es: 'Canadá' }, region: 'north-america', priceBRL: 4200, image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=600&q=80' },

  // ═══════════════════ AMÉRICA CENTRAL ═══════════════════
  { id: 'cancun', name: 'Cancún', country: { pt: 'México', en: 'Mexico', es: 'México' }, region: 'central-america', priceBRL: 3200, image: 'https://images.unsplash.com/photo-1510097467424-192d713fd8b2?w=600&q=80', featured: true },
  { id: 'cidadedomexico', name: 'Cidade do México', country: { pt: 'México', en: 'Mexico', es: 'México' }, region: 'central-america', priceBRL: 2800, image: 'https://images.unsplash.com/photo-1585464231875-d9ef1f5ad396?w=600&q=80' },
  { id: 'playadelcarmen', name: 'Playa del Carmen', country: { pt: 'México', en: 'Mexico', es: 'México' }, region: 'central-america', priceBRL: 3100, image: 'https://images.unsplash.com/photo-1510097467424-192d713fd8b2?w=600&q=80' },
  { id: 'tulum', name: 'Tulum', country: { pt: 'México', en: 'Mexico', es: 'México' }, region: 'central-america', priceBRL: 3300, image: 'https://images.unsplash.com/photo-1510097467424-192d713fd8b2?w=600&q=80' },
  { id: 'sanjose', name: 'San José', country: { pt: 'Costa Rica', en: 'Costa Rica', es: 'Costa Rica' }, region: 'central-america', priceBRL: 2800, image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&q=80' },
  { id: 'panama', name: 'Cidade do Panamá', country: { pt: 'Panamá', en: 'Panama', es: 'Panamá' }, region: 'central-america', priceBRL: 2600, image: 'https://images.unsplash.com/photo-1570789210967-2cac24834d46?w=600&q=80' },
  { id: 'guatemala', name: 'Antígua Guatemala', country: { pt: 'Guatemala', en: 'Guatemala', es: 'Guatemala' }, region: 'central-america', priceBRL: 2200, image: 'https://images.unsplash.com/photo-1570789210967-2cac24834d46?w=600&q=80' },
  { id: 'belize', name: 'Belize City', country: { pt: 'Belize', en: 'Belize', es: 'Belice' }, region: 'central-america', priceBRL: 3000, image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&q=80' },

  // ═══════════════════ CARIBE ═══════════════════
  { id: 'havana', name: 'Havana', country: { pt: 'Cuba', en: 'Cuba', es: 'Cuba' }, region: 'caribbean', priceBRL: 3000, image: 'https://images.unsplash.com/photo-1500759285222-a95626b934cb?w=600&q=80' },
  { id: 'puntacana', name: 'Punta Cana', country: { pt: 'República Dominicana', en: 'Dominican Republic', es: 'República Dominicana' }, region: 'caribbean', priceBRL: 3200, image: 'https://images.unsplash.com/photo-1510097467424-192d713fd8b2?w=600&q=80', featured: true },
  { id: 'aruba', name: 'Aruba', country: { pt: 'Aruba', en: 'Aruba', es: 'Aruba' }, region: 'caribbean', priceBRL: 4500, image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&q=80' },
  { id: 'curacao', name: 'Curaçao', country: { pt: 'Curaçao', en: 'Curaçao', es: 'Curazao' }, region: 'caribbean', priceBRL: 4200, image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&q=80' },
  { id: 'jamaica', name: 'Kingston', country: { pt: 'Jamaica', en: 'Jamaica', es: 'Jamaica' }, region: 'caribbean', priceBRL: 3800, image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&q=80' },
  { id: 'sanmartin', name: 'Saint Martin', country: { pt: 'Saint Martin', en: 'Saint Martin', es: 'San Martín' }, region: 'caribbean', priceBRL: 4800, image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&q=80' },
  { id: 'barbados', name: 'Barbados', country: { pt: 'Barbados', en: 'Barbados', es: 'Barbados' }, region: 'caribbean', priceBRL: 4500, image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&q=80' },
  { id: 'bahamas', name: 'Nassau', country: { pt: 'Bahamas', en: 'Bahamas', es: 'Bahamas' }, region: 'caribbean', priceBRL: 5000, image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&q=80' },
  { id: 'trinidadtobago', name: 'Trinidad e Tobago', country: { pt: 'Trinidad e Tobago', en: 'Trinidad and Tobago', es: 'Trinidad y Tobago' }, region: 'caribbean', priceBRL: 3600, image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&q=80' },

  // ═══════════════════ EUROPA ═══════════════════
  { id: 'paris', name: 'Paris', country: { pt: 'França', en: 'France', es: 'Francia' }, region: 'europe', priceBRL: 4500, image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&q=80', featured: true },
  { id: 'nice', name: 'Nice', country: { pt: 'França', en: 'France', es: 'Francia' }, region: 'europe', priceBRL: 4700, image: 'https://images.unsplash.com/photo-1491166617655-0723a0999cfc?w=600&q=80' },
  { id: 'lyon', name: 'Lyon', country: { pt: 'França', en: 'France', es: 'Francia' }, region: 'europe', priceBRL: 4200, image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&q=80' },
  { id: 'rome', name: 'Roma', country: { pt: 'Itália', en: 'Italy', es: 'Italia' }, region: 'europe', priceBRL: 4100, image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=600&q=80', featured: true },
  { id: 'milan', name: 'Milão', country: { pt: 'Itália', en: 'Italy', es: 'Italia' }, region: 'europe', priceBRL: 4300, image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=600&q=80' },
  { id: 'florence', name: 'Florença', country: { pt: 'Itália', en: 'Italy', es: 'Italia' }, region: 'europe', priceBRL: 4200, image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=600&q=80' },
  { id: 'venice', name: 'Veneza', country: { pt: 'Itália', en: 'Italy', es: 'Italia' }, region: 'europe', priceBRL: 4500, image: 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=600&q=80' },
  { id: 'amalfi', name: 'Costa Amalfitana', country: { pt: 'Itália', en: 'Italy', es: 'Italia' }, region: 'europe', priceBRL: 5000, image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=600&q=80' },
  { id: 'london', name: 'Londres', country: { pt: 'Inglaterra', en: 'England', es: 'Inglaterra' }, region: 'europe', priceBRL: 4800, image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=600&q=80' },
  { id: 'edinburgh', name: 'Edimburgo', country: { pt: 'Escócia', en: 'Scotland', es: 'Escocia' }, region: 'europe', priceBRL: 4600, image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=600&q=80' },
  { id: 'barcelona', name: 'Barcelona', country: { pt: 'Espanha', en: 'Spain', es: 'España' }, region: 'europe', priceBRL: 4200, image: 'https://images.unsplash.com/photo-1583422409516-2895a77efed6?w=600&q=80' },
  { id: 'madrid', name: 'Madrid', country: { pt: 'Espanha', en: 'Spain', es: 'España' }, region: 'europe', priceBRL: 4000, image: 'https://images.unsplash.com/photo-1543783207-ec64e4d95325?w=600&q=80' },
  { id: 'sevilla', name: 'Sevilha', country: { pt: 'Espanha', en: 'Spain', es: 'España' }, region: 'europe', priceBRL: 3800, image: 'https://images.unsplash.com/photo-1543783207-ec64e4d95325?w=600&q=80' },
  { id: 'ibiza', name: 'Ibiza', country: { pt: 'Espanha', en: 'Spain', es: 'España' }, region: 'europe', priceBRL: 4500, image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=600&q=80' },
  { id: 'lisbon', name: 'Lisboa', country: { pt: 'Portugal', en: 'Portugal', es: 'Portugal' }, region: 'europe', priceBRL: 3900, image: 'https://images.unsplash.com/photo-1585208798174-6cedd86e019a?w=600&q=80' },
  { id: 'porto', name: 'Porto', country: { pt: 'Portugal', en: 'Portugal', es: 'Portugal' }, region: 'europe', priceBRL: 3700, image: 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=600&q=80' },
  { id: 'algarve', name: 'Algarve', country: { pt: 'Portugal', en: 'Portugal', es: 'Portugal' }, region: 'europe', priceBRL: 3800, image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=600&q=80' },
  { id: 'amsterdam', name: 'Amsterdã', country: { pt: 'Holanda', en: 'Netherlands', es: 'Países Bajos' }, region: 'europe', priceBRL: 4400, image: 'https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=600&q=80' },
  { id: 'berlin', name: 'Berlim', country: { pt: 'Alemanha', en: 'Germany', es: 'Alemania' }, region: 'europe', priceBRL: 4100, image: 'https://images.unsplash.com/photo-1560969184-10fe8719e047?w=600&q=80' },
  { id: 'munich', name: 'Munique', country: { pt: 'Alemanha', en: 'Germany', es: 'Alemania' }, region: 'europe', priceBRL: 4300, image: 'https://images.unsplash.com/photo-1560969184-10fe8719e047?w=600&q=80' },
  { id: 'frankfurt', name: 'Frankfurt', country: { pt: 'Alemanha', en: 'Germany', es: 'Alemania' }, region: 'europe', priceBRL: 4000, image: 'https://images.unsplash.com/photo-1560969184-10fe8719e047?w=600&q=80' },
  { id: 'santorini', name: 'Santorini', country: { pt: 'Grécia', en: 'Greece', es: 'Grecia' }, region: 'europe', priceBRL: 5100, image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=600&q=80' },
  { id: 'athens', name: 'Atenas', country: { pt: 'Grécia', en: 'Greece', es: 'Grecia' }, region: 'europe', priceBRL: 4000, image: 'https://images.unsplash.com/photo-1555993539-1732b0258235?w=600&q=80' },
  { id: 'mykonos', name: 'Mykonos', country: { pt: 'Grécia', en: 'Greece', es: 'Grecia' }, region: 'europe', priceBRL: 5300, image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=600&q=80' },
  { id: 'prague', name: 'Praga', country: { pt: 'República Tcheca', en: 'Czech Republic', es: 'República Checa' }, region: 'europe', priceBRL: 3500, image: 'https://images.unsplash.com/photo-1541849546-216549ae216d?w=600&q=80' },
  { id: 'vienna', name: 'Viena', country: { pt: 'Áustria', en: 'Austria', es: 'Austria' }, region: 'europe', priceBRL: 4300, image: 'https://images.unsplash.com/photo-1516550893923-42d28e5677af?w=600&q=80' },
  { id: 'zurich', name: 'Zurique', country: { pt: 'Suíça', en: 'Switzerland', es: 'Suiza' }, region: 'europe', priceBRL: 5500, image: 'https://images.unsplash.com/photo-1515488764276-beab7607c1e6?w=600&q=80' },
  { id: 'interlaken', name: 'Interlaken', country: { pt: 'Suíça', en: 'Switzerland', es: 'Suiza' }, region: 'europe', priceBRL: 5800, image: 'https://images.unsplash.com/photo-1515488764276-beab7607c1e6?w=600&q=80' },
  { id: 'budapest', name: 'Budapeste', country: { pt: 'Hungria', en: 'Hungary', es: 'Hungría' }, region: 'europe', priceBRL: 3300, image: 'https://images.unsplash.com/photo-1541849546-216549ae216d?w=600&q=80' },
  { id: 'dublin', name: 'Dublin', country: { pt: 'Irlanda', en: 'Ireland', es: 'Irlanda' }, region: 'europe', priceBRL: 4500, image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=600&q=80' },
  { id: 'copenhagen', name: 'Copenhague', country: { pt: 'Dinamarca', en: 'Denmark', es: 'Dinamarca' }, region: 'europe', priceBRL: 4800, image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=600&q=80' },
  { id: 'stockholm', name: 'Estocolmo', country: { pt: 'Suécia', en: 'Sweden', es: 'Suecia' }, region: 'europe', priceBRL: 4700, image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=600&q=80' },
  { id: 'oslo', name: 'Oslo', country: { pt: 'Noruega', en: 'Norway', es: 'Noruega' }, region: 'europe', priceBRL: 5200, image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=600&q=80' },
  { id: 'helsinki', name: 'Helsinque', country: { pt: 'Finlândia', en: 'Finland', es: 'Finlandia' }, region: 'europe', priceBRL: 4900, image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=600&q=80' },
  { id: 'reykjavik', name: 'Reykjavik', country: { pt: 'Islândia', en: 'Iceland', es: 'Islandia' }, region: 'europe', priceBRL: 5500, image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=600&q=80' },
  { id: 'warsaw', name: 'Varsóvia', country: { pt: 'Polônia', en: 'Poland', es: 'Polonia' }, region: 'europe', priceBRL: 3200, image: 'https://images.unsplash.com/photo-1541849546-216549ae216d?w=600&q=80' },
  { id: 'krakow', name: 'Cracóvia', country: { pt: 'Polônia', en: 'Poland', es: 'Polonia' }, region: 'europe', priceBRL: 3000, image: 'https://images.unsplash.com/photo-1541849546-216549ae216d?w=600&q=80' },
  { id: 'bucharest', name: 'Bucareste', country: { pt: 'Romênia', en: 'Romania', es: 'Rumania' }, region: 'europe', priceBRL: 2800, image: 'https://images.unsplash.com/photo-1541849546-216549ae216d?w=600&q=80' },
  { id: 'croatia', name: 'Dubrovnik', country: { pt: 'Croácia', en: 'Croatia', es: 'Croacia' }, region: 'europe', priceBRL: 4200, image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=600&q=80' },
  { id: 'split', name: 'Split', country: { pt: 'Croácia', en: 'Croatia', es: 'Croacia' }, region: 'europe', priceBRL: 3900, image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=600&q=80' },
  { id: 'brussels', name: 'Bruxelas', country: { pt: 'Bélgica', en: 'Belgium', es: 'Bélgica' }, region: 'europe', priceBRL: 4200, image: 'https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=600&q=80' },
  { id: 'luxembourg', name: 'Luxemburgo', country: { pt: 'Luxemburgo', en: 'Luxembourg', es: 'Luxemburgo' }, region: 'europe', priceBRL: 4500, image: 'https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=600&q=80' },
  { id: 'monaco', name: 'Mônaco', country: { pt: 'Mônaco', en: 'Monaco', es: 'Mónaco' }, region: 'europe', priceBRL: 6000, image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=600&q=80' },
  { id: 'malta', name: 'Malta', country: { pt: 'Malta', en: 'Malta', es: 'Malta' }, region: 'europe', priceBRL: 3800, image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=600&q=80' },
  { id: 'istanbul', name: 'Istambul', country: { pt: 'Turquia', en: 'Turkey', es: 'Turquía' }, region: 'europe', priceBRL: 3500, image: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=600&q=80' },
  { id: 'cappadocia', name: 'Capadócia', country: { pt: 'Turquia', en: 'Turkey', es: 'Turquía' }, region: 'europe', priceBRL: 3800, image: 'https://images.unsplash.com/photo-1641128324972-af3212f0f6bd?w=600&q=80' },
  { id: 'moscow', name: 'Moscou', country: { pt: 'Rússia', en: 'Russia', es: 'Rusia' }, region: 'europe', priceBRL: 4000, image: 'https://images.unsplash.com/photo-1541849546-216549ae216d?w=600&q=80' },
  { id: 'stpetersburg', name: 'São Petersburgo', country: { pt: 'Rússia', en: 'Russia', es: 'Rusia' }, region: 'europe', priceBRL: 4200, image: 'https://images.unsplash.com/photo-1541849546-216549ae216d?w=600&q=80' },

  // ═══════════════════ ÁSIA ═══════════════════
  { id: 'tokyo', name: 'Tóquio', country: { pt: 'Japão', en: 'Japan', es: 'Japón' }, region: 'asia', priceBRL: 6200, image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600&q=80', featured: true },
  { id: 'kyoto', name: 'Kyoto', country: { pt: 'Japão', en: 'Japan', es: 'Japón' }, region: 'asia', priceBRL: 6000, image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600&q=80' },
  { id: 'osaka', name: 'Osaka', country: { pt: 'Japão', en: 'Japan', es: 'Japón' }, region: 'asia', priceBRL: 5900, image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600&q=80' },
  { id: 'seoul', name: 'Seul', country: { pt: 'Coreia do Sul', en: 'South Korea', es: 'Corea del Sur' }, region: 'asia', priceBRL: 6000, image: 'https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?w=600&q=80' },
  { id: 'bangkok', name: 'Bangkok', country: { pt: 'Tailândia', en: 'Thailand', es: 'Tailandia' }, region: 'asia', priceBRL: 4800, image: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=600&q=80' },
  { id: 'phuket', name: 'Phuket', country: { pt: 'Tailândia', en: 'Thailand', es: 'Tailandia' }, region: 'asia', priceBRL: 5000, image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&q=80' },
  { id: 'chiangmai', name: 'Chiang Mai', country: { pt: 'Tailândia', en: 'Thailand', es: 'Tailandia' }, region: 'asia', priceBRL: 4500, image: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=600&q=80' },
  { id: 'bali', name: 'Bali', country: { pt: 'Indonésia', en: 'Indonesia', es: 'Indonesia' }, region: 'asia', priceBRL: 5200, image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&q=80' },
  { id: 'jakarta', name: 'Jacarta', country: { pt: 'Indonésia', en: 'Indonesia', es: 'Indonesia' }, region: 'asia', priceBRL: 4800, image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&q=80' },
  { id: 'singapore', name: 'Singapura', country: { pt: 'Singapura', en: 'Singapore', es: 'Singapur' }, region: 'asia', priceBRL: 5500, image: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=600&q=80' },
  { id: 'kualalumpur', name: 'Kuala Lumpur', country: { pt: 'Malásia', en: 'Malaysia', es: 'Malasia' }, region: 'asia', priceBRL: 4600, image: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=600&q=80' },
  { id: 'hanoi', name: 'Hanói', country: { pt: 'Vietnã', en: 'Vietnam', es: 'Vietnam' }, region: 'asia', priceBRL: 4400, image: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=600&q=80' },
  { id: 'hochiminh', name: 'Ho Chi Minh', country: { pt: 'Vietnã', en: 'Vietnam', es: 'Vietnam' }, region: 'asia', priceBRL: 4300, image: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=600&q=80' },
  { id: 'beijing', name: 'Pequim', country: { pt: 'China', en: 'China', es: 'China' }, region: 'asia', priceBRL: 5800, image: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=600&q=80' },
  { id: 'shanghai', name: 'Xangai', country: { pt: 'China', en: 'China', es: 'China' }, region: 'asia', priceBRL: 5700, image: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=600&q=80' },
  { id: 'hongkong', name: 'Hong Kong', country: { pt: 'Hong Kong', en: 'Hong Kong', es: 'Hong Kong' }, region: 'asia', priceBRL: 5600, image: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=600&q=80' },
  { id: 'taipei', name: 'Taipei', country: { pt: 'Taiwan', en: 'Taiwan', es: 'Taiwán' }, region: 'asia', priceBRL: 5400, image: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=600&q=80' },
  { id: 'delhi', name: 'Nova Delhi', country: { pt: 'Índia', en: 'India', es: 'India' }, region: 'asia', priceBRL: 4200, image: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=600&q=80' },
  { id: 'mumbai', name: 'Mumbai', country: { pt: 'Índia', en: 'India', es: 'India' }, region: 'asia', priceBRL: 4300, image: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=600&q=80' },
  { id: 'jaipur', name: 'Jaipur', country: { pt: 'Índia', en: 'India', es: 'India' }, region: 'asia', priceBRL: 4100, image: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=600&q=80' },
  { id: 'goa', name: 'Goa', country: { pt: 'Índia', en: 'India', es: 'India' }, region: 'asia', priceBRL: 4000, image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&q=80' },
  { id: 'srilanka', name: 'Colombo', country: { pt: 'Sri Lanka', en: 'Sri Lanka', es: 'Sri Lanka' }, region: 'asia', priceBRL: 4200, image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&q=80' },
  { id: 'maldives', name: 'Maldivas', country: { pt: 'Maldivas', en: 'Maldives', es: 'Maldivas' }, region: 'asia', priceBRL: 8000, image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=600&q=80', featured: true },
  { id: 'nepal', name: 'Katmandu', country: { pt: 'Nepal', en: 'Nepal', es: 'Nepal' }, region: 'asia', priceBRL: 4500, image: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=600&q=80' },
  { id: 'philippines', name: 'Manila', country: { pt: 'Filipinas', en: 'Philippines', es: 'Filipinas' }, region: 'asia', priceBRL: 4800, image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&q=80' },
  { id: 'cambodia', name: 'Siem Reap', country: { pt: 'Camboja', en: 'Cambodia', es: 'Camboya' }, region: 'asia', priceBRL: 4000, image: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=600&q=80' },
  { id: 'myanmar', name: 'Yangon', country: { pt: 'Mianmar', en: 'Myanmar', es: 'Myanmar' }, region: 'asia', priceBRL: 4200, image: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=600&q=80' },

  // ═══════════════════ ORIENTE MÉDIO ═══════════════════
  { id: 'dubai', name: 'Dubai', country: { pt: 'Emirados Árabes', en: 'UAE', es: 'EAU' }, region: 'middle-east', priceBRL: 5800, image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&q=80', featured: true },
  { id: 'abudhabi', name: 'Abu Dhabi', country: { pt: 'Emirados Árabes', en: 'UAE', es: 'EAU' }, region: 'middle-east', priceBRL: 5500, image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&q=80' },
  { id: 'doha', name: 'Doha', country: { pt: 'Catar', en: 'Qatar', es: 'Qatar' }, region: 'middle-east', priceBRL: 5600, image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&q=80' },
  { id: 'telaviv', name: 'Tel Aviv', country: { pt: 'Israel', en: 'Israel', es: 'Israel' }, region: 'middle-east', priceBRL: 5000, image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&q=80' },
  { id: 'jerusalem', name: 'Jerusalém', country: { pt: 'Israel', en: 'Israel', es: 'Israel' }, region: 'middle-east', priceBRL: 5200, image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&q=80' },
  { id: 'amman', name: 'Amã', country: { pt: 'Jordânia', en: 'Jordan', es: 'Jordania' }, region: 'middle-east', priceBRL: 4800, image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&q=80' },
  { id: 'petra', name: 'Petra', country: { pt: 'Jordânia', en: 'Jordan', es: 'Jordania' }, region: 'middle-east', priceBRL: 5000, image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&q=80' },
  { id: 'muscat', name: 'Mascate', country: { pt: 'Omã', en: 'Oman', es: 'Omán' }, region: 'middle-east', priceBRL: 5200, image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&q=80' },
  { id: 'riyadh', name: 'Riad', country: { pt: 'Arábia Saudita', en: 'Saudi Arabia', es: 'Arabia Saudita' }, region: 'middle-east', priceBRL: 5500, image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&q=80' },

  // ═══════════════════ ÁFRICA ═══════════════════
  { id: 'cairo', name: 'Cairo', country: { pt: 'Egito', en: 'Egypt', es: 'Egipto' }, region: 'africa', priceBRL: 4500, image: 'https://images.unsplash.com/photo-1539768942893-daf53e736b68?w=600&q=80', featured: true },
  { id: 'luxor', name: 'Luxor', country: { pt: 'Egito', en: 'Egypt', es: 'Egipto' }, region: 'africa', priceBRL: 4800, image: 'https://images.unsplash.com/photo-1539768942893-daf53e736b68?w=600&q=80' },
  { id: 'marrakech', name: 'Marrakech', country: { pt: 'Marrocos', en: 'Morocco', es: 'Marruecos' }, region: 'africa', priceBRL: 4000, image: 'https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=600&q=80' },
  { id: 'fez', name: 'Fez', country: { pt: 'Marrocos', en: 'Morocco', es: 'Marruecos' }, region: 'africa', priceBRL: 3800, image: 'https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=600&q=80' },
  { id: 'capetown', name: 'Cidade do Cabo', country: { pt: 'África do Sul', en: 'South Africa', es: 'Sudáfrica' }, region: 'africa', priceBRL: 4800, image: 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=600&q=80', featured: true },
  { id: 'johannesburg', name: 'Joanesburgo', country: { pt: 'África do Sul', en: 'South Africa', es: 'Sudáfrica' }, region: 'africa', priceBRL: 4500, image: 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=600&q=80' },
  { id: 'kruger', name: 'Kruger Park', country: { pt: 'África do Sul', en: 'South Africa', es: 'Sudáfrica' }, region: 'africa', priceBRL: 5500, image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=600&q=80' },
  { id: 'nairobi', name: 'Nairobi', country: { pt: 'Quênia', en: 'Kenya', es: 'Kenia' }, region: 'africa', priceBRL: 5000, image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=600&q=80' },
  { id: 'masaimara', name: 'Masai Mara', country: { pt: 'Quênia', en: 'Kenya', es: 'Kenia' }, region: 'africa', priceBRL: 6000, image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=600&q=80' },
  { id: 'serengeti', name: 'Serengeti', country: { pt: 'Tanzânia', en: 'Tanzania', es: 'Tanzania' }, region: 'africa', priceBRL: 6500, image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=600&q=80' },
  { id: 'zanzibar', name: 'Zanzibar', country: { pt: 'Tanzânia', en: 'Tanzania', es: 'Tanzania' }, region: 'africa', priceBRL: 5200, image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&q=80' },
  { id: 'kilimanjaro', name: 'Kilimanjaro', country: { pt: 'Tanzânia', en: 'Tanzania', es: 'Tanzania' }, region: 'africa', priceBRL: 7000, image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=600&q=80' },
  { id: 'mauritius', name: 'Ilhas Maurício', country: { pt: 'Maurício', en: 'Mauritius', es: 'Mauricio' }, region: 'africa', priceBRL: 6500, image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&q=80' },
  { id: 'seychelles', name: 'Seychelles', country: { pt: 'Seychelles', en: 'Seychelles', es: 'Seychelles' }, region: 'africa', priceBRL: 7500, image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&q=80' },
  { id: 'madagascar', name: 'Antananarivo', country: { pt: 'Madagascar', en: 'Madagascar', es: 'Madagascar' }, region: 'africa', priceBRL: 5500, image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=600&q=80' },
  { id: 'victoria', name: 'Cataratas Vitória', country: { pt: 'Zâmbia/Zimbábue', en: 'Zambia/Zimbabwe', es: 'Zambia/Zimbabue' }, region: 'africa', priceBRL: 5800, image: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?w=600&q=80' },
  { id: 'tunis', name: 'Túnis', country: { pt: 'Tunísia', en: 'Tunisia', es: 'Túnez' }, region: 'africa', priceBRL: 3500, image: 'https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=600&q=80' },
  { id: 'accra', name: 'Acra', country: { pt: 'Gana', en: 'Ghana', es: 'Ghana' }, region: 'africa', priceBRL: 4200, image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=600&q=80' },
  { id: 'lagos', name: 'Lagos', country: { pt: 'Nigéria', en: 'Nigeria', es: 'Nigeria' }, region: 'africa', priceBRL: 4500, image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=600&q=80' },
  { id: 'addis', name: 'Adis Abeba', country: { pt: 'Etiópia', en: 'Ethiopia', es: 'Etiopía' }, region: 'africa', priceBRL: 4800, image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=600&q=80' },

  // ═══════════════════ OCEANIA ═══════════════════
  { id: 'sydney', name: 'Sydney', country: { pt: 'Austrália', en: 'Australia', es: 'Australia' }, region: 'oceania', priceBRL: 7000, image: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=600&q=80', featured: true },
  { id: 'melbourne', name: 'Melbourne', country: { pt: 'Austrália', en: 'Australia', es: 'Australia' }, region: 'oceania', priceBRL: 6800, image: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=600&q=80' },
  { id: 'goldcoast', name: 'Gold Coast', country: { pt: 'Austrália', en: 'Australia', es: 'Australia' }, region: 'oceania', priceBRL: 7200, image: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=600&q=80' },
  { id: 'greatbarrier', name: 'Grande Barreira de Coral', country: { pt: 'Austrália', en: 'Australia', es: 'Australia' }, region: 'oceania', priceBRL: 7500, image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&q=80' },
  { id: 'auckland', name: 'Auckland', country: { pt: 'Nova Zelândia', en: 'New Zealand', es: 'Nueva Zelanda' }, region: 'oceania', priceBRL: 7200, image: 'https://images.unsplash.com/photo-1507699622108-4be3abd695ad?w=600&q=80' },
  { id: 'queenstown', name: 'Queenstown', country: { pt: 'Nova Zelândia', en: 'New Zealand', es: 'Nueva Zelanda' }, region: 'oceania', priceBRL: 7500, image: 'https://images.unsplash.com/photo-1507699622108-4be3abd695ad?w=600&q=80' },
  { id: 'fiji', name: 'Fiji', country: { pt: 'Fiji', en: 'Fiji', es: 'Fiyi' }, region: 'oceania', priceBRL: 7800, image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&q=80' },
  { id: 'tahiti', name: 'Taiti', country: { pt: 'Polinésia Francesa', en: 'French Polynesia', es: 'Polinesia Francesa' }, region: 'oceania', priceBRL: 9000, image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&q=80' },
  { id: 'borabora', name: 'Bora Bora', country: { pt: 'Polinésia Francesa', en: 'French Polynesia', es: 'Polinesia Francesa' }, region: 'oceania', priceBRL: 10000, image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=600&q=80', featured: true },
];
