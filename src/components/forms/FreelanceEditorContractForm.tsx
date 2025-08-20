
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from '@/components/ui/switch';
import type { FreelanceEditorContractData, RemunerationType } from '@/types/contract';
import { FileText, Send, User, Briefcase, MapPin, Mail, DollarSign, CalendarDays, Shield, ShieldOff, Percent, FileWarning } from 'lucide-react';

const contratadoSchema = z.object({
  name: z.string().min(1, "Nome do editor é obrigatório"),
  cpfCnpj: z.string().min(1, "CPF/CNPJ do editor é obrigatório"),
  address: z.string().min(1, "Endereço do editor é obrigatório"),
  email: z.string().email("E-mail inválido").or(z.literal('')),
});

export const freelanceEditorContractFormSchema = z.object({
  contractType: z.literal('FREELANCE_HIRE_EDITOR'),
  contractTitle: z.string().min(1, "Título do contrato é obrigatório"),
  contratado: contratadoSchema,
  remunerationType: z.enum(['MENSAL', 'PROJETO', 'SEMANAL', 'PERCENTUAL']),
  remunerationValue: z.string().refine(val => !isNaN(parseFloat(val)) && parseFloat(val) >= 0, { message: "Valor deve ser um número não negativo" }),
  paymentDetails: z.string().min(1, "Detalhes complementares de pagamento são obrigatórios"),
  lateDeliveryPenalty: z.string().refine(val => !isNaN(parseFloat(val)) && parseFloat(val) >= 0 && parseFloat(val) <= 100, { message: "Deve ser uma porcentagem entre 0 e 100" }),
  softwareResponsibility: z.string().min(1, "Cláusula de software é obrigatória"),
  confidentialityPenalty: z.string().refine(val => !isNaN(parseFloat(val)) && parseFloat(val) >= 0, { message: "Valor da multa deve ser um número não negativo" }),
  remoteWorkPolicy: z.string().min(1, "Política de trabalho remoto/híbrido é obrigatória"),
  rescissionNoticeDays: z.string().refine(val => !isNaN(parseInt(val)) && parseInt(val) >= 0, { message: "Deve ser um número não negativo" }),
  unjustifiedRescissionPenalty: z.string().refine(val => !isNaN(parseFloat(val)) && parseFloat(val) >= 0 && parseFloat(val) <= 100, { message: "Deve ser uma porcentagem entre 0 e 100" }),
  foro: z.string().min(1, "Foro é obrigatório"),
  availabilityAndCommunication: z.string().min(1, "Cláusula de disponibilidade é obrigatória"),
  serviceQuality: z.string().min(1, "Cláusula de qualidade é obrigatória"),
  intellectualProperty: z.string().min(1, "Cláusula de propriedade intelectual é obrigatória"),
  nonCompeteClause: z.string().min(1, "Cláusula de não concorrência é obrigatória"),
  includeNonCompeteClause: z.boolean(),
  contractCity: z.string().min(1, "Cidade do contrato é obrigatória"),
  contractFullDate: z.string().min(1, "Data completa do contrato é obrigatória"),
});

interface FreelanceEditorContractFormProps {
  initialData: FreelanceEditorContractData;
  onSubmitForm: (data: FreelanceEditorContractData) => void;
  onPreviewUpdate: (data: FreelanceEditorContractData) => void;
}

