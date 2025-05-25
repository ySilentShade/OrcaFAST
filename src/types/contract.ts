
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
  permutante: ContractParty; // Person/entity ceding equipment
  // Permutado is FastFilms, so its details can be hardcoded or come from CompanyInfo
  equipmentDescription: string;
  equipmentValue: number; // Monetary value
  serviceDescription: string; // Services to be rendered by FastFilms
  conditions?: string; // Specific conditions, like deadline for services
  transferClause?: string; // Details about property transfer
  foro: string; // e.g., "Lagoa Santa/MG"
  contractDate: string; // e.g., "15 de maio de 2025"
  cityForDate: string; // e.g., "Lagoa Santa/MG" for the "Lagoa Santa/MG, 15 de maio de 2025." line
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


// Union type for all possible contract data structures
export type AnyContractData = 
  | PermutaEquipmentServiceContractData 
  | ServiceVideoContractData
  | FreelanceHireContractData;
