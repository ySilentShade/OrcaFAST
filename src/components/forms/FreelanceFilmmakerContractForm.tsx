
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
import type { FreelanceFilmmakerContractData } from '@/types/contract';
import { FileText, Send, User, Briefcase, MapPin, Mail, DollarSign, CalendarDays, Settings, Percent, ShieldCheck } from 'lucide-react';

const contratadoSchema = z.object({
  name: z.string().min(1, "Nome do contratado é obrigatório"),
  cpfCnpj: z.string().min(1, "CPF/CNPJ do contratado é obrigatório"),
  address: z.string().min(1, "Endereço do contratado é obrigatório"),
  email: z.string().email("E-mail inválido").or(z.literal('')),
});

export const freelanceFilmmakerContractFormSchema = z.object({
  contractType: z.literal('FREELANCE_HIRE_FILMMAKER'),
  contractTitle: z.string().min(1, "Título do contrato é obrigatório"),
  contratado: contratadoSchema,
  remunerationValue: z.string().refine(val => !isNaN(parseFloat(val)) && parseFloat(val) >= 0, { message: "Valor deve ser um número não negativo" }),
  remunerationUnit: z.enum(['hora', 'dia', 'projeto'], { required_error: "Unidade de remuneração é obrigatória" }),
  paymentMethodDescription: z.string().min(1, "Descrição do método de pagamento é obrigatória"),
  deliveryDeadlineDetails: z.string().min(1, "Detalhes do prazo de entrega são obrigatórios"),
  equipmentDetails: z.string().min(1, "Detalhes dos equipamentos são obrigatórios"),
  confidentialityBreachPenaltyValue: z.string().refine(val => !isNaN(parseFloat(val)) && parseFloat(val) >= 0, { message: "Valor da multa deve ser um número não negativo" }),
  rescissionNoticeDays: z.string().refine(val => !isNaN(parseInt(val)) && parseInt(val) >= 0, { message: "Deve ser um número não negativo" }),
  unjustifiedRescissionPenaltyPercentage: z.string().refine(val => !isNaN(parseFloat(val)) && parseFloat(val) >= 0 && parseFloat(val) <= 100, { message: "Deve ser um número entre 0 e 100" }),
  foro: z.string().min(1, "Foro é obrigatório"),
  contractCity: z.string().min(1, "Cidade do contrato é obrigatória"),
  contractFullDate: z.string().min(1, "Data completa do contrato é obrigatória"),
});

interface FreelanceFilmmakerContractFormProps {
  initialData: FreelanceFilmmakerContractData;
  onSubmitForm: (data: FreelanceFilmmakerContractData) => void;
  onPreviewUpdate: (data: FreelanceFilmmakerContractData) => void;
}

