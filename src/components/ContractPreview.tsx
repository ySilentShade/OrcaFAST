
"use client";

import React from 'react';
import type { AnyContractData, PermutaEquipmentServiceContractData, ServiceVideoContractData, ContractParty } from '@/types/contract';
import type { CompanyInfo } from '@/types/budget'; // Assuming CompanyInfo is in budget types
import { FileText } from 'lucide-react';

const formatCurrency = (value: string | number | undefined): string => {
  if (value === undefined || value === null) return 'R$ 0,00';
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(num)) return 'R$ 0,00';
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(num);
};

// --- Início da Lógica para Conversão de Número para Extenso em PT-BR ---
const unidades: string[] = ["", "um", "dois", "três", "quatro", "cinco", "seis", "sete", "oito", "nove"];
const especiais: string[] = ["dez", "onze", "doze", "treze", "catorze", "quinze", "dezesseis", "dezessete", "dezoito", "dezenove"];
const dezenas: string[] = ["", "", "vinte", "trinta", "quarenta", "cinquenta", "sessenta", "setenta", "oitenta", "noventa"];
const centenas: string[] = ["", "cento", "duzentos", "trezentos", "quatrocentos", "quinhentos", "seiscentos", "setecentos", "oitocentos", "novecentos"];

function converterInteiroParaExtensoPTBR(n: number): string {
    if (n === 0) return "zero";
    if (n < 0) return "menos " + converterInteiroParaExtensoPTBR(Math.abs(n));

    let extenso = "";

    if (n >= 1000000000) { 
        const bilhao = Math.floor(n / 1000000000);
        extenso += (bilhao === 1 ? "um bilhão" : converterInteiroParaExtensoPTBR(bilhao) + " bilhões");
        n %= 1000000000;
        if (n > 0) extenso += (n < 100 || n % 100 === 0 ? " e " : ", ");
    }
    
    if (n >= 1000000) { 
        const milhao = Math.floor(n / 1000000);
        extenso += (milhao === 1 ? "um milhão" : converterInteiroParaExtensoPTBR(milhao) + " milhões");
        n %= 1000000;
        if (n > 0) extenso += (n < 100 || n % 100 === 0 ? " e " : ", ");
    }

    if (n >= 1000) {
        const milhar = Math.floor(n / 1000);
        extenso += (milhar === 1 ? "mil" : converterInteiroParaExtensoPTBR(milhar) + " mil");
        n %= 1000;
         if (n > 0) {
            if (n % 100 === 0 ) { 
                 extenso += " e ";
            } else if (n < 100) {
                 extenso += " e ";
            } else if (n > 0) { 
                extenso += ", ";
            }
        }
    }
    
    if (n === 100) { 
        extenso += "cem";
        n = 0; 
    } else if (n > 100) { 
        extenso += centenas[Math.floor(n / 100)];
        n %= 100;
        if (n > 0) extenso += " e ";
    }

    if (n >= 20) {
        extenso += dezenas[Math.floor(n / 10)];
        n %= 10;
        if (n > 0) extenso += " e ";
    } else if (n >= 10) {
        extenso += especiais[n - 10];
        n = 0; 
    }

    if (n > 0) {
        extenso += unidades[n];
    }
    
    if (extenso.endsWith(" e ")) {
        extenso = extenso.substring(0, extenso.length - 3);
    }
    if (extenso.endsWith(", ")) {
        extenso = extenso.substring(0, extenso.length - 2);
    }

    return extenso.trim();
}

const numberToWords = (numStr: string | number | undefined): string => {
    if (numStr === undefined || numStr === null) return '';
    const numValue = typeof numStr === 'string' ? parseFloat(numStr.replace(',', '.')) : numStr;
    if (isNaN(numValue)) return '';

    const integerPart = Math.floor(numValue);
    const decimalPart = Math.round((numValue - integerPart) * 100);

    let extensoInteiro = "";
    if (integerPart === 0 && decimalPart === 0) { 
        extensoInteiro = "zero";
    } else if (integerPart > 0) { 
        extensoInteiro = converterInteiroParaExtensoPTBR(integerPart);
    }
    
    let extensoFinal = "";

    if (extensoInteiro) {
      const unidadeMoeda = (integerPart === 1 && !extensoInteiro.includes("mil") && !extensoInteiro.includes("milhão") && !extensoInteiro.includes("bilhão") ) ? "real" : "reais";
      extensoFinal = `${extensoInteiro} ${unidadeMoeda}`;
    }

    if (decimalPart > 0) {
        const extensoDecimal = converterInteiroParaExtensoPTBR(decimalPart);
        const unidadeCentavos = decimalPart === 1 ? "centavo" : "centavos";
        if (extensoFinal) { 
             extensoFinal += ` e ${extensoDecimal} ${unidadeCentavos}`;
        } else { 
            extensoFinal = `${extensoDecimal} ${unidadeCentavos}`;
        }
    }

    if (!extensoFinal && integerPart === 0 && decimalPart === 0) { 
        extensoFinal = "Zero reais";
    }

    if (extensoFinal) {
      extensoFinal = extensoFinal.charAt(0).toUpperCase() + extensoFinal.slice(1);
      return `(${extensoFinal})`;
    }
    return "";
};
// --- Fim da Lógica para Conversão de Número para Extenso em PT-BR ---

