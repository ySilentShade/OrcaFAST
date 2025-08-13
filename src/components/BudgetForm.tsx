
"use client";

import React, { useState, useEffect } from 'react';
import type { UseFormGetValues, UseFormSetValue} from 'react-hook-form';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Briefcase, Settings, User, MapPin, PlusCircle, Sparkles, Send, DollarSign, Percent } from 'lucide-react';
import BudgetItemRow from './BudgetItemRow';
import PresetManagerDialog from './PresetManagerDialog';
import type { BudgetFormState, BudgetItemForm, PresetItem, BudgetDemoData, DiscountType } from '@/types/budget';
import useLocalStorage from '@/hooks/useLocalStorage';
import { useToast } from "@/hooks/use-toast";
import initialPresetsData from '@/data/presets.json';

const defaultTerms = "Condições Comerciais: Forma de Pagamento: Transferência bancária, boleto ou PIX.\n\nCondições de Pagamento: 50% do valor será pago antes do início do serviço e o restante, após sua conclusão.";

const budgetItemSchema = z.object({
  id: z.string(),
  description: z.string().min(1, "Descrição é obrigatória"),
  quantity: z.string().refine(val => !isNaN(parseFloat(val)) && parseFloat(val) > 0, { message: "Quantidade deve ser um número positivo" }),
  unitPrice: z.string().refine(val => !isNaN(parseFloat(val)) && parseFloat(val) >= 0, { message: "Preço deve ser um número não negativo" }),
  totalOverride: z.string().optional().refine(val => val === undefined || val.trim() === '' || (!isNaN(parseFloat(val)) && parseFloat(val) >= 0), {
    message: "Total Item (Opcional) deve ser um número não negativo se preenchido",
  }),
});

const budgetFormSchema = z.object({
  clientName: z.string().min(1, "Nome do cliente é obrigatório"),
  clientAddress: z.string().optional(),
  items: z.array(budgetItemSchema).min(1, "Adicione pelo menos um item ao orçamento"),
  terms: z.string().min(1, "Termos e condições são obrigatórios"),
  discountType: z.enum(['PERCENTAGE', 'AMOUNT']),
  discountValue: z.string().optional().refine(val => {
    if (val === undefined || val.trim() === '') return true;
    const num = parseFloat(val);
    return !isNaN(num) && num >= 0;
  }, {
    message: "O desconto deve ser um número positivo."
  })
}).refine(data => {
    if (data.discountType === 'PERCENTAGE' && data.discountValue) {
      const num = parseFloat(data.discountValue);
      return num <= 100;
    }
    return true;
}, {
    message: "O desconto percentual não pode ser maior que 100%.",
    path: ["discountValue"],
});


interface BudgetFormProps {
  onSubmitForm: (data: BudgetFormState) => void;
  onFillWithDemoData: () => Promise<BudgetDemoData | null>;
  onPreviewUpdate: (data: Partial<BudgetFormState>) => void;
  isDroneFeatureEnabled: boolean;
  onToggleDroneFeature: (
    getFormValues: UseFormGetValues<BudgetFormState>,
    setFormValue: UseFormSetValue<BudgetFormState>
  ) => void;
}

// Simple Drone SVG Icon
const DroneIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
    <circle cx="12" cy="12" r="3.5"/>
    <path d="M12 2V8.5"/> <path d="M12 15.5V22"/>
    <path d="M2 12H8.5"/> <path d="M15.5 12H22"/>
    <path d="M16.95 7.05L14.12 9.88"/> <path d="M9.88 14.12L7.05 16.95"/>
    <path d="M16.95 16.95L14.12 14.12"/> <path d="M9.88 9.88L7.05 7.05"/>
  </svg>
);


