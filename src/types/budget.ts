
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
  unitPrice: number;
  total: number; // This total will reflect the override if applied
}

export interface CompanyInfo {
  name: string;
  logoUrl: string;
  address: string;
  email: string;
  phone: string;
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
