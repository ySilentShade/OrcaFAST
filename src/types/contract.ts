
// Defines the types of contracts supported by the application.
// This will be expanded as more contract functionalities are added.

export type SupportedContractType =
  | 'PERMUTA_EQUIPMENT_SERVICE'
  | 'SERVICE_VIDEO'
  | 'FREELANCE_HIRE_FILMMAKER'
  | 'FREELANCER_MATERIAL_AUTHORIZATION' // New type
  | 'FREELANCE_HIRE_EDITOR'; // Remains disabled for now

// Basic structure for contact information, reusable across contracts
export interface ContractParty {
  id?: string; // Optional ID for useFieldArray key
  name: string;
  cpfCnpj: string; // Can be CPF or CNPJ
  address: string;
  email: string;
  isCompany?: boolean; // To differentiate if it's a person or company, for salutations or field labels
}

// --- Data for "Permuta de Equipamento por Serviços" Contract ---
export interface PermutaEquipmentServiceContractData {
  contractType: 'PERMUTA_EQUIPMENT_SERVICE';
  contractTitle: string;
  permutante: ContractParty;
  // Permutado is FastFilms (Contratada) - Handled by CompanyInfo prop
  equipmentDescription: string;
  equipmentValue: string; // Keep as string for form input
  serviceDescription: string;
  paymentClause?: string; // "CLÁUSULA 2 - DA FORMA DE PAGAMENTO"
  conditions: string;
  transferClause: string;
  generalDispositions?: string; // "CLÁUSULA 5 - DAS DISPOSIÇÕES GERAIS"
  foro: string;
  contractCity: string; // e.g., "Lagoa Santa/MG" for the signature line
  contractFullDate: string; // e.g., "15 de maio de 2025" for the signature line
}

// --- Data for "Prestação de Serviços de Vídeo" Contract ---
export interface ServiceVideoContractData {
  contractType: 'SERVICE_VIDEO';
  contractTitle: string;
  contratantes: ContractParty[]; // Changed to an array
  // Contratada is FastFilms - Handled by CompanyInfo prop
  objectDescription: string; // e.g., "gravação e edição de 10 (dez) vídeos..."
  totalValue: string; // Keep as string for form input
  paymentType: 'vista' | 'sinal_entrega' | 'outro';
  sinalValuePercentage?: string; // if 'sinal_entrega', e.g., "50"
  paymentOutroDescription?: string; // if 'outro'
  deliveryDeadline: string; // e.g., "7 dias úteis após a última gravação"
  responsibilitiesContratada: string; // List of responsibilities as a single string for Textarea
  responsibilitiesContratante: string; // List of responsibilities as a single string for Textarea
  copyrightClause: string;
  rescissionNoticePeriodDays: string; // e.g., "7"
  rescissionPenaltyPercentage: string; // e.g., "20"
  generalDispositions?: string;
  foro: string;
  contractCity: string;
  contractFullDate: string;
}

// --- Data for "Contratação Freelancer Filmmaker" Contract ---
export interface FreelanceFilmmakerContractData {
  contractType: 'FREELANCE_HIRE_FILMMAKER';
  contractTitle: string;
  contratado: ContractParty; // The freelancer being hired
  remunerationValue: string; // e.g., "150.00"
  remunerationUnit: 'hora' | 'dia' | 'projeto'; // for "por [hora/dia/projeto]"
  paymentMethodDescription: string; // for "A forma de pagamento ao CONTRATADO (mensal, semanal ou por projeto) será de sua escolha..."
  deliveryDeadlineDetails: string; // for "Os prazos para execução e entrega dos arquivos serão definidos..."
  equipmentDetails: string; // for "Os equipamentos utilizados poderão ser..."
  confidentialityBreachPenaltyValue: string; // e.g., "15000.00"
  rescissionNoticeDays: string; // e.g., "15"
  unjustifiedRescissionPenaltyPercentage: string; // e.g., "30"
  foro: string;
  contractCity: string;
  contractFullDate: string;
}

// --- Data for "Termo de Autorização Específica de Uso de Material – Freelancer" Contract ---
export interface FreelancerMaterialAuthorizationData {
  contractType: 'FREELANCER_MATERIAL_AUTHORIZATION';
  contractTitle: string;
  autorizado: ContractParty; // The freelancer being authorized
  projectName: string;
  finalClientName: string;
  executionDate: string;
  authorizedLinks: string; // Could be a textarea for multiple links
  penaltyValue: string; // e.g., "5000.00"
  foro: string;
  contractCity: string;
  contractFullDate: string;
}


// --- Data for "Contratação Freelancer Editor" Contract (Placeholder) ---
export interface FreelanceEditorContractData {
  contractType: 'FREELANCE_HIRE_EDITOR';
  // Define fields as needed
  // For now, just a placeholder to keep the type system happy
  editorName?: string; 
  contractCity?: string;
  contractFullDate?: string;
}


// Union type for all possible contract data structures for form state
export type AnyContractFormState =
  | PermutaEquipmentServiceContractData
  | ServiceVideoContractData
  | FreelanceFilmmakerContractData
  | FreelancerMaterialAuthorizationData // Added new type
  | Partial<FreelanceEditorContractData>; // Use partial for editor until fully implemented

// Union type for all possible complete contract data structures
export type AnyContractData =
  | PermutaEquipmentServiceContractData
  | ServiceVideoContractData
  | FreelanceFilmmakerContractData
  | FreelancerMaterialAuthorizationData // Added new type
  | FreelanceEditorContractData;


