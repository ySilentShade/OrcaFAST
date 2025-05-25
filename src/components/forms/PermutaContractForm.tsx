
"use client";

import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import type { PermutaEquipmentServiceContractData } from '@/types/contract';
import { Briefcase, User, FileText, Settings, Send } from 'lucide-react';

const permutanteSchema = z.object({
  name: z.string().min(1, "Nome do permutante é obrigatório"),
  cpfCnpj: z.string().min(1, "CPF/CNPJ do permutante é obrigatório"),
  address: z.string().min(1, "Endereço do permutante é obrigatório"),
  email: z.string().email("E-mail inválido").or(z.literal('')),
});

export const permutaContractFormSchema = z.object({
  contractType: z.literal('PERMUTA_EQUIPMENT_SERVICE'),
  contractTitle: z.string().min(1, "Título do contrato é obrigatório"),
  permutante: permutanteSchema,
  equipmentDescription: z.string().min(1, "Descrição do equipamento é obrigatória"),
  equipmentValue: z.string().refine(val => !isNaN(parseFloat(val)) && parseFloat(val) >= 0, { message: "Valor deve ser um número não negativo" }),
  serviceDescription: z.string().min(1, "Descrição dos serviços é obrigatória"),
  paymentClause: z.string().optional(),
  conditions: z.string().min(1, "Condições são obrigatórias"),
  transferClause: z.string().min(1, "Cláusula de transferência é obrigatória"),
  generalDispositions: z.string().optional(),
  foro: z.string().min(1, "Foro é obrigatório"),
  contractCity: z.string().min(1, "Cidade do contrato é obrigatória"),
  contractFullDate: z.string().min(1, "Data completa do contrato é obrigatória"),
});

interface PermutaContractFormProps {
  initialData: PermutaEquipmentServiceContractData;
  onSubmitForm: (data: PermutaEquipmentServiceContractData) => void;
  onPreviewUpdate: (data: PermutaEquipmentServiceContractData) => void;
}

