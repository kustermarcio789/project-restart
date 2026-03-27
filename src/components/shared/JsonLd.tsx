import { Helmet } from 'react-helmet-async';

interface JsonLdProps {
  data: Record<string, unknown>;
}

export const JsonLd = ({ data }: JsonLdProps) => (
  <Helmet>
    <script type="application/ld+json">{JSON.stringify(data)}</script>
  </Helmet>
);

export const buildOrganizationSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'TravelAgency',
  name: 'Decolando em Viagens',
  url: 'https://decolandoemviagens.com',
  description: 'Plataforma completa de viagens, emigração e serviços ao viajante.',
  sameAs: [],
});

export const buildDestinationSchema = (destination: {
  name: string;
  country: string;
  description: string;
  slug: string;
  faq?: { question: string; answer: string }[];
}) => {
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'TouristDestination',
    name: destination.name,
    description: destination.description,
    url: `https://decolandoemviagens.com/destino/${destination.slug}`,
    containedInPlace: {
      '@type': 'Country',
      name: destination.country,
    },
  };

  return schema;
};

export const buildFAQSchema = (faqs: { question: string; answer: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((faq) => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.answer,
    },
  })),
});

export const buildBreadcrumbSchema = (items: { name: string; url: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: item.name,
    item: item.url,
  })),
});
