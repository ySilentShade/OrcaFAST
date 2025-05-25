
"use client";

import React from 'react';
import type { AnyContractData, PermutaEquipmentServiceContractData, ServiceVideoContractData, ContractParty } from '@/types/contract';
import type { CompanyInfo } from '@/types/budget'; // Assuming CompanyInfo is in budget types
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText } from 'lucide-react';

interface ContractPreviewProps {
  data: AnyContractData | null;
  companyInfo: CompanyInfo; // FastFilms info
}

const formatCurrency = (value: string | number | undefined): string => {
  if (value === undefined || value === null) return 'R$ 0,00';
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(num)) return 'R$ 0,00'; // Or handle as an error/placeholder
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(num);
};

const numberToWords = (numStr: string | number | undefined): string => {
    if (numStr === undefined || numStr === null) return '';
    const num = typeof numStr === 'string' ? parseFloat(numStr) : numStr;
    if (isNaN(num)) return '';

    // Basic implementation, consider a library for full fidelity
    // This is a very simplified version for demonstration
    const toWords = require('number-to-words'); // You might need to install this: npm install number-to-words
    try {
        return toWords.toWords(num, { currency: 'BRL', ignoreDecimal: false }).replace(/ reais?/, '');
    } catch (e) {
        console.warn("Error converting number to words, ensure 'number-to-words' is installed and locale is supported or use a different library.", e);
        // Fallback to just the number if conversion fails
        const [integerPart, decimalPart = '00'] = String(num.toFixed(2)).split('.');
        return `${integerPart} e ${decimalPart}/100`;
    }
};


const PartyDetails: React.FC<{ party: ContractParty, title: string }> = ({ party, title }) => (
  <div className="mb-4">
    <p className="font-semibold">{title}:</p>
    <p><span className="font-semibold">NOME:</span> {party.name || '____________________________________________'}</p>
    <p><span className="font-semibold">CPF/CNPJ:</span> {party.cpfCnpj || '____________________________________________'}</p>
    <p><span className="font-semibold">ENDEREÇO:</span> {party.address || '____________________________________________'}</p>
    <p><span className="font-semibold">E-MAIL:</span> {party.email || '____________________________________________'}</p>
  </div>
);

