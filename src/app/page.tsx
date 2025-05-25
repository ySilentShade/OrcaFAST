
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
import ContractTypeDialog from '@/components/ContractTypeDialog'; // New Import
import type { SupportedContractType } from '@/types/contract'; // New Import

const companyInfo: CompanyInfo = {
  name: "FastFilms",
  logoUrl: "https://raw.githubusercontent.com/Lyd09/FF/587b5eb4cf0fc07885618620dc1f18e8d6e0aef4/LOGO%20SVG.svg",
  address: "Rua Criativa, 789, Estúdio Central, Filmópolis - SP",
  email: "contato@fastfilms.com",
  phone: "(11) 98765-4321",
};

const generateBudgetNumber = () => {
  const year = new Date().getFullYear();
  const randomNumber = Math.floor(Math.random() * 100000).toString().padStart(5, '0');
  return `ORC-${year}-${randomNumber}`;
};

// Helper function to create the preview object
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
  const [previewData, setPreviewData] = useState<BudgetPreviewData | null>(null);
  const { toast } = useToast();
  const previewRef = useRef<HTMLDivElement>(null);

  const [lastSubmittedBudgetNumber, setLastSubmittedBudgetNumber] = useState("PREVIEW");
  const [lastSubmittedBudgetDate, setLastSubmittedBudgetDate] = useState(() => new Date().toLocaleDateString('pt-BR'));

  // State for contract dialog
  const [isContractTypeDialogOpen, setIsContractTypeDialogOpen] = useState(false);

  // Initialize date on client side to avoid hydration mismatch
  useEffect(() => {
    setLastSubmittedBudgetDate(new Date().toLocaleDateString('pt-BR'));
  }, []);


  const handleFormSubmit = useCallback((data: BudgetFormState) => {
    const finalBudgetNumber = generateBudgetNumber();
    const finalBudgetDate = new Date().toLocaleDateString('pt-BR');
    
    setLastSubmittedBudgetNumber(finalBudgetNumber);
    setLastSubmittedBudgetDate(finalBudgetDate);

    const finalPreview = createPreviewObject(data, finalBudgetNumber, finalBudgetDate, companyInfo);
    setPreviewData(finalPreview);

    if (finalPreview) {
        toast({ title: "Orçamento Gerado!", description: "A pré-visualização foi atualizada.", variant: "default" });
    }
  }, [toast]); 

  const handlePreviewUpdate = useCallback((data: BudgetFormState) => {
    const currentPreviewNumber = lastSubmittedBudgetNumber;
    const currentPreviewDate = lastSubmittedBudgetDate;
    
    const updatedPreview = createPreviewObject(data, currentPreviewNumber, currentPreviewDate, companyInfo);
    setPreviewData(updatedPreview);
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
        setPreviewData(demoPreview);
    }
    return data;
  };

  const handleDownloadPdf = async () => {
    if (!previewRef.current || !previewData) {
      toast({
        title: "Erro ao gerar PDF",
        description: "Não há dados de orçamento para gerar o PDF.",
        variant: "destructive",
      });
      return;
    }

    const element = previewRef.current.querySelector('#budget-preview-content');
    if (!element) {
         toast({
        title: "Erro ao gerar PDF",
        description: "Conteúdo da pré-visualização não encontrado.",
        variant: "destructive",
      });
      return;
    }

    const html2pdf = (await import('html2pdf.js')).default;

    const clientNameSanitized = previewData.clientName ? previewData.clientName.replace(/[^a-z0-9]/gi, '_').toLowerCase() : 'cliente';
    const opt = {
      margin:       0.5,
      filename:     `orcamento_${clientNameSanitized || 'orcafast'}.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true, backgroundColor: '#18191b' },
      jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' }
    };

    const worker = html2pdf().from(element).set(opt);
    worker.save();

    toast({
      title: "PDF Gerado",
      description: `O arquivo ${opt.filename} está sendo baixado.`,
    });
  };

  const handleContractTypeSelect = (contractType: SupportedContractType) => {
    // For now, just log the selected type. 
    // In the future, this will trigger opening a specific contract form/dialog.
    console.log("Selected contract type:", contractType);
    toast({
      title: "Tipo de Contrato Selecionado",
      description: `Você selecionou: ${contractType}. O próximo passo será preencher os dados específicos.`,
    });
    setIsContractTypeDialogOpen(false);
  };


  return (
    <div className="min-h-screen bg-background text-foreground">
      <AppHeader />
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <BudgetForm 
              onSubmitForm={handleFormSubmit} 
              onFillWithDemoData={handleFillWithDemoData}
              onPreviewUpdate={handlePreviewUpdate} 
            />
          </div>
          <div className="lg:col-span-1">
            <div className="flex gap-2 mb-4">
              {previewData && (
                <Button 
                  onClick={handleDownloadPdf} 
                  className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  <Download className="mr-2 h-4 w-4" /> Baixar PDF
                </Button>
              )}
              <Button 
                variant="outline" 
                size="icon" 
                onClick={() => setIsContractTypeDialogOpen(true)}
                className={!previewData ? "w-full" : ""}
                title="Gerar Contrato"
              >
                <FileSignature className="h-5 w-5" />
              </Button>
            </div>
            <div ref={previewRef}>
              <BudgetPreview data={previewData} />
            </div>
          </div>
        </div>
      </main>
      <ContractTypeDialog 
        isOpen={isContractTypeDialogOpen}
        onOpenChange={setIsContractTypeDialogOpen}
        onContractTypeSelect={handleContractTypeSelect}
      />
    </div>
  );
}

