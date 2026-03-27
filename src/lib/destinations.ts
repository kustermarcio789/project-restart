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
  region: 'brasil' | 'south-america' | 'north-america' | 'europe' | 'asia' | 'middle-east';
  priceBRL: number;
  image: string;
  featured?: boolean;
}

export const allDestinations: Destination[] = [
  // Brasil
  { id: 'rio', name: 'Rio de Janeiro', country: { pt: 'Brasil', en: 'Brazil', es: 'Brasil' }, region: 'brasil', priceBRL: 1200, image: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=600&q=80', featured: true },
  { id: 'salvador', name: 'Salvador', country: { pt: 'Brasil', en: 'Brazil', es: 'Brasil' }, region: 'brasil', priceBRL: 1100, image: 'https://images.unsplash.com/photo-1589556264800-08ae9e129a8c?w=600&q=80' },
  { id: 'florianopolis', name: 'Florianópolis', country: { pt: 'Brasil', en: 'Brazil', es: 'Brasil' }, region: 'brasil', priceBRL: 950, image: 'https://images.unsplash.com/photo-1588001832198-c15cff59b078?w=600&q=80' },
  { id: 'gramado', name: 'Gramado', country: { pt: 'Brasil', en: 'Brazil', es: 'Brasil' }, region: 'brasil', priceBRL: 800, image: 'https://images.unsplash.com/photo-1590073844006-33379778ae09?w=600&q=80' },
  { id: 'saopaulo', name: 'São Paulo', country: { pt: 'Brasil', en: 'Brazil', es: 'Brasil' }, region: 'brasil', priceBRL: 600, image: 'https://images.unsplash.com/photo-1543059080-f9b1272213d5?w=600&q=80' },
  { id: 'iguacu', name: 'Foz do Iguaçu', country: { pt: 'Brasil', en: 'Brazil', es: 'Brasil' }, region: 'brasil', priceBRL: 1000, image: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?w=600&q=80' },
  // South America
  { id: 'buenosaires', name: 'Buenos Aires', country: { pt: 'Argentina', en: 'Argentina', es: 'Argentina' }, region: 'south-america', priceBRL: 2800, image: 'https://images.unsplash.com/photo-1589909202802-8f4aadce1849?w=600&q=80', featured: true },
  { id: 'bariloche', name: 'Bariloche', country: { pt: 'Argentina', en: 'Argentina', es: 'Argentina' }, region: 'south-america', priceBRL: 3200, image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=600&q=80' },
  // North America
  { id: 'nyc', name: 'Nova York', country: { pt: 'EUA', en: 'USA', es: 'EE.UU.' }, region: 'north-america', priceBRL: 3800, image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=600&q=80', featured: true },
  { id: 'cancun', name: 'Cancún', country: { pt: 'México', en: 'Mexico', es: 'México' }, region: 'north-america', priceBRL: 3200, image: 'https://images.unsplash.com/photo-1510097467424-192d713fd8b2?w=600&q=80' },
  // Europe
  { id: 'paris', name: 'Paris', country: { pt: 'França', en: 'France', es: 'Francia' }, region: 'europe', priceBRL: 4500, image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&q=80', featured: true },
  { id: 'rome', name: 'Roma', country: { pt: 'Itália', en: 'Italy', es: 'Italia' }, region: 'europe', priceBRL: 4100, image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=600&q=80', featured: true },
  { id: 'santorini', name: 'Santorini', country: { pt: 'Grécia', en: 'Greece', es: 'Grecia' }, region: 'europe', priceBRL: 5100, image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=600&q=80' },
  { id: 'lisbon', name: 'Lisboa', country: { pt: 'Portugal', en: 'Portugal', es: 'Portugal' }, region: 'europe', priceBRL: 3900, image: 'https://images.unsplash.com/photo-1585208798174-6cedd86e019a?w=600&q=80' },
  // Asia
  { id: 'tokyo', name: 'Tóquio', country: { pt: 'Japão', en: 'Japan', es: 'Japón' }, region: 'asia', priceBRL: 6200, image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600&q=80', featured: true },
  // Middle East
  { id: 'dubai', name: 'Dubai', country: { pt: 'Emirados Árabes', en: 'UAE', es: 'EAU' }, region: 'middle-east', priceBRL: 5800, image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&q=80', featured: true },
  // More South America
  { id: 'santiago', name: 'Santiago', country: { pt: 'Chile', en: 'Chile', es: 'Chile' }, region: 'south-america', priceBRL: 2600, image: 'https://images.unsplash.com/photo-1569161031678-19c41e13a1e7?w=600&q=80' },
  { id: 'lima', name: 'Lima', country: { pt: 'Peru', en: 'Peru', es: 'Perú' }, region: 'south-america', priceBRL: 2400, image: 'https://images.unsplash.com/photo-1531968899763-f042a406e18c?w=600&q=80' },
  { id: 'bogota', name: 'Bogotá', country: { pt: 'Colômbia', en: 'Colombia', es: 'Colombia' }, region: 'south-america', priceBRL: 2200, image: 'https://images.unsplash.com/photo-1568632234157-ce7aecd03d0d?w=600&q=80' },
  { id: 'montevideo', name: 'Montevidéu', country: { pt: 'Uruguai', en: 'Uruguay', es: 'Uruguay' }, region: 'south-america', priceBRL: 2500, image: 'https://images.unsplash.com/photo-1599420186946-7b6fb4e297f0?w=600&q=80' },
  { id: 'cartagena', name: 'Cartagena', country: { pt: 'Colômbia', en: 'Colombia', es: 'Colombia' }, region: 'south-america', priceBRL: 2700, image: 'https://images.unsplash.com/photo-1583531172005-814042858d2e?w=600&q=80' },
  // More North America
  { id: 'miami', name: 'Miami', country: { pt: 'EUA', en: 'USA', es: 'EE.UU.' }, region: 'north-america', priceBRL: 3500, image: 'https://images.unsplash.com/photo-1533106497176-45ae19e68ba2?w=600&q=80' },
  { id: 'orlando', name: 'Orlando', country: { pt: 'EUA', en: 'USA', es: 'EE.UU.' }, region: 'north-america', priceBRL: 3600, image: 'https://images.unsplash.com/photo-1575089976121-8ed7b2a54265?w=600&q=80' },
  { id: 'losangeles', name: 'Los Angeles', country: { pt: 'EUA', en: 'USA', es: 'EE.UU.' }, region: 'north-america', priceBRL: 4000, image: 'https://images.unsplash.com/photo-1534190760961-74e8c1c5c3da?w=600&q=80' },
  // More Europe
  { id: 'london', name: 'Londres', country: { pt: 'Inglaterra', en: 'England', es: 'Inglaterra' }, region: 'europe', priceBRL: 4800, image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=600&q=80' },
  { id: 'barcelona', name: 'Barcelona', country: { pt: 'Espanha', en: 'Spain', es: 'España' }, region: 'europe', priceBRL: 4200, image: 'https://images.unsplash.com/photo-1583422409516-2895a77efed6?w=600&q=80' },
  { id: 'madrid', name: 'Madrid', country: { pt: 'Espanha', en: 'Spain', es: 'España' }, region: 'europe', priceBRL: 4000, image: 'https://images.unsplash.com/photo-1543783207-ec64e4d95325?w=600&q=80' },
  { id: 'amsterdam', name: 'Amsterdã', country: { pt: 'Holanda', en: 'Netherlands', es: 'Países Bajos' }, region: 'europe', priceBRL: 4400, image: 'https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=600&q=80' },
  { id: 'berlin', name: 'Berlim', country: { pt: 'Alemanha', en: 'Germany', es: 'Alemania' }, region: 'europe', priceBRL: 4100, image: 'https://images.unsplash.com/photo-1560969184-10fe8719e047?w=600&q=80' },
  { id: 'prague', name: 'Praga', country: { pt: 'República Tcheca', en: 'Czech Republic', es: 'República Checa' }, region: 'europe', priceBRL: 3500, image: 'https://images.unsplash.com/photo-1541849546-216549ae216d?w=600&q=80' },
  { id: 'zurich', name: 'Zurique', country: { pt: 'Suíça', en: 'Switzerland', es: 'Suiza' }, region: 'europe', priceBRL: 5500, image: 'https://images.unsplash.com/photo-1515488764276-beab7607c1e6?w=600&q=80' },
  { id: 'vienna', name: 'Viena', country: { pt: 'Áustria', en: 'Austria', es: 'Austria' }, region: 'europe', priceBRL: 4300, image: 'https://images.unsplash.com/photo-1516550893923-42d28e5677af?w=600&q=80' },
  { id: 'porto', name: 'Porto', country: { pt: 'Portugal', en: 'Portugal', es: 'Portugal' }, region: 'europe', priceBRL: 3700, image: 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=600&q=80' },
  // More Asia
  { id: 'bangkok', name: 'Bangkok', country: { pt: 'Tailândia', en: 'Thailand', es: 'Tailandia' }, region: 'asia', priceBRL: 4800, image: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=600&q=80' },
  { id: 'bali', name: 'Bali', country: { pt: 'Indonésia', en: 'Indonesia', es: 'Indonesia' }, region: 'asia', priceBRL: 5200, image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&q=80' },
  { id: 'seoul', name: 'Seul', country: { pt: 'Coreia do Sul', en: 'South Korea', es: 'Corea del Sur' }, region: 'asia', priceBRL: 6000, image: 'https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?w=600&q=80' },
  // More Brasil
  { id: 'natal', name: 'Natal', country: { pt: 'Brasil', en: 'Brazil', es: 'Brasil' }, region: 'brasil', priceBRL: 1100, image: 'https://images.unsplash.com/photo-1590071089561-0aee75996e50?w=600&q=80' },
  { id: 'recife', name: 'Recife', country: { pt: 'Brasil', en: 'Brazil', es: 'Brasil' }, region: 'brasil', priceBRL: 1050, image: 'https://images.unsplash.com/photo-1598301257982-0cf014dabbcd?w=600&q=80' },
  { id: 'manaus', name: 'Manaus', country: { pt: 'Brasil', en: 'Brazil', es: 'Brasil' }, region: 'brasil', priceBRL: 1300, image: 'https://images.unsplash.com/photo-1619546952812-520e98064a52?w=600&q=80' },
  { id: 'curitiba', name: 'Curitiba', country: { pt: 'Brasil', en: 'Brazil', es: 'Brasil' }, region: 'brasil', priceBRL: 700, image: 'https://images.unsplash.com/photo-1597564661879-49dd3c1c8af4?w=600&q=80' },
  { id: 'fortaleza', name: 'Fortaleza', country: { pt: 'Brasil', en: 'Brazil', es: 'Brasil' }, region: 'brasil', priceBRL: 1150, image: 'https://images.unsplash.com/photo-1598301257982-0cf014dabbcd?w=600&q=80' },
];