const FreelanceFilmmakerContractForm: React.FC<FreelanceFilmmakerContractFormProps> = ({ initialData, onSubmitForm, onPreviewUpdate }) => {
  const { control, handleSubmit, watch, formState: { errors } } = useForm<FreelanceFilmmakerContractData>({
    resolver: zodResolver(freelanceFilmmakerContractFormSchema),
    defaultValues: initialData,
  });

  React.useEffect(() => {
    const subscription = watch((value) => {
      onPreviewUpdate(value as FreelanceFilmmakerContractData);
    });
    return () => subscription.unsubscribe();
  }, [watch, onPreviewUpdate]);

  return (
    <Card className="shadow-xl bg-card text-card-foreground w-full border-none">
      <CardHeader>
        <CardTitle className="flex items-center">
          <FileText className="h-6 w-6 mr-2 text-primary" />
          {initialData.contractTitle}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-6">

          <section>
            <h3 className="text-lg font-semibold mb-3 text-primary border-b pb-2">Detalhes do Contrato</h3>
            <div className="mb-3">
              <Label htmlFor="contractTitle" className="flex items-center mb-1"><FileText className="mr-2 h-4 w-4" />Título do Contrato</Label>
              <Controller name="contractTitle" control={control} render={({ field }) => <Input id="contractTitle" {...field} />} />
              {errors.contractTitle && <p className="text-sm text-destructive mt-1">{errors.contractTitle.message}</p>}
            </div>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-3 text-primary border-b pb-2">CONTRATADO (Freelancer)</h3>
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
            <div className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
                <div className="mb-3">
                  <Label htmlFor="remunerationValue" className="flex items-center mb-1"><DollarSign className="mr-2 h-4 w-4" />Valor da Remuneração (R$)</Label>
                  <Controller name="remunerationValue" control={control} render={({ field }) => <Input id="remunerationValue" type="number" step="0.01" {...field} />} />
                  {errors.remunerationValue && <p className="text-sm text-destructive mt-1">{errors.remunerationValue.message}</p>}
                </div>
                <div className="mb-3">
                  <Label className="flex items-center mb-1"><DollarSign className="mr-2 h-4 w-4" />Unidade (Hora/Dia/Projeto)</Label>
                  <Controller
                    name="remunerationUnit"
                    control={control}
                    render={({ field }) => (
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex space-x-4 mt-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="hora" id="hora" />
                          <Label htmlFor="hora" className="font-normal">Hora</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="dia" id="dia" />
                          <Label htmlFor="dia" className="font-normal">Dia</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="projeto" id="projeto" />
                          <Label htmlFor="projeto" className="font-normal">Projeto</Label>
                        </div>
                      </RadioGroup>
                    )}
                  />
                  {errors.remunerationUnit && <p className="text-sm text-destructive mt-1">{errors.remunerationUnit.message}</p>}
                </div>
              </div>

              <div className="mb-3">
                <Label htmlFor="paymentMethodDescription" className="flex items-center mb-1"><Settings className="mr-2 h-4 w-4" />Forma de Pagamento ao Contratado (Detalhes)</Label>
                <Controller name="paymentMethodDescription" control={control} render={({ field }) => <Textarea id="paymentMethodDescription" {...field} placeholder="Ex: A escolha do CONTRATADO, acordada previamente..." />} />
                {errors.paymentMethodDescription && <p className="text-sm text-destructive mt-1">{errors.paymentMethodDescription.message}</p>}
              </div>

              <div className="mb-3">
                <Label htmlFor="deliveryDeadlineDetails" className="flex items-center mb-1"><CalendarDays className="mr-2 h-4 w-4" />Prazos e Entregas (Detalhes)</Label>
                <Controller name="deliveryDeadlineDetails" control={control} render={({ field }) => <Textarea id="deliveryDeadlineDetails" {...field} placeholder="Ex: Definidos por e-mail, com confirmação obrigatória..." />} />
                {errors.deliveryDeadlineDetails && <p className="text-sm text-destructive mt-1">{errors.deliveryDeadlineDetails.message}</p>}
              </div>

              <div className="mb-3">
                <Label htmlFor="equipmentDetails" className="flex items-center mb-1"><Settings className="mr-2 h-4 w-4" />Equipamentos (Detalhes)</Label>
                <Controller name="equipmentDetails" control={control} render={({ field }) => <Textarea id="equipmentDetails" {...field} placeholder="Ex: Fornecidos pela CONTRATANTE ou do próprio CONTRATADO..." />} />
                {errors.equipmentDetails && <p className="text-sm text-destructive mt-1">{errors.equipmentDetails.message}</p>}
              </div>

              <div className="mb-3">
                <Label htmlFor="confidentialityBreachPenaltyValue" className="flex items-center mb-1"><DollarSign className="mr-2 h-4 w-4" />Multa por Quebra de Confidencialidade (R$)</Label>
                <Controller name="confidentialityBreachPenaltyValue" control={control} render={({ field }) => <Input id="confidentialityBreachPenaltyValue" type="number" step="0.01" {...field} />} />
                {errors.confidentialityBreachPenaltyValue && <p className="text-sm text-destructive mt-1">{errors.confidentialityBreachPenaltyValue.message}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
                <div className="mb-3">
                  <Label htmlFor="rescissionNoticeDays" className="flex items-center mb-1"><CalendarDays className="mr-2 h-4 w-4" />Rescisão: Aviso Prévio (dias)</Label>
                  <Controller name="rescissionNoticeDays" control={control} render={({ field }) => <Input id="rescissionNoticeDays" type="number" {...field} />} />
                  {errors.rescissionNoticeDays && <p className="text-sm text-destructive mt-1">{errors.rescissionNoticeDays.message}</p>}
                </div>
                <div className="mb-3">
                  <Label htmlFor="unjustifiedRescissionPenaltyPercentage" className="flex items-center mb-1"><Percent className="mr-2 h-4 w-4" />Rescisão Injustificada: Multa (%)</Label>
                  <Controller name="unjustifiedRescissionPenaltyPercentage" control={control} render={({ field }) => <Input id="unjustifiedRescissionPenaltyPercentage" type="number" {...field} />} />
                  {errors.unjustifiedRescissionPenaltyPercentage && <p className="text-sm text-destructive mt-1">{errors.unjustifiedRescissionPenaltyPercentage.message}</p>}
                </div>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-3 text-primary border-b pb-2">Finalização</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
              <div className="mb-3">
                <Label htmlFor="foro" className="flex items-center mb-1"><ShieldCheck className="mr-2 h-4 w-4" />Foro</Label>
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
              <Send className="mr-2 h-4 w-4" /> Salvar Contrato (para PDF)
            </Button>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  );
};

export default FreelanceFilmmakerContractForm;

    