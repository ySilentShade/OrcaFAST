"use client";

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Plus, Edit3, Trash2 } from 'lucide-react';
import type { PresetItem } from '@/types/budget';
import useLocalStorage from '@/hooks/useLocalStorage';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

interface PresetManagerDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

const initialPresets: PresetItem[] = [
  { id: crypto.randomUUID(), description: 'Produção de Vídeo', unitPrice: 250.00 },
  { id: crypto.randomUUID(), description: 'Animação de logomarca', unitPrice: 300.00 },
  { id: crypto.randomUUID(), description: 'Fotos Profissionais', unitPrice: 150.00 },
  { id: crypto.randomUUID(), description: 'Edição de Vídeo', unitPrice: 100.00 },
  { id: crypto.randomUUID(), description: 'Gravação (p/h)', unitPrice: 150.00 },
];

const PresetManagerDialog: React.FC<PresetManagerDialogProps> = ({ isOpen, onOpenChange }) => {
  const [presets, setPresets] = useLocalStorage<PresetItem[]>('fastfilms-presets', initialPresets);
  const [editingPreset, setEditingPreset] = useState<PresetItem | null>(null);
  const [newDescription, setNewDescription] = useState('');
  const [newPrice, setNewPrice] = useState('');

  useEffect(() => {
    if (editingPreset) {
      setNewDescription(editingPreset.description);
      setNewPrice(editingPreset.unitPrice.toString());
    } else {
      setNewDescription('');
      setNewPrice('');
    }
  }, [editingPreset]);

  const handleAddOrUpdatePreset = () => {
    const price = parseFloat(newPrice);
    if (newDescription.trim() === '' || isNaN(price) || price < 0) {
      // Basic validation, can be improved with toast notifications
      alert('Descrição e preço válido são obrigatórios.');
      return;
    }

    if (editingPreset) {
      setPresets(presets.map(p => p.id === editingPreset.id ? { ...p, description: newDescription, unitPrice: price } : p));
    } else {
      setPresets([...presets, { id: crypto.randomUUID(), description: newDescription, unitPrice: price }]);
    }
    setEditingPreset(null);
  };

  const handleDeletePreset = (id: string) => {
    setPresets(presets.filter(p => p.id !== id));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-card text-card-foreground">
        <DialogHeader>
          <DialogTitle>Gerenciar Presets (Modelos de Itens)</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-4 p-4 border rounded-md">
          <div className="md:col-span-2">
            <Label htmlFor="preset-description">Descrição do Preset</Label>
            <Input 
              id="preset-description" 
              value={newDescription} 
              onChange={(e) => setNewDescription(e.target.value)} 
              placeholder="Ex: Filmagem diária"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="preset-price">Preço Unitário (R$)</Label>
            <Input 
              id="preset-price" 
              type="number" 
              value={newPrice} 
              onChange={(e) => setNewPrice(e.target.value)} 
              placeholder="Ex: 150.00"
              className="mt-1"
            />
          </div>
          <div className="md:col-span-3 flex justify-end">
            <Button onClick={handleAddOrUpdatePreset} variant="default">
              <Plus className="mr-2 h-4 w-4" /> {editingPreset ? 'Atualizar Preset' : 'Adicionar Preset'}
            </Button>
            {editingPreset && (
              <Button variant="ghost" onClick={() => setEditingPreset(null)} className="ml-2">
                Cancelar Edição
              </Button>
            )}
          </div>
        </div>

        <h3 className="text-lg font-medium mb-2">Presets Salvos</h3>
        <ScrollArea className="h-[250px] border rounded-md p-2">
          {presets.length === 0 && <p className="text-muted-foreground text-center py-4">Nenhum preset salvo.</p>}
          {presets.map((preset) => (
            <div key={preset.id} className="flex items-center justify-between p-2 my-1 rounded-md hover:bg-muted/50">
              <div>
                <p className="font-medium">{preset.description}</p>
                <p className="text-sm text-muted-foreground">R$ {preset.unitPrice.toFixed(2)}</p>
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" onClick={() => setEditingPreset(preset)} aria-label="Editar preset">
                  <Edit3 className="h-4 w-4" />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon" aria-label="Excluir preset">
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                      <AlertDialogDescription>
                        Tem certeza que deseja excluir o preset "{preset.description}"? Esta ação não pode ser desfeita.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDeletePreset(preset.id)} className="bg-destructive hover:bg-destructive/90">
                        Excluir
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          ))}
        </ScrollArea>
        <DialogFooter className="mt-4">
          <DialogClose asChild>
            <Button type="button" variant="outline">Fechar</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PresetManagerDialog;
