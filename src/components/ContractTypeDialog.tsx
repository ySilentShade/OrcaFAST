
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
import { FileText, Video, Repeat, UserCheck, FileCheck2, UserCog, Briefcase, ArrowLeft } from 'lucide-react'; 

interface ContractTypeDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onContractTypeSelect: (contractType: SupportedContractType) => void;
}

const contractTypesByCategory = [
  {
    category: 'Serviços',
    icon: Briefcase,
    contracts: [
      { 
          type: 'PERMUTA_EQUIPMENT_SERVICE' as SupportedContractType, 
          label: 'Permuta de Equipamento por Serviços', 
          icon: Repeat,
          disabled: false 
      },
      { 
          type: 'SERVICE_VIDEO' as SupportedContractType, 
          label: 'Prestação de Serviços de Vídeo', 
          icon: Video,
          disabled: false 
      },
    ]
  },
  {
    category: 'Contratação',
    icon: UserCog,
    contracts: [
      { 
          type: 'FREELANCE_HIRE_FILMMAKER' as SupportedContractType, 
          label: 'Contratação Cinegrafista', 
          icon: UserCheck, 
          disabled: false 
      },
      { 
          type: 'FREELANCE_HIRE_EDITOR' as SupportedContractType, 
          label: 'Contratação Editor de Vídeo', 
          icon: UserCheck,
          disabled: false 
      },
      { 
          type: 'FREELANCER_MATERIAL_AUTHORIZATION' as SupportedContractType,
          label: 'Autorização de Uso de Material',
          icon: FileCheck2,
          disabled: false
      },
    ]
  }
];


const ContractTypeDialog: React.FC<ContractTypeDialogProps> = ({ isOpen, onOpenChange, onContractTypeSelect }) => {
  const [view, setView] = useState<'categories' | 'contracts'>('categories');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleSelectContract = (type: SupportedContractType) => {
    onContractTypeSelect(type);
    resetView();
  };

  const handleSelectCategory = (category: string) => {
    setSelectedCategory(category);
    setView('contracts');
  };

  const resetView = () => {
    setView('categories');
    setSelectedCategory(null);
  };
  
  const handleOpenChange = (open: boolean) => {
    onOpenChange(open);
    if (!open) {
      setTimeout(resetView, 300); // Delay to allow dialog to close gracefully
    }
  }
  
  const currentContracts = contractTypesByCategory.find(c => c.category === selectedCategory)?.contracts || [];

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md bg-card text-card-foreground">
        <DialogHeader className="mb-2">
           <div className="flex items-center">
             {view === 'contracts' && (
                <Button variant="ghost" size="icon" onClick={resetView} className="mr-2">
                    <ArrowLeft className="h-5 w-5" />
                </Button>
             )}
            <DialogTitle className="text-2xl">
              {view === 'categories' ? 'Selecionar Categoria' : `Contratos de ${selectedCategory}`}
            </DialogTitle>
           </div>
          <DialogDescription>
            {view === 'categories' ? 'Escolha uma categoria para ver os modelos de contrato.' : 'Escolha o modelo de contrato que deseja gerar.'}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-2">
          {view === 'categories' && contractTypesByCategory.map(({ category, icon: CategoryIcon }) => (
            <Button
              key={category}
              onClick={() => handleSelectCategory(category)}
              className="w-full h-auto p-3 rounded-lg flex items-center justify-start text-left transition-colors
                          border border-border bg-card text-card-foreground
                          hover:bg-primary/90 hover:text-primary-foreground focus:ring-2 focus:ring-primary group"
            >
              <CategoryIcon className="mr-3 h-5 w-5 text-primary group-hover:text-primary-foreground" />
              <span className="flex-1">{category}</span>
            </Button>
          ))}
          
          {view === 'contracts' && currentContracts.map(({ type, label, icon: Icon, disabled }) => (
            <Button
              key={type}
              onClick={() => handleSelectContract(type)}
              disabled={disabled}
              className="w-full h-auto p-3 rounded-lg flex items-center justify-start text-left transition-colors
                          border border-border bg-card text-card-foreground
                          hover:bg-primary/90 hover:text-primary-foreground focus:ring-2 focus:ring-primary
                          disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              <Icon className="mr-3 h-5 w-5 text-primary group-hover:text-primary-foreground" /> 
              <span className="flex-1">{label}{disabled ? " (Em breve)" : ""}</span>
            </Button>
          ))}
        </div>
        
        <DialogFooter className="mt-4">
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
