
"use client";

import React, { useState, useRef, useCallback, useEffect } from 'react';
import AppHeader from '@/components/AppHeader';
import BudgetForm from '@/components/BudgetForm';
import BudgetPreview from '@/components/BudgetPreview';
import { Button } from '@/components/ui/button';
import { Download, FileSignature } from 'lucide-react';
import type { BudgetFormState, BudgetPreviewData, CompanyInfo, BudgetItem, BudgetDemoData } from '@/types/budget';
import { fetchDemoBudgetData } from './actions';
import { useToast } from "@/hooks/use-toast";
import ContractTypeDialog from '@/components/ContractTypeDialog';
import type { SupportedContractType, AnyContractFormState, PermutaEquipmentServiceContractData, initialPermutaData } from '@/types/contract';
import { initialPermutaData as defaultPermutaDataValues } from '@/types/contract';
import ContractFormDialog from '@/components/ContractFormDialog'; // New Dialog for contract forms
import { cn } from '@/lib/utils';

export const companyInfo: CompanyInfo = {
  name: "FastFilms",
  logoUrl: "https://raw.githubusercontent.com/Lyd09/FF/587b5eb4cf0fc07885618620dc1f18e8d6e0aef4/LOGO%20SVG.svg",
  address: "Rua Bartolomeu Bueno de Gusmao, 594 - Aeronautas, Lagoa Santa - MG, 33.236- 454",
  email: "fastfilmsoficial@gmail.com",
  phone: "(11) 98765-4321", // Example, adjust as needed
};

const generateBudgetNumber = () => {
  const year = new Date().getFullYear();
  const randomNumber = Math.floor(Math.random() * 100000).toString().padStart(5, '0');
  return `ORC-${year}-${randomNumber}`;
};

const createPreviewObject = (
  formData: BudgetFormState,
  budgetNumber: string,
  budgetDate: string,
  currentCompanyInfo: CompanyInfo
): BudgetPreviewData | null => {
  if (!formData || (!formData.clientName && !formData.clientAddress && (!formData.items || formData.items.length === 0 || !formData.items.some(i => i.description || i.quantity || i.unitPrice)))) {
    return null;
  }

  const items: BudgetItem[] = (formData.items || []).map(item => {
    const quantity = parseFloat(item.quantity) || 0;
    const unitPrice = parseFloat(item.unitPrice) || 0;
    return {
      id: item.id,
      description: item.description,
      quantity,
      unitPrice,
      total: quantity * unitPrice,
    };
  });

  const totalAmount = items.reduce((sum, item) => sum + item.total, 0);

  return {
    clientName: formData.clientName,
    clientAddress: formData.clientAddress,
    items,
    terms: formData.terms,
    budgetNumber,
    budgetDate,
    companyInfo: currentCompanyInfo,
    totalAmount,
  };
};


