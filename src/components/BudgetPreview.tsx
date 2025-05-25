
"use client";

import React from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
import type { BudgetPreviewData } from '@/types/budget';
import { FileText } from 'lucide-react';

interface BudgetPreviewProps {
  data: BudgetPreviewData | null;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
};

const BudgetPreview: React.FC<BudgetPreviewProps> = ({ data }) => {
  if (!data) {
    return (
      <Card className="sticky top-8 shadow-lg h-[calc(100vh-4rem)] overflow-auto" style={{ backgroundColor: '#18191b' }}>
        <CardContent className="p-6 text-center text-muted-foreground flex flex-col items-center justify-center h-full">
          <FileText className="h-16 w-16 mb-4 text-gray-500" />
          <p className="text-lg">Nenhum orçamento gerado ainda.</p>
          <p className="text-sm">Preencha o formulário e clique em "Gerar Orçamento".</p>
        </CardContent>
      </Card>
    );
  }

  const { clientName, clientAddress, items, terms, budgetNumber, budgetDate, companyInfo, totalAmount } = data;

  return (
    <Card id="budget-preview-content" className="sticky top-8 shadow-lg h-[calc(100vh-4rem)] flex flex-col" style={{ backgroundColor: '#18191b', color: '#e0e0e0' }}>
      <CardHeader className="p-8 border-b border-gray-600 flex-shrink-0">
        <div className="flex justify-between items-start">
          <div className="flex items-center">
            {companyInfo.logoUrl && (
              <Image 
                src={companyInfo.logoUrl} 
                alt={`${companyInfo.name} Logo`} 
                width={100} 
                height={100} 
                className="mr-4 rounded"
                data-ai-hint="company logo"
              />
            )}
            <div>
              <h2 className="text-2xl font-bold" style={{ color: '#FFFFFF' }}>{companyInfo.name}</h2>
              <p className="text-sm italic" style={{ color: '#B0B0B0' }}>cada momento merece um bom take!</p>
            </div>
          </div>
          <div className="text-right">
            <h1 className="text-3xl font-bold" style={{ color: '#FFFFFF' }}>ORÇAMENTO</h1>
            <p className="text-sm" style={{ color: '#B0B0B0' }}>Número: {budgetNumber}</p>
            <p className="text-sm" style={{ color: '#B0B0B0' }}>Data: {budgetDate}</p>
          </div>
        </div>
      </CardHeader>
      {/* CardContent agora não tem overflow-y-auto, mas permite que seus filhos flex cresçam */}
      <CardContent className="p-8 flex-grow flex flex-col min-h-0">
        <div className="mb-6 flex-shrink-0"> {/* Informações do Cliente não encolhem */}
          <h3 className="text-lg font-semibold mb-1" style={{ color: '#D0D0D0' }}>Cliente:</h3>
          <p className="font-bold" style={{ color: '#FFFFFF' }}>{clientName}</p>
          <p className="text-sm whitespace-pre-line" style={{ color: '#B0B0B0' }}>{clientAddress}</p>
        </div>

        {/* Esta div é a área de scroll para os itens */}
        <div className="mb-6 flex-grow overflow-y-auto min-h-0">
          <h3 className="text-lg font-semibold mb-2 sticky top-0 py-1 z-10" style={{ color: '#D0D0D0', backgroundColor: '#18191b'}}>Itens do Orçamento:</h3>
          <Table style={{ color: '#D0D0D0' }}>
            <TableHeader>
              <TableRow className="border-b" style={{ borderColor: '#4A4A4A', hover: {backgroundColor: 'rgba(74, 74, 74, 0.3)'} }}>
                <TableHead style={{ color: '#B0B0B0' }}>Descrição</TableHead>
                <TableHead className="text-right" style={{ color: '#B0B0B0' }}>Qtde.</TableHead>
                <TableHead className="text-right" style={{ color: '#B0B0B0' }}>Preço Unit.</TableHead>
                <TableHead className="text-right" style={{ color: '#B0B0B0' }}>Total Item</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id} className="border-b" style={{ borderColor: '#4A4A4A', hover: {backgroundColor: 'rgba(74, 74, 74, 0.3)'} }}>
                  <TableCell>{item.description}</TableCell>
                  <TableCell className="text-right">{item.quantity}</TableCell>
                  <TableCell className="text-right">{formatCurrency(item.unitPrice)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(item.total)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        {/* Rodapé não encolhe */}
        <div className="flex-shrink-0">
          <Separator className="my-6" style={{ backgroundColor: '#4A4A4A' }} />
          <div className="flex justify-end mb-8 pr-4">
            <p className="text-2xl font-bold" style={{ color: '#FFFFFF' }}>
              <span className="mr-2">Total:</span>
              {formatCurrency(totalAmount)}
            </p>
          </div>
          <Separator className="my-6" style={{ backgroundColor: '#4A4A4A' }} />
          <div className="text-center mb-6">
            <h3 className="text-xl font-semibold mb-2" style={{ color: '#D0D0D0' }}>Termos e Condições:</h3>
            <p className="text-xs whitespace-pre-line text-justify" style={{ color: '#B0B0B0' }}>{terms}</p>
          </div>
          <Separator className="my-6" style={{ backgroundColor: '#4A4A4A' }} />
          <p className="text-center text-sm font-medium" style={{ color: '#D0D0D0' }}>
            Obrigado pela sua preferência!
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default BudgetPreview;