const CompanyAsPartyDetails: React.FC<{ companyInfo: CompanyInfo, title: string, cnpj?: string }> = ({ companyInfo, title, cnpj }) => (
 <div className="mb-6">
    <p className="font-semibold">{title}:</p>
    <p><span className="font-semibold">NOME:</span> {companyInfo.name}</p>
    <p><span className="font-semibold">CNPJ:</span> {cnpj || '53.525.841/0001-89'}</p> {/* Default CNPJ for FastFilms */}
    <p><span className="font-semibold">ENDEREÇO:</span> {companyInfo.address}</p>
    <p><span className="font-semibold">E-MAIL:</span> {companyInfo.email}</p>
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

  const equipmentValueFormatted = formatCurrency(equipmentValue);
  const equipmentValueInWords = numberToWords(equipmentValue);


  return (
    <div className="text-sm leading-relaxed" style={{ fontFamily: 'Arial, Helvetica, sans-serif', color: '#333' }}>
      <h1 className="text-center font-bold text-lg mb-6 uppercase">{contractTitle || "CONTRATO DE PERMUTA"}</h1>
      
      <p className="mb-4">Pelo presente instrumento particular, as partes abaixo identificadas:</p>

      <PartyDetails party={permutante} title="PERMUTANTE (Cede o equipamento e recebe os serviços)" />
      <CompanyAsPartyDetails companyInfo={companyInfo} title="PERMUTADO (Recebe o equipamento e presta os serviços)" />

      <p className="mb-6">têm, entre si, justo e contratado o presente {contractTitle?.toUpperCase() || "CONTRATO DE PERMUTA"}, que se regerá pelas cláusulas e condições seguintes:</p>

      <div className="space-y-3">
        <p><span className="font-bold">CLÁUSULA 1 - DO OBJETO</span><br/>
        O presente contrato tem como objeto a permuta de {equipmentDescription || '___________________'}, de propriedade do PERMUTANTE, avaliada em {equipmentValueFormatted}{equipmentValueInWords ? ` (${equipmentValueInWords} reais)` : ' (___________________ reais)'}, pelo serviço de {serviceDescription || '___________________'} a ser prestado pelo PERMUTADO.</p>
        
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

const ServiceVideoPreview: React.FC<{ contractData: ServiceVideoContractData, companyInfo: CompanyInfo }> = ({ contractData, companyInfo }) => {
  const {
    contractTitle,
    contratante,
    objectDescription,
    totalValue,
    paymentType,
    sinalValuePercentage,
    paymentOutroDescription,
    deliveryDeadline,
    responsibilitiesContratada,
    responsibilitiesContratante,
    copyrightClause,
    rescissionNoticePeriodDays,
    rescissionPenaltyPercentage,
    generalDispositions,
    foro,
    contractCity,
    contractFullDate,
  } = contractData;

  const totalValueFormatted = formatCurrency(totalValue);
  const totalValueInWords = numberToWords(totalValue);

  let paymentDescription = '';
  if (paymentType === 'vista') {
    paymentDescription = 'À vista na assinatura deste contrato.';
  } else if (paymentType === 'sinal_entrega') {
    paymentDescription = `${sinalValuePercentage || '50'}% na assinatura e ${100 - (parseFloat(sinalValuePercentage || '50'))}% na entrega dos vídeos.`;
  } else if (paymentType === 'outro') {
    paymentDescription = paymentOutroDescription || 'Conforme especificado pelas partes.';
  }
  
  const renderList = (text: string = '') => {
    return text.split('\n').map((item, index) => item.trim() ? <li key={index}>{item.trim()}</li> : null).filter(Boolean);
  };

  return (
    <div className="text-sm leading-relaxed" style={{ fontFamily: 'Arial, Helvetica, sans-serif', color: '#333' }}>
      <h1 className="text-center font-bold text-lg mb-6 uppercase">{contractTitle || "CONTRATO DE PRESTAÇÃO DE SERVIÇOS"}</h1>
      
      <PartyDetails party={contratante} title="CONTRATANTE" />
      <CompanyAsPartyDetails companyInfo={companyInfo} title="CONTRATADA" />

      <p className="mb-4"><span className="font-bold">OBJETO DO CONTRATO:</span><br/>
      A CONTRATADA prestará ao CONTRATANTE os serviços de {objectDescription || '___________________'}.</p>

      <p className="mb-4"><span className="font-bold">VALOR E FORMA DE PAGAMENTO:</span><br/>
      O valor total pelos serviços é de {totalValueFormatted}{totalValueInWords ? ` (${totalValueInWords} reais)` : ' (___________________ reais)'}, a ser pago da seguinte forma:<br/>
      {paymentDescription}</p>

      <p className="mb-4"><span className="font-bold">PRAZO DE ENTREGA:</span><br/>
      {deliveryDeadline || '___________________'}</p>

      <p className="mb-2 font-bold">RESPONSABILIDADES DA CONTRATADA:</p>
      <ul className="list-disc list-inside mb-4 ml-4">
        {renderList(responsibilitiesContratada)}
        {!responsibilitiesContratada?.trim() && <li>___________________</li>}
      </ul>

      <p className="mb-2 font-bold">RESPONSABILIDADES DO CONTRATANTE:</p>
      <ul className="list-disc list-inside mb-4 ml-4">
        {renderList(responsibilitiesContratante)}
        {!responsibilitiesContratante?.trim() && <li>___________________</li>}
      </ul>
      
      <p className="mb-4"><span className="font-bold">DIREITOS AUTORAIS:</span><br/>
      {copyrightClause || '___________________'}</p>

      <p className="mb-4"><span className="font-bold">RESCISÃO:</span><br/>
      O contrato poderá ser rescindido por qualquer das partes mediante aviso prévio de {rescissionNoticePeriodDays || '__'} ({numberToWords(rescissionNoticePeriodDays) || '______'}) dias. Em caso de rescisão sem justa causa, a parte que der causa pagará à outra uma multa de {rescissionPenaltyPercentage || '__'}% ({numberToWords(rescissionPenaltyPercentage) || '______'} por cento) sobre o valor do contrato.</p>

      {generalDispositions && (
        <p className="mb-4"><span className="font-bold">DISPOSIÇÕES GERAIS:</span><br/>
        {generalDispositions}</p>
      )}
        
      <p className="mb-4"><span className="font-bold">FORO:</span><br/>
      As partes elegem o foro da comarca de {foro || '___________________'} para dirimir eventuais dúvidas ou conflitos oriundos deste contrato.</p>

      <p className="mt-8 mb-8">E, por estarem assim justos e contratados, firmam o presente instrumento em duas vias de igual teor.</p>

      <div className="mt-12 space-y-8">
        <p className="text-center">__________________________________________<br/>CONTRATANTE</p>
        <p className="text-center">__________________________________________<br/>CONTRATADA ({companyInfo.name})</p>
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
        {data.contractType === 'SERVICE_VIDEO' && (
          <ServiceVideoPreview contractData={data as ServiceVideoContractData} companyInfo={companyInfo} />
        )}
        {/* Add other contract type previews here as they are implemented */}
        {(data.contractType !== 'PERMUTA_EQUIPMENT_SERVICE' && data.contractType !== 'SERVICE_VIDEO') && (
          <p>Pré-visualização para este tipo de contrato ainda não implementada.</p>
        )}
      </CardContent>
    </Card>
  );
};

export default ContractPreview;
