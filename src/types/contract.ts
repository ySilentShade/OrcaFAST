
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
  // Permutado is FastFilms (Contratada)
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
  contratante: ContractParty; // Client hiring FastFilms
  // Contratada is FastFilms
  objectDescription: string; // e.g., "gravação e edição de 10 (dez) vídeos..."
  totalValue: number;
  paymentTerms: {
    type: 'vista' | 'sinal_entrega' | 'outro';
    sinalPercentage?: number; // if 'sinal_entrega'
    outroDescription?: string; // if 'outro'
  };
  deliveryDeadline: string; // e.g., "3 dias úteis após a última gravação"
  responsibilitiesContratada?: string[]; // List of responsibilities
  responsibilitiesContratante?: string[]; // List of responsibilities
  copyrightClause?: string;
  rescissionClause?: {
    noticePeriodDays: number; // e.g., 7
    penaltyPercentage: number; // e.g., 20
  };
  generalDispositions?: string;
  foro: string;
  contractDate: string;
  cityForDate: string;
  contratanteSignatories?: number; // For multiple signatories from contratante side
}

// --- Data for "Contratação Freelancer" Contract ---
export interface FreelanceHireContractData {
  contractType: 'FREELANCE_HIRE_EDITOR' | 'FREELANCE_HIRE_FILMMAKER';
  // Contratante is FastFilms
  freelancer: ContractParty; // The freelancer being hired
  serviceObject: string; // Specific description of services
  paymentValue: number;
  paymentMethod: string; // e.g., "PIX", "Transferência Bancária"
  deliveryTerms: string; // Deadlines, format, etc.
  confidentialityClause?: boolean;
  equipmentResponsibility?: 'FREELANCER' | 'FASTFILMS' | 'SHARED'; // Who provides equipment
  copyrightOwnership: 'FASTFILMS' | 'FREELANCER_LIMITED_LICENSE' | 'SHARED_USAGE';
  rescissionConditions?: string;
  foro: string;
  contractDate: string;
  cityForDate: string;
}


// Union type for all possible contract data structures for form state
export type AnyContractFormState = 
  | PermutaEquipmentServiceContractData 
  | Partial<ServiceVideoContractData> // Use partial for other types until fully implemented
  | Partial<FreelanceHireContractData>;

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
