
"use client";

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import type { SupportedContractType } from '@/types/contract';
import { Repeat, Video, UserCheck, FileCheck2, ArrowLeft, Handshake, Briefcase, ChevronLeft } from 'lucide-react'; 

interface ContractTypeDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onContractTypeSelect: (contractType: SupportedContractType) => void;
}

type Category = 'services' | 'hiring';

const contractTypesWithOptions = [
  { 
    type: 'PERMUTA_EQUIPMENT_SERVICE' as SupportedContractType, 
    label: 'Permuta de Equipamento por Serviços', 
    icon: Repeat,
    category: 'services' as Category,
    disabled: false 
  },
  { 
    type: 'SERVICE_VIDEO' as SupportedContractType, 
    label: 'Prestação de Serviços de Vídeo', 
    icon: Video,
    category: 'services' as Category,
    disabled: false 
  },
  { 
    type: 'FREELANCE_HIRE_FILMMAKER' as SupportedContractType, 
    label: 'Contratação Cinegrafista', 
    icon: UserCheck, 
    category: 'hiring' as Category,
    disabled: false 
  },
  { 
    type: 'FREELANCE_HIRE_EDITOR' as SupportedContractType, 
    label: 'Contratação Editor de Vídeo', 
    icon: UserCheck,
    category: 'hiring' as Category,
    disabled: false 
  },
  { 
    type: 'FREELANCER_MATERIAL_AUTHORIZATION' as SupportedContractType,
    label: 'Autorização de Uso de Material',
    icon: FileCheck2,
    category: 'hiring' as Category,
    disabled: false
  },
];


const ContractTypeDialog: React.FC<ContractTypeDialogProps> = ({ isOpen, onOpenChange, onContractTypeSelect }) => {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  
  const handleSelect = (type: SupportedContractType) => {
    onContractTypeSelect(type);
    resetView();
  };
  
  const resetView = () => {
    setSelectedCategory(null);
  }

  const handleOpenChange = (open: boolean) => {
    onOpenChange(open);
    if (!open) {
      setTimeout(resetView, 300); // Delay to allow dialog to close gracefully
    }
  }

  const renderContractButtons = (category: Category) => {
    return contractTypesWithOptions
      .filter(c => c.category === category)
      .map(({ type, label, icon: Icon, disabled }) => (
        <Button
          key={type}
          onClick={() => handleSelect(type)}
          disabled={disabled}
          className="w-full h-auto p-4 rounded-lg flex items-center justify-start text-left transition-colors group
                     border border-border bg-card text-card-foreground
                     hover:bg-primary/90 hover:text-primary-foreground focus:ring-2 focus:ring-primary"
        >
          <Icon className="mr-3 h-5 w-5 text-primary group-hover:text-primary-foreground" /> 
          <span className="flex-1">{label}{disabled ? " (Em breve)" : ""}</span>
        </Button>
      ));
  };


  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md bg-card text-card-foreground">
        <DialogHeader className="mb-2">
           <div className="flex items-center">
             {selectedCategory && (
                <Button variant="ghost" size="icon" onClick={() => setSelectedCategory(null)} className="mr-2">
                    <ArrowLeft className="h-5 w-5" />
                </Button>
             )}
            <DialogTitle className="text-2xl">
              {selectedCategory === null ? 'Selecionar Categoria' : selectedCategory === 'services' ? 'Contratos de Serviços' : 'Contratos de Contratação'}
            </DialogTitle>
           </div>
          <DialogDescription>
            {selectedCategory ? 'Escolha o modelo de contrato que deseja gerar.' : 'Selecione uma categoria para ver os modelos de contrato.'}
          </DialogDescription>
        </DialogHeader>

        {selectedCategory === null ? (
           <div className="flex flex-col gap-3">
              <Button 
                onClick={() => setSelectedCategory('services')} 
                className="w-full h-auto p-4 rounded-lg flex items-center justify-start text-left transition-colors group border border-border bg-card text-card-foreground hover:bg-primary/90 hover:text-primary-foreground focus:ring-2 focus:ring-primary"
              >
                <Handshake className="mr-3 h-5 w-5 text-primary group-hover:text-primary-foreground" />
                <span className="flex-1">Serviços</span>
              </Button>
              <Button 
                onClick={() => setSelectedCategory('hiring')} 
                className="w-full h-auto p-4 rounded-lg flex items-center justify-start text-left transition-colors group border border-border bg-card text-card-foreground hover:bg-primary/90 hover:text-primary-foreground focus:ring-2 focus:ring-primary"
              >
                <Briefcase className="mr-3 h-5 w-5 text-primary group-hover:text-primary-foreground" />
                <span className="flex-1">Contratação</span>
              </Button>
           </div>
        ) : (
          <div>
            <div className="flex flex-col gap-3">
              {renderContractButtons(selectedCategory)}
            </div>
          </div>
        )}

        <DialogFooter className="mt-6">
          <DialogClose asChild>
            <Button type="button" variant="ghost">
              Cancelar
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ContractTypeDialog;

    