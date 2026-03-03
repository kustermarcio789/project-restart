

# 🛫 Decolando em Viagens — Plano de Implementação

## Visão Geral
Recriar a plataforma de viagens "Viajante" no Lovable, mantendo todo o visual e UX do projeto original, adaptando o backend de tRPC/Express/MySQL para Supabase.

---

## Fase 1: Estrutura Base e Design System
- Configurar tema escuro como padrão com cores e gradientes do projeto original (gradient-btn, glass-panel, gradient-text)
- Criar contextos de **Tema** e **Idioma** (PT/EN/ES) com traduções
- Instalar **framer-motion** para animações
- Configurar rotas: Home, Admin, Booking Success, Booking Cancel, 404

## Fase 2: Landing Page (Home)
- **Hero Section** com imagem de fundo, efeito Ken Burns, título com gradiente e CTAs
- **Stats Bar** flutuante (50K+ viajantes, 120+ destinos, 24/7 suporte, 4.9 avaliação)
- **Seção de Serviços** (Voos, Hotéis, Aluguel de Carro, Seguro, Tours, Vistos) com cards glass
- **Como Funciona** — 3 passos ilustrados
- **Destinos Populares** — grid de cards com imagens e preços
- **Depoimentos** — carrossel de reviews
- **Seção CTA** final com chamada para ação
- **Footer** completo com links e informações
- **Header** com navegação, seletor de idioma e tema

## Fase 3: Fluxo do Viajante
- **TravelerFlow** — modal/wizard interativo para o usuário planejar viagem (destino, datas, preferências)
- **Formulários de Registro** — cadastro de Prestador e Parceiro
- **GlassCard** e **SplashScreen** — componentes visuais reutilizáveis

## Fase 4: Páginas de Booking
- **Booking Success** — confirmação de pagamento com próximos passos
- **Booking Cancel** — página de cancelamento com opção de tentar novamente
- Ambas com suporte multi-idioma e animações

## Fase 5: Painel Administrativo
- **Login Admin** — tela de autenticação com visual consistente
- **Dashboard** — cards de métricas (reservas, prestadores, usuários, receita) + tabela de reservas recentes
- **Gestão de Prestadores** — listagem com filtros e atualização de status
- **Gestão de Reservas** — todas as reservas com status e ações
- **Comissões** — controle de comissões por prestador
- Navegação lateral com abas (Dashboard, Prestadores, Reservas, Comissões)

## Fase 6: Backend com Supabase (Lovable Cloud)
- Tabelas: users, providers, bookings, commissions, admin_users
- Autenticação admin via Supabase Auth
- RLS policies para segurança
- Funções para estatísticas do dashboard

## Notas Técnicas
- **wouter → react-router-dom** (já disponível no projeto)
- **tRPC → React Query + Supabase client** 
- **framer-motion** será adicionado como dependência
- Todo o conteúdo será multi-idioma (PT/EN/ES)
- Design mobile-first com tema escuro

