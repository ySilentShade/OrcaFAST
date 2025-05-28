
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
import type { FreelancerMaterialAuthorizationData } from '@/types/contract';
import { FileText, Send, User, Briefcase, MapPin, Mail, DollarSign, CalendarDays, LinkIcon, ShieldCheck, Edit3 } from 'lucide-react';

const autorizadoSchema = z.object({
  name: z.string().min(1, "Nome do autorizado é obrigatório"),
  cpfCnpj: z.string().min(1, "CPF do autorizado é obrigatório"), // Assuming CPF for freelancer
  address: z.string().min(1, "Endereço do autorizado é obrigatório"),
  email: z.string().email("E-mail inválido").or(z.literal('')),
});

export const freelancerMaterialAuthorizationFormSchema = z.object({
  contractType: z.literal('FREELANCER_MATERIAL_AUTHORIZATION'),
  contractTitle: z.string().min(1, "Título do termo é obrigatório"),
  autorizado: autorizadoSchema,
  projectName: z.string().min(1, "Nome do projeto é obrigatório"),
  finalClientName: z.string().min(1, "Nome do cliente final é obrigatório"),
  executionDate: z.string().min(1, "Data de execução é obrigatória"),
  authorizedLinks: z.string().min(1, "Link(s) autorizado(s) são obrigatórios"),
  penaltyValue: z.string().refine(val => !isNaN(parseFloat(val)) && parseFloat(val) >= 0, { message: "Valor da multa deve ser um número não negativo" }),
  foro: z.string().min(1, "Foro é obrigatório"),
  contractCity: z.string().min(1, "Cidade do termo é obrigatória"),
  contractFullDate: z.string().min(1, "Data completa do termo é obrigatória"),
});

interface FreelancerMaterialAuthorizationFormProps {
  initialData: FreelancerMaterialAuthorizationData;
  onSubmitForm: (data: FreelancerMaterialAuthorizationData) => void;
  onPreviewUpdate: (data: FreelancerMaterialAuthorizationData) => void;
}