const BudgetForm: React.FC<BudgetFormProps> = ({ 
  onSubmitForm, 
  onFillWithDemoData, 
  onPreviewUpdate,
  isDroneFeatureEnabled,
  onToggleDroneFeature
 }) => {
  const { toast } = useToast();
  const [isPresetManagerOpen, setIsPresetManagerOpen] = useState(false);
  const [presets] = useLocalStorage<PresetItem[]>('fastfilms-presets', initialPresetsData);

  const { control, handleSubmit, reset, setValue, getValues, watch, formState: { errors } } = useForm<BudgetFormState>({
    resolver: zodResolver(budgetFormSchema),
    defaultValues: {
      clientName: '',
      clientAddress: '',
      items: [{ id: crypto.randomUUID(), description: '', quantity: '1', unitPrice: '0', totalOverride: '' }],
      terms: defaultTerms,
      discountType: 'AMOUNT',
      discountValue: '',
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  });

  const watchedDiscountType = watch('discountType');

  useEffect(() => {
    // Initial preview on mount
    onPreviewUpdate(getValues());

    const subscription = watch((value, { name, type }) => {
      // value here is the entire form value
      onPreviewUpdate(value as Partial<BudgetFormState>);
    });
    return () => subscription.unsubscribe();
  }, [watch, onPreviewUpdate, getValues]);


  const handleFormSubmitInternal = (data: BudgetFormState) => {
    onSubmitForm(data);
  };

  const handleAddItem = () => {
    append({ id: crypto.randomUUID(), description: '', quantity: '1', unitPrice: '0', totalOverride: '' });
  };
  
  const handleToggleDiscountType = () => {
    const currentType = getValues('discountType');
    setValue('discountType', currentType === 'AMOUNT' ? 'PERCENTAGE' : 'AMOUNT');
    setValue('discountValue', ''); // Clear value on toggle to avoid confusion
  }

  const handleApplyPreset = (itemIndex: number, presetId: string) => {
    const preset = presets.find(p => p.id === presetId);
    if (preset) {
      setValue(`items.${itemIndex}.description`, preset.description, { shouldValidate: true, shouldDirty: true, shouldTouch: true });
      setValue(`items.${itemIndex}.unitPrice`, preset.unitPrice.toString(), { shouldValidate: true, shouldDirty: true, shouldTouch: true });
      setValue(`items.${itemIndex}.quantity`, '1', { shouldValidate: true, shouldDirty: true, shouldTouch: true });
      setValue(`items.${itemIndex}.totalOverride`, '', { shouldValidate: true, shouldDirty: true, shouldTouch: true }); // Clear override when preset is applied
      
      toast({
        title: "Preset Aplicado!",
        description: `"${preset.description}" foi aplicado ao item ${itemIndex + 1}.`,
        variant: "default",
      });
    } else {
      toast({
        title: "Erro ao Aplicar Preset",
        description: "O preset selecionado não foi encontrado.",
        variant: "destructive",
      });
    }
  };

  const handleDemoFill = async () => {
    try {
      const demoData = await onFillWithDemoData();
      if (demoData && demoData.item) {
        const newFormState: BudgetFormState = { 
          clientName: demoData.clientName,
          clientAddress: demoData.clientAddress,
          items: [{ 
            id: crypto.randomUUID(), 
            description: demoData.item.description, 
            quantity: demoData.item.quantity.toString(), 
            unitPrice: demoData.item.unitPrice.toString(),
            totalOverride: '' 
          }],
          terms: defaultTerms,
          discountType: 'AMOUNT',
          discountValue: '',
        };
        reset(newFormState);
        toast({ title: "Dados de Teste Carregados!", description: "O formulário foi preenchido com dados de exemplo.", variant: "default" });
      } else {
        toast({ title: "Erro ao Carregar Dados", description: "Não foi possível preencher com dados de teste ou dados de item ausentes.", variant: "destructive" });
      }
    } catch (error) {
      console.error("Error filling with demo data:", error);
      toast({ title: "Erro ao Carregar Dados", description: "Ocorreu um erro inesperado.", variant: "destructive" });
    }
  };

  return (
    <>
      <Card className="shadow-xl bg-card text-card-foreground">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center">
            <Briefcase className="h-6 w-6 mr-2 text-primary" />
            <CardTitle>Criar Novo Orçamento</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => onToggleDroneFeature(getValues, setValue)}
              className={isDroneFeatureEnabled ? 'bg-green-600 text-white hover:bg-green-700' : 'hover:bg-accent/10'}
              title={isDroneFeatureEnabled ? "Desativar Filmagem com Drone" : "Ativar Filmagem com Drone"}
            >
              <DroneIcon />
            </Button>
            <Button variant="outline" onClick={() => setIsPresetManagerOpen(true)}>
              <Settings className="mr-2 h-4 w-4" />
              Gerenciar Presets
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(handleFormSubmitInternal)} className="space-y-6">
            <section>
              <h3 className="text-lg font-semibold mb-2 text-primary">Dados do Cliente</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="clientName" className="flex items-center mb-1">
                    <User className="h-4 w-4 mr-2 text-muted-foreground" /> Nome do Cliente
                  </Label>
                  <Controller
                    name="clientName"
                    control={control}
                    render={({ field }) => <Input id="clientName" {...field} placeholder="Ex: João Silva" />}
                  />
                  {errors.clientName && <p className="text-sm text-destructive mt-1">{errors.clientName.message}</p>}
                </div>
                <div>
                  <Label htmlFor="clientAddress" className="flex items-center mb-1">
                    <MapPin className="h-4 w-4 mr-2 text-muted-foreground" /> Endereço (Opcional)
                  </Label>
                  <Controller
                    name="clientAddress"
                    control={control}
                    render={({ field }) => <Textarea id="clientAddress" {...field} placeholder="Ex: Rua das Palmeiras, 123, Bairro, Cidade - UF" />}
                  />
                  {errors.clientAddress && <p className="text-sm text-destructive mt-1">{errors.clientAddress.message}</p>}
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-2 text-primary">Itens do Orçamento</h3>
              {fields.map((item, index) => (
                <BudgetItemRow
                  key={item.id}
                  index={index}
                  control={control}
                  remove={remove}
                  itemCount={fields.length}
                  presets={presets}
                  onApplyPreset={handleApplyPreset}
                  errors={errors}
                />
              ))}
               {errors.items && typeof errors.items === 'object' && !Array.isArray(errors.items) && ( // For root array errors like min(1)
                <p className="text-sm text-destructive mt-1">{errors.items.message}</p>
              )}
              <Button type="button" variant="outline" onClick={handleAddItem} className="mt-2">
                <PlusCircle className="mr-2 h-4 w-4" /> Adicionar Item
              </Button>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-2 text-primary">Termos e Condições</h3>
              <Controller
                name="terms"
                control={control}
                render={({ field }) => <Textarea {...field} rows={5} />}
              />
              {errors.terms && <p className="text-sm text-destructive mt-1">{errors.terms.message}</p>}
            </section>

            <section>
                <h3 className="text-lg font-semibold mb-2 text-primary">Desconto Geral (Opcional)</h3>
                <div>
                  <Label htmlFor="discountValue" className="flex items-center mb-1">
                     Valor do Desconto
                  </Label>
                  <div className="flex gap-2">
                    <Controller
                        name="discountValue"
                        control={control}
                        render={({ field }) => (
                            <Input 
                                type="number" 
                                id="discountValue" 
                                {...field} 
                                placeholder={watchedDiscountType === 'PERCENTAGE' ? "Ex: 10 para 10%" : "Ex: 150 para R$150,00"} 
                                step="0.01" 
                                min="0"
                            />
                        )}
                    />
                    <Button type="button" variant="outline" onClick={handleToggleDiscountType} className="w-20">
                        {watchedDiscountType === 'PERCENTAGE' ? <Percent className="h-4 w-4" /> : <DollarSign className="h-4 w-4" />}
                    </Button>
                  </div>
                   <p className="text-xs text-muted-foreground mt-1">
                    Aplique um desconto sobre o valor total do orçamento. Alterne entre % e R$.
                  </p>
                  {errors.discountValue && <p className="text-sm text-destructive mt-1">{errors.discountValue.message}</p>}
                </div>
            </section>
            
            <CardFooter className="flex flex-col sm:flex-row justify-between gap-2 p-0 pt-6">
              <Button type="button" variant="secondary" onClick={handleDemoFill} className="w-full sm:w-auto">
                <Sparkles className="mr-2 h-4 w-4" /> Preencher Teste
              </Button>
              <Button type="submit" className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground">
                <Send className="mr-2 h-4 w-4" /> Gerar Orçamento
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
      <PresetManagerDialog isOpen={isPresetManagerOpen} onOpenChange={setIsPresetManagerOpen} />
    </>
  );
};

export default BudgetForm;
