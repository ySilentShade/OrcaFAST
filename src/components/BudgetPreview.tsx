
"use client";

import React from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
import type { BudgetPreviewData, BudgetItem } from '@/types/budget';
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
      <Card className="sticky top-8 shadow-lg" style={{ backgroundColor: '#18191b' }}>
        <CardContent className="p-6 text-center text-muted-foreground flex flex-col items-center justify-center min-h-[300px]">
          <FileText className="h-16 w-16 mb-4 text-gray-500" />
          <p className="text-lg">Nenhum orçamento gerado ainda.</p>
          <p className="text-sm">Preencha o formulário e clique em "Gerar Orçamento".</p>
        </CardContent>
      </Card>
    );
  }

  const { 
    clientName, 
    clientAddress, 
    items, 
    terms, 
    budgetNumber, 
    budgetDate, 
    companyInfo, 
    subtotal,
    totalAmount, 
    totalDiscountValue,
    totalDiscountPercentage,
    isDroneFeatureEnabled 
  } = data;

  return (
    <Card id="budget-preview-content" className="sticky top-8 shadow-lg flex flex-col" style={{ backgroundColor: '#18191b', color: '#e0e0e0' }}>
      <CardHeader className="p-8 border-b border-gray-600 flex-shrink-0">
        <div className="flex justify-between items-start">
          <div className="flex items-center">
            {companyInfo.logoUrl && (
              <Image 
                src={companyInfo.logoUrl} 
                alt={`${companyInfo.name} Logo`} 
                width={80} 
                height={80} 
                className="mr-4 rounded object-contain"
                data-ai-hint="company logo"
              />
            )}
            <div>
              <h2 className="text-2xl font-bold" style={{ color: '#FFFFFF' }}>{companyInfo.name}</h2>
              <p className="text-sm italic" style={{ color: '#B0B0B0' }}>cada momento merece um bom take!</p>
            </div>
          </div>
          <div className="text-right">
            <h1 className="text-3xl font-bold" style={{ color: '#FFFFFF' }}>
              ORÇAMENTO
            </h1>
            {isDroneFeatureEnabled && (
              <p className="text-drone-active text-base -mt-1">
                (com Drone)
              </p>
            )}
            <p className={`text-sm ${isDroneFeatureEnabled ? 'mt-2' : ''}`} style={{ color: '#B0B0B0' }}>Número: {budgetNumber}</p>
            <p className="text-sm" style={{ color: '#B0B0B0' }}>Data: {budgetDate}</p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-8 flex-grow flex flex-col overflow-y-auto min-h-0">
        <div className="mb-6 flex-shrink-0">
          <h3 className="text-lg font-semibold mb-1" style={{ color: '#D0D0D0' }}>Cliente:</h3>
          <p className="font-bold text-lg" style={{ color: '#FFFFFF' }}>{clientName}</p>
          <p className="text-sm whitespace-pre-line" style={{ color: '#B0B0B0' }}>{clientAddress}</p>
        </div>

        <div className="mb-6 flex-grow overflow-y-auto min-h-0"> 
          <h3 className="text-lg font-semibold mb-2 sticky top-0 py-1 z-10" style={{ color: '#D0D0D0', backgroundColor: '#18191b'}}>Itens do Orçamento:</h3>
          <Table style={{ color: '#D0D0D0' }}>
            <TableHeader>
              <TableRow>
                <TableHead>Descrição</TableHead>
                <TableHead className="text-right">Qtde.</TableHead>
                <TableHead className="text-right">Preço Unit.</TableHead>
                <TableHead className="text-right">Total Item</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item: BudgetItem) => (
                <TableRow key={item.id}>
                  <TableCell className="align-middle leading-none">
                    {item.description}
                    {item.discountPercentage !== undefined && item.discountPercentage > 0 && (
                      <div className="text-xs text-green-400 mt-1">
                        (Desconto: {item.discountPercentage.toFixed(2)}%)
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="text-right align-middle leading-none">{item.quantity}</TableCell>
                  <TableCell className="text-right align-middle leading-none">{formatCurrency(item.unitPrice)}</TableCell>
                  <TableCell className="text-right align-middle leading-none">{formatCurrency(item.total)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        <div className="mt-auto flex-shrink-0"> 
          <Separator className="my-6" style={{ backgroundColor: 'hsl(var(--border))' }} />
          <div className="flex justify-end mb-4 pr-4">
            <div className="text-right space-y-2">
              {totalDiscountValue !== undefined && totalDiscountValue > 0 && (
                <>
                  <p className="text-base text-muted-foreground">
                    Subtotal: <span className="line-through">{formatCurrency(subtotal)}</span>
                  </p>
                  <p className="text-base text-green-400">
                    Desconto ({totalDiscountPercentage?.toFixed(2)}%): -{formatCurrency(totalDiscountValue)}
                  </p>
                </>
              )}
              <p className="text-2xl font-bold" style={{ color: '#FFFFFF' }}>
                <span className="mr-2">Total:</span>
                {formatCurrency(totalAmount)}
              </p>
            </div>
          </div>
          <Separator className="my-6" style={{ backgroundColor: 'hsl(var(--border))' }} />
          <div className="text-center mb-6">
            <h3 className="text-xl font-semibold mb-2" style={{ color: '#D0D0D0' }}>Termos e Condições:</h3>
            <p className="text-xs whitespace-pre-line text-justify" style={{ color: '#B0B0B0' }}>{terms}</p>
          </div>
          <Separator className="my-6" style={{ backgroundColor: 'hsl(var(--border))' }} />
          <p className="text-center text-sm font-medium" style={{ color: '#D0D0D0' }}>
            Obrigado pela preferência! — FastFilms
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default BudgetPreview;
