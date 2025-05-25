"use client";

import React, { useState, useRef } from 'react';
import AppHeader from '@/components/AppHeader';
import BudgetForm from '@/components/BudgetForm';
import BudgetPreview from '@/components/BudgetPreview';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import type { BudgetFormState, BudgetPreviewData, CompanyInfo, BudgetItem, BudgetDemoData } from '@/types/budget';
import { fetchDemoBudgetData } from './actions';
import { useToast } from "@/hooks/use-toast";
import html2pdf from 'html2pdf.js';

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

  const handleFormSubmit = (data: BudgetFormState) => {
    const items: BudgetItem[] = data.items.map(item => {
      const quantity = parseFloat(item.quantity);
      const unitPrice = parseFloat(item.unitPrice);
      return {
        ...item,
        quantity,
        unitPrice,
        total: quantity * unitPrice,
      };
    });

    const totalAmount = items.reduce((sum, item) => sum + item.total, 0);

    setPreviewData({
      ...data,
      items,
      budgetNumber: generateBudgetNumber(),
      budgetDate: new Date().toLocaleDateString('pt-BR'),
      companyInfo,
      totalAmount,
    });
  };

  const handleFillWithDemoData = async (): Promise<BudgetDemoData | null> => {
    const data = await fetchDemoBudgetData();
    return data;
  };

  const handleDownloadPdf = () => {
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

    const clientNameSanitized = previewData.clientName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    const opt = {
      margin:       0.5,
      filename:     `orcamento_${clientNameSanitized || 'fastfilms'}.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true, backgroundColor: '#18191b' }, // Ensure background is captured
      jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' }
    };

    // html2pdf().from(element).set(opt).save(); // This was causing issues in some environments
     // Temporary workaround for potential html2pdf().from().set().save() issues:
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
            <BudgetForm onSubmitForm={handleFormSubmit} onFillWithDemoData={handleFillWithDemoData} />
          </div>
          <div className="lg:col-span-1">
            {previewData && (
              <Button onClick={handleDownloadPdf} className="mb-4 w-full bg-accent hover:bg-accent/90 text-accent-foreground">
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
