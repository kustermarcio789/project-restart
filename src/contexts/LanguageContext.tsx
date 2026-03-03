import React, { createContext, useContext, useState, useCallback } from 'react';

export type Language = 'pt' | 'en' | 'es';

const translations = {
  pt: {
    // Header
    'nav.home': 'Início',
    'nav.services': 'Serviços',
    'nav.destinations': 'Destinos',
    'nav.about': 'Sobre',
    'nav.contact': 'Contato',
    'nav.admin': 'Admin',
    // Hero
    'hero.title': 'Descubra o Mundo',
    'hero.titleHighlight': 'Com a Gente',
    'hero.subtitle': 'Planeje sua viagem dos sonhos com os melhores preços e experiências inesquecíveis.',
    'hero.cta': 'Começar Agora',
    'hero.ctaSecondary': 'Ver Destinos',
    // Stats
    'stats.travelers': 'Viajantes Felizes',
    'stats.destinations': 'Destinos',
    'stats.support': 'Suporte',
    'stats.rating': 'Avaliação',
    // Services
    'services.title': 'Nossos Serviços',
    'services.subtitle': 'Tudo que você precisa para uma viagem perfeita',
    'services.flights': 'Voos',
    'services.flightsDesc': 'Passagens aéreas com os melhores preços para qualquer destino.',
    'services.hotels': 'Hotéis',
    'services.hotelsDesc': 'Hospedagens selecionadas para o máximo conforto.',
    'services.cars': 'Aluguel de Carro',
    'services.carsDesc': 'Liberdade para explorar cada destino no seu ritmo.',
    'services.insurance': 'Seguro Viagem',
    'services.insuranceDesc': 'Proteção completa para viajar com tranquilidade.',
    'services.tours': 'Tours Guiados',
    'services.toursDesc': 'Experiências exclusivas com guias especializados.',
    'services.visas': 'Vistos',
    'services.visasDesc': 'Assessoria completa para documentação e vistos.',
    // How it works
    'how.title': 'Como Funciona',
    'how.subtitle': 'Simples, rápido e seguro',
    'how.step1Title': 'Escolha seu Destino',
    'how.step1Desc': 'Navegue por centenas de destinos incríveis ao redor do mundo.',
    'how.step2Title': 'Personalize sua Viagem',
    'how.step2Desc': 'Selecione datas, hospedagem e atividades do seu jeito.',
    'how.step3Title': 'Viaje com Confiança',
    'how.step3Desc': 'Reserva confirmada, suporte 24/7 e experiências inesquecíveis.',
    // Destinations
    'dest.title': 'Destinos Populares',
    'dest.subtitle': 'Os lugares mais procurados pelos nossos viajantes',
    'dest.from': 'A partir de',
    // Testimonials
    'test.title': 'O que dizem nossos viajantes',
    'test.subtitle': 'Experiências reais de quem viajou conosco',
    // CTA
    'cta.title': 'Pronto para sua próxima aventura?',
    'cta.subtitle': 'Junte-se a milhares de viajantes satisfeitos e comece a planejar agora.',
    'cta.button': 'Planejar Minha Viagem',
    // Footer
    'footer.description': 'Sua plataforma completa para planejar viagens inesquecíveis.',
    'footer.links': 'Links Rápidos',
    'footer.legal': 'Legal',
    'footer.privacy': 'Privacidade',
    'footer.terms': 'Termos de Uso',
    'footer.contact': 'Contato',
    'footer.rights': 'Todos os direitos reservados.',
  },
  en: {
    'nav.home': 'Home',
    'nav.services': 'Services',
    'nav.destinations': 'Destinations',
    'nav.about': 'About',
    'nav.contact': 'Contact',
    'nav.admin': 'Admin',
    'hero.title': 'Discover the World',
    'hero.titleHighlight': 'With Us',
    'hero.subtitle': 'Plan your dream trip with the best prices and unforgettable experiences.',
    'hero.cta': 'Get Started',
    'hero.ctaSecondary': 'View Destinations',
    'stats.travelers': 'Happy Travelers',
    'stats.destinations': 'Destinations',
    'stats.support': 'Support',
    'stats.rating': 'Rating',
    'services.title': 'Our Services',
    'services.subtitle': 'Everything you need for the perfect trip',
    'services.flights': 'Flights',
    'services.flightsDesc': 'Airfare with the best prices to any destination.',
    'services.hotels': 'Hotels',
    'services.hotelsDesc': 'Selected accommodations for maximum comfort.',
    'services.cars': 'Car Rental',
    'services.carsDesc': 'Freedom to explore every destination at your pace.',
    'services.insurance': 'Travel Insurance',
    'services.insuranceDesc': 'Complete protection to travel with peace of mind.',
    'services.tours': 'Guided Tours',
    'services.toursDesc': 'Exclusive experiences with specialized guides.',
    'services.visas': 'Visas',
    'services.visasDesc': 'Full assistance for documentation and visas.',
    'how.title': 'How It Works',
    'how.subtitle': 'Simple, fast and secure',
    'how.step1Title': 'Choose Your Destination',
    'how.step1Desc': 'Browse hundreds of incredible destinations around the world.',
    'how.step2Title': 'Customize Your Trip',
    'how.step2Desc': 'Select dates, accommodations and activities your way.',
    'how.step3Title': 'Travel with Confidence',
    'how.step3Desc': 'Confirmed booking, 24/7 support and unforgettable experiences.',
    'dest.title': 'Popular Destinations',
    'dest.subtitle': 'The most sought-after places by our travelers',
    'dest.from': 'From',
    'test.title': 'What our travelers say',
    'test.subtitle': 'Real experiences from those who traveled with us',
    'cta.title': 'Ready for your next adventure?',
    'cta.subtitle': 'Join thousands of satisfied travelers and start planning now.',
    'cta.button': 'Plan My Trip',
    'footer.description': 'Your complete platform for planning unforgettable trips.',
    'footer.links': 'Quick Links',
    'footer.legal': 'Legal',
    'footer.privacy': 'Privacy',
    'footer.terms': 'Terms of Use',
    'footer.contact': 'Contact',
    'footer.rights': 'All rights reserved.',
  },
  es: {
    'nav.home': 'Inicio',
    'nav.services': 'Servicios',
    'nav.destinations': 'Destinos',
    'nav.about': 'Acerca',
    'nav.contact': 'Contacto',
    'nav.admin': 'Admin',
    'hero.title': 'Descubre el Mundo',
    'hero.titleHighlight': 'Con Nosotros',
    'hero.subtitle': 'Planifica tu viaje soñado con los mejores precios y experiencias inolvidables.',
    'hero.cta': 'Comenzar Ahora',
    'hero.ctaSecondary': 'Ver Destinos',
    'stats.travelers': 'Viajeros Felices',
    'stats.destinations': 'Destinos',
    'stats.support': 'Soporte',
    'stats.rating': 'Calificación',
    'services.title': 'Nuestros Servicios',
    'services.subtitle': 'Todo lo que necesitas para un viaje perfecto',
    'services.flights': 'Vuelos',
    'services.flightsDesc': 'Pasajes aéreos con los mejores precios a cualquier destino.',
    'services.hotels': 'Hoteles',
    'services.hotelsDesc': 'Alojamientos seleccionados para el máximo confort.',
    'services.cars': 'Alquiler de Auto',
    'services.carsDesc': 'Libertad para explorar cada destino a tu ritmo.',
    'services.insurance': 'Seguro de Viaje',
    'services.insuranceDesc': 'Protección completa para viajar con tranquilidad.',
    'services.tours': 'Tours Guiados',
    'services.toursDesc': 'Experiencias exclusivas con guías especializados.',
    'services.visas': 'Visas',
    'services.visasDesc': 'Asesoría completa para documentación y visas.',
    'how.title': 'Cómo Funciona',
    'how.subtitle': 'Simple, rápido y seguro',
    'how.step1Title': 'Elige tu Destino',
    'how.step1Desc': 'Navega por cientos de destinos increíbles alrededor del mundo.',
    'how.step2Title': 'Personaliza tu Viaje',
    'how.step2Desc': 'Selecciona fechas, alojamiento y actividades a tu manera.',
    'how.step3Title': 'Viaja con Confianza',
    'how.step3Desc': 'Reserva confirmada, soporte 24/7 y experiencias inolvidables.',
    'dest.title': 'Destinos Populares',
    'dest.subtitle': 'Los lugares más buscados por nuestros viajeros',
    'dest.from': 'Desde',
    'test.title': 'Lo que dicen nuestros viajeros',
    'test.subtitle': 'Experiencias reales de quienes viajaron con nosotros',
    'cta.title': '¿Listo para tu próxima aventura?',
    'cta.subtitle': 'Únete a miles de viajeros satisfechos y comienza a planificar ahora.',
    'cta.button': 'Planificar Mi Viaje',
    'footer.description': 'Tu plataforma completa para planificar viajes inolvidables.',
    'footer.links': 'Enlaces Rápidos',
    'footer.legal': 'Legal',
    'footer.privacy': 'Privacidad',
    'footer.terms': 'Términos de Uso',
    'footer.contact': 'Contacto',
    'footer.rights': 'Todos los derechos reservados.',
  },
} as const;

type TranslationKey = keyof typeof translations.pt;

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('pt');

  const t = useCallback((key: TranslationKey): string => {
    return translations[language]?.[key] || translations.pt[key] || key;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
};
