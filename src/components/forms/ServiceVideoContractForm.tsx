
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import type { ServiceVideoContractData } from '@/types/contract';
import { FileText, Send, User, CaseSensitive, DollarSign, CalendarDays, Percent, Settings, MapPinIcon, Mail, Briefcase } from 'lucide-react';

const contratanteSchema = z.object({
  name: z.string().min(1, "Nome do contratante é obrigatório"),
  cpfCnpj: z.string().min(1, "CPF/CNPJ do contratante é obrigatório"),
  address: z.string().min(1, "Endereço do contratante é obrigatório"),
  email: z.string().email("E-mail inválido").or(z.literal('')),
});

export const serviceVideoContractFormSchema = z.object({
  contractType: z.literal('SERVICE_VIDEO'),
  contractTitle: z.string().min(1, "Título do contrato é obrigatório"),
  contratante: contratanteSchema,
  objectDescription: z.string().min(1, "Descrição do objeto é obrigatória"),
  totalValue: z.string().refine(val => !isNaN(parseFloat(val)) && parseFloat(val) >= 0, { message: "Valor total deve ser um número não negativo" }),
  paymentType: z.enum(['vista', 'sinal_entrega', 'outro']),
  sinalValuePercentage: z.string().optional().refine(val => val === undefined || val === '' || (!isNaN(parseFloat(val)) && parseFloat(val) >= 0 && parseFloat(val) <= 100), { message: "Porcentagem deve ser entre 0 e 100" }),
  paymentOutroDescription: z.string().optional(),
  deliveryDeadline: z.string().min(1, "Prazo de entrega é obrigatório"),
  responsibilitiesContratada: z.string().min(1, "Responsabilidades da CONTRATADA são obrigatórias"),
  responsibilitiesContratante: z.string().min(1, "Responsabilidades do CONTRATANTE são obrigatórias"),
  copyrightClause: z.string().min(1, "Cláusula de direitos autorais é obrigatória"),
  rescissionNoticePeriodDays: z.string().refine(val => !isNaN(parseInt(val)) && parseInt(val) >= 0, { message: "Deve ser um número não negativo" }),
  rescissionPenaltyPercentage: z.string().refine(val => !isNaN(parseFloat(val)) && parseFloat(val) >= 0 && parseFloat(val) <= 100, { message: "Deve ser um número entre 0 e 100" }),
  generalDispositions: z.string().optional(),
  foro: z.string().min(1, "Foro é obrigatório"),
  contractCity: z.string().min(1, "Cidade do contrato é obrigatória"),
  contractFullDate: z.string().min(1, "Data completa do contrato é obrigatória"),
}).refine(data => {
    if (data.paymentType === 'sinal_entrega' && (data.sinalValuePercentage === undefined || data.sinalValuePercentage.trim() === '')) {
      return false; // Sinal percentage is required for 'sinal_entrega'
    }
    return true;
  }, {
    message: "Porcentagem do sinal é obrigatória para pagamento 'Sinal + Entrega'",
    path: ["sinalValuePercentage"], 
  })
  .refine(data => {
    if (data.paymentType === 'outro' && (data.paymentOutroDescription === undefined || data.paymentOutroDescription.trim() === '')) {
      return false; // Outro description is required for 'outro'
    }
    return true;
  }, {
    message: "Descrição é obrigatória para pagamento 'Outro'",
    path: ["paymentOutroDescription"],
  });


interface ServiceVideoContractFormProps {
  initialData: ServiceVideoContractData;
  onSubmitForm: (data: ServiceVideoContractData) => void;
  onPreviewUpdate: (data: ServiceVideoContractData) => void;
}

