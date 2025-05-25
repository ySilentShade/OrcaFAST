"use client";

import type { Control, UseFieldArrayRemove, FieldErrors } from 'react-hook-form';
import { Controller } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash2 } from 'lucide-react';
import type { BudgetFormState, PresetItem } from '@/types/budget';

interface BudgetItemRowProps {
  index: number;
  control: Control<BudgetFormState>;
  remove: UseFieldArrayRemove;
  itemCount: number;
  presets: PresetItem[];
  onApplyPreset: (itemIndex: number, presetId: string) => void;
  errors: FieldErrors<BudgetFormState>;
}

const BudgetItemRow: React.FC<BudgetItemRowProps> = ({ index, control, remove, itemCount, presets, onApplyPreset, errors }) => {
  const itemErrors = errors.items?.[index];

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-2 p-3 border border-border rounded-md mb-3 bg-card/50">
      <div className="md:col-span-4">
        <Controller
          name={`items.${index}.description`}
          control={control}
          render={({ field }) => <Input placeholder="Descrição do Item/Serviço" {...field} />}
        />
        {itemErrors?.description && <p className="text-sm text-destructive mt-1">{itemErrors.description.message}</p>}
      </div>
      <div className="md:col-span-3">
        <Controller
          name={`items.${index}.id`} // Not directly used for value, but Select needs a field for form state
          control={control}
          render={({ field }) => ( // field is for the item's own id, not preset id
            <Select onValueChange={(value) => onApplyPreset(index, value)} value="">
              <SelectTrigger>
                <SelectValue placeholder="Aplicar Preset" />
              </SelectTrigger>
              <SelectContent>
                {presets.map((preset) => (
                  <SelectItem key={preset.id} value={preset.id}>
                    {preset.description} - R$ {preset.unitPrice.toFixed(2)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </div>
      <div className="md:col-span-2">
        <Controller
          name={`items.${index}.quantity`}
          control={control}
          render={({ field }) => <Input type="number" placeholder="Qtde." {...field} min="0" />}
        />
        {itemErrors?.quantity && <p className="text-sm text-destructive mt-1">{itemErrors.quantity.message}</p>}
      </div>
      <div className="md:col-span-2">
        <Controller
          name={`items.${index}.unitPrice`}
          control={control}
          render={({ field }) => <Input type="number" placeholder="Preço Unit. (R$)" {...field} step="0.01" min="0" />}
        />
        {itemErrors?.unitPrice && <p className="text-sm text-destructive mt-1">{itemErrors.unitPrice.message}</p>}
      </div>
      <div className="md:col-span-1 flex items-center justify-end md:justify-center">
        {itemCount > 1 && (
          <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)} aria-label="Remover item">
            <Trash2 className="h-5 w-5 text-destructive" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default BudgetItemRow;
