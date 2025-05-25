
"use client";

import React, { useState, useRef, useCallback } from 'react';
import AppHeader from '@/components/AppHeader';
import BudgetForm from '@/components/BudgetForm';
import BudgetPreview from '@/components/BudgetPreview';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import type { BudgetFormState, BudgetPreviewData, CompanyInfo, BudgetItem, BudgetDemoData } from '@/types/budget';
import { fetchDemoBudgetData } from './actions';
import { useToast } from "@/hooks/use-toast";

const companyInfo: CompanyInfo = {
  name: "FastFilms",
  logoUrl: "https://raw.githubusercontent.com/Lyd09/FF/refs/heads/main/LOGO%20SEM%20FUNDO.png",
  address: "Rua Criativa, 789, Estúdio Central, Filmópolis - SP",
  email: "contato@fastfilms.com",
  phone: "(11) 98765-4321",
};

export default function Home() {
  const [previewData, setPreviewData] = useState<BudgetPreviewData | null>(null);
  const { toast } = useToast();
  const previewRef = useRef<HTMLDivElement>(null);

  const generateBudgetNumber = () => {
    const year = new Date().getFullYear();
    const randomNumber = Math.floor(Math.random() * 100000).toString().padStart(5, '0');
    return `ORC-${year}-${randomNumber}`;
  };

  const preparePreviewData = useCallback((formData: BudgetFormState, isFinalSubmission: boolean = false): BudgetPreviewData | null => {
    if (!formData || (!formData.clientName && !formData.clientAddress && (!formData.items || formData.items.length === 0 || !formData.items.some(i => i.description || i.quantity || i.unitPrice)))) {
      return null; // Não mostra preview se não há dados significativos
    }

    const items: BudgetItem[] = (formData.items || []).map(item => {
      const quantity = parseFloat(item.quantity) || 0;
      const unitPrice = parseFloat(item.unitPrice) || 0;
      return {
        id: item.id, // id é obrigatório em BudgetItem
        description: item.description,
        quantity,
        unitPrice,
        total: quantity * unitPrice,
      };
    });

    const totalAmount = items.reduce((sum, item) => sum + item.total, 0);

    return {
      clientName: formData.clientName,
      clientAddress: formData.clientAddress,
      items,
      terms: formData.terms,
      budgetNumber: isFinalSubmission ? generateBudgetNumber() : (previewData?.budgetNumber || "PREVIEW"),
      budgetDate: isFinalSubmission ? new Date().toLocaleDateString('pt-BR') : (previewData?.budgetDate || new Date().toLocaleDateString('pt-BR')),
      companyInfo,
      totalAmount,
    };
  }, [previewData]); // Adicionado previewData como dependência para que budgetNumber/Date sejam estáveis no preview

  const handleFormSubmit = useCallback((data: BudgetFormState) => {
    const finalPreviewData = preparePreviewData(data, true);
    setPreviewData(finalPreviewData);
    if (finalPreviewData) {
        toast({ title: "Orçamento Gerado!", description: "A pré-visualização foi atualizada.", variant: "default" });
    }
  }, [preparePreviewData, toast]);

  const handlePreviewUpdate = useCallback((data: BudgetFormState) => {
    const updatedPreview = preparePreviewData(data, false);
    setPreviewData(updatedPreview);
  }, [preparePreviewData]);


  const handleFillWithDemoData = async (): Promise<BudgetDemoData | null> => {
    const data = await fetchDemoBudgetData();
    if (data) {
        // Atualiza o preview imediatamente após preencher com dados demo
        const demoFormState: BudgetFormState = {
            clientName: data.clientName,
            clientAddress: data.clientAddress,
            items: [{
                id: crypto.randomUUID(),
                description: data.item.description,
                quantity: data.item.quantity.toString(),
                unitPrice: data.item.unitPrice.toString(),
            }],
            terms: "Condições Comerciais: Forma de Pagamento: Transferência bancária, boleto ou PIX.\n\nCondições de Pagamento: 50% do valor será pago antes do início do serviço e o restante, após sua conclusão." // Usar defaultTerms aqui
        };
        handlePreviewUpdate(demoFormState);
    }
    return data;
  };

  const handleDownloadPdf = async () => {
    if (!previewRef.current || !previewData) {
      toast({
        title: "Erro ao gerar PDF",
        description: "Não há dados de orçamento para gerar o PDF.",
        variant: "destructive",
      });
      return;
    }

    const element = previewRef.current.querySelector('#budget-preview-content');
    if (!element) {
         toast({
        title: "Erro ao gerar PDF",
        description: "Conteúdo da pré-visualização não encontrado.",
        variant: "destructive",
      });
      return;
    }

    const html2pdf = (await import('html2pdf.js')).default;

    const clientNameSanitized = previewData.clientName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    const opt = {
      margin:       0.5,
      filename:     `orcamento_${clientNameSanitized || 'orcamento_pro'}.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true, backgroundColor: '#18191b' },
      jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' }
    };

    const worker = html2pdf().from(element).set(opt);
    worker.save();

    toast({
      title: "PDF Gerado",
      description: `O arquivo ${opt.filename} está sendo baixado.`,
    });
  };


  return (
    <div className="min-h-screen bg-background text-foreground">
      <AppHeader />
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <BudgetForm 
              onSubmitForm={handleFormSubmit} 
              onFillWithDemoData={handleFillWithDemoData}
              onPreviewUpdate={handlePreviewUpdate} 
            />
          </div>
          <div className="lg:col-span-1">
            {previewData && (
              <Button onClick={handleDownloadPdf} className="mb-4 w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                <Download className="mr-2 h-4 w-4" /> Baixar PDF
              </Button>
            )}
            <div ref={previewRef}>
              <BudgetPreview data={previewData} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