const ServiceVideoContractForm: React.FC<ServiceVideoContractFormProps> = ({ initialData, onSubmitForm, onPreviewUpdate }) => {
  const { control, handleSubmit, watch, formState: { errors } } = useForm<ServiceVideoContractData>({
    resolver: zodResolver(serviceVideoContractFormSchema),
    defaultValues: initialData,
  });

  const watchedPaymentType = watch("paymentType");

  React.useEffect(() => {
    const subscription = watch((value) => {
      onPreviewUpdate(value as ServiceVideoContractData);
    });
    return () => subscription.unsubscribe();
  }, [watch, onPreviewUpdate]);

  return (
    <Card className="shadow-xl bg-card text-card-foreground w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <FileText className="h-6 w-6 mr-2 text-primary" />
          {initialData.contractTitle || "Contrato de Prestação de Serviços"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-6">
          
          <section>
            <h3 className="text-lg font-semibold mb-3 text-primary border-b pb-2">Detalhes do Contrato</h3>
             <div>
                <Label htmlFor="contractTitle" className="flex items-center"><CaseSensitive className="mr-2 h-4 w-4"/>Título do Contrato</Label>
                <Controller name="contractTitle" control={control} render={({ field }) => <Input id="contractTitle" {...field} />} />
                {errors.contractTitle && <p className="text-sm text-destructive mt-1">{errors.contractTitle.message}</p>}
            </div>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-3 text-primary border-b pb-2">CONTRATANTE</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="contratante.name" className="flex items-center"><User className="mr-2 h-4 w-4"/>Nome</Label>
                <Controller name="contratante.name" control={control} render={({ field }) => <Input id="contratante.name" {...field} />} />
                {errors.contratante?.name && <p className="text-sm text-destructive mt-1">{errors.contratante.name.message}</p>}
              </div>
              <div>
                <Label htmlFor="contratante.cpfCnpj" className="flex items-center"><Briefcase className="mr-2 h-4 w-4"/>CPF/CNPJ</Label>
                <Controller name="contratante.cpfCnpj" control={control} render={({ field }) => <Input id="contratante.cpfCnpj" {...field} />} />
                {errors.contratante?.cpfCnpj && <p className="text-sm text-destructive mt-1">{errors.contratante.cpfCnpj.message}</p>}
              </div>
              <div>
                <Label htmlFor="contratante.address" className="flex items-center"><MapPinIcon className="mr-2 h-4 w-4"/>Endereço Completo</Label>
                <Controller name="contratante.address" control={control} render={({ field }) => <Textarea id="contratante.address" {...field} />} />
                {errors.contratante?.address && <p className="text-sm text-destructive mt-1">{errors.contratante.address.message}</p>}
              </div>
              <div>
                <Label htmlFor="contratante.email" className="flex items-center"><Mail className="mr-2 h-4 w-4"/>E-mail</Label>
                <Controller name="contratante.email" control={control} render={({ field }) => <Input id="contratante.email" type="email" {...field} />} />
                {errors.contratante?.email && <p className="text-sm text-destructive mt-1">{errors.contratante.email.message}</p>}
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-3 text-primary border-b pb-2">Objeto e Pagamento</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="objectDescription" className="flex items-center"><Settings className="mr-2 h-4 w-4"/>Objeto do Contrato</Label>
                <Controller name="objectDescription" control={control} render={({ field }) => <Textarea id="objectDescription" {...field} />} />
                {errors.objectDescription && <p className="text-sm text-destructive mt-1">{errors.objectDescription.message}</p>}
              </div>
              <div>
                <Label htmlFor="totalValue" className="flex items-center"><DollarSign className="mr-2 h-4 w-4"/>Valor Total (R$)</Label>
                <Controller name="totalValue" control={control} render={({ field }) => <Input id="totalValue" type="number" step="0.01" {...field} />} />
                {errors.totalValue && <p className="text-sm text-destructive mt-1">{errors.totalValue.message}</p>}
              </div>
              <div>
                <Label className="flex items-center mb-2"><DollarSign className="mr-2 h-4 w-4"/>Forma de Pagamento</Label>
                <Controller
                  name="paymentType"
                  control={control}
                  render={({ field }) => (
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="vista" id="vista" />
                        <Label htmlFor="vista">À vista na assinatura</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="sinal_entrega" id="sinal_entrega" />
                        <Label htmlFor="sinal_entrega">Sinal + Restante na entrega</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="outro" id="outro" />
                        <Label htmlFor="outro">Outro</Label>
                      </div>
                    </RadioGroup>
                  )}
                />
                 {errors.paymentType && <p className="text-sm text-destructive mt-1">{errors.paymentType.message}</p>}
              </div>
              {watchedPaymentType === 'sinal_entrega' && (
                <div>
                  <Label htmlFor="sinalValuePercentage" className="flex items-center"><Percent className="mr-2 h-4 w-4"/>Porcentagem do Sinal (%)</Label>
                  <Controller name="sinalValuePercentage" control={control} render={({ field }) => <Input id="sinalValuePercentage" type="number" step="1" placeholder="Ex: 50" {...field} />} />
                  {errors.sinalValuePercentage && <p className="text-sm text-destructive mt-1">{errors.sinalValuePercentage.message}</p>}
                </div>
              )}
              {watchedPaymentType === 'outro' && (
                <div>
                  <Label htmlFor="paymentOutroDescription" className="flex items-center"><CaseSensitive className="mr-2 h-4 w-4"/>Descrição (Outro Pagamento)</Label>
                  <Controller name="paymentOutroDescription" control={control} render={({ field }) => <Textarea id="paymentOutroDescription" placeholder="Detalhe a forma de pagamento..." {...field} />} />
                  {errors.paymentOutroDescription && <p className="text-sm text-destructive mt-1">{errors.paymentOutroDescription.message}</p>}
                </div>
              )}
            </div>
          </section>
          
          <section>
            <h3 className="text-lg font-semibold mb-3 text-primary border-b pb-2">Prazos e Responsabilidades</h3>
             <div className="space-y-4">
                <div>
                    <Label htmlFor="deliveryDeadline" className="flex items-center"><CalendarDays className="mr-2 h-4 w-4"/>Prazo de Entrega</Label>
                    <Controller name="deliveryDeadline" control={control} render={({ field }) => <Input id="deliveryDeadline" {...field} />} />
                    {errors.deliveryDeadline && <p className="text-sm text-destructive mt-1">{errors.deliveryDeadline.message}</p>}
                </div>
                <div>
                    <Label htmlFor="responsibilitiesContratada" className="flex items-center"><Settings className="mr-2 h-4 w-4"/>Responsabilidades da CONTRATADA</Label>
                    <Controller name="responsibilitiesContratada" control={control} render={({ field }) => <Textarea id="responsibilitiesContratada" rows={4} {...field} />} />
                    {errors.responsibilitiesContratada && <p className="text-sm text-destructive mt-1">{errors.responsibilitiesContratada.message}</p>}
                </div>
                 <div>
                    <Label htmlFor="responsibilitiesContratante" className="flex items-center"><Settings className="mr-2 h-4 w-4"/>Responsabilidades do CONTRATANTE</Label>
                    <Controller name="responsibilitiesContratante" control={control} render={({ field }) => <Textarea id="responsibilitiesContratante" rows={4} {...field} />} />
                    {errors.responsibilitiesContratante && <p className="text-sm text-destructive mt-1">{errors.responsibilitiesContratante.message}</p>}
                </div>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-3 text-primary border-b pb-2">Cláusulas Adicionais</h3>
            <div className="space-y-4">
              <div>
                  <Label htmlFor="copyrightClause" className="flex items-center"><CaseSensitive className="mr-2 h-4 w-4"/>Direitos Autorais</Label>
                  <Controller name="copyrightClause" control={control} render={({ field }) => <Textarea id="copyrightClause" {...field} />} />
                  {errors.copyrightClause && <p className="text-sm text-destructive mt-1">{errors.copyrightClause.message}</p>}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="rescissionNoticePeriodDays" className="flex items-center"><CalendarDays className="mr-2 h-4 w-4"/>Rescisão: Aviso Prévio (dias)</Label>
                  <Controller name="rescissionNoticePeriodDays" control={control} render={({ field }) => <Input id="rescissionNoticePeriodDays" type="number" {...field} />} />
                  {errors.rescissionNoticePeriodDays && <p className="text-sm text-destructive mt-1">{errors.rescissionNoticePeriodDays.message}</p>}
                </div>
                <div>
                  <Label htmlFor="rescissionPenaltyPercentage" className="flex items-center"><Percent className="mr-2 h-4 w-4"/>Rescisão: Multa (%)</Label>
                  <Controller name="rescissionPenaltyPercentage" control={control} render={({ field }) => <Input id="rescissionPenaltyPercentage" type="number" {...field} />} />
                  {errors.rescissionPenaltyPercentage && <p className="text-sm text-destructive mt-1">{errors.rescissionPenaltyPercentage.message}</p>}
                </div>
              </div>
              <div>
                  <Label htmlFor="generalDispositions" className="flex items-center"><Settings className="mr-2 h-4 w-4"/>Disposições Gerais (Opcional)</Label>
                  <Controller name="generalDispositions" control={control} render={({ field }) => <Textarea id="generalDispositions" {...field} />} />
                  {errors.generalDispositions && <p className="text-sm text-destructive mt-1">{errors.generalDispositions.message}</p>}
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-3 text-primary border-b pb-2">Finalização</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-1">
                <Label htmlFor="foro" className="flex items-center"><MapPinIcon className="mr-2 h-4 w-4"/>Foro</Label>
                <Controller name="foro" control={control} render={({ field }) => <Input id="foro" {...field} placeholder="Comarca de..." />} />
                {errors.foro && <p className="text-sm text-destructive mt-1">{errors.foro.message}</p>}
              </div>
              <div className="md:col-span-1">
                <Label htmlFor="contractCity" className="flex items-center"><MapPinIcon className="mr-2 h-4 w-4"/>Cidade para Assinatura</Label>
                <Controller name="contractCity" control={control} render={({ field }) => <Input id="contractCity" {...field} placeholder="Ex: Lagoa Santa/MG"/>} />
                {errors.contractCity && <p className="text-sm text-destructive mt-1">{errors.contractCity.message}</p>}
              </div>
              <div className="md:col-span-1">
                <Label htmlFor="contractFullDate" className="flex items-center"><CalendarDays className="mr-2 h-4 w-4"/>Data Completa da Assinatura</Label>
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

export default ServiceVideoContractForm;