// Helper function to bolden specific terms in a text
const boldenContractTerms = (text: string | undefined, termsToBold: string[]): React.ReactNode[] => {
  if (!text) return [];
  if (termsToBold.length === 0) return [text];

  const regex = new RegExp(`(${termsToBold.join('|')})`, 'g');
  const parts = text.split(regex); 

  return parts.map((part, index) => {
    if (termsToBold.includes(part)) {
      return <strong key={index}>{part}</strong>;
    }
    return part;
  }).filter(part => part !== '');
};


const PartyDetails: React.FC<{ party: ContractParty, title: string, index?: number }> = ({ party, title, index }) => (
  <div className="mb-4">
    <p className="font-semibold">{title}{typeof index === 'number' ? ` ${index + 1}` : ''}:</p>
    <p><span className="font-bold">NOME:</span> {party.name || '____________________________________________'}</p>
    <p><span className="font-bold">CPF/CNPJ:</span> {party.cpfCnpj || '____________________________________________'}</p>
    <p><span className="font-bold">ENDEREÇO:</span> {party.address || '____________________________________________'}</p>
    <p><span className="font-bold">E-MAIL:</span> {party.email || '____________________________________________'}</p>
  </div>
);

const CompanyAsPartyDetails: React.FC<{ companyInfo: CompanyInfo, title: string, cnpj?: string }> = ({ companyInfo, title, cnpj }) => (
 <div className="mb-6">
    <p className="font-semibold">{title}:</p>
    <p><span className="font-bold">NOME:</span> {companyInfo.name}</p>
    <p><span className="font-bold">CNPJ:</span> {cnpj || '53.525.841/0001-89'}</p>
    <p><span className="font-bold">ENDEREÇO:</span> {companyInfo.address}</p>
    <p><span className="font-bold">E-MAIL:</span> {companyInfo.email}</p>
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
  const permutaTerms = ["PERMUTANTE", "PERMUTADO"];

  return (
    <div className="text-sm leading-relaxed" style={{ fontFamily: 'Arial, Helvetica, sans-serif', color: '#333' }}>
      <h1 className="text-center font-bold text-lg mb-6 uppercase">{contractTitle || "CONTRATO DE PERMUTA"}</h1>

      <p className="mb-4">Pelo presente instrumento particular, as partes abaixo identificadas:</p>

      <PartyDetails party={permutante} title="PERMUTANTE (Cede o equipamento e recebe os serviços)" />
      <CompanyAsPartyDetails companyInfo={companyInfo} title="PERMUTADO (Recebe o equipamento e presta os serviços)" />

      <p className="mb-6">têm, entre si, justo e contratado o presente {contractTitle?.toUpperCase() || "CONTRATO DE PERMUTA"}, que se regerá pelas cláusulas e condições seguintes:</p>

      <div className="space-y-3">
        <p><span className="font-bold">CLÁUSULA 1 - DO OBJETO</span><br/>
        O presente contrato tem como objeto a permuta de {equipmentDescription || '___________________'}, de propriedade do <strong>PERMUTANTE</strong>, avaliada em {equipmentValueFormatted}{equipmentValueInWords ? ` ${equipmentValueInWords}` : ''}, pelo serviço de {serviceDescription || '___________________'} a ser prestado pelo <strong>PERMUTADO</strong>.
        </p>

        {paymentClause && (
            <p><span className="font-bold">CLÁUSULA 2 - DA FORMA DE PAGAMENTO</span><br/>
            {boldenContractTerms(paymentClause, permutaTerms)}</p>
        )}

        <p><span className="font-bold">CLÁUSULA {paymentClause ? '3' : '2'} - DAS CONDIÇÕES</span><br/>
        {boldenContractTerms(conditions, permutaTerms) || '________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________'}</p>

        <p><span className="font-bold">CLÁUSULA {paymentClause ? '4' : '3'} - DA TRANSFERÊNCIA DE PROPRIEDADE</span><br/>
        {boldenContractTerms(transferClause, permutaTerms) || '________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________'}</p>

        {generalDispositions && (
            <p><span className="font-bold">CLÁUSULA {paymentClause ? '5' : '4'} - DAS DISPOSIÇÕES GERAIS</span><br/>
            {boldenContractTerms(generalDispositions, permutaTerms)}</p>
        )}

        <p><span className="font-bold">CLÁUSULA {paymentClause ? (generalDispositions ? '6' : '5') : (generalDispositions ? '5' : '4')} - DO FORO</span><br/>
        Para dirimir eventuais dúvidas ou conflitos oriundos deste contrato, as partes elegem o foro da comarca de {foro || '___________________'}.</p>
      </div>

      <p className="mt-8 mb-8">E, por estarem assim justos e contratados, firmam o presente instrumento em duas vias de igual teor.</p>
      
      <div className="mt-12 space-y-10">
        <p className="text-center">__________________________________________<br/>{permutante.name || 'PERMUTANTE'}</p>
        <p className="text-center">__________________________________________<br/>{companyInfo.name || 'PERMUTADO'}</p>
      </div>

      <p className="mt-12 text-right">{contractCity || '___________________'}, {contractFullDate || '___________________'}.</p>

    </div>
  );
};