const PermutaContractForm: React.FC<PermutaContractFormProps> = ({ initialData, onSubmitForm, onPreviewUpdate }) => {
  const { control, handleSubmit, watch, formState: { errors } } = useForm<PermutaEquipmentServiceContractData>({
    resolver: zodResolver(permutaContractFormSchema),
    defaultValues: initialData,
  });

  React.useEffect(() => {
    const subscription = watch((value) => {
      onPreviewUpdate(value as PermutaEquipmentServiceContractData);
    });
    return () => subscription.unsubscribe();
  }, [watch, onPreviewUpdate]);

  return (
    <Card className="shadow-xl bg-card text-card-foreground w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <FileText className="h-6 w-6 mr-2 text-primary" />
          {initialData.contractTitle || "Contrato de Permuta"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-6">
          
          <section>
            <h3 className="text-lg font-semibold mb-3 text-primary border-b pb-2">Detalhes do Contrato</h3>
             <div>
                <Label htmlFor="contractTitle">Título do Contrato</Label>
                <Controller name="contractTitle" control={control} render={({ field }) => <Input id="contractTitle" {...field} />} />
                {errors.contractTitle && <p className="text-sm text-destructive mt-1">{errors.contractTitle.message}</p>}
            </div>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-3 text-primary border-b pb-2">PERMUTANTE (Cede o equipamento)</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="permutante.name">Nome</Label>
                <Controller name="permutante.name" control={control} render={({ field }) => <Input id="permutante.name" {...field} />} />
                {errors.permutante?.name && <p className="text-sm text-destructive mt-1">{errors.permutante.name.message}</p>}
              </div>
              <div>
                <Label htmlFor="permutante.cpfCnpj">CPF/CNPJ</Label>
                <Controller name="permutante.cpfCnpj" control={control} render={({ field }) => <Input id="permutante.cpfCnpj" {...field} />} />
                {errors.permutante?.cpfCnpj && <p className="text-sm text-destructive mt-1">{errors.permutante.cpfCnpj.message}</p>}
              </div>
              <div>
                <Label htmlFor="permutante.address">Endereço Completo</Label>
                <Controller name="permutante.address" control={control} render={({ field }) => <Textarea id="permutante.address" {...field} />} />
                {errors.permutante?.address && <p className="text-sm text-destructive mt-1">{errors.permutante.address.message}</p>}
              </div>
              <div>
                <Label htmlFor="permutante.email">E-mail</Label>
                <Controller name="permutante.email" control={control} render={({ field }) => <Input id="permutante.email" type="email" {...field} />} />
                {errors.permutante?.email && <p className="text-sm text-destructive mt-1">{errors.permutante.email.message}</p>}
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-3 text-primary border-b pb-2">Objeto da Permuta</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="equipmentDescription">Descrição do Equipamento (cedido pelo Permutante)</Label>
                <Controller name="equipmentDescription" control={control} render={({ field }) => <Textarea id="equipmentDescription" {...field} />} />
                {errors.equipmentDescription && <p className="text-sm text-destructive mt-1">{errors.equipmentDescription.message}</p>}
              </div>
              <div>
                <Label htmlFor="equipmentValue">Valor Avaliado do Equipamento (R$)</Label>
                <Controller name="equipmentValue" control={control} render={({ field }) => <Input id="equipmentValue" type="number" step="0.01" {...field} />} />
                {errors.equipmentValue && <p className="text-sm text-destructive mt-1">{errors.equipmentValue.message}</p>}
              </div>
              <div>
                <Label htmlFor="serviceDescription">Descrição dos Serviços (prestados pelo Permutado/FastFilms)</Label>
                <Controller name="serviceDescription" control={control} render={({ field }) => <Textarea id="serviceDescription" {...field} />} />
                {errors.serviceDescription && <p className="text-sm text-destructive mt-1">{errors.serviceDescription.message}</p>}
              </div>
            </div>
          </section>
          
          <section>
            <h3 className="text-lg font-semibold mb-3 text-primary border-b pb-2">Cláusulas</h3>
             <div className="space-y-4">
                <div>
                    <Label htmlFor="paymentClause">CLÁUSULA 2 - DA FORMA DE PAGAMENTO (Opcional)</Label>
                    <Controller name="paymentClause" control={control} render={({ field }) => <Textarea id="paymentClause" {...field} placeholder="O pagamento do valor acordado será realizado por meio da prestação dos serviços..." />} />
                    {errors.paymentClause && <p className="text-sm text-destructive mt-1">{errors.paymentClause.message}</p>}
                </div>
                <div>
                    <Label htmlFor="conditions">CLÁUSULA 3 - DAS CONDIÇÕES</Label>
                    <Controller name="conditions" control={control} render={({ field }) => <Textarea id="conditions" {...field} placeholder="Não há prazo limite estipulado..." />} />
                    {errors.conditions && <p className="text-sm text-destructive mt-1">{errors.conditions.message}</p>}
                </div>
                 <div>
                    <Label htmlFor="transferClause">CLÁUSULA 4 - DA TRANSFERÊNCIA DE PROPRIEDADE</Label>
                    <Controller name="transferClause" control={control} render={({ field }) => <Textarea id="transferClause" {...field} placeholder="A propriedade do equipamento será transferida..." />} />
                    {errors.transferClause && <p className="text-sm text-destructive mt-1">{errors.transferClause.message}</p>}
                </div>
                <div>
                    <Label htmlFor="generalDispositions">CLÁUSULA 5 - DAS DISPOSIÇÕES GERAIS (Opcional)</Label>
                    <Controller name="generalDispositions" control={control} render={({ field }) => <Textarea id="generalDispositions" {...field} placeholder="Este contrato é celebrado em caráter irrevogável..." />} />
                    {errors.generalDispositions && <p className="text-sm text-destructive mt-1">{errors.generalDispositions.message}</p>}
                </div>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-3 text-primary border-b pb-2">Finalização</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="foro">CLÁUSULA 6 - DO FORO</Label>
                <Controller name="foro" control={control} render={({ field }) => <Input id="foro" {...field} placeholder="Comarca de..." />} />
                {errors.foro && <p className="text-sm text-destructive mt-1">{errors.foro.message}</p>}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <Label htmlFor="contractCity">Cidade para Assinatura</Label>
                <Controller name="contractCity" control={control} render={({ field }) => <Input id="contractCity" {...field} placeholder="Ex: Lagoa Santa/MG"/>} />
                {errors.contractCity && <p className="text-sm text-destructive mt-1">{errors.contractCity.message}</p>}
              </div>
              <div>
                <Label htmlFor="contractFullDate">Data Completa da Assinatura</Label>
                <Controller name="contractFullDate" control={control} render={({ field }) => <Input id="contractFullDate" {...field} placeholder="Ex: 15 de maio de 2025"/>} />
                {errors.contractFullDate && <p className="text-sm text-destructive mt-1">{errors.contractFullDate.message}</p>}
              </div>
            </div>
          </section>

          <CardFooter className="flex justify-end p-0 pt-6">
            <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <Send className="mr-2 h-4 w-4" /> Salvar Contrato (para PDF)
            </Button>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  );
};

export default PermutaContractForm;
