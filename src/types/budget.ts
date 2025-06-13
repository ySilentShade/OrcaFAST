
export interface BudgetItemForm {
  id: string;
  description: string;
  quantity: string; // Use string for form input, convert to number on submission
  unitPrice: string; // Use string for form input, convert to number on submission
  totalOverride?: string; // Optional field to override the total calculation
}

export interface BudgetFormState {
  clientName: string;
  clientAddress: string;
  items: BudgetItemForm[];
  terms: string;
}

export interface PresetItem {
  id: string;
  description: string;
  unitPrice: number;
}

// Data structure for the actual budget calculation and preview
export interface BudgetItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number; // Este é o PREÇO UNITÁRIO ORIGINAL (DE TABELA)
  total: number;     // Este é o valor final do item (com override/desconto, se houver)
  discountValue?: number; // Valor absoluto do desconto, se aplicável
  discountPercentage?: number; // Percentual do desconto, se aplicável
}

export interface CompanyInfo {
  name: string;
  logoUrl: string;
  address: string;
  email: string;
  phone: string;
  cnpj: string;
}

export interface BudgetPreviewData {
  clientName: string;
  clientAddress: string;
  items: BudgetItem[];
  terms: string;
  budgetNumber: string;
  budgetDate: string;
  companyInfo: CompanyInfo;
  totalAmount: number;
  isDroneFeatureEnabled?: boolean;
}

// For AI demo data
export interface BudgetDemoData {
  clientName: string;
  clientAddress: string;
  item: {
    description: string;
    quantity: number;
    unitPrice: number;
  };
}
