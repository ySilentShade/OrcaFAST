
"use client";

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import type { SupportedContractType, AnyContractFormState, PermutaEquipmentServiceContractData, initialPermutaData as initialPermutaDataTypeDef } from '@/types/contract'; // Adjust path as needed
import PermutaContractForm from './forms/PermutaContractForm';
import ContractPreview from './ContractPreview';
import type { CompanyInfo } from '@/types/budget';
import { useToast } from "@/hooks/use-toast";


interface ContractFormDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  contractType: SupportedContractType | null;
  companyInfo: CompanyInfo;
  initialFormData: AnyContractFormState | null;
  onFormChange: (data: AnyContractFormState) => void;
  onFormSubmit: (data: AnyContractFormState) => void; // For saving/finalizing data
  onDownloadPdf: () => void;
  currentContractData: AnyContractFormState | null;
}

const ContractFormDialog: React.FC<ContractFormDialogProps> = ({
  isOpen,
  onOpenChange,
  contractType,
  companyInfo,
  initialFormData,
  onFormChange,
  onFormSubmit,
  onDownloadPdf,
  currentContractData,
}) => {
  const { toast } = useToast();

  if (!contractType || !initialFormData) {
    return null; // Or some loading/error state
  }

  const handleSubmit = (data: AnyContractFormState) => {
    onFormSubmit(data);
    toast({ title: "Contrato Salvo!", description: "Os dados do contrato foram salvos." });
    // Potentially close dialog or offer PDF download immediately
  };


  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl h-[90vh] flex flex-col bg-card text-card-foreground p-0">
        <DialogHeader className="p-4 border-b">
          <DialogTitle>Gerar Contrato: {contractType.replace(/_/g, ' ')}</DialogTitle>
          <DialogDescription>
            Preencha os campos abaixo para gerar o contrato. A pré-visualização será atualizada automaticamente.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-grow grid grid-cols-1 lg:grid-cols-2 gap-0 overflow-hidden">
          <div className="lg:col-span-1 p-6 overflow-y-auto">
            {contractType === 'PERMUTA_EQUIPMENT_SERVICE' && (
              <PermutaContractForm
                initialData={initialFormData as PermutaEquipmentServiceContractData}
                onSubmitForm={handleSubmit}
                onPreviewUpdate={onFormChange}
              />
            )}
            {/* Add other contract forms here */}
            {contractType !== 'PERMUTA_EQUIPMENT_SERVICE' && (
                <p className="text-center p-10">Formulário para {contractType.replace(/_/g, ' ')} ainda não implementado.</p>
            )}
          </div>
          <div className="lg:col-span-1 p-6 bg-gray-100 dark:bg-background/30 overflow-y-auto">
             <div className="flex justify-end mb-4">
                {currentContractData && (
                    <Button 
                        onClick={onDownloadPdf} 
                        variant="outline"
                        className="bg-primary hover:bg-primary/90 text-primary-foreground"
                    >
                        <Download className="mr-2 h-4 w-4" /> Baixar PDF do Contrato
                    </Button>
                )}
            </div>
            <ContractPreview data={currentContractData} companyInfo={companyInfo} />
          </div>
        </div>
        
        <div className="p-4 border-t flex justify-end">
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Fechar
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ContractFormDialog;