export default function Home() {
  const [budgetPreviewData, setBudgetPreviewData] = useState<BudgetPreviewData | null>(null);
  const { toast } = useToast();
  const budgetPreviewRef = useRef<HTMLDivElement>(null);
  const contractPreviewRef = useRef<HTMLDivElement>(null); // For contract PDF

  const [lastSubmittedBudgetNumber, setLastSubmittedBudgetNumber] = useState("PREVIEW");
  const [lastSubmittedBudgetDate, setLastSubmittedBudgetDate] = useState(() => new Date().toLocaleDateString('pt-BR'));

  // State for contract type selection dialog
  const [isContractTypeDialogOpen, setIsContractTypeDialogOpen] = useState(false);
  
  // State for contract form dialog
  const [isContractFormDialogOpen, setIsContractFormDialogOpen] = useState(false);
  const [selectedContractType, setSelectedContractType] = useState<SupportedContractType | null>(null);
  const [currentContractFormData, setCurrentContractFormData] = useState<AnyContractFormState | null>(null);
  const [finalContractDataForPdf, setFinalContractDataForPdf] = useState<AnyContractFormState | null>(null);


  useEffect(() => {
    setLastSubmittedBudgetDate(new Date().toLocaleDateString('pt-BR'));
  }, []);


  const handleBudgetFormSubmit = useCallback((data: BudgetFormState) => {
    const finalBudgetNumber = generateBudgetNumber();
    const finalBudgetDate = new Date().toLocaleDateString('pt-BR');
    
    setLastSubmittedBudgetNumber(finalBudgetNumber);
    setLastSubmittedBudgetDate(finalBudgetDate);

    const finalPreview = createPreviewObject(data, finalBudgetNumber, finalBudgetDate, companyInfo);
    setBudgetPreviewData(finalPreview);

    if (finalPreview) {
        toast({ title: "Orçamento Gerado!", description: "A pré-visualização foi atualizada.", variant: "default" });
    }
  }, [toast]); 

  const handleBudgetPreviewUpdate = useCallback((data: BudgetFormState) => {
    const currentPreviewNumber = lastSubmittedBudgetNumber;
    const currentPreviewDate = lastSubmittedBudgetDate;
    
    const updatedPreview = createPreviewObject(data, currentPreviewNumber, currentPreviewDate, companyInfo);
    setBudgetPreviewData(updatedPreview);
  }, [lastSubmittedBudgetNumber, lastSubmittedBudgetDate]); 


  const handleFillWithDemoData = async (): Promise<BudgetDemoData | null> => {
    const data = await fetchDemoBudgetData();
    if (data) {
        const demoFormState: BudgetFormState = {
            clientName: data.clientName,
            clientAddress: data.clientAddress,
            items: [{
                id: crypto.randomUUID(),
                description: data.item.description,
                quantity: data.item.quantity.toString(),
                unitPrice: data.item.unitPrice.toString(),
            }],
            terms: "Condições Comerciais: Forma de Pagamento: Transferência bancária, boleto ou PIX.\n\nCondições de Pagamento: 50% do valor será pago antes do início do serviço e o restante, após sua conclusão."
        };
        
        const demoPreview = createPreviewObject(
            demoFormState, 
            "PREVIEW", 
            new Date().toLocaleDateString('pt-BR'), 
            companyInfo
        );
        setBudgetPreviewData(demoPreview);
    }
    return data;
  };

  const handleDownloadBudgetPdf = async () => {
    if (!budgetPreviewRef.current || !budgetPreviewData) {
      toast({ title: "Erro ao gerar PDF do Orçamento", description: "Não há dados de orçamento para gerar o PDF.", variant: "destructive" });
      return;
    }
    const element = budgetPreviewRef.current.querySelector('#budget-preview-content');
    if (!element) {
         toast({ title: "Erro ao gerar PDF", description: "Conteúdo da pré-visualização do orçamento não encontrado.", variant: "destructive" });
      return;
    }
    const html2pdf = (await import('html2pdf.js')).default;
    const clientNameSanitized = budgetPreviewData.clientName ? budgetPreviewData.clientName.replace(/[^a-z0-9]/gi, '_').toLowerCase() : 'cliente';
    const opt = {
      margin: 0.5, filename: `orcamento_${clientNameSanitized || 'orcafast'}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true, backgroundColor: '#18191b' }, // Dark background for budget
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
    };
    html2pdf().from(element).set(opt).save();
    toast({ title: "PDF do Orçamento Gerado", description: `O arquivo ${opt.filename} está sendo baixado.` });
  };

  // --- Contract Logic ---
  const handleContractTypeSelect = (contractType: SupportedContractType) => {
    setSelectedContractType(contractType);
    // Initialize form data based on contract type
    if (contractType === 'PERMUTA_EQUIPMENT_SERVICE') {
      const initialData = { ...defaultPermutaDataValues, contractFullDate: new Date().toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' }) };
      setCurrentContractFormData(initialData);
      setFinalContractDataForPdf(initialData); // Also set for initial PDF download readiness
    } else {
      // Placeholder for other contract types
      setCurrentContractFormData({ contractType } as AnyContractFormState);
      setFinalContractDataForPdf({ contractType } as AnyContractFormState);
    }
    setIsContractTypeDialogOpen(false); // Close selection dialog
    setIsContractFormDialogOpen(true); // Open form dialog
  };

  const handleContractFormChange = useCallback((data: AnyContractFormState) => {
    setCurrentContractFormData(data);
    setFinalContractDataForPdf(data); // Update data for PDF as well
  }, []);

  const handleContractFormSubmit = useCallback((data: AnyContractFormState) => {
    setFinalContractDataForPdf(data); // This data will be used for PDF generation
    setCurrentContractFormData(data); // Keep form in sync
    // Potentially save to a backend or list in the future
    toast({ title: "Dados do Contrato Salvos", description: "Pronto para gerar o PDF do contrato." });
  }, [toast]);

  const handleDownloadContractPdf = async () => {
    const previewElement = document.getElementById('contract-preview-content'); // Target the new preview
    if (!previewElement || !finalContractDataForPdf) {
      toast({ title: "Erro ao gerar PDF do Contrato", description: "Não há dados de contrato para gerar o PDF.", variant: "destructive" });
      return;
    }

    const html2pdf = (await import('html2pdf.js')).default;
    let clientNameSanitized = 'contrato';
    if (finalContractDataForPdf.contractType === 'PERMUTA_EQUIPMENT_SERVICE') {
        clientNameSanitized = (finalContractDataForPdf as PermutaEquipmentServiceContractData).permutante.name.replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'permutante';
    }
    // Add more specific naming for other contract types if needed

    const opt = {
      margin: 0.75, // Standard margin for contracts
      filename: `contrato_${finalContractDataForPdf.contractType.toLowerCase()}_${clientNameSanitized}.pdf`,
      image: { type: 'jpeg', quality: 0.95 },
      html2canvas: { scale: 2, useCORS: true, backgroundColor: '#ffffff' }, // White background for contracts
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
    };
    html2pdf().from(previewElement).set(opt).save();
    toast({ title: "PDF do Contrato Gerado", description: `O arquivo ${opt.filename} está sendo baixado.` });
  };


  return (
    <div className="min-h-screen bg-background text-foreground">
      <AppHeader />
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <BudgetForm 
              onSubmitForm={handleBudgetFormSubmit} 
              onFillWithDemoData={handleFillWithDemoData}
              onPreviewUpdate={handleBudgetPreviewUpdate} 
            />
          </div>
          <div className="lg:col-span-1">
            <div className="flex gap-2 mb-4">
              {budgetPreviewData && (
                <Button 
                  onClick={handleDownloadBudgetPdf} 
                  className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  <Download className="mr-2 h-4 w-4" /> Baixar PDF
                </Button>
              )}
              <Button 
                variant="outline" 
                size="icon" 
                onClick={() => setIsContractTypeDialogOpen(true)}
                className={cn(
                  "hover:bg-primary/90 hover:text-primary-foreground",
                  !budgetPreviewData && "w-full" // Make full width if no budget preview
                )}
                title="Gerar Contrato"
              >
                <FileSignature className="h-5 w-5" />
              </Button>
            </div>
            <div ref={budgetPreviewRef}>
              <BudgetPreview data={budgetPreviewData} />
            </div>
          </div>
        </div>
      </main>
      <ContractTypeDialog 
        isOpen={isContractTypeDialogOpen}
        onOpenChange={setIsContractTypeDialogOpen}
        onContractTypeSelect={handleContractTypeSelect}
      />
      {selectedContractType && currentContractFormData && (
        <ContractFormDialog
            isOpen={isContractFormDialogOpen}
            onOpenChange={setIsContractFormDialogOpen}
            contractType={selectedContractType}
            companyInfo={companyInfo}
            initialFormData={currentContractFormData}
            onFormChange={handleContractFormChange}
            onFormSubmit={handleContractFormSubmit}
            onDownloadPdf={handleDownloadContractPdf}
            currentContractData={finalContractDataForPdf}
        />
      )}
    </div>
  );
}
