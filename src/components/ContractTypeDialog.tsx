
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

interface ContractTypeDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onContractTypeSelect: (contractType: SupportedContractType) => void;
}

const ContractTypeDialog: React.FC<ContractTypeDialogProps> = ({ isOpen, onOpenChange, onContractTypeSelect }) => {
  const handleSelect = (type: SupportedContractType) => {
    onContractTypeSelect(type);
    // onOpenChange(false); // Dialog will be closed by the parent (page.tsx) after selection
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-card text-card-foreground">
        <DialogHeader>
          <DialogTitle>Selecionar Tipo de Contrato</DialogTitle>
          <DialogDescription>
            Escolha o modelo de contrato que deseja gerar. Os dados específicos serão solicitados a seguir.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Button 
            variant="outline" 
            onClick={() => handleSelect('PERMUTA_EQUIPMENT_SERVICE')}
            className="justify-start text-left h-auto py-3 hover:bg-primary/90 hover:text-primary-foreground"
          >
            Permuta de Equipamento por Serviços
          </Button>
          <Button 
            variant="outline" 
            onClick={() => handleSelect('SERVICE_VIDEO')}
            className="justify-start text-left h-auto py-3 hover:bg-primary/90 hover:text-primary-foreground"
            disabled // Remove disabled once implemented
          >
            Prestação de Serviços de Vídeo (Em breve)
          </Button>
          <Button 
            variant="outline" 
            onClick={() => handleSelect('FREELANCE_HIRE_EDITOR')}
            className="justify-start text-left h-auto py-3 hover:bg-primary/90 hover:text-primary-foreground"
            disabled // Remove disabled once implemented
          >
            Contratação Freelancer (Editor de Vídeo) (Em breve)
          </Button>
           <Button 
            variant="outline" 
            onClick={() => handleSelect('FREELANCE_HIRE_FILMMAKER')}
            className="justify-start text-left h-auto py-3 hover:bg-primary/90 hover:text-primary-foreground"
            disabled // Remove disabled once implemented
          >
            Contratação Freelancer (Cinegrafista/Captação) (Em breve)
          </Button>
        </div>
        <DialogFooter>
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
