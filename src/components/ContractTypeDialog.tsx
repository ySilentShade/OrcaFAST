
"use client";

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
import { FileText, Video, Repeat, UserCheck, FileCheck2 } from 'lucide-react'; 

interface ContractTypeDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onContractTypeSelect: (contractType: SupportedContractType) => void;
}

const contractTypesWithOptions = [
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
  { 
    type: 'FREELANCE_HIRE_FILMMAKER' as SupportedContractType, 
    label: 'Contratação Freelancer (Cinegrafista)', 
    icon: UserCheck, 
    disabled: false 
  },
  { 
    type: 'FREELANCER_MATERIAL_AUTHORIZATION' as SupportedContractType,
    label: 'Autorização de Uso de Material (Freelancer)',
    icon: FileCheck2,
    disabled: false
  },
  { 
    type: 'FREELANCE_HIRE_EDITOR' as SupportedContractType, 
    label: 'Contratação Freelancer (Editor)', 
    icon: UserCheck,
    disabled: false 
  },
];


const ContractTypeDialog: React.FC<ContractTypeDialogProps> = ({ isOpen, onOpenChange, onContractTypeSelect }) => {
  const handleSelect = (type: SupportedContractType) => {
    onContractTypeSelect(type);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card text-card-foreground">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-2xl">Selecionar Tipo de Contrato</DialogTitle>
          <DialogDescription>
            Escolha o modelo de contrato que deseja gerar. Os dados específicos serão solicitados a seguir.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-3">
          {contractTypesWithOptions.map(({ type, label, icon: Icon, disabled }) => (
            <Button
              key={type}
              onClick={() => handleSelect(type)}
              disabled={disabled}
              className="w-full h-auto p-4 rounded-lg flex items-center justify-start text-left transition-colors
                         border border-border bg-card text-card-foreground
                         hover:bg-primary/90 hover:text-primary-foreground focus:ring-2 focus:ring-primary
                         disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Icon className="mr-3 h-5 w-5 text-primary group-hover:text-primary-foreground" /> 
              <span className="flex-1">{label}{disabled ? " (Em breve)" : ""}</span>
            </Button>
          ))}
        </div>
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

    