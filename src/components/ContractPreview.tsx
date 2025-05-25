
"use client";

import React from 'react';
import type { AnyContractData, PermutaEquipmentServiceContractData, ContractParty } from '@/types/contract';
import type { CompanyInfo } from '@/types/budget'; // Assuming CompanyInfo is in budget types
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText } from 'lucide-react';

interface ContractPreviewProps {
  data: AnyContractData | null;
  companyInfo: CompanyInfo; // FastFilms info
}

const formatCurrency = (value: string | number): string => {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(num)) return 'R$ 0,00';
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(num);
};

const PartyDetails: React.FC<{ party: ContractParty, title: string }> = ({ party, title }) => (
  <div className="mb-4">
    <p className="font-semibold">{title}:</p>
    <p>NOME: {party.name || '____________________________________________'}</p>
    <p>CPF/CNPJ: {party.cpfCnpj || '____________________________________________'}</p>
    <p>ENDEREÇO: {party.address || '____________________________________________'}</p>
    <p>E-MAIL: {party.email || '____________________________________________'}</p>
  </div>
);

const PermutadoDetails: React.FC<{ companyInfo: CompanyInfo }> = ({ companyInfo }) => (
 <div className="mb-6">
    <p className="font-semibold">PERMUTADO (Recebe o equipamento e presta os serviços):</p>
    <p>NOME: {companyInfo.name}</p>
    {/* Assuming CNPJ is not in CompanyInfo, add if available, or hardcode */}
    <p>CPF/CNPJ: 53.525.841/0001-89</p> 
    <p>ENDEREÇO: {companyInfo.address}</p>
    <p>E-MAIL: {companyInfo.email}</p>
  </div>
);


const PermutaEquipmentServicePreview: React.FC<{ contractData: PermutaEquipmentServiceContractData, companyInfo: CompanyInfo }> = ({ contractData, companyInfo }) => {
  const {
    contractTitle,
    permutante,
    equipmentDescription,
    equipmentValue,
    serviceDescription,
    paymentClause,
    conditions,
    transferClause,
    generalDispositions,
    foro,
    contractCity,
    contractFullDate,
  } = contractData;

  return (
    <div className="text-sm leading-relaxed" style={{ fontFamily: 'Arial, Helvetica, sans-serif', color: '#333' }}>
      <h1 className="text-center font-bold text-lg mb-6 uppercase">{contractTitle}</h1>
      
      <p className="mb-4">Pelo presente instrumento particular, as partes abaixo identificadas:</p>

      <PartyDetails party={permutante} title="PERMUTANTE (Cede o equipamento e recebe os serviços)" />
      <PermutadoDetails companyInfo={companyInfo} />

      <p className="mb-6">têm, entre si, justo e contratado o presente {contractTitle.toUpperCase()}, que se regerá pelas cláusulas e condições seguintes:</p>

      <div className="space-y-3">
        <p><span className="font-bold">CLÁUSULA 1 - DO OBJETO</span><br/>
        O presente contrato tem como objeto a permuta de {equipmentDescription || '___________________'}, de propriedade do PERMUTANTE, avaliada em {formatCurrency(equipmentValue || "0")}{equipmentValue ? ` (${(parseFloat(equipmentValue).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0 }).replace("R$", "").trim())} reais)` : ' (___________________ reais)'}, pelo serviço de {serviceDescription || '___________________'} a ser prestado pelo PERMUTADO.</p>
        
        {paymentClause && (
            <p><span className="font-bold">CLÁUSULA 2 - DA FORMA DE PAGAMENTO</span><br/>
            {paymentClause}</p>
        )}

        <p><span className="font-bold">CLÁUSULA {paymentClause ? '3' : '2'} - DAS CONDIÇÕES</span><br/>
        {conditions || '________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________'}</p>
        
        <p><span className="font-bold">CLÁUSULA {paymentClause ? '4' : '3'} - DA TRANSFERÊNCIA DE PROPRIEDADE</span><br/>
        {transferClause || '________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________'}</p>

        {generalDispositions && (
            <p><span className="font-bold">CLÁUSULA {paymentClause ? '5' : '4'} - DAS DISPOSIÇÕES GERAIS</span><br/>
            {generalDispositions}</p>
        )}
        
        <p><span className="font-bold">CLÁUSULA {paymentClause ? (generalDispositions ? '6' : '5') : (generalDispositions ? '5' : '4')} - DO FORO</span><br/>
        Para dirimir eventuais dúvidas ou conflitos oriundos deste contrato, as partes elegem o foro da comarca de {foro || '___________________'}.</p>
      </div>

      <p className="mt-8 mb-8">E, por estarem assim justos e contratados, firmam o presente instrumento em duas vias de igual teor.</p>

      <div className="mt-12 space-y-8">
        <p className="text-center">__________________________________________<br/>PERMUTANTE</p>
        <p className="text-center">__________________________________________<br/>PERMUTADO ({companyInfo.name})</p>
      </div>

      <p className="mt-12 text-left">{contractCity || '___________________'}, {contractFullDate || '___________________'}.</p>
    </div>
  );
};


const ContractPreview: React.FC<ContractPreviewProps> = ({ data, companyInfo }) => {
  if (!data) {
    return (
      <Card className="sticky top-8 shadow-lg bg-white">
        <CardContent className="p-6 text-center text-gray-500 flex flex-col items-center justify-center min-h-[300px]">
          <FileText className="h-16 w-16 mb-4 text-gray-400" />
          <p className="text-lg">Nenhum contrato selecionado ou dados preenchidos.</p>
          <p className="text-sm">Escolha um tipo de contrato e preencha o formulário.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card id="contract-preview-content" className="sticky top-8 shadow-lg flex flex-col bg-white text-black max-h-[calc(100vh-10rem)] overflow-y-auto">
        <CardHeader className="p-4 border-b">
            <CardTitle className="text-xl">Pré-visualização do Contrato</CardTitle>
        </CardHeader>
      <CardContent className="p-6">
        {data.contractType === 'PERMUTA_EQUIPMENT_SERVICE' && (
          <PermutaEquipmentServicePreview contractData={data as PermutaEquipmentServiceContractData} companyInfo={companyInfo} />
        )}
        {/* Add other contract type previews here as they are implemented */}
        {data.contractType !== 'PERMUTA_EQUIPMENT_SERVICE' && (
          <p>Pré-visualização para este tipo de contrato ainda não implementada.</p>
        )}
      </CardContent>
    </Card>
  );
};

export default ContractPreview;
