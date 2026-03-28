export interface SeoGuideSection {
  title: string;
  paragraphs: string[];
  bullets?: string[];
}

export interface SeoGuideFAQ {
  question: string;
  answer: string;
}

export interface SeoGuideLink {
  title: string;
  href: string;
  description: string;
}

export interface SeoGuidePage {
  slug: string;
  category: 'vistos' | 'morar-fora' | 'planejamento' | 'documentacao' | 'viagem-internacional';
  title: string;
  description: string;
  intro: string[];
  heroTag: string;
  canonical: string;
  keywords: string[];
  ctaTitle: string;
  ctaDescription: string;
  ctaPrimaryHref: string;
  ctaPrimaryLabel: string;
  ctaSecondaryHref: string;
  ctaSecondaryLabel: string;
  sections: SeoGuideSection[];
  faq: SeoGuideFAQ[];
  relatedLinks: SeoGuideLink[];
}

export const seoGuidePages: SeoGuidePage[] = [
  {
    slug: 'vistos-para-brasileiros',
    category: 'vistos',
    title: 'Vistos para brasileiros: guia completo para turismo, estudo e trabalho',
    description:
      'Entenda como funcionam os vistos para brasileiros, quando há isenção, quais documentos costumam ser exigidos e como se preparar para viagens de turismo, estudo e trabalho.',
    intro: [
      'Entender as regras de entrada de cada país é uma das etapas mais importantes do planejamento internacional. Mesmo quando o brasileiro não precisa de visto para turismo, as autoridades migratórias podem exigir comprovantes de hospedagem, recursos financeiros, objetivo da viagem e bilhete de retorno.',
      'Por isso, um bom planejamento começa pela verificação do tipo de viagem, do tempo de permanência, das escalas previstas e do canal oficial de consulta. Esse cuidado evita recusas de embarque, problemas em imigração e gastos inesperados durante a viagem.',
    ],
    heroTag: 'Guia essencial de vistos',
    canonical: 'https://www.decolandoemviagens.com.br/guias/vistos-para-brasileiros',
    keywords: ['vistos para brasileiros', 'visto de turismo', 'visto de estudo', 'visto de trabalho', 'documentos de viagem'],
    ctaTitle: 'Quer planejar sua viagem internacional com segurança?',
    ctaDescription:
      'Organizamos voos, hospedagem, seguro viagem e orientação de documentação para que você viaje com mais previsibilidade e menos risco de erro.',
    ctaPrimaryHref: '/cotacao',
    ctaPrimaryLabel: 'Solicitar cotação',
    ctaSecondaryHref: '/planejar',
    ctaSecondaryLabel: 'Planejar viagem',
    sections: [
      {
        title: 'Quando o brasileiro precisa de visto',
        paragraphs: [
          'A necessidade de visto varia conforme o país de destino, a nacionalidade do viajante, a finalidade da visita e o tempo de permanência. Em viagens de turismo, muitos destinos dispensam o visto para brasileiros, mas trabalho, estudo, residência e trânsito internacional podem exigir autorizações específicas.',
          'Além disso, a isenção para turismo não significa entrada automática. A decisão final de admissão costuma ser da autoridade de fronteira, que pode solicitar documentos complementares no momento do embarque ou da imigração.',
        ],
        bullets: [
          'Verifique o objetivo da viagem antes de comprar passagens não reembolsáveis.',
          'Confirme se existe exigência de visto de trânsito nas escalas.',
          'Consulte sempre a embaixada ou o consulado do país de destino.',
        ],
      },
      {
        title: 'Documentos normalmente solicitados',
        paragraphs: [
          'Independentemente da exigência de visto, muitos países pedem um conjunto mínimo de comprovações para liberar a entrada. A organização prévia desses documentos reduz o risco de questionamentos e ajuda a mostrar coerência entre roteiro, tempo de estadia e capacidade financeira.',
        ],
        bullets: [
          'Passaporte válido dentro do prazo exigido pelo destino.',
          'Comprovante de hospedagem ou carta-convite.',
          'Passagem de retorno ou prova de continuação da viagem.',
          'Comprovantes financeiros compatíveis com o tempo de permanência.',
          'Seguro viagem, quando aplicável ao destino ou ao perfil do viajante.',
        ],
      },
      {
        title: 'Diferença entre visto de turismo, estudo e trabalho',
        paragraphs: [
          'Cada categoria de visto possui regras próprias, documentos específicos e limitações de permanência. Um erro comum é supor que a entrada como turista resolve situações de curso longo, intercâmbio ou atividade remunerada, o que pode gerar descumprimento migratório.',
          'Na prática, o enquadramento correto depende da atividade principal desenvolvida no país. Se houver aulas, estágio, contrato de trabalho, prestação de serviço ou intenção de residência, o visto adequado precisa ser confirmado antes da viagem.',
        ],
      },
      {
        title: 'Como reduzir riscos no processo',
        paragraphs: [
          'O ideal é montar um cronograma com antecedência suficiente para passaporte, formulários, coleta biométrica, tradução de documentos e eventual entrevista consular. Também vale alinhar reservas, roteiro e datas para que toda a documentação conte a mesma história.',
          'Para viagens com múltiplos países, escalas longas ou objetivos mistos, o planejamento integrado de documentação e logística se torna ainda mais importante.',
        ],
      },
    ],
    faq: [
      {
        question: 'Brasileiro precisa de visto para toda viagem internacional?',
        answer:
          'Não. Muitos países dispensam visto de turismo para brasileiros, mas isso depende do destino, do tempo de permanência e da finalidade da viagem. Além disso, outros documentos ainda podem ser exigidos na imigração.',
      },
      {
        question: 'Posso usar visto de turismo para estudar ou trabalhar?',
        answer:
          'Em geral, não. Atividades de estudo, trabalho ou residência costumam exigir categorias específicas de visto. Usar a categoria errada pode gerar recusa de entrada ou problemas migratórios.',
      },
      {
        question: 'Escala em outro país pode exigir visto?',
        answer:
          'Sim. Alguns países exigem visto de trânsito mesmo quando o destino final não exige visto do brasileiro. Esse ponto deve ser checado antes da emissão da passagem.',
      },
    ],
    relatedLinks: [
      {
        title: 'Como morar fora do Brasil com planejamento',
        href: '/guias/como-morar-fora-do-brasil',
        description: 'Veja os pilares de documentação, finanças e adaptação para uma mudança internacional.',
      },
      {
        title: 'Documentos para viagem internacional',
        href: '/guias/documentos-para-viagem-internacional',
        description: 'Confira um checklist essencial para embarcar com mais segurança.',
      },
      {
        title: 'Solicitar cotação personalizada',
        href: '/cotacao',
        description: 'Receba apoio para voos, hospedagem, seguro e planejamento de viagem.',
      },
    ],
  },
  {
    slug: 'como-morar-fora-do-brasil',
    category: 'morar-fora',
    title: 'Como morar fora do Brasil: planejamento, documentação e primeiros passos',
    description:
      'Saiba como se organizar para morar fora do Brasil, com foco em visto correto, documentação, custo de vida, reserva financeira e adaptação ao novo destino.',
    intro: [
      'Morar fora exige muito mais do que comprar uma passagem. A mudança internacional envolve escolha do país, entendimento da categoria migratória correta, organização financeira e um plano de adaptação realista para trabalho, estudo e rotina.',
      'Quem se prepara melhor tende a reduzir erros, custos e ansiedade. Por isso, o processo deve ser construído em etapas, com decisões fundamentadas e alinhadas ao objetivo principal da mudança.',
    ],
    heroTag: 'Morar fora com estratégia',
    canonical: 'https://www.decolandoemviagens.com.br/guias/como-morar-fora-do-brasil',
    keywords: ['como morar fora', 'morar fora do brasil', 'planejamento internacional', 'documentos para morar fora', 'vida no exterior'],
    ctaTitle: 'Quer estruturar sua jornada internacional com apoio?',
    ctaDescription:
      'Ajudamos você a organizar a parte prática da viagem, a logística e o planejamento do embarque para começar sua mudança com mais clareza.',
    ctaPrimaryHref: '/cotacao',
    ctaPrimaryLabel: 'Falar com especialista',
    ctaSecondaryHref: '/servico/vistos',
    ctaSecondaryLabel: 'Ver serviço de vistos',
    sections: [
      {
        title: 'Defina o objetivo da mudança',
        paragraphs: [
          'O primeiro passo é entender o motivo principal da mudança: estudo, trabalho, intercâmbio, reagrupamento familiar, empreendedorismo ou residência. Essa definição impacta diretamente o tipo de visto, os documentos aceitos e o tempo de permanência permitido.',
          'Sem esse alinhamento, o projeto de morar fora fica vulnerável a decisões erradas, como escolher um curso inadequado, comprar passagem cedo demais ou preparar documentação incompatível com a categoria migratória.',
        ],
      },
      {
        title: 'Monte uma reserva financeira realista',
        paragraphs: [
          'Uma mudança internacional costuma envolver custos de passaporte, taxas consulares, traduções, passagens, seguro, caução de aluguel, transporte local e despesas do início da adaptação. Por isso, a reserva financeira precisa considerar o cenário real, e não apenas o valor da passagem.',
          'Também é recomendável prever um colchão financeiro para imprevistos, atrasos de documentação, diferença cambial e primeiros meses de instalação.',
        ],
      },
      {
        title: 'Organize a documentação antes da viagem',
        paragraphs: [
          'A parte documental deve ser tratada como um projeto. Certidões, diplomas, histórico escolar, comprovantes financeiros, cartas de aceitação e contratos podem exigir atualização, apostilamento, tradução ou formatos específicos.',
        ],
        bullets: [
          'Confira validade e integridade do passaporte.',
          'Separe documentos civis e acadêmicos com antecedência.',
          'Verifique exigências de tradução juramentada ou apostilamento.',
          'Digitalize todos os principais documentos em nuvem segura.',
        ],
      },
      {
        title: 'Prepare-se para a adaptação prática',
        paragraphs: [
          'Morar fora também envolve rotina. Habitação, transporte, idioma, sistema de saúde, abertura de conta e dinâmica cultural fazem parte da experiência desde o início. Um bom planejamento inclui estudo do custo de vida, bairros, mobilidade e exigências locais para recém-chegados.',
        ],
      },
    ],
    faq: [
      {
        question: 'Qual é o primeiro passo para morar fora?',
        answer:
          'O primeiro passo é definir o objetivo da mudança e, a partir disso, verificar o tipo de visto ou autorização compatível com estudo, trabalho, residência ou outro enquadramento.',
      },
      {
        question: 'Preciso traduzir meus documentos?',
        answer:
          'Depende do país e do processo. Muitos destinos exigem tradução juramentada, apostilamento ou formatos específicos para documentos civis, acadêmicos e financeiros.',
      },
      {
        question: 'Vale a pena comprar passagem antes da aprovação do visto?',
        answer:
          'Em muitos casos, o mais prudente é aguardar a confirmação do processo ou optar por reservas flexíveis, para evitar perdas financeiras em caso de atraso ou recusa.',
      },
    ],
    relatedLinks: [
      {
        title: 'Vistos para brasileiros',
        href: '/guias/vistos-para-brasileiros',
        description: 'Entenda a diferença entre turismo, estudo, trabalho e trânsito.',
      },
      {
        title: 'Checklist de documentos para viagem internacional',
        href: '/guias/documentos-para-viagem-internacional',
        description: 'Tenha um roteiro claro do que separar antes do embarque.',
      },
      {
        title: 'Planejar viagem online',
        href: '/planejar',
        description: 'Use o planejador para simular voos e hospedagem da sua jornada.',
      },
    ],
  },
  {
    slug: 'documentos-para-viagem-internacional',
    category: 'documentacao',
    title: 'Documentos para viagem internacional: checklist prático para embarcar com segurança',
    description:
      'Veja quais documentos organizar para uma viagem internacional, incluindo passaporte, comprovantes, seguro, reservas, vistos e itens que podem ser pedidos na imigração.',
    intro: [
      'Uma viagem internacional bem planejada começa com documentação organizada. Ter o documento certo, no formato correto e acessível no embarque e na imigração reduz atrasos, dúvidas e risco de recusa de entrada.',
      'Esse checklist é útil tanto para quem está viajando a turismo quanto para quem vai estudar, trabalhar ou fazer uma viagem com múltiplos trechos e países de trânsito.',
    ],
    heroTag: 'Checklist internacional',
    canonical: 'https://www.decolandoemviagens.com.br/guias/documentos-para-viagem-internacional',
    keywords: ['documentos para viagem internacional', 'checklist viagem internacional', 'passaporte e visto', 'comprovantes imigração'],
    ctaTitle: 'Quer viajar com documentação e roteiro alinhados?',
    ctaDescription:
      'Organize sua viagem com apoio para voos, hotéis, seguro e serviços ao viajante em um só lugar.',
    ctaPrimaryHref: '/planejar',
    ctaPrimaryLabel: 'Montar meu roteiro',
    ctaSecondaryHref: '/cotacao',
    ctaSecondaryLabel: 'Receber cotação',
    sections: [
      {
        title: 'Documentos básicos que não podem faltar',
        paragraphs: [
          'O passaporte é o documento principal, mas ele raramente é o único. Em muitos destinos, o viajante também deve comprovar hospedagem, passagens, motivo da viagem e capacidade financeira para o período de permanência.',
        ],
        bullets: [
          'Passaporte válido dentro da regra do destino.',
          'Visto ou autorização eletrônica, quando aplicável.',
          'Comprovante de hospedagem ou carta-convite.',
          'Passagem de retorno ou continuação da viagem.',
          'Seguro viagem, se exigido ou recomendado.',
        ],
      },
      {
        title: 'Documentos de apoio que ajudam na imigração',
        paragraphs: [
          'Além do básico, é útil levar documentos que deem contexto à viagem. Eles podem ser decisivos quando o agente migratório faz perguntas sobre tempo de permanência, motivo da visita ou meios de sustento durante a viagem.',
        ],
        bullets: [
          'Extratos ou comprovantes financeiros recentes.',
          'Roteiro de viagem e reservas intermediárias.',
          'Comprovante de vínculo no Brasil, quando pertinente.',
          'Carta da escola, empresa ou organizador do evento, se houver.',
        ],
      },
      {
        title: 'Como organizar tudo antes de embarcar',
        paragraphs: [
          'O ideal é separar a documentação em duas versões: física e digital. Deixe uma pasta com os originais ou cópias necessárias e mantenha versões salvas em nuvem segura e no celular, para fácil acesso durante o deslocamento.',
          'Também vale conferir se nomes, datas e números dos documentos estão consistentes entre passaporte, passagem, reservas e formulários.',
        ],
      },
    ],
    faq: [
      {
        question: 'Posso viajar só com reserva de hotel no celular?',
        answer:
          'Em muitos casos, sim, mas é recomendável ter fácil acesso ao comprovante e considerar uma versão offline ou impressa, especialmente em conexões e imigração.',
      },
      {
        question: 'Seguro viagem é obrigatório?',
        answer:
          'Depende do destino e do tipo de viagem. Mesmo quando não é obrigatório, ele costuma ser altamente recomendado para emergências médicas, atrasos e imprevistos.',
      },
      {
        question: 'A imigração pode pedir comprovantes financeiros?',
        answer:
          'Sim. Alguns países e agentes migratórios podem solicitar prova de recursos compatíveis com a duração e o perfil da viagem.',
      },
    ],
    relatedLinks: [
      {
        title: 'Vistos para brasileiros',
        href: '/guias/vistos-para-brasileiros',
        description: 'Veja quando é necessário ter visto e qual categoria faz sentido para sua viagem.',
      },
      {
        title: 'Como morar fora do Brasil',
        href: '/guias/como-morar-fora-do-brasil',
        description: 'Planeje uma mudança internacional com documentação e finanças organizadas.',
      },
      {
        title: 'Seguro viagem',
        href: '/servico/seguro-viagem',
        description: 'Conheça um dos serviços mais importantes para viagens internacionais.',
      },
    ],
  },
  {
    slug: 'primeira-viagem-internacional',
    category: 'viagem-internacional',
    title: 'Primeira viagem internacional: o que planejar antes de embarcar',
    description:
      'Saiba o que organizar na sua primeira viagem internacional, desde documentação e câmbio até roteiro, seguro, imigração e uso do planejador de voos e hospedagem.',
    intro: [
      'Fazer a primeira viagem internacional é empolgante, mas também pode gerar dúvidas sobre documentação, imigração, moeda, bagagem e reservas. Um planejamento simples e bem estruturado costuma resolver a maior parte dessas inseguranças.',
      'A melhor estratégia é dividir a preparação em etapas: documentos, roteiro, reservas, seguro, orçamento, deslocamentos e plano de contingência para imprevistos.',
    ],
    heroTag: 'Primeira viagem ao exterior',
    canonical: 'https://www.decolandoemviagens.com.br/guias/primeira-viagem-internacional',
    keywords: ['primeira viagem internacional', 'como planejar viagem internacional', 'imigração primeira viagem', 'dicas viagem exterior'],
    ctaTitle: 'Quer montar sua primeira viagem com apoio?',
    ctaDescription:
      'Use nossa plataforma para pesquisar voos, hospedagem e organizar uma viagem internacional com mais clareza.',
    ctaPrimaryHref: '/planejar',
    ctaPrimaryLabel: 'Começar planejamento',
    ctaSecondaryHref: '/cotacao',
    ctaSecondaryLabel: 'Solicitar ajuda especializada',
    sections: [
      {
        title: 'Comece pela documentação',
        paragraphs: [
          'Antes de pesquisar preço, confirme passaporte, visto, autorizações e regras de trânsito. Esse é o ponto que evita a maioria dos problemas pré-embarque.',
        ],
      },
      {
        title: 'Monte um roteiro compatível com seu orçamento',
        paragraphs: [
          'Na primeira viagem, vale priorizar deslocamentos mais simples, conexões confortáveis e hospedagens bem localizadas. Isso reduz estresse, facilita locomoção e melhora a experiência geral.',
        ],
      },
      {
        title: 'Tenha reserva para imprevistos',
        paragraphs: [
          'Mesmo com tudo organizado, podem acontecer atrasos, mudanças de portão, variação cambial, necessidade de transporte extra ou despesas médicas. Uma reserva financeira e um seguro adequado deixam a viagem muito mais tranquila.',
        ],
      },
    ],
    faq: [
      {
        question: 'Vale a pena usar agência ou consultoria na primeira viagem internacional?',
        answer:
          'Para muitos viajantes, sim. O apoio reduz erros de planejamento e ajuda a organizar voos, hospedagem, seguro e documentação com mais segurança.',
      },
      {
        question: 'Qual é o maior erro de quem vai viajar ao exterior pela primeira vez?',
        answer:
          'Um dos erros mais comuns é focar só na passagem e deixar documentação, imigração, seguro e logística local para a última hora.',
      },
    ],
    relatedLinks: [
      {
        title: 'Planejar viagem',
        href: '/planejar',
        description: 'Pesquise voos e hospedagem em um mesmo fluxo de planejamento.',
      },
      {
        title: 'Documentos para viagem internacional',
        href: '/guias/documentos-para-viagem-internacional',
        description: 'Confira o checklist ideal para o embarque.',
      },
      {
        title: 'Blog de viagens',
        href: '/blog',
        description: 'Acesse mais conteúdos evergreen sobre roteiros, documentação e dicas práticas.',
      },
    ],
  },
];

export const seoGuideCategories = [
  {
    slug: 'vistos',
    title: 'Vistos e documentação',
    description: 'Conteúdos para brasileiros que precisam entender regras de entrada, permanência e documentação internacional.',
  },
  {
    slug: 'morar-fora',
    title: 'Morar fora do Brasil',
    description: 'Guias introdutórios para organizar mudança internacional, finanças e adaptação.',
  },
  {
    slug: 'planejamento',
    title: 'Planejamento de viagem',
    description: 'Materiais práticos para estruturar roteiros, orçamento, documentação e experiência de viagem.',
  },
  {
    slug: 'viagem-internacional',
    title: 'Viagem internacional',
    description: 'Conteúdos evergreen para quem quer viajar ao exterior com mais previsibilidade e segurança.',
  },
];

export const getSeoGuidePageBySlug = (slug: string) =>
  seoGuidePages.find((page) => page.slug === slug);