// Initial data for forms
export const initialPermutaData: PermutaEquipmentServiceContractData = {
  contractType: 'PERMUTA_EQUIPMENT_SERVICE',
  contractTitle: 'CONTRATO DE PERMUTA DE EQUIPAMENTO POR PRESTAÇÃO DE SERVIÇOS',
  permutante: { name: '', cpfCnpj: '', address: '', email: '' },
  equipmentDescription: 'uma câmera fotográfica com acessórios',
  equipmentValue: '6000.00',
  serviceDescription: 'gravação e edição de vídeos',
  paymentClause: 'O pagamento do valor acordado será realizado por meio da prestação dos serviços descritos na cláusula anterior, não havendo a necessidade de pagamento em dinheiro.',
  conditions: 'Não há prazo limite estipulado para a quitação do valor em serviços. As partes se comprometem a manter comunicação clara e objetiva quanto à realização e entrega dos serviços.',
  transferClause: 'A propriedade do equipamento será transferida ao PERMUTADO na assinatura deste contrato, sendo este responsável por sua guarda, manutenção e utilização a partir de então.',
  generalDispositions: 'Este contrato é celebrado em caráter irrevogável e irretratável, obrigando as partes por si e seus sucessores.',
  foro: 'Lagoa Santa/MG',
  contractCity: 'Lagoa Santa/MG',
  contractFullDate: new Date().toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' }),
};

export const initialServiceVideoData: ServiceVideoContractData = {
  contractType: 'SERVICE_VIDEO',
  contractTitle: 'CONTRATO DE PRESTAÇÃO DE SERVIÇOS DE GRAVAÇÃO E EDIÇÃO DE VÍDEOS',
  contratantes: [{ id: crypto.randomUUID(), name: '', cpfCnpj: '', address: '', email: '' }], // Initialized as an array
  objectDescription: 'gravação e edição de 10 (dez) vídeos, conforme briefing e orientações fornecidas pelo CONTRATANTE.',
  totalValue: '2299.00',
  paymentType: 'sinal_entrega',
  sinalValuePercentage: '50',
  paymentOutroDescription: '',
  deliveryDeadline: '7 dias úteis após a realização da última gravação, salvo acordo diferente entre as partes.',
  responsibilitiesContratada: "Gravar os vídeos conforme combinado\nEditar os vídeos conforme briefing aprovado\nEntregar os vídeos finalizados em formato digital",
  responsibilitiesContratante: "Fornecer todas as informações necessárias para o trabalho\nAprovar o roteiro ou briefing, quando necessário\nEfetuar os pagamentos nas condições previstas",
  copyrightClause: 'Os direitos sobre os vídeos finalizados serão cedidos ao CONTRATANTE após o pagamento integral.',
  rescissionNoticePeriodDays: '7',
  rescissionPenaltyPercentage: '20',
  generalDispositions: 'Qualquer alteração neste contrato só terá validade se feita por escrito e assinada por ambas as partes.',
  foro: 'Lagoa Santa/MG',
  contractCity: 'Lagoa Santa/MG',
  contractFullDate: new Date().toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' }),
};

export const initialFreelanceFilmmakerData: FreelanceFilmmakerContractData = {
  contractType: 'FREELANCE_HIRE_FILMMAKER',
  contractTitle: 'CONTRATO DE PRESTAÇÃO DE SERVIÇOS FREELANCER PARA CAPTAÇÃO DE VÍDEO',
  contratado: { name: '', cpfCnpj: '', address: '', email: '' },
  remunerationValue: '150.00',
  remunerationUnit: 'dia',
  paymentMethodDescription: 'A forma de pagamento ao CONTRATADO (mensal, semanal ou por projeto) será de sua escolha, desde que acordada com a CONTRATANTE antes do início dos trabalhos, podendo esse acordo ser feito verbalmente, por e-mail ou qualquer outro meio eletrônico de comunicação aceito por ambas as partes.',
  deliveryDeadlineDetails: 'Os prazos para execução e entrega dos arquivos serão definidos por e-mail ou outro meio digital, sendo obrigatória sua confirmação pelo CONTRATADO.',
  equipmentDetails: 'Os equipamentos utilizados poderão ser fornecidos pela CONTRATANTE ou do próprio CONTRATADO, desde que previamente aprovados.',
  confidentialityBreachPenaltyValue: '15000.00',
  rescissionNoticeDays: '15',
  unjustifiedRescissionPenaltyPercentage: '30',
  foro: 'Lagoa Santa/MG',
  contractCity: 'Lagoa Santa/MG',
  contractFullDate: new Date().toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' }),
};

export const initialFreelancerMaterialAuthorizationData: FreelancerMaterialAuthorizationData = {
  contractType: 'FREELANCER_MATERIAL_AUTHORIZATION',
  contractTitle: 'TERMO DE AUTORIZAÇÃO ESPECÍFICA DE USO DE MATERIAL – FREELANCER',
  autorizado: { name: '', cpfCnpj: '', address: '', email: '' },
  projectName: '',
  finalClientName: '',
  executionDate: '',
  authorizedLinks: '',
  penaltyValue: '5000.00',
  foro: 'Lagoa Santa/MG',
  contractCity: 'Lagoa Santa/MG',
  contractFullDate: new Date().toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' }),
};


// Placeholder for freelance editor contract - not fully implemented yet
export const initialFreelanceEditorData: Partial<FreelanceEditorContractData> = {
  contractType: 'FREELANCE_HIRE_EDITOR',
  contractCity: 'Lagoa Santa/MG',
  contractFullDate: new Date().toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' }),
};

