
"use client";

import React, { useState, useRef, useCallback, useEffect } from 'react';
import type { UseFormGetValues, UseFormSetValue } from 'react-hook-form';
import AppHeader from '@/components/AppHeader';
import BudgetForm from '@/components/BudgetForm';
import BudgetPreview from '@/components/BudgetPreview';
import { Button } from '@/components/ui/button';
import { Download, FileSignature } from 'lucide-react';
import type { BudgetFormState, BudgetPreviewData, CompanyInfo, BudgetItem, BudgetItemForm, BudgetDemoData } from '@/types/budget';
import { fetchDemoBudgetData } from './actions';
import { useToast } from "@/hooks/use-toast";
import ContractTypeDialog from '@/components/ContractTypeDialog';
import type { SupportedContractType, AnyContractFormState, PermutaEquipmentServiceContractData, ServiceVideoContractData } from '@/types/contract';
import { initialPermutaData, initialServiceVideoData } from '@/types/contract';
import ContractFormDialog from '@/components/ContractFormDialog';
import { cn } from '@/lib/utils';
import initialPresetsData from '@/data/presets.json';


export const companyInfo: CompanyInfo = {
  name: "FastFilms",
  logoUrl: "https://raw.githubusercontent.com/Lyd09/FF/587b5eb4cf0fc07885618620dc1f18e8d6e0aef4/LOGO%20SVG.svg",
  address: "Rua Bartolomeu Bueno de Gusmao, 594 - Aeronautas, Lagoa Santa - MG, 33.236- 454",
  email: "fastfilmsoficial@gmail.com",
  phone: "(11) 98765-4321",
};

const generateBudgetNumber = () => {
  const year = new Date().getFullYear();
  const randomNumber = Math.floor(Math.random() * 100000).toString().padStart(5, '0');
  return `ORC-${year}-${randomNumber}`;
};

const createPreviewObject = (
  formData: Partial<BudgetFormState>, // formData.items[n].totalOverride é string
  budgetNumber: string,
  budgetDate: string,
  currentCompanyInfo: CompanyInfo,
  isDroneFeatureEnabled: boolean
): BudgetPreviewData | null => {
  if (!formData || (!formData.clientName && !formData.clientAddress && (!formData.items || formData.items.length === 0 || !formData.items.some(i => i.description || i.quantity || i.unitPrice)))) {
    if (budgetNumber === "PREVIEW") return null;
  }

  const items: BudgetItem[] = (formData.items || []).map((itemFormData: Partial<BudgetItemForm>) => {
    const quantity = parseFloat(itemFormData.quantity || '0') || 0;
    const unitPrice = parseFloat(itemFormData.unitPrice || '0') || 0;
    const totalOverrideString = itemFormData.totalOverride;
    
    let finalItemTotal: number;

    if (totalOverrideString && totalOverrideString.trim() !== '') {
      const parsedOverride = parseFloat(totalOverrideString);
      if (!isNaN(parsedOverride) && parsedOverride >=0) {
        finalItemTotal = parsedOverride;
      } else {
        finalItemTotal = quantity * unitPrice; // Fallback se override for inválido
      }
    } else {
      finalItemTotal = quantity * unitPrice;
    }

    return {
      id: itemFormData.id || crypto.randomUUID(), // Garantir ID
      description: itemFormData.description || "",
      quantity,
      unitPrice,
      total: finalItemTotal,
    };
  });

  const totalAmount = items.reduce((sum, item) => sum + item.total, 0);

  return {
    clientName: formData.clientName || "",
    clientAddress: formData.clientAddress || "",
    items,
    terms: formData.terms || "",
    budgetNumber,
    budgetDate,
    companyInfo: currentCompanyInfo,
    totalAmount,
    isDroneFeatureEnabled,
  };
};


