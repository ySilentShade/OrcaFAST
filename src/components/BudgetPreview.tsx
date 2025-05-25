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
    <Card id="budget-preview-content" className="sticky top-8 shadow-lg h-[calc(100vh-4rem)] overflow-auto" style={{ backgroundColor: '#18191b', color: '#e0e0e0' }}>
      <CardHeader className="p-8 border-b border-gray-700">
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
              <h2 className="text-2xl font-bold text-primary">{companyInfo.name}</h2>
              <p className="text-sm text-gray-400">{companyInfo.address}</p>
              <p className="text-sm text-gray-400">{companyInfo.email} | {companyInfo.phone}</p>
            </div>
          </div>
          <div className="text-right">
            <h1 className="text-3xl font-bold text-primary">ORÇAMENTO</h1>
            <p className="text-sm">Número: {budgetNumber}</p>
            <p className="text-sm">Data: {budgetDate}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-8">
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-1 text-gray-300">Cliente:</h3>
          <p className="font-medium text-primary">{clientName}</p>
          <p className="text-sm whitespace-pre-line">{clientAddress}</p>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2 text-gray-300">Itens do Orçamento:</h3>
          <Table className="text-gray-300">
            <TableHeader>
              <TableRow className="border-gray-700 hover:bg-gray-700/30">
                <TableHead className="text-gray-400">Descrição</TableHead>
                <TableHead className="text-right text-gray-400">Qtde.</TableHead>
                <TableHead className="text-right text-gray-400">Preço Unit.</TableHead>
                <TableHead className="text-right text-gray-400">Total Item</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id} className="border-gray-700 hover:bg-gray-700/30">
                  <TableCell>{item.description}</TableCell>
                  <TableCell className="text-right">{item.quantity}</TableCell>
                  <TableCell className="text-right">{formatCurrency(item.unitPrice)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(item.total)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="flex justify-end mb-8">
          <div className="text-right">
            <p className="text-sm text-gray-400">Subtotal:</p>
            <p className="text-2xl font-bold text-primary">{formatCurrency(totalAmount)}</p>
          </div>
        </div>
        
        <Separator className="my-6 border-gray-700" />

        <div className="text-center mb-6">
          <h3 className="text-xl font-semibold mb-2 text-gray-300">Termos e Condições:</h3>
          <p className="text-xs text-gray-400 whitespace-pre-line text-justify">{terms}</p>
        </div>
        
        <Separator className="my-6 border-gray-700" />

        <p className="text-center text-sm font-medium text-gray-300">
          Obrigado pela sua preferência! - {companyInfo.name}
        </p>
      </CardContent>
    </Card>
  );
};

export default BudgetPreview;
