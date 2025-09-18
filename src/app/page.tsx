
"use client";

import React, { useState, useRef, useCallback, useEffect } from 'react';
import type { UseFormGetValues, UseFormSetValue } from 'react-hook-form';
import AppHeader from '@/components/AppHeader';
import BudgetForm from '@/components/BudgetForm';
import BudgetPreview from '@/components/BudgetPreview';
import { Button } from '@/components/ui/button';
import { Download, FileSignature } from 'lucide-react';
import type { BudgetFormState, BudgetPreviewData, CompanyInfo, BudgetItem, BudgetItemForm, BudgetDemoData, DiscountType } from '@/types/budget';
import { fetchDemoBudgetData } from './actions';
import { useToast } from "@/hooks/use-toast";
import ContractTypeDialog from '@/components/ContractTypeDialog';
import type { SupportedContractType, AnyContractFormState, PermutaEquipmentServiceContractData, ServiceVideoContractData, FreelanceFilmmakerContractData, FreelancerMaterialAuthorizationData, FreelanceEditorContractData } from '@/types/contract';
import { initialPermutaData, initialServiceVideoData, initialFreelanceFilmmakerData, initialFreelanceEditorData, initialFreelancerMaterialAuthorizationData } from '@/types/contract';
import ContractFormDialog from '@/components/ContractFormDialog';
import { cn } from '@/lib/utils';
import initialPresetsData from '@/data/presets.json';
import jsPDF from 'jspdf';


export const companyInfo: CompanyInfo = {
  name: "FastFilms",
  logoUrl: "https://raw.githubusercontent.com/Lyd09/FF/587b5eb4cf0fc07885618620dc1f18e8d6e0aef4/LOGO%20SVG.svg",
  address: "Rua Bartolomeu Bueno de Gusmao, 594 - Aeronautas, Lagoa Santa - MG, 33.236- 454",
  email: "fastfilmsoficial@gmail.com",
  phone: "(11) 98765-4321",
  cnpj: "53.525.841/0001-89",
};

const generateBudgetNumber = () => {
  const year = new Date().getFullYear();
  const randomNumber = Math.floor(Math.random() * 100000).toString().padStart(5, '0');
  return `ORC-${year}-${randomNumber}`;
};

