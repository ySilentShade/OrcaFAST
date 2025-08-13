
export type DiscountType = 'PERCENTAGE' | 'AMOUNT';

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
  discountType: DiscountType; // 'PERCENTAGE' or 'AMOUNT'
  discountValue: string; // The value for the discount
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
  unitPrice: number; // This is the ORIGINAL unit price from the form
  total: number;     // This is the final value for the item (with override/discount, if any)
  discountValue?: number; // Absolute value of the discount, if applicable
  discountPercentage?: number; // Percentage of the discount, if applicable
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
  subtotal: number; // The sum of all item totals
  totalAmount: number; // The final total, can be the override value
  totalDiscountValue?: number; // The discount on the whole budget
  totalDiscountPercentage?: number; // The discount percentage on the whole budget
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