export default function Home() {
  const [budgetPreviewData, setBudgetPreviewData] = useState<BudgetPreviewData | null>(null);
  const { toast } = useToast();
  const budgetPreviewRef = useRef<HTMLDivElement>(null);
  
  const [lastSubmittedBudgetNumber, setLastSubmittedBudgetNumber] = useState("PREVIEW");
  const [lastSubmittedBudgetDate, setLastSubmittedBudgetDate] = useState(() => new Date().toLocaleDateString('pt-BR'));
  const [isDroneFeatureEnabled, setIsDroneFeatureEnabled] = useState(false);

  const [isContractTypeDialogOpen, setIsContractTypeDialogOpen] = useState(false);
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

    const finalPreview = createPreviewObject(data, finalBudgetNumber, finalBudgetDate, companyInfo, isDroneFeatureEnabled);
    setBudgetPreviewData(finalPreview);

    if (finalPreview) {
        toast({ title: "Orçamento Gerado!", description: "A pré-visualização foi atualizada.", variant: "default" });
    }
  }, [toast, isDroneFeatureEnabled]); 

  const handleBudgetPreviewUpdate = useCallback((data: Partial<BudgetFormState>) => {
    const currentPreviewNumber = lastSubmittedBudgetNumber;
    const currentPreviewDate = lastSubmittedBudgetDate;
    
    const updatedPreview = createPreviewObject(data, currentPreviewNumber, currentPreviewDate, companyInfo, isDroneFeatureEnabled);
    setBudgetPreviewData(updatedPreview);
  }, [lastSubmittedBudgetNumber, lastSubmittedBudgetDate, isDroneFeatureEnabled]);


  const handleFillWithDemoData = async (): Promise<BudgetDemoData | null> => {
    const demoApiData = await fetchDemoBudgetData(); 
    if (demoApiData) {
        const demoFormStateForPreview: BudgetFormState = {
            clientName: demoApiData.clientName,
            clientAddress: demoApiData.clientAddress,
            items: [{
                id: crypto.randomUUID(),
                description: demoApiData.item.description,
                quantity: demoApiData.item.quantity.toString(),
                unitPrice: demoApiData.item.unitPrice.toString(),
                totalOverride: '',
            }],
            terms: "Condições Comerciais: Forma de Pagamento: Transferência bancária, boleto ou PIX.\n\nCondições de Pagamento: 50% do valor será pago antes do início do serviço e o restante, após sua conclusão."
        };
        
        const demoPreview = createPreviewObject(
            demoFormStateForPreview, 
            "PREVIEW", 
            new Date().toLocaleDateString('pt-BR'), 
            companyInfo,
            isDroneFeatureEnabled
        );
        setBudgetPreviewData(demoPreview); 
        return demoApiData; 
    }
    return null;
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
      html2canvas:  { scale: 2, useCORS: true, backgroundColor: '#18191b' }, 
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
    };
    html2pdf().from(element).set(opt).save();
    toast({ title: "PDF do Orçamento Gerado", description: `O arquivo ${opt.filename} está sendo baixado.` });
  };

  const handleToggleDroneFeature = useCallback((
    getFormValues: UseFormGetValues<BudgetFormState>,
    setFormValue: UseFormSetValue<BudgetFormState>
  ) => {
    const newDroneState = !isDroneFeatureEnabled;
    setIsDroneFeatureEnabled(newDroneState);

    const currentItems = getFormValues().items;
    const videoProductionItemIndex = currentItems.findIndex(item => item.description === "Produção de Vídeo");

    if (videoProductionItemIndex !== -1) {
      // Clear totalOverride for the "Produção de Vídeo" item so unitPrice change takes effect
      setFormValue(`items.${videoProductionItemIndex}.totalOverride`, '', { shouldValidate: true, shouldDirty: true, shouldTouch: true });

      if (newDroneState) {
        setFormValue(`items.${videoProductionItemIndex}.unitPrice`, "500.00", { shouldValidate: true, shouldDirty: true, shouldTouch: true });
        toast({ title: "Drone Ativado!", description: "Preço de 'Produção de Vídeo' ajustado para R$500,00." });
      } else {
        const videoPreset = initialPresetsData.find(p => p.description === "Produção de Vídeo");
        const defaultPrice = videoPreset ? videoPreset.unitPrice.toString() : "250.00"; // Fallback if preset not found
        setFormValue(`items.${videoProductionItemIndex}.unitPrice`, defaultPrice, { shouldValidate: true, shouldDirty: true, shouldTouch: true });
        toast({ title: "Drone Desativado!", description: `Preço de 'Produção de Vídeo' ajustado para R$${defaultPrice}.` });
      }
    } else if (newDroneState) {
      toast({ title: "Aviso", description: "Item 'Produção de Vídeo' não encontrado para aplicar o preço do drone.", variant: "default" });
    }
    // Preview will be updated by the watch in BudgetForm due to setValue changing form values
  }, [isDroneFeatureEnabled, setIsDroneFeatureEnabled, toast]);


  // --- Contract Logic ---
  const handleContractTypeSelect = (contractType: SupportedContractType) => {
    setSelectedContractType(contractType);
    let initialData: AnyContractFormState | null = null;

    if (contractType === 'PERMUTA_EQUIPMENT_SERVICE') {
      initialData = { ...initialPermutaData, contractFullDate: new Date().toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' }) };
    } else if (contractType === 'SERVICE_VIDEO') {
      const serviceVideoInitial = {
        ...initialServiceVideoData,
        contratantes: initialServiceVideoData.contratantes.map(c => ({...c, id: crypto.randomUUID()})),
        contractFullDate: new Date().toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })
      };
      initialData = serviceVideoInitial;
    } else {
      initialData = { contractType } as AnyContractFormState; 
    }

    if (initialData) {
      setCurrentContractFormData(initialData);
      setFinalContractDataForPdf(initialData); 
    }
    setIsContractTypeDialogOpen(false); 
    setIsContractFormDialogOpen(true); 
  };

  const handleContractFormChange = useCallback((data: AnyContractFormState) => {
    setCurrentContractFormData(data);
    setFinalContractDataForPdf(data); 
  }, []);

  const handleContractFormSubmit = useCallback((data: AnyContractFormState) => {
    setFinalContractDataForPdf(data); 
    setCurrentContractFormData(data); 
    toast({ title: "Dados do Contrato Salvos", description: "Pronto para gerar o PDF do contrato." });
  }, [toast]);

  const handleDownloadContractPdf = async () => {
    const previewElement = document.getElementById('contract-preview-content'); 
    if (!previewElement || !finalContractDataForPdf) {
      toast({ title: "Erro ao gerar PDF do Contrato", description: "Não há dados de contrato para gerar o PDF.", variant: "destructive" });
      return;
    }

    const html2pdf = (await import('html2pdf.js')).default;
    let clientNameSanitized = 'contrato';
    let partyName = '';

    if (finalContractDataForPdf.contractType === 'PERMUTA_EQUIPMENT_SERVICE') {
        partyName = (finalContractDataForPdf as PermutaEquipmentServiceContractData).permutante.name;
    } else if (finalContractDataForPdf.contractType === 'SERVICE_VIDEO') {
        const serviceContractData = finalContractDataForPdf as ServiceVideoContractData;
        if (serviceContractData.contratantes && serviceContractData.contratantes.length > 0) {
            partyName = serviceContractData.contratantes[0].name; 
        }
    }
    clientNameSanitized = partyName ? partyName.replace(/[^a-z0-9]/gi, '_').toLowerCase() : finalContractDataForPdf.contractType.toLowerCase();


    const opt = {
      margin: [0.75, 0.75, 0.75, 0.75], 
      filename: `contrato_${finalContractDataForPdf.contractType.toLowerCase()}_${clientNameSanitized}.pdf`,
      image: { type: 'jpeg', quality: 0.95 },
      html2canvas: { scale: 2, useCORS: true, backgroundColor: '#ffffff' }, 
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
              isDroneFeatureEnabled={isDroneFeatureEnabled}
              onToggleDroneFeature={handleToggleDroneFeature}
            />
          </div>
          <div className="lg:col-span-1">
            <div className="flex gap-2 mb-4">
              {budgetPreviewData && (
                <Button 
                  onClick={handleDownloadBudgetPdf} 
                  className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  <Download className="mr-2 h-4 w-4" /> Baixar Orçamento
                </Button>
              )}
              <Button 
                variant="outline" 
                size="icon" 
                onClick={() => setIsContractTypeDialogOpen(true)}
                className={cn(
                  "hover:bg-primary/90 hover:text-primary-foreground",
                  !budgetPreviewData && "w-full" 
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
            onOpenChange={(isOpen) => {
              setIsContractFormDialogOpen(isOpen);
              if (!isOpen) setSelectedContractType(null); 
            }}
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
