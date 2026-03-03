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
];