const FreelancerMaterialAuthorizationForm: React.FC<FreelancerMaterialAuthorizationFormProps> = ({ initialData, onSubmitForm, onPreviewUpdate }) => {
  const { control, handleSubmit, watch, formState: { errors } } = useForm<FreelancerMaterialAuthorizationData>({
    resolver: zodResolver(freelancerMaterialAuthorizationFormSchema),
    defaultValues: initialData,
  });

  React.useEffect(() => {
    const subscription = watch((value) => {
      onPreviewUpdate(value as FreelancerMaterialAuthorizationData);
    });
    return () => subscription.unsubscribe();
  }, [watch, onPreviewUpdate]);

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
            <h3 className="text-lg font-semibold mb-3 text-primary border-b pb-2">Detalhes do Termo</h3>
            <div className="mb-3">
              <Label htmlFor="contractTitle" className="flex items-center mb-1"><Edit3 className="mr-2 h-4 w-4" />Título do Termo</Label>
              <Controller name="contractTitle" control={control} render={({ field }) => <Input id="contractTitle" {...field} />} />
              {errors.contractTitle && <p className="text-sm text-destructive mt-1">{errors.contractTitle.message}</p>}
            </div>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-3 text-primary border-b pb-2">AUTORIZADO(A) (Freelancer)</h3>
            <div className="space-y-3">
              <div className="mb-3">
                <Label htmlFor="autorizado.name" className="flex items-center mb-1"><User className="mr-2 h-4 w-4" />Nome do Freelancer</Label>
                <Controller name="autorizado.name" control={control} render={({ field }) => <Input id="autorizado.name" {...field} />} />
                {errors.autorizado?.name && <p className="text-sm text-destructive mt-1">{errors.autorizado.name.message}</p>}
              </div>
              <div className="mb-3">
                <Label htmlFor="autorizado.cpfCnpj" className="flex items-center mb-1"><Briefcase className="mr-2 h-4 w-4" />CPF</Label>
                <Controller name="autorizado.cpfCnpj" control={control} render={({ field }) => <Input id="autorizado.cpfCnpj" {...field} placeholder="Apenas CPF" />} />
                {errors.autorizado?.cpfCnpj && <p className="text-sm text-destructive mt-1">{errors.autorizado.cpfCnpj.message}</p>}
              </div>
              <div className="mb-3">
                <Label htmlFor="autorizado.address" className="flex items-center mb-1"><MapPin className="mr-2 h-4 w-4" />Endereço Completo</Label>
                <Controller name="autorizado.address" control={control} render={({ field }) => <Textarea id="autorizado.address" {...field} />} />
                {errors.autorizado?.address && <p className="text-sm text-destructive mt-1">{errors.autorizado.address.message}</p>}
              </div>
              <div className="mb-3">
                <Label htmlFor="autorizado.email" className="flex items-center mb-1"><Mail className="mr-2 h-4 w-4" />E-mail</Label>
                <Controller name="autorizado.email" control={control} render={({ field }) => <Input id="autorizado.email" type="email" {...field} />} />
                {errors.autorizado?.email && <p className="text-sm text-destructive mt-1">{errors.autorizado.email.message}</p>}
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-3 text-primary border-b pb-2">Detalhes do Projeto e Uso</h3>
            <div className="space-y-3">
              <div className="mb-3">
                <Label htmlFor="projectName" className="flex items-center mb-1"><Edit3 className="mr-2 h-4 w-4" />Nome do Projeto</Label>
                <Controller name="projectName" control={control} render={({ field }) => <Input id="projectName" {...field} />} />
                {errors.projectName && <p className="text-sm text-destructive mt-1">{errors.projectName.message}</p>}
              </div>
              <div className="mb-3">
                <Label htmlFor="finalClientName" className="flex items-center mb-1"><User className="mr-2 h-4 w-4" />Cliente Final Atendido</Label>
                <Controller name="finalClientName" control={control} render={({ field }) => <Input id="finalClientName" {...field} />} />
                {errors.finalClientName && <p className="text-sm text-destructive mt-1">{errors.finalClientName.message}</p>}
              </div>
              <div className="mb-3">
                <Label htmlFor="executionDate" className="flex items-center mb-1"><CalendarDays className="mr-2 h-4 w-4" />Data de Execução da Gravação</Label>
                <Controller name="executionDate" control={control} render={({ field }) => <Input id="executionDate" {...field} placeholder="Ex: 10/01/2024" />} />
                {errors.executionDate && <p className="text-sm text-destructive mt-1">{errors.executionDate.message}</p>}
              </div>
              <div className="mb-3">
                <Label htmlFor="authorizedLinks" className="flex items-center mb-1"><LinkIcon className="mr-2 h-4 w-4" />Link(s) Autorizado(s) para Portfólio</Label>
                <Controller name="authorizedLinks" control={control} render={({ field }) => <Textarea id="authorizedLinks" {...field} placeholder="Cole o(s) link(s) aqui, um por linha se necessário." />} />
                {errors.authorizedLinks && <p className="text-sm text-destructive mt-1">{errors.authorizedLinks.message}</p>}
              </div>
               <div className="mb-3">
                <Label htmlFor="penaltyValue" className="flex items-center mb-1"><DollarSign className="mr-2 h-4 w-4" />Multa por Uso Indevido (R$)</Label>
                <Controller name="penaltyValue" control={control} render={({ field }) => <Input id="penaltyValue" type="number" step="0.01" {...field} />} />
                {errors.penaltyValue && <p className="text-sm text-destructive mt-1">{errors.penaltyValue.message}</p>}
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
              <Send className="mr-2 h-4 w-4" /> Salvar Termo (para PDF)
            </Button>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  );
};

export default FreelancerMaterialAuthorizationForm;