const createPreviewObject = (
  formData: Partial<BudgetFormState>,
  budgetNumber: string,
  budgetDate: string,
  currentCompanyInfo: CompanyInfo,
  isDroneFeatureEnabled: boolean
): BudgetPreviewData | null => {
  if (!formData || (!formData.clientName && !formData.clientAddress && (!formData.items || formData.items.length === 0 || !formData.items.some(i => i.description || i.quantity || i.unitPrice)))) {
    if (budgetNumber === "PREVIEW") return null;
  }

  const items: BudgetItem[] = (formData.items || []).map((itemFormData: Partial<BudgetItemForm>) => {
    const originalUnitPrice = parseFloat(itemFormData.unitPrice || '0') || 0;
    const quantity = parseFloat(itemFormData.quantity || '0') || 0;
    const itemSubtotal = quantity * originalUnitPrice;

    let finalItemTotal = itemSubtotal;
    let discountVal: number | undefined = undefined;
    let discountPct: number | undefined = undefined;
    let itemDiscountType: DiscountType | undefined = undefined;

    const discountType = itemFormData.discountType || 'AMOUNT';
    const discountValueStr = itemFormData.discountValue;
    
    if (discountValueStr && discountValueStr.trim() !== '' && itemSubtotal > 0) {
      const parsedDiscountValue = parseFloat(discountValueStr);
      if (!isNaN(parsedDiscountValue) && parsedDiscountValue > 0) {
        itemDiscountType = discountType;
        if (discountType === 'PERCENTAGE' && parsedDiscountValue <= 100) {
            discountPct = parsedDiscountValue;
            discountVal = itemSubtotal * (discountPct / 100);
            finalItemTotal = itemSubtotal - discountVal;
        } else if (discountType === 'AMOUNT' && parsedDiscountValue <= itemSubtotal) {
            discountVal = parsedDiscountValue;
            finalItemTotal = itemSubtotal - discountVal;
            discountPct = (discountVal / itemSubtotal) * 100;
        }
      }
    }

    return {
      id: itemFormData.id || crypto.randomUUID(),
      description: itemFormData.description || "",
      quantity,
      unitPrice: originalUnitPrice,
      total: finalItemTotal,
      discountValue: discountVal,
      discountPercentage: discountPct,
      discountType: itemDiscountType,
    };
  });

  const subtotal = items.reduce((sum, item) => sum + item.total, 0);

  let totalAmount = subtotal;
  let totalDiscountValue: number | undefined = undefined;
  let totalDiscountPercentage: number | undefined = undefined;
  
  const discountType = formData.discountType || 'AMOUNT';
  const discountValueStr = formData.discountValue;

  if (discountValueStr && discountValueStr.trim() !== '' && subtotal > 0) {
    const parsedDiscountValue = parseFloat(discountValueStr);
    if (!isNaN(parsedDiscountValue) && parsedDiscountValue > 0) {
      if (discountType === 'PERCENTAGE' && parsedDiscountValue <= 100) {
          totalDiscountPercentage = parsedDiscountValue;
          totalDiscountValue = subtotal * (totalDiscountPercentage / 100);
          totalAmount = subtotal - totalDiscountValue;
      } else if (discountType === 'AMOUNT' && parsedDiscountValue <= subtotal) {
          totalDiscountValue = parsedDiscountValue;
          totalAmount = subtotal - totalDiscountValue;
          totalDiscountPercentage = (totalDiscountValue / subtotal) * 100;
      }
    }
  }


  return {
    clientName: formData.clientName || "",
    clientAddress: formData.clientAddress || "",
    items,
    terms: formData.terms || "",
    budgetNumber,
    budgetDate,
    companyInfo: currentCompanyInfo,
    subtotal,
    totalAmount,
    totalDiscountValue,
    totalDiscountPercentage,
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
        const demoFormStateForPreview: Partial<BudgetFormState> = {
            clientName: demoApiData.clientName,
            clientAddress: demoApiData.clientAddress,
            items: [{
                id: crypto.randomUUID(),
                description: demoApiData.item.description,
                quantity: demoApiData.item.quantity.toString(),
                unitPrice: demoApiData.item.unitPrice.toString(),
                discountType: 'AMOUNT',
                discountValue: '',
            }],
            terms: "Condições Comerciais: Forma de Pagamento: Transferência bancária, boleto ou PIX.\n\nCondições de Pagamento: 50% do valor será pago antes do início do serviço e o restante, após sua conclusão.",
            discountType: 'AMOUNT',
            discountValue: '',
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

  const handleDownloadPdf = async (
    contentElementId: string,
    fileNamePrefix: string,
    options?: { orientation?: 'p' | 'l', format?: string | number[] }
  ) => {
    const { orientation = 'p', format = 'a4' } = options || {};
    const contentElement = document.getElementById(contentElementId);

    if (!contentElement) {
        toast({ title: "Erro ao gerar PDF", description: `Elemento com ID '${contentElementId}' não encontrado.`, variant: "destructive" });
        return;
    }

    try {
        const doc = new jsPDF({
            orientation,
            unit: 'pt',
            format,
            putOnlyUsedFonts: true,
            floatPrecision: 16,
        });

        const margin = 40;
        const pageWidth = doc.internal.pageSize.getWidth();
        const contentWidth = pageWidth - (margin * 2);

        await doc.html(contentElement, {
            callback: function (doc) {
                doc.save(`${fileNamePrefix}.pdf`);
                toast({ title: `PDF Gerado`, description: `O arquivo ${fileNamePrefix}.pdf está sendo baixado.` });
            },
            html2canvas: {
                scale: 0.7, // Ajustado para melhor renderização
                useCORS: true,
                logging: false,
            },
            margin: [margin, margin, margin, margin],
            autoPaging: 'text',
            width: contentWidth, // Use calculated width
            windowWidth: 900, // Fixed window width for consistency
        });

    } catch (error) {
        console.error("Erro ao gerar PDF com jsPDF:", error);
        toast({ title: "Erro ao gerar PDF", description: "Ocorreu um erro inesperado.", variant: "destructive" });
    }
  };

  const handleDownloadBudgetPdf = async () => {
    if (!budgetPreviewData) {
        toast({ title: "Erro ao gerar PDF do Orçamento", description: "Não há dados de orçamento para gerar o PDF.", variant: "destructive" });
        return;
    }
    const clientNameSanitized = budgetPreviewData.clientName.replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'orcafast';
    handleDownloadPdf('budget-preview-content', `orcamento_${clientNameSanitized}`);
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
      setFormValue(`items.${videoProductionItemIndex}.discountValue`, '', { shouldValidate: true, shouldDirty: true, shouldTouch: true });

      if (newDroneState) {
        setFormValue(`items.${videoProductionItemIndex}.unitPrice`, "500.00", { shouldValidate: true, shouldDirty: true, shouldTouch: true });
        toast({ title: "Drone Ativado!", description: "Preço de 'Produção de Vídeo' ajustado para R$500,00." });
      } else {
        const videoPreset = initialPresetsData.find(p => p.description === "Produção de Vídeo");
        const defaultPrice = videoPreset ? videoPreset.unitPrice.toString() : "250.00";
        setFormValue(`items.${videoProductionItemIndex}.unitPrice`, defaultPrice, { shouldValidate: true, shouldDirty: true, shouldTouch: true });
        toast({ title: "Drone Desativado!", description: `Preço de 'Produção de Vídeo' ajustado para R$${defaultPrice}.` });
      }
    } else if (newDroneState) {
      toast({ title: "Aviso", description: "Item 'Produção de Vídeo' não encontrado para aplicar o preço do drone.", variant: "default" });
    }
  }, [isDroneFeatureEnabled, setIsDroneFeatureEnabled, toast]);


  // --- Contract Logic ---
  const handleContractTypeSelect = (contractType: SupportedContractType) => {
    setSelectedContractType(contractType);
    let initialData: AnyContractFormState | null = null;
    const currentDate = new Date().toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' });

    if (contractType === 'PERMUTA_EQUIPMENT_SERVICE') {
      initialData = { ...initialPermutaData, contractFullDate: currentDate };
    } else if (contractType === 'SERVICE_VIDEO') {
      const serviceVideoInitial = {
        ...initialServiceVideoData,
        contratantes: initialServiceVideoData.contratantes.map(c => ({...c, id: crypto.randomUUID()})),
        contractFullDate: currentDate
      };
      initialData = serviceVideoInitial;
    } else if (contractType === 'FREELANCE_HIRE_FILMMAKER') {
      initialData = { ...initialFreelanceFilmmakerData, contractFullDate: currentDate };
    } else if (contractType === 'FREELANCER_MATERIAL_AUTHORIZATION') {
      initialData = { ...initialFreelancerMaterialAuthorizationData, autorizado: { ...initialFreelancerMaterialAuthorizationData.autorizado, cpfCnpj: companyInfo.cnpj }, contractFullDate: currentDate };
    } else if (contractType === 'FREELANCE_HIRE_EDITOR') {
      initialData = { ...initialFreelanceEditorData, contractFullDate: currentDate };
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
    if (!finalContractDataForPdf) {
      toast({ title: "Erro ao gerar PDF do Contrato", description: "Não há dados de contrato para gerar o PDF.", variant: "destructive" });
      return;
    }

    let partyName = '';
    if (finalContractDataForPdf.contractType === 'PERMUTA_EQUIPMENT_SERVICE') {
        partyName = (finalContractDataForPdf as PermutaEquipmentServiceContractData).permutante.name;
    } else if (finalContractDataForPdf.contractType === 'SERVICE_VIDEO') {
        const serviceContractData = finalContractDataForPdf as ServiceVideoContractData;
        if (serviceContractData.contratantes && serviceContractData.contratantes.length > 0) {
            partyName = serviceContractData.contratantes[0].name;
        }
    } else if (finalContractDataForPdf.contractType === 'FREELANCE_HIRE_FILMMAKER') {
        partyName = (finalContractDataForPdf as FreelanceFilmmakerContractData).contratado.name;
    } else if (finalContractDataForPdf.contractType === 'FREELANCER_MATERIAL_AUTHORIZATION') {
        partyName = (finalContractDataForPdf as FreelancerMaterialAuthorizationData).autorizado.name;
    } else if (finalContractDataForPdf.contractType === 'FREELANCE_HIRE_EDITOR') {
        partyName = (finalContractDataForPdf as FreelanceEditorContractData).contratado.name;
    }

    const clientNameSanitized = partyName ? partyName.replace(/[^a-z0-9]/gi, '_').toLowerCase() : finalContractDataForPdf.contractType.toLowerCase();
    
    // Set the contract text color to black before printing
    const previewElement = document.getElementById('contract-preview-content');
    if(previewElement) {
        previewElement.style.color = 'black';
    }

    await handleDownloadPdf(
        'contract-preview-content', 
        `contrato_${finalContractDataForPdf.contractType.toLowerCase()}_${clientNameSanitized}`,
        { orientation: 'p' }
    );
    
    // Revert the color back after printing
    if(previewElement) {
        previewElement.style.color = ''; // Reverts to CSS default
    }
  };


  return (
    <div className="min-h-screen bg-background text-foreground">
      <AppHeader />
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3">
            <BudgetForm
              onSubmitForm={handleBudgetFormSubmit}
              onFillWithDemoData={handleFillWithDemoData}
              onPreviewUpdate={handleBudgetPreviewUpdate}
              isDroneFeatureEnabled={isDroneFeatureEnabled}
              onToggleDroneFeature={handleToggleDroneFeature}
            />
          </div>
          <div className="lg:col-span-2">
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
                onClick={() => setIsContractTypeDialogOpen(true)}
                className={cn(
                  "hover:bg-primary hover:text-primary-foreground",
                  !budgetPreviewData && "w-full",
                  "p-2" 
                )}
                title="Gerar Contrato"
                size="icon"
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
            onBack={() => {
                setIsContractFormDialogOpen(false);
                setIsContractTypeDialogOpen(true);
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

    