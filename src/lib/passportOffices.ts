import { Language } from "@/contexts/LanguageContext";

export interface PassportOffice {
  country: string;
  flag: string;
  name: Record<Language, string>;
  website: string;
  phone: string;
  address: Record<Language, string>;
  documents: Record<Language, string[]>;
  processingTime: Record<Language, string>;
  cost: Record<Language, string>;
  tips: Record<Language, string[]>;
}

export const PASSPORT_OFFICES: Record<string, PassportOffice> = {
  BR: {
    country: "BR",
    flag: "🇧🇷",
    name: {
      pt: "Polícia Federal – Emissão de Passaporte",
      en: "Federal Police – Passport Issuance",
      es: "Policía Federal – Emisión de Pasaporte",
    },
    website: "https://www.gov.br/pf/pt-br/assuntos/passaporte",
    phone: "194",
    address: {
      pt: "Postos da Polícia Federal em todo o Brasil",
      en: "Federal Police offices throughout Brazil",
      es: "Oficinas de la Policía Federal en todo Brasil",
    },
    documents: {
      pt: [
        "Documento de identidade (RG) original",
        "CPF",
        "Título de eleitor (maiores de 18 anos)",
        "Certificado de reservista (homens 18-45 anos)",
        "Certidão de nascimento ou casamento",
        "Comprovante de pagamento da GRU (taxa)",
        "Foto 5x7 recente (fundo branco)",
      ],
      en: [
        "Original ID document (RG)",
        "CPF (tax ID)",
        "Voter registration card (18+)",
        "Military service certificate (men 18-45)",
        "Birth or marriage certificate",
        "GRU payment receipt (fee)",
        "Recent 5x7 photo (white background)",
      ],
      es: [
        "Documento de identidad (RG) original",
        "CPF (identificación fiscal)",
        "Título de elector (mayores de 18)",
        "Certificado de reservista (hombres 18-45)",
        "Acta de nacimiento o matrimonio",
        "Comprobante de pago de la GRU (tasa)",
        "Foto 5x7 reciente (fondo blanco)",
      ],
    },
    processingTime: {
      pt: "6 a 10 dias úteis",
      en: "6 to 10 business days",
      es: "6 a 10 días hábiles",
    },
    cost: {
      pt: "R$ 257,25",
      en: "R$ 257.25 (~US$ 50)",
      es: "R$ 257,25 (~US$ 50)",
    },
    tips: {
      pt: [
        "Agende online antes de ir ao posto da PF",
        "Leve documentos originais (não são aceitas cópias)",
        "Menores de 18 precisam de autorização dos pais",
        "O passaporte brasileiro tem validade de 10 anos",
        "É possível solicitar urgência em casos comprovados",
      ],
      en: [
        "Schedule online before visiting the PF office",
        "Bring original documents (copies not accepted)",
        "Minors need parental authorization",
        "Brazilian passport is valid for 10 years",
        "Expedited processing available for proven emergencies",
      ],
      es: [
        "Agende en línea antes de ir a la oficina de la PF",
        "Lleve documentos originales (no se aceptan copias)",
        "Menores de 18 necesitan autorización de los padres",
        "El pasaporte brasileño tiene validez de 10 años",
        "Se puede solicitar urgencia en casos comprobados",
      ],
    },
  },
  PT: {
    country: "PT",
    flag: "🇵🇹",
    name: {
      pt: "Instituto dos Registos e do Notariado (IRN)",
      en: "Institute of Registries and Notaries (IRN)",
      es: "Instituto de Registros y Notariado (IRN)",
    },
    website: "https://www.irn.mj.pt/IRN/sections/irn/a_registral/servicos-702712/passaporte-eletronico",
    phone: "+351 211 950 500",
    address: {
      pt: "Conservatórias e Lojas do Cidadão em Portugal",
      en: "Registry offices and Citizen Shops in Portugal",
      es: "Oficinas de registro y Tiendas del Ciudadano en Portugal",
    },
    documents: {
      pt: ["Cartão de Cidadão", "Foto tipo passe", "Comprovante de pagamento"],
      en: ["Citizen Card", "Passport photo", "Payment receipt"],
      es: ["Tarjeta de Ciudadano", "Foto tipo pasaporte", "Comprobante de pago"],
    },
    processingTime: { pt: "5 dias úteis", en: "5 business days", es: "5 días hábiles" },
    cost: { pt: "€ 65,00", en: "€ 65.00", es: "€ 65,00" },
    tips: {
      pt: ["Agendamento prévio é recomendado", "Passaporte válido por 5 anos", "Renovação pode ser feita online"],
      en: ["Prior scheduling recommended", "Passport valid for 5 years", "Renewal can be done online"],
      es: ["Se recomienda agendar previamente", "Pasaporte válido por 5 años", "La renovación se puede hacer en línea"],
    },
  },
  US: {
    country: "US",
    flag: "🇺🇸",
    name: {
      pt: "Departamento de Estado dos EUA",
      en: "U.S. Department of State",
      es: "Departamento de Estado de EE.UU.",
    },
    website: "https://travel.state.gov/content/travel/en/passports.html",
    phone: "1-877-487-2778",
    address: {
      pt: "Agências de Passaporte e Correios dos EUA",
      en: "Passport Agencies and Post Offices across the US",
      es: "Agencias de Pasaporte y Oficinas Postales de EE.UU.",
    },
    documents: {
      pt: ["Formulário DS-11", "Prova de cidadania americana", "Foto 2x2 polegadas", "Documento de identidade com foto"],
      en: ["Form DS-11", "Proof of US citizenship", "2x2 inch photo", "Photo ID"],
      es: ["Formulario DS-11", "Prueba de ciudadanía estadounidense", "Foto 2x2 pulgadas", "Documento de identidad con foto"],
    },
    processingTime: { pt: "6 a 8 semanas", en: "6 to 8 weeks", es: "6 a 8 semanas" },
    cost: { pt: "US$ 165 (adulto)", en: "US$ 165 (adult)", es: "US$ 165 (adulto)" },
    tips: {
      pt: ["Solicite com antecedência de 3+ meses", "Serviço expresso disponível por US$ 60 extra", "Válido por 10 anos para adultos"],
      en: ["Apply 3+ months in advance", "Expedited service available for extra $60", "Valid for 10 years for adults"],
      es: ["Solicite con 3+ meses de anticipación", "Servicio exprés disponible por US$ 60 extra", "Válido por 10 años para adultos"],
    },
  },
  AR: {
    country: "AR",
    flag: "🇦🇷",
    name: {
      pt: "Registro Nacional das Pessoas (RENAPER)",
      en: "National Registry of Persons (RENAPER)",
      es: "Registro Nacional de las Personas (RENAPER)",
    },
    website: "https://www.argentina.gob.ar/interior/renaper/pasaporte",
    phone: "+54 11 4311-1110",
    address: {
      pt: "Centros de Documentação Rápida na Argentina",
      en: "Rapid Documentation Centers in Argentina",
      es: "Centros de Documentación Rápida en Argentina",
    },
    documents: {
      pt: ["DNI argentino", "Foto 4x4", "Comprovante de pagamento"],
      en: ["Argentine DNI", "4x4 photo", "Payment receipt"],
      es: ["DNI argentino", "Foto 4x4", "Comprobante de pago"],
    },
    processingTime: { pt: "15 dias", en: "15 days", es: "15 días" },
    cost: { pt: "ARS 65.000", en: "ARS 65,000 (~US$ 65)", es: "ARS 65.000 (~US$ 65)" },
    tips: {
      pt: ["Agende turno online no site do RENAPER", "Válido por 10 anos", "Trâmite expresso disponível"],
      en: ["Schedule appointment online at RENAPER", "Valid for 10 years", "Express processing available"],
      es: ["Agende turno online en el sitio del RENAPER", "Válido por 10 años", "Trámite exprés disponible"],
    },
  },
  IT: {
    country: "IT",
    flag: "🇮🇹",
    name: {
      pt: "Questura – Ufficio Passaporti",
      en: "Questura – Passport Office",
      es: "Questura – Oficina de Pasaportes",
    },
    website: "https://www.poliziadistato.it/articolo/134",
    phone: "+39 06 46861",
    address: {
      pt: "Questura da província de residência na Itália",
      en: "Provincial Questura in Italy",
      es: "Questura de la provincia de residencia en Italia",
    },
    documents: {
      pt: ["Documento de identidade italiano", "2 fotos tipo passaporte", "Marca da bollo de € 73,50", "Formulário de solicitação"],
      en: ["Italian ID document", "2 passport photos", "Revenue stamp € 73.50", "Application form"],
      es: ["Documento de identidad italiano", "2 fotos tipo pasaporte", "Marca da bollo de € 73,50", "Formulario de solicitud"],
    },
    processingTime: { pt: "30 dias", en: "30 days", es: "30 días" },
    cost: { pt: "€ 116,00", en: "€ 116.00", es: "€ 116,00" },
    tips: {
      pt: ["Agende via Agenda Online da Polizia", "Válido por 10 anos", "Consulados emitem para italianos no exterior"],
      en: ["Schedule via Polizia Online Agenda", "Valid for 10 years", "Consulates issue for Italians abroad"],
      es: ["Agende vía Agenda Online de la Polizia", "Válido por 10 años", "Consulados emiten para italianos en el exterior"],
    },
  },
  DE: {
    country: "DE",
    flag: "🇩🇪",
    name: {
      pt: "Prefeitura Local (Bürgeramt)",
      en: "Local Citizens' Office (Bürgeramt)",
      es: "Oficina Municipal (Bürgeramt)",
    },
    website: "https://www.bmi.bund.de/DE/themen/moderne-verwaltung/ausweise-und-paesse/reisepass/reisepass-node.html",
    phone: "+49 30 115",
    address: {
      pt: "Bürgeramt da cidade de residência na Alemanha",
      en: "Bürgeramt of the city of residence in Germany",
      es: "Bürgeramt de la ciudad de residencia en Alemania",
    },
    documents: {
      pt: ["Documento de identidade alemão", "Foto biométrica", "Passaporte anterior (se houver)"],
      en: ["German ID", "Biometric photo", "Previous passport (if any)"],
      es: ["Documento de identidad alemán", "Foto biométrica", "Pasaporte anterior (si lo hay)"],
    },
    processingTime: { pt: "3 a 6 semanas", en: "3 to 6 weeks", es: "3 a 6 semanas" },
    cost: { pt: "€ 70,00 (adulto)", en: "€ 70.00 (adult)", es: "€ 70,00 (adulto)" },
    tips: {
      pt: ["Agendamento obrigatório no Bürgeramt", "Válido por 10 anos", "Passaporte expresso em 72h por € 32 extra"],
      en: ["Appointment required at Bürgeramt", "Valid for 10 years", "Express passport in 72h for € 32 extra"],
      es: ["Cita obligatoria en el Bürgeramt", "Válido por 10 años", "Pasaporte exprés en 72h por € 32 extra"],
    },
  },
  FR: {
    country: "FR",
    flag: "🇫🇷",
    name: {
      pt: "Prefeitura (Mairie)",
      en: "Town Hall (Mairie)",
      es: "Ayuntamiento (Mairie)",
    },
    website: "https://www.service-public.fr/particuliers/vosdroits/N360",
    phone: "34 00",
    address: {
      pt: "Mairie equipada com estação biométrica na França",
      en: "Mairie equipped with biometric station in France",
      es: "Mairie equipada con estación biométrica en Francia",
    },
    documents: {
      pt: ["Foto de identidade", "Justificativo de domicílio", "Timbre fiscal de € 86"],
      en: ["ID photo", "Proof of residence", "€ 86 tax stamp"],
      es: ["Foto de identidad", "Justificante de domicilio", "Timbre fiscal de € 86"],
    },
    processingTime: { pt: "2 a 3 semanas", en: "2 to 3 weeks", es: "2 a 3 semanas" },
    cost: { pt: "€ 86,00 (adulto)", en: "€ 86.00 (adult)", es: "€ 86,00 (adulto)" },
    tips: {
      pt: ["Pré-solicitação online no site ANTS", "Válido por 10 anos", "Gratuito para menores de 15 anos"],
      en: ["Pre-apply online at ANTS website", "Valid for 10 years", "Free for under 15"],
      es: ["Pre-solicite en línea en el sitio ANTS", "Válido por 10 años", "Gratuito para menores de 15 años"],
    },
  },
  JP: {
    country: "JP",
    flag: "🇯🇵",
    name: {
      pt: "Centro de Passaportes da Província",
      en: "Prefectural Passport Center",
      es: "Centro de Pasaportes de la Prefectura",
    },
    website: "https://www.mofa.go.jp/mofaj/toko/passport/",
    phone: "+81 3 3580-3311",
    address: {
      pt: "Centro de Passaportes da prefeitura local no Japão",
      en: "Passport Center of the local prefectural government",
      es: "Centro de Pasaportes del gobierno prefectural local",
    },
    documents: {
      pt: ["Formulário de solicitação", "Koseki Tohon (registro familiar)", "Foto 4,5x3,5cm", "Documento de identidade"],
      en: ["Application form", "Koseki Tohon (family register)", "4.5x3.5cm photo", "ID document"],
      es: ["Formulario de solicitud", "Koseki Tohon (registro familiar)", "Foto 4,5x3,5cm", "Documento de identidad"],
    },
    processingTime: { pt: "6 dias úteis", en: "6 business days", es: "6 días hábiles" },
    cost: { pt: "¥ 16.000 (10 anos)", en: "¥ 16,000 (10 years)", es: "¥ 16.000 (10 años)" },
    tips: {
      pt: ["Não é necessário agendamento", "Válido por 5 ou 10 anos", "Retirada pessoal obrigatória"],
      en: ["No appointment needed", "Valid for 5 or 10 years", "Personal pickup required"],
      es: ["No es necesario agendar", "Válido por 5 o 10 años", "Retiro personal obligatorio"],
    },
  },
  CO: {
    country: "CO",
    flag: "🇨🇴",
    name: {
      pt: "Cancillería de Colombia",
      en: "Colombian Ministry of Foreign Affairs",
      es: "Cancillería de Colombia",
    },
    website: "https://www.cancilleria.gov.co/tramites_servicios/pasaportes",
    phone: "+57 1 381 4000",
    address: {
      pt: "Oficinas de Passaporte da Cancillería na Colômbia",
      en: "Passport Offices of the Cancillería in Colombia",
      es: "Oficinas de Pasaporte de la Cancillería en Colombia",
    },
    documents: {
      pt: ["Cédula de ciudadanía", "Foto digital (tirada no local)", "Comprovante de pagamento"],
      en: ["Citizenship ID card", "Digital photo (taken on-site)", "Payment receipt"],
      es: ["Cédula de ciudadanía", "Foto digital (tomada en el lugar)", "Comprobante de pago"],
    },
    processingTime: { pt: "24 horas (urgente)", en: "24 hours (urgent)", es: "24 horas (urgente)" },
    cost: { pt: "COP 224.000", en: "COP 224,000 (~US$ 55)", es: "COP 224.000 (~US$ 55)" },
    tips: {
      pt: ["Agendamento online obrigatório", "Válido por 10 anos", "Pode ser solicitado em consulados"],
      en: ["Online appointment required", "Valid for 10 years", "Can be requested at consulates"],
      es: ["Cita en línea obligatoria", "Válido por 10 años", "Se puede solicitar en consulados"],
    },
  },
  MX: {
    country: "MX",
    flag: "🇲🇽",
    name: {
      pt: "Secretaría de Relaciones Exteriores (SRE)",
      en: "Ministry of Foreign Affairs (SRE)",
      es: "Secretaría de Relaciones Exteriores (SRE)",
    },
    website: "https://www.gob.mx/sre/acciones-y-programas/pasaportes-702",
    phone: "+52 55 3686 5581",
    address: {
      pt: "Delegações da SRE no México",
      en: "SRE Delegations in Mexico",
      es: "Delegaciones de la SRE en México",
    },
    documents: {
      pt: ["Acta de nascimento", "CURP", "Identificação oficial com foto", "Comprovante de pagamento"],
      en: ["Birth certificate", "CURP", "Official photo ID", "Payment receipt"],
      es: ["Acta de nacimiento", "CURP", "Identificación oficial con foto", "Comprobante de pago"],
    },
    processingTime: { pt: "3 a 5 semanas", en: "3 to 5 weeks", es: "3 a 5 semanas" },
    cost: { pt: "MXN 2.790 (10 anos)", en: "MXN 2,790 (10 years)", es: "MXN 2.790 (10 años)" },
    tips: {
      pt: ["Agende cita no site da SRE", "Passaporte eletrônico com chip", "Menores precisam de ambos os pais presentes"],
      en: ["Schedule appointment at SRE website", "Electronic passport with chip", "Minors need both parents present"],
      es: ["Agende cita en el sitio de la SRE", "Pasaporte electrónico con chip", "Menores necesitan ambos padres presentes"],
    },
  },
  CL: {
    country: "CL",
    flag: "🇨🇱",
    name: {
      pt: "Registro Civil e Identificação do Chile",
      en: "Civil Registry and Identification of Chile",
      es: "Registro Civil e Identificación de Chile",
    },
    website: "https://www.registrocivil.cl/principal/canal-702/702-pasaportes",
    phone: "+56 600 370 2000",
    address: {
      pt: "Oficinas do Registro Civil no Chile",
      en: "Civil Registry offices in Chile",
      es: "Oficinas del Registro Civil en Chile",
    },
    documents: {
      pt: ["Cédula de identidade chilena", "Comprovante de pagamento"],
      en: ["Chilean ID card", "Payment receipt"],
      es: ["Cédula de identidad chilena", "Comprobante de pago"],
    },
    processingTime: { pt: "10 dias úteis", en: "10 business days", es: "10 días hábiles" },
    cost: { pt: "CLP 75.400 (adulto)", en: "CLP 75,400 (adult)", es: "CLP 75.400 (adulto)" },
    tips: {
      pt: ["Agendamento online disponível", "Válido por 10 anos", "Dados biométricos coletados no local"],
      en: ["Online appointment available", "Valid for 10 years", "Biometric data collected on-site"],
      es: ["Cita en línea disponible", "Válido por 10 años", "Datos biométricos recopilados en el lugar"],
    },
  },
  PE: {
    country: "PE",
    flag: "🇵🇪",
    name: {
      pt: "Superintendência Nacional de Migrações",
      en: "National Superintendence of Migration",
      es: "Superintendencia Nacional de Migraciones",
    },
    website: "https://www.migraciones.gob.pe/pasaporte/",
    phone: "+51 1 200 1000",
    address: {
      pt: "Sede de Migrações e oficinas autorizadas no Peru",
      en: "Migration headquarters and authorized offices in Peru",
      es: "Sede de Migraciones y oficinas autorizadas en Perú",
    },
    documents: {
      pt: ["DNI peruano vigente", "Comprovante de pagamento"],
      en: ["Valid Peruvian DNI", "Payment receipt"],
      es: ["DNI peruano vigente", "Comprobante de pago"],
    },
    processingTime: { pt: "7 dias úteis", en: "7 business days", es: "7 días hábiles" },
    cost: { pt: "PEN 120,89", en: "PEN 120.89 (~US$ 32)", es: "PEN 120,89 (~US$ 32)" },
    tips: {
      pt: ["Agendamento online no site de Migraciones", "Passaporte biométrico", "Válido por 5 anos"],
      en: ["Online appointment at Migraciones website", "Biometric passport", "Valid for 5 years"],
      es: ["Cita en línea en el sitio de Migraciones", "Pasaporte biométrico", "Válido por 5 años"],
    },
  },
};

export function getPassportOffice(countryCode: string): PassportOffice {
  return PASSPORT_OFFICES[countryCode] || PASSPORT_OFFICES.BR;
}
