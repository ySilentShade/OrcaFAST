"use client";

import React, { useState } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Briefcase, Settings, User, MapPin, PlusCircle, Sparkles, Send } from 'lucide-react';
import BudgetItemRow from './BudgetItemRow';
import PresetManagerDialog from './PresetManagerDialog';
import type { BudgetFormState, BudgetItemForm, PresetItem, BudgetDemoData } from '@/types/budget';
import useLocalStorage from '@/hooks/useLocalStorage';
import { useToast } from "@/hooks/use-toast";

const defaultTerms = "Condições Comerciais: Forma de Pagamento: Transferência bancária, boleto ou PIX.\n\nCondições de Pagamento: 50% do valor será pago antes do início do serviço e o restante, após sua conclusão.";

const budgetItemSchema = z.object({
  id: z.string(),
  description: z.string().min(1, "Descrição é obrigatória"),
  quantity: z.string().refine(val => !isNaN(parseFloat(val)) && parseFloat(val) > 0, { message: "Quantidade deve ser um número positivo" }),
  unitPrice: z.string().refine(val => !isNaN(parseFloat(val)) && parseFloat(val) >= 0, { message: "Preço deve ser um número não negativo" }),
});

const budgetFormSchema = z.object({
  clientName: z.string().min(1, "Nome do cliente é obrigatório"),
  clientAddress: z.string().min(1, "Endereço é obrigatório"),
  items: z.array(budgetItemSchema).min(1, "Adicione pelo menos um item ao orçamento"),
  terms: z.string().min(1, "Termos e condições são obrigatórios"),
});

interface BudgetFormProps {
  onSubmitForm: (data: BudgetFormState) => void;
  onFillWithDemoData: () => Promise<BudgetDemoData | null>;
}

const BudgetForm: React.FC<BudgetFormProps> = ({ onSubmitForm, onFillWithDemoData }) => {
  const { toast } = useToast();
  const [isPresetManagerOpen, setIsPresetManagerOpen] = useState(false);
  const [presets] = useLocalStorage<PresetItem[]>('fastfilms-presets', []);

  const { control, handleSubmit, reset, setValue, getValues, formState: { errors } } = useForm<BudgetFormState>({
    resolver: zodResolver(budgetFormSchema),
    defaultValues: {
      clientName: '',
      clientAddress: '',
      items: [{ id: crypto.randomUUID(), description: '', quantity: '1', unitPrice: '0' }],
      terms: defaultTerms,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  });

  const handleFormSubmit = (data: BudgetFormState) => {
    onSubmitForm(data);
    toast({ title: "Orçamento Gerado!", description: "A pré-visualização foi atualizada.", variant: "default" });
  };

  const handleAddItem = () => {
    append({ id: crypto.randomUUID(), description: '', quantity: '1', unitPrice: '0' });
  };

  const handleApplyPreset = (itemIndex: number, presetId: string) => {
    const preset = presets.find(p => p.id === presetId);
    if (preset) {
      setValue(`items.${itemIndex}.description`, preset.description);
      setValue(`items.${itemIndex}.unitPrice`, preset.unitPrice.toString());
    }
  };

  const handleDemoFill = async () => {
    try {
      const demoData = await onFillWithDemoData();
      if (demoData) {
        reset({
          clientName: demoData.clientName,
          clientAddress: demoData.clientAddress,
          items: [{ 
            id: crypto.randomUUID(), 
            description: demoData.item.description, 
            quantity: demoData.item.quantity.toString(), 
            unitPrice: demoData.item.unitPrice.toString() 
          }],
          terms: defaultTerms,
        });
        toast({ title: "Dados de Teste Carregados!", description: "O formulário foi preenchido com dados de exemplo.", variant: "default" });
      } else {
        toast({ title: "Erro ao Carregar Dados", description: "Não foi possível preencher com dados de teste.", variant: "destructive" });
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
          <Button variant="outline" onClick={() => setIsPresetManagerOpen(true)}>
            <Settings className="mr-2 h-4 w-4" />
            Gerenciar Presets
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
            <section>
              <h3 className="text-lg font-semibold mb-2 text-primary">Dados do Cliente</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="clientName" className="flex items-center">
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
                  <Label htmlFor="clientAddress" className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-muted-foreground" /> Endereço
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
               {errors.items && typeof errors.items === 'object' && !Array.isArray(errors.items) && (
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
