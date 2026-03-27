import { z } from 'zod';

export const leadSchema = z.object({
  name: z.string().trim().min(2, 'Nome deve ter pelo menos 2 caracteres').max(100),
  email: z.string().trim().email('E-mail inválido').max(255).optional().or(z.literal('')),
  phone: z.string().trim().max(20).optional().or(z.literal('')),
  destination_slug: z.string().optional().or(z.literal('')),
  service_type: z.string().optional().or(z.literal('')),
  travel_date_from: z.string().optional().or(z.literal('')),
  travel_date_to: z.string().optional().or(z.literal('')),
  travelers_count: z.coerce.number().min(1).max(50).default(1),
  budget_range: z.string().optional().or(z.literal('')),
  message: z.string().max(1000).optional().or(z.literal('')),
}).refine(
  (data) => data.email || data.phone,
  { message: 'Preencha pelo menos e-mail ou WhatsApp', path: ['email'] }
);

export type LeadFormData = z.infer<typeof leadSchema>;

export const BUDGET_RANGES = [
  { value: 'ate-5k', label: 'Até R$ 5.000' },
  { value: '5k-10k', label: 'R$ 5.000 - R$ 10.000' },
  { value: '10k-20k', label: 'R$ 10.000 - R$ 20.000' },
  { value: '20k-50k', label: 'R$ 20.000 - R$ 50.000' },
  { value: 'acima-50k', label: 'Acima de R$ 50.000' },
];

export const SERVICE_TYPES = [
  { value: 'voos', label: '✈️ Passagem Aérea' },
  { value: 'hoteis', label: '🏨 Hospedagem' },
  { value: 'seguro', label: '🛡️ Seguro Viagem' },
  { value: 'vistos', label: '📄 Visto' },
  { value: 'aluguel-carro', label: '🚗 Aluguel de Carro' },
  { value: 'consultoria', label: '💼 Consultoria' },
  { value: 'pacote-completo', label: '🎯 Pacote Completo' },
];
