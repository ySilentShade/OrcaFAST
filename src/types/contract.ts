
// Defines the types of contracts supported by the application.
// This will be expanded as more contract functionalities are added.

export type SupportedContractType = 
  | 'PERMUTA_EQUIPMENT_SERVICE' 
  | 'SERVICE_VIDEO'
  | 'FREELANCE_HIRE_EDITOR'
  | 'FREELANCE_HIRE_FILMMAKER';

// Basic structure for contact information, reusable across contracts
export interface ContractParty {
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
  contratante: ContractParty;
  // Contratada is FastFilms - Handled by CompanyInfo prop
  objectDescription: string; // e.g., "gravação e edição de 10 (dez) vídeos..."
  totalValue: string; // Keep as string for form input
  paymentType: 'vista' | 'sinal_entrega' | 'outro';
  sinalValuePercentage?: string; // if 'sinal_entrega', e.g., "50"
  paymentOutroDescription?: string; // if 'outro'
  deliveryDeadline: string; // e.g., "3 dias úteis após a última gravação"
  responsibilitiesContratada: string; // List of responsibilities as a single string for Textarea
  responsibilitiesContratante: string; // List of responsibilities as a single string for Textarea
  copyrightClause: string;
  rescissionNoticePeriodDays: string; // e.g., "7"
  rescissionPenaltyPercentage: string; // e.g., "20"
  generalDispositions?: string;
  foro: string;
  contractCity: string;
  contractFullDate: string;
  // contratanteSignatories?: number; // For multiple signatories - simplifying for now
}

// --- Data for "Contratação Freelancer" Contract ---
export interface FreelanceHireContractData {
  contractType: 'FREELANCE_HIRE_EDITOR' | 'FREELANCE_HIRE_FILMMAKER';
  // Contratante is FastFilms
  freelancer: ContractParty; // The freelancer being hired
  serviceObject: string; // Specific description of services
  paymentValue: string; // Keep as string
  paymentMethod: string; // e.g., "PIX", "Transferência Bancária"
  deliveryTerms: string; // Deadlines, format, etc.
  confidentialityClause?: boolean;
  equipmentResponsibility?: 'FREELANCER' | 'FASTFILMS' | 'SHARED'; // Who provides equipment
  copyrightOwnership: 'FASTFILMS' | 'FREELANCER_LIMITED_LICENSE' | 'SHARED_USAGE';
  rescissionConditions?: string;
  foro: string;
  contractCity: string;
  contractFullDate: string;
}


// Union type for all possible contract data structures for form state
export type AnyContractFormState = 
  | PermutaEquipmentServiceContractData 
  | ServiceVideoContractData
  | Partial<FreelanceHireContractData>; // Use partial for other types until fully implemented

// Union type for all possible complete contract data structures
export type AnyContractData =
  | PermutaEquipmentServiceContractData
  | ServiceVideoContractData
  | FreelanceHireContractData;

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
  contratante: { name: '', cpfCnpj: '', address: '', email: '' },
  objectDescription: 'gravação e edição de 10 (dez) vídeos, conforme briefing e orientações fornecidas pelo CONTRATANTE.',
  totalValue: '2299.00',
  paymentType: 'sinal_entrega',
  sinalValuePercentage: '50',
  paymentOutroDescription: '',
  deliveryDeadline: '7 dias úteis após a realização da última gravação, salvo acordo diferente entre as partes.',
  responsibilitiesContratada: "- Gravar os vídeos conforme combinado;\n- Editar os vídeos conforme briefing aprovado;\n- Entregar os vídeos finalizados em formato digital.",
  responsibilitiesContratante: "- Fornecer todas as informações necessárias para o trabalho;\n- Aprovar o roteiro ou briefing, quando necessário;\n- Efetuar os pagamentos nas condições previstas.",
  copyrightClause: 'Os direitos sobre os vídeos finalizados serão cedidos ao CONTRATANTE após o pagamento integral.',
  rescissionNoticePeriodDays: '7',
  rescissionPenaltyPercentage: '20',
  generalDispositions: 'Qualquer alteração neste contrato só terá validade se feita por escrito e assinada por ambas as partes.',
  foro: 'Lagoa Santa/MG',
  contractCity: 'Lagoa Santa/MG',
  contractFullDate: new Date().toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' }),
};

// Placeholder for freelance contracts - not fully implemented yet
export const initialFreelanceHireEditorData: Partial<FreelanceHireContractData> = {
  contractType: 'FREELANCE_HIRE_EDITOR',
  // ... other fields
};

export const initialFreelanceHireFilmmakerData: Partial<FreelanceHireContractData> = {
  contractType: 'FREELANCE_HIRE_FILMMAKER',
  // ... other fields
};