const ServiceVideoPreview: React.FC<{ contractData: ServiceVideoContractData, companyInfo: CompanyInfo }> = ({ contractData, companyInfo }) => {
  const {
    contractTitle,
    contratantes, 
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
  const serviceTerms = ["CONTRATANTE", "CONTRATADA"];
  
  let rescissionNoticePeriodInWords = "";
  if (rescissionNoticePeriodDays && !isNaN(parseInt(rescissionNoticePeriodDays))) {
      rescissionNoticePeriodInWords = converterInteiroParaExtensoPTBR(parseInt(rescissionNoticePeriodDays));
  }

  let rescissionPenaltyInWords = "";
  if (rescissionPenaltyPercentage && !isNaN(parseFloat(rescissionPenaltyPercentage))) {
     rescissionPenaltyInWords = converterInteiroParaExtensoPTBR(parseFloat(rescissionPenaltyPercentage));
  }

  let paymentDescription = '';
  if (paymentType === 'vista') {
    paymentDescription = 'À vista na assinatura deste contrato.';
  } else if (paymentType === 'sinal_entrega') {
    paymentDescription = `${sinalValuePercentage || '50'}% na assinatura e ${100 - (parseFloat(sinalValuePercentage || '50'))}% na entrega dos vídeos.`;
  } else if (paymentType === 'outro') {
    paymentDescription = paymentOutroDescription || 'Conforme especificado pelas partes.';
  }

  const renderList = (text: string = '', termsToBold: string[]) => {
    return text.split('\n').map((item, index) => {
      const trimmedItem = item.trim();
      return trimmedItem ? <li key={index}>{boldenContractTerms(trimmedItem, termsToBold)}</li> : null;
    }).filter(Boolean);
  };

  return (
    <div className="text-sm leading-relaxed" style={{ fontFamily: 'Arial, Helvetica, sans-serif', color: '#333' }}>
      <h1 className="text-center font-bold text-lg mb-6 uppercase">{contractTitle || "CONTRATO DE PRESTAÇÃO DE SERVIÇOS"}</h1>

      {contratantes.map((contratante, index) => (
        <PartyDetails key={contratante.id || index} party={contratante} title="CONTRATANTE" index={contratantes.length > 1 ? index : undefined} />
      ))}
      <CompanyAsPartyDetails companyInfo={companyInfo} title="CONTRATADA" />

      <p className="mb-4"><span className="font-bold">OBJETO DO CONTRATO:</span><br/>
      A <strong>CONTRATADA</strong> prestará ao(s) <strong>CONTRATANTE</strong>{contratantes.length > 1 ? '(S)' : ''} os serviços de {objectDescription || '___________________'}.
      </p>

      <p className="mb-4"><span className="font-bold">VALOR E FORMA DE PAGAMENTO:</span><br/>
      O valor total pelos serviços é de {totalValueFormatted}{totalValueInWords ? ` ${totalValueInWords}` : ''}, a ser pago da seguinte forma:<br/>
      {boldenContractTerms(paymentDescription, serviceTerms)}</p>

      <p className="mb-4"><span className="font-bold">PRAZO DE ENTREGA:</span><br/>
      {deliveryDeadline || '___________________'}</p>

      <p className="mb-2 font-bold">RESPONSABILIDADES DA CONTRATADA:</p>
      <ul className="list-disc list-inside mb-4 ml-4">
        {renderList(responsibilitiesContratada, serviceTerms)}
        {!responsibilitiesContratada?.trim() && <li>___________________</li>}
      </ul>

      <p className="mb-2 font-bold">RESPONSABILIDADES DO(S) CONTRATANTE(S):</p>
      <ul className="list-disc list-inside mb-4 ml-4">
        {renderList(responsibilitiesContratante, serviceTerms)}
        {!responsibilitiesContratante?.trim() && <li>___________________</li>}
      </ul>

      <p className="mb-4"><span className="font-bold">DIREITOS AUTORAIS:</span><br/>
      {boldenContractTerms(copyrightClause, serviceTerms) || '___________________'}</p>

      <p className="mb-4"><span className="font-bold">RESCISÃO:</span><br/>
      {boldenContractTerms(`O contrato poderá ser rescindido por qualquer das partes mediante aviso prévio de ${rescissionNoticePeriodDays || '__'} (${rescissionNoticePeriodInWords || '______'}) dias. Em caso de rescisão sem justa causa, a parte que der causa pagará à outra uma multa de ${rescissionPenaltyPercentage || '__'}% (${rescissionPenaltyInWords || '______ por cento'}) sobre o valor do contrato.`, serviceTerms)}
      </p>

      {generalDispositions && (
        <p className="mb-4"><span className="font-bold">DISPOSIÇÕES GERAIS:</span><br/>
        {boldenContractTerms(generalDispositions, serviceTerms)}</p>
      )}

      <p className="mb-4"><span className="font-bold">FORO:</span><br/>
      As partes elegem o foro da comarca de {foro || '___________________'} para dirimir eventuais dúvidas ou conflitos oriundos deste contrato.</p>

      <p className="mt-8 mb-8">E, por estarem assim justos e contratados, firmam o presente instrumento em duas vias de igual teor.</p>

      <div className="mt-12 space-y-10">
        {contratantes.length === 1 && contratantes[0] && (
            <p className="text-center">__________________________________________<br/>{contratantes[0].name || 'CONTRATANTE'}</p>
        )}
        {contratantes.length > 1 && (
            <>
                <p className="text-center font-semibold">CONTRATANTES:</p>
                {contratantes.map((contratante, index) => (
                    <p key={contratante.id || index} className="text-center mt-2">__________________________________________<br/>{contratante.name || `CONTRATANTE ${index + 1}`}</p>
                ))}
            </>
        )}
        <p className="text-center">__________________________________________<br/>{companyInfo.name || 'CONTRATADA'}</p>
      </div>

      <p className="mt-12 text-right">{contractCity || '___________________'}, {contractFullDate || '___________________'}.</p>

    </div>
  );
};


const ContractPreview: React.FC<{ data: AnyContractData | null, companyInfo: CompanyInfo }> = ({ data, companyInfo }) => {
  if (!data) {
    return (
      <div className="p-6 text-center text-gray-500 flex flex-col items-center justify-center min-h-[300px] bg-white">
        <FileText className="h-16 w-16 mb-4 text-gray-400" />
        <p className="text-lg">Nenhum contrato selecionado ou dados preenchidos.</p>
        <p className="text-sm">Escolha um tipo de contrato e preencha o formulário.</p>
      </div>
    );
  }

  return (
    <div id="contract-preview-content" className="bg-white p-8 text-black print:shadow-none print:border-none">
      {data.contractType === 'PERMUTA_EQUIPMENT_SERVICE' && (
        <PermutaEquipmentServicePreview contractData={data as PermutaEquipmentServiceContractData} companyInfo={companyInfo} />
      )}
      {data.contractType === 'SERVICE_VIDEO' && (
        <ServiceVideoPreview contractData={data as ServiceVideoContractData} companyInfo={companyInfo} />
      )}
      {(data.contractType !== 'PERMUTA_EQUIPMENT_SERVICE' && data.contractType !== 'SERVICE_VIDEO') && (
        <p>Pré-visualização para este tipo de contrato ainda não implementada.</p>
      )}
    </div>
  );
};

export default ContractPreview;