const FreelanceEditorContractForm: React.FC<FreelanceEditorContractFormProps> = ({ initialData, onSubmitForm, onPreviewUpdate }) => {
  const { control, handleSubmit, watch, formState: { errors } } = useForm<FreelanceEditorContractData>({
    resolver: zodResolver(freelanceEditorContractFormSchema),
    defaultValues: initialData,
  });

  React.useEffect(() => {
    const subscription = watch((value) => {
      onPreviewUpdate(value as FreelanceEditorContractData);
    });
    return () => subscription.unsubscribe();
  }, [watch, onPreviewUpdate]);
  
  const includeNonCompete = watch('includeNonCompeteClause');
  const remunerationType = watch('remunerationType');

  return (
    <Card className="shadow-xl bg-card text-card-foreground w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <FileText className="h-6 w-6 mr-2 text-primary" />
          {initialData.contractTitle}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-6">

          <section>
            <h3 className="text-lg font-semibold mb-3 text-primary border-b pb-2">CONTRATADO (Editor)</h3>
            <div className="space-y-3">
              <div className="mb-3">
                <Label htmlFor="contratado.name" className="flex items-center mb-1"><User className="mr-2 h-4 w-4" />Nome</Label>
                <Controller name="contratado.name" control={control} render={({ field }) => <Input id="contratado.name" {...field} />} />
                {errors.contratado?.name && <p className="text-sm text-destructive mt-1">{errors.contratado.name.message}</p>}
              </div>
              <div className="mb-3">
                <Label htmlFor="contratado.cpfCnpj" className="flex items-center mb-1"><Briefcase className="mr-2 h-4 w-4" />CPF/CNPJ</Label>
                <Controller name="contratado.cpfCnpj" control={control} render={({ field }) => <Input id="contratado.cpfCnpj" {...field} />} />
                {errors.contratado?.cpfCnpj && <p className="text-sm text-destructive mt-1">{errors.contratado.cpfCnpj.message}</p>}
              </div>
              <div className="mb-3">
                <Label htmlFor="contratado.address" className="flex items-center mb-1"><MapPin className="mr-2 h-4 w-4" />Endereço Completo</Label>
                <Controller name="contratado.address" control={control} render={({ field }) => <Textarea id="contratado.address" {...field} />} />
                {errors.contratado?.address && <p className="text-sm text-destructive mt-1">{errors.contratado.address.message}</p>}
              </div>
              <div className="mb-3">
                <Label htmlFor="contratado.email" className="flex items-center mb-1"><Mail className="mr-2 h-4 w-4" />E-mail</Label>
                <Controller name="contratado.email" control={control} render={({ field }) => <Input id="contratado.email" type="email" {...field} />} />
                {errors.contratado?.email && <p className="text-sm text-destructive mt-1">{errors.contratado.email.message}</p>}
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-3 text-primary border-b pb-2">Cláusulas Editáveis</h3>
            <div className="space-y-4">
              
              <div className="p-3 border rounded-md space-y-3">
                <Label className="flex items-center mb-1 font-semibold"><DollarSign className="mr-2 h-4 w-4" />Cláusula 3 - Remuneração</Label>
                <Controller
                    name="remunerationType"
                    control={control}
                    render={({ field }) => (
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-wrap gap-x-4 gap-y-2 mt-2"
                      >
                        {(['MENSAL', 'SEMANAL', 'PROJETO', 'PERCENTUAL'] as RemunerationType[]).map((type) => (
                           <div className="flex items-center space-x-2" key={type}>
                             <RadioGroupItem value={type} id={`remuneration-${type}`} />
                             <Label htmlFor={`remuneration-${type}`} className="font-normal capitalize">{type.toLowerCase()}</Label>
                           </div>
                        ))}
                      </RadioGroup>
                    )}
                  />
                  {errors.remunerationType && <p className="text-sm text-destructive mt-1">{errors.remunerationType.message}</p>}
                
                <div>
                  <Label htmlFor="remunerationValue" className="flex items-center mb-1">
                    {remunerationType === 'PERCENTUAL' ? <Percent className="mr-2 h-4 w-4"/> : <DollarSign className="mr-2 h-4 w-4" />}
                    Valor
                  </Label>
                  <Controller name="remunerationValue" control={control} render={({ field }) => <Input id="remunerationValue" type="number" step="0.01" {...field} placeholder={remunerationType === 'PERCENTUAL' ? 'Ex: 15 para 15%' : 'Ex: 3000.00'} />} />
                  {errors.remunerationValue && <p className="text-sm text-destructive mt-1">{errors.remunerationValue.message}</p>}
                </div>
                
                <div>
                  <Label htmlFor="paymentDetails" className="flex items-center mb-1">Detalhes Complementares de Pagamento</Label>
                  <Controller name="paymentDetails" control={control} render={({ field }) => <Textarea id="paymentDetails" rows={3} {...field} />} />
                  {errors.paymentDetails && <p className="text-sm text-destructive mt-1">{errors.paymentDetails.message}</p>}
                </div>
              </div>
              
              <div>
                <Label htmlFor="lateDeliveryPenalty" className="flex items-center mb-1"><Percent className="mr-2 h-4 w-4" />Cláusula 4 - Multa por Atraso na Entrega (%)</Label>
                <Controller name="lateDeliveryPenalty" control={control} render={({ field }) => <Input id="lateDeliveryPenalty" type="number" {...field} />} />
                {errors.lateDeliveryPenalty && <p className="text-sm text-destructive mt-1">{errors.lateDeliveryPenalty.message}</p>}
              </div>
              
              <div>
                <Label htmlFor="softwareResponsibility" className="flex items-center mb-1"><FileWarning className="mr-2 h-4 w-4" />Cláusula 5 - Softwares</Label>
                <Controller name="softwareResponsibility" control={control} render={({ field }) => <Textarea id="softwareResponsibility" rows={5} {...field} />} />
                {errors.softwareResponsibility && <p className="text-sm text-destructive mt-1">{errors.softwareResponsibility.message}</p>}
              </div>
              
               <div>
                <Label htmlFor="confidentialityPenalty" className="flex items-center mb-1"><DollarSign className="mr-2 h-4 w-4" />Cláusula 7 - Multa de Confidencialidade (R$)</Label>
                <Controller name="confidentialityPenalty" control={control} render={({ field }) => <Input id="confidentialityPenalty" type="number" step="0.01" {...field} />} />
                {errors.confidentialityPenalty && <p className="text-sm text-destructive mt-1">{errors.confidentialityPenalty.message}</p>}
              </div>
              
               <div>
                <Label htmlFor="remoteWorkPolicy" className="flex items-center mb-1"><FileWarning className="mr-2 h-4 w-4" />Cláusula 9 - Trabalho Remoto e Híbrido</Label>
                <Controller name="remoteWorkPolicy" control={control} render={({ field }) => <Textarea id="remoteWorkPolicy" rows={5} {...field} />} />
                {errors.remoteWorkPolicy && <p className="text-sm text-destructive mt-1">{errors.remoteWorkPolicy.message}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
                 <div>
                    <Label htmlFor="rescissionNoticeDays" className="flex items-center mb-1"><CalendarDays className="mr-2 h-4 w-4" />Cláusula 10 - Aviso Prévio de Rescisão (dias)</Label>
                    <Controller name="rescissionNoticeDays" control={control} render={({ field }) => <Input id="rescissionNoticeDays" type="number" {...field} />} />
                    {errors.rescissionNoticeDays && <p className="text-sm text-destructive mt-1">{errors.rescissionNoticeDays.message}</p>}
                 </div>
                 <div>
                    <Label htmlFor="unjustifiedRescissionPenalty" className="flex items-center mb-1"><Percent className="mr-2 h-4 w-4" />Cláusula 10 - Multa de Rescisão Injustificada (%)</Label>
                    <Controller name="unjustifiedRescissionPenalty" control={control} render={({ field }) => <Input id="unjustifiedRescissionPenalty" type="number" {...field} />} />
                    {errors.unjustifiedRescissionPenalty && <p className="text-sm text-destructive mt-1">{errors.unjustifiedRescissionPenalty.message}</p>}
                </div>
              </div>

               <div>
                <Label htmlFor="availabilityAndCommunication" className="flex items-center mb-1"><FileWarning className="mr-2 h-4 w-4" />Cláusula 13 - Disponibilidade e Comunicação</Label>
                <Controller name="availabilityAndCommunication" control={control} render={({ field }) => <Textarea id="availabilityAndCommunication" rows={3} {...field} />} />
                {errors.availabilityAndCommunication && <p className="text-sm text-destructive mt-1">{errors.availabilityAndCommunication.message}</p>}
              </div>
              
               <div>
                <Label htmlFor="serviceQuality" className="flex items-center mb-1"><FileWarning className="mr-2 h-4 w-4" />Cláusula 14 - Qualidade dos Serviços</Label>
                <Controller name="serviceQuality" control={control} render={({ field }) => <Textarea id="serviceQuality" rows={3} {...field} />} />
                {errors.serviceQuality && <p className="text-sm text-destructive mt-1">{errors.serviceQuality.message}</p>}
              </div>

              <div className="p-3 border rounded-md space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="includeNonCompeteClause" className="flex items-center">
                        {includeNonCompete ? <Shield className="mr-2 h-4 w-4 text-green-500" /> : <ShieldOff className="mr-2 h-4 w-4 text-red-500" />}
                        Cláusula 15 - Não Concorrência
                    </Label>
                    <Controller
                        name="includeNonCompeteClause"
                        control={control}
                        render={({ field }) => <Switch id="includeNonCompeteClause" checked={field.value} onCheckedChange={field.onChange} />}
                    />
                  </div>
                   {errors.includeNonCompeteClause && <p className="text-sm text-destructive mt-1">{errors.includeNonCompeteClause.message}</p>}
                  
                   {includeNonCompete && (
                     <div>
                        <Controller name="nonCompeteClause" control={control} render={({ field }) => <Textarea id="nonCompeteClause" rows={3} {...field} />} />
                        {errors.nonCompeteClause && <p className="text-sm text-destructive mt-1">{errors.nonCompeteClause.message}</p>}
                     </div>
                   )}
              </div>

            </div>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-3 text-primary border-b pb-2">Finalização</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
              <div className="mb-3">
                <Label htmlFor="foro" className="flex items-center mb-1"><Shield className="mr-2 h-4 w-4" />Foro</Label>
                <Controller name="foro" control={control} render={({ field }) => <Input id="foro" {...field} placeholder="Comarca de..." />} />
                {errors.foro && <p className="text-sm text-destructive mt-1">{errors.foro.message}</p>}
              </div>
              <div className="mb-3">
                <Label htmlFor="contractCity" className="flex items-center mb-1"><MapPin className="mr-2 h-4 w-4" />Cidade para Assinatura</Label>
                <Controller name="contractCity" control={control} render={({ field }) => <Input id="contractCity" {...field} placeholder="Ex: Lagoa Santa/MG" />} />
                {errors.contractCity && <p className="text-sm text-destructive mt-1">{errors.contractCity.message}</p>}
              </div>
            </div>
            <div className="mb-3">
              <Label htmlFor="contractFullDate" className="flex items-center mb-1"><CalendarDays className="mr-2 h-4 w-4" />Data Completa da Assinatura</Label>
              <Controller name="contractFullDate" control={control} render={({ field }) => <Input id="contractFullDate" {...field} placeholder="Ex: 15 de maio de 2025" />} />
              {errors.contractFullDate && <p className="text-sm text-destructive mt-1">{errors.contractFullDate.message}</p>}
            </div>
          </section>

          <CardFooter className="flex justify-end p-0 pt-6">
            <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <Send className="mr-2 h-4 w-4" /> Salvar Contrato
            </Button>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  );
};

export default FreelanceEditorContractForm;

    