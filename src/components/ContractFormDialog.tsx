
"use client";

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import type { SupportedContractType, AnyContractFormState, PermutaEquipmentServiceContractData, ServiceVideoContractData, FreelanceFilmmakerContractData, FreelancerMaterialAuthorizationData } from '@/types/contract'; // Adjust path as needed
import PermutaContractForm from './forms/PermutaContractForm';
import ServiceVideoContractForm from './forms/ServiceVideoContractForm';
import FreelanceFilmmakerContractForm from './forms/FreelanceFilmmakerContractForm';
import FreelancerMaterialAuthorizationForm from './forms/FreelancerMaterialAuthorizationForm';
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
    return null; 
  }

  const handleSubmit = (data: AnyContractFormState) => {
    onFormSubmit(data);
    toast({ title: "Contrato Salvo!", description: "Os dados do contrato foram salvos." });
  };

  const getContractTypeDisplayName = (type: SupportedContractType): string => {
    switch(type) {
      case 'PERMUTA_EQUIPMENT_SERVICE':
        return 'Permuta de Equipamento por Serviços';
      case 'SERVICE_VIDEO':
        return 'Prestação de Serviços de Vídeo';
      case 'FREELANCE_HIRE_FILMMAKER':
        return 'Contratação Freelancer (Cinegrafista)';
      case 'FREELANCER_MATERIAL_AUTHORIZATION':
        return 'Autorização de Uso de Material (Freelancer)';
      case 'FREELANCE_HIRE_EDITOR':
        return 'Contratação Freelancer (Editor)';
      default:
        return 'Contrato';
    }
  };


  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl h-[90vh] flex flex-col bg-card text-card-foreground p-0">
        <DialogHeader className="p-4 border-b">
          <DialogTitle>Gerar Contrato: {getContractTypeDisplayName(contractType)}</DialogTitle>
          <DialogDescription>
            Preencha os campos abaixo para gerar o contrato. A pré-visualização será atualizada automaticamente.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-grow grid grid-cols-1 lg:grid-cols-2 gap-0 overflow-hidden">
          {/* Form Section - Scrolls if content is too long */}
          <div className="lg:col-span-1 p-6 overflow-y-auto">
            {contractType === 'PERMUTA_EQUIPMENT_SERVICE' && (
              <PermutaContractForm
                initialData={initialFormData as PermutaEquipmentServiceContractData}
                onSubmitForm={handleSubmit}
                onPreviewUpdate={onFormChange}
              />
            )}
            {contractType === 'SERVICE_VIDEO' && (
              <ServiceVideoContractForm
                initialData={initialFormData as ServiceVideoContractData}
                onSubmitForm={handleSubmit}
                onPreviewUpdate={onFormChange}
              />
            )}
             {contractType === 'FREELANCE_HIRE_FILMMAKER' && (
              <FreelanceFilmmakerContractForm
                initialData={initialFormData as FreelanceFilmmakerContractData}
                onSubmitForm={handleSubmit}
                onPreviewUpdate={onFormChange}
              />
            )}
            {contractType === 'FREELANCER_MATERIAL_AUTHORIZATION' && (
              <FreelancerMaterialAuthorizationForm
                initialData={initialFormData as FreelancerMaterialAuthorizationData}
                onSubmitForm={handleSubmit}
                onPreviewUpdate={onFormChange}
              />
            )}
            {(contractType !== 'PERMUTA_EQUIPMENT_SERVICE' && 
              contractType !== 'SERVICE_VIDEO' && 
              contractType !== 'FREELANCE_HIRE_FILMMAKER' &&
              contractType !== 'FREELANCER_MATERIAL_AUTHORIZATION'
             ) && (
                <p className="text-center p-10">Formulário para {getContractTypeDisplayName(contractType)} ainda não implementado.</p>
            )}
          </div>
          {/* Contract Preview Section - Scrolls if content is too long */}
          <div className="lg:col-span-1 p-6 bg-gray-100 dark:bg-background/50 overflow-y-auto">
             <div className="flex justify-end mb-4 sticky top-0 py-2 z-10 bg-gray-100 dark:bg-background/50">
                {currentContractData && (
                    <Button 
                        onClick={onDownloadPdf} 
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

