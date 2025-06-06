
"use client";

import React from 'react';
import type { AnyContractData, PermutaEquipmentServiceContractData, ServiceVideoContractData, ContractParty, FreelanceFilmmakerContractData, FreelancerMaterialAuthorizationData } from '@/types/contract';
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
    
    if (n >= 1000000000000) { // Trilhão
        const trilhao = Math.floor(n / 1000000000000);
        extenso += (trilhao === 1 ? "um trilhão" : converterInteiroParaExtensoPTBR(trilhao) + " trilhões");
        n %= 1000000000000;
        if (n > 0) extenso += (n < 100 || n % 100 === 0 ? " e " : ", ");
    }

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
    
    let cleanedExtenso = extenso.trim();
    if (cleanedExtenso.endsWith(" e")) {
        cleanedExtenso = cleanedExtenso.substring(0, cleanedExtenso.length - 2);
    }
    if (cleanedExtenso.endsWith(",")) {
        cleanedExtenso = cleanedExtenso.substring(0, cleanedExtenso.length - 1);
    }
    
    return cleanedExtenso.trim();
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
      const unidadeMoeda = (integerPart === 1 && !extensoInteiro.includes("mil") && !extensoInteiro.includes("milhão") && !extensoInteiro.includes("bilhão") && !extensoInteiro.includes("trilhão") ) ? "real" : "reais";
      extensoFinal = `${extensoInteiro} ${unidadeMoeda}`;
    }

    if (decimalPart > 0) {
        const extensoDecimal = converterInteiroParaExtensoPTBR(decimalPart);
        const unidadeCentavos = decimalPart === 1 ? "centavo" : "centavos";
        if (extensoFinal && extensoFinal !== "zero reais") { 
             extensoFinal += ` e ${extensoDecimal} ${unidadeCentavos}`;
        } else if (extensoFinal === "zero reais" && decimalPart > 0) {
            extensoFinal = `${extensoDecimal} ${unidadeCentavos}`;
        }
         else { 
            extensoFinal = `${extensoDecimal} ${unidadeCentavos}`;
        }
    }

    if (!extensoFinal && integerPart === 0 && decimalPart === 0) { 
        extensoFinal = "Zero reais";
    }

    if (extensoFinal) {
      extensoFinal = extensoFinal.charAt(0).toUpperCase() + extensoFinal.slice(1);
      return ` (${extensoFinal})`;
    }
    return "";
};
// --- Fim da Lógica para Conversão de Número para Extenso em PT-BR ---

// Helper function to bolden specific terms in a text
const boldenContractTerms = (text: string | undefined, termsToBold: string[]): React.ReactNode[] => {
  if (!text) return [<React.Fragment key="empty"></React.Fragment>];
  if (termsToBold.length === 0) return [text];

  // Escape special characters in terms for regex
  const escapedTerms = termsToBold.map(term => term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  // Create a regex that matches any of the terms, case-insensitively, and ensures word boundaries
  // for more precise matching (e.g., doesn't match "CONTRATANTE" inside "CONTRATANTES").
  const regex = new RegExp(`\\b(${escapedTerms.join('|')})\\b`, 'gi');
  const parts = text.split(regex);

  return parts.map((part, index) => {
    if (termsToBold.some(term => term.toLowerCase() === part.toLowerCase())) {
      return <strong key={index}>{part}</strong>;
    }
    return part;
  }).filter(part => part !== '');
};


const PartyDetails: React.FC<{ party: ContractParty, title: string, index?: number }> = ({ party, title, index }) => (
  <div className="mb-4">
    <p className="font-semibold">{title}{typeof index === 'number' ? ` ${index + 1}` : ''}:</p>
    <p><strong className="font-bold">NOME:</strong> {party.name || '____________________________________________'}</p>
    <p><strong className="font-bold">CPF/CNPJ:</strong> {party.cpfCnpj || '____________________________________________'}</p>
    <p><strong className="font-bold">ENDEREÇO:</strong> {party.address || '____________________________________________'}</p>
    <p><strong className="font-bold">E-MAIL:</strong> {party.email || '____________________________________________'}</p>
  </div>
);

const CompanyAsPartyDetails: React.FC<{ companyInfo: CompanyInfo, title: string, cnpj?: string, sede?: string }> = ({ companyInfo, title, cnpj, sede }) => (
 <div className="mb-6">
    <p className="font-semibold">{title}:</p>
    <p><strong className="font-bold">NOME:</strong> {companyInfo.name}</p>
    <p><strong className="font-bold">CNPJ:</strong> {cnpj || '53.525.841/0001-89'}</p>
    <p><strong className="font-bold">ENDEREÇO / SEDE:</strong> {sede || companyInfo.address}</p>
    <p><strong className="font-bold">E-MAIL:</strong> {companyInfo.email}</p>
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

  const permutaTerms = ["PERMUTANTE", "PERMUTADO", "CONTRATO DE PERMUTA DE EQUIPAMENTO POR PRESTAÇÃO DE SERVIÇOS"];
  const equipmentValueFormatted = formatCurrency(equipmentValue);
  const equipmentValueInWords = numberToWords(equipmentValue);
  
  let clauseNumber = 1;

  return (
    <div className="text-sm leading-relaxed" style={{ fontFamily: 'Arial, Helvetica, sans-serif', color: '#333' }}>
      <h1 className="text-center font-bold text-lg mb-6 uppercase">{boldenContractTerms(contractTitle, permutaTerms)}</h1>

      <div style={{ pageBreakInside: 'avoid' }}>
        <p className="mb-4">Pelo presente instrumento particular, as partes abaixo identificadas:</p>
        <PartyDetails party={permutante} title="PERMUTANTE (Cede o equipamento e recebe os serviços)" />
        <CompanyAsPartyDetails companyInfo={companyInfo} title="PERMUTADO (Recebe o equipamento e presta os serviços)" />
        <p className="mb-6">têm, entre si, justo e contratado o presente {boldenContractTerms(contractTitle?.toUpperCase(), permutaTerms)}, que se regerá pelas cláusulas e condições seguintes:</p>
      </div>
      

      <div className="space-y-3">
        <div style={{ pageBreakInside: 'avoid' }}>
            <p><strong className="font-bold">CLÁUSULA {clauseNumber++} - DO OBJETO</strong><br/>
            {boldenContractTerms(`O presente contrato tem como objeto a permuta de ${equipmentDescription}, de propriedade do PERMUTANTE, avaliada em ${equipmentValueFormatted}${equipmentValueInWords}, pelo serviço de ${serviceDescription} a ser prestado pelo PERMUTADO.`, permutaTerms)}
            </p>
        </div>

        {paymentClause && paymentClause.trim() !== '' && (
            <div style={{ pageBreakInside: 'avoid' }}>
                <p><strong className="font-bold">CLÁUSULA {clauseNumber++} - DA FORMA DE PAGAMENTO</strong><br/>
                {boldenContractTerms(paymentClause, permutaTerms)}</p>
            </div>
        )}

        <div style={{ pageBreakInside: 'avoid' }}>
            <p><strong className="font-bold">CLÁUSULA {clauseNumber++} - DAS CONDIÇÕES</strong><br/>
            {boldenContractTerms(conditions, permutaTerms)}</p>
        </div>
        
        <div style={{ pageBreakInside: 'avoid' }}>
            <p><strong className="font-bold">CLÁUSULA {clauseNumber++} - DA TRANSFERÊNCIA DE PROPRIEDADE</strong><br/>
            {boldenContractTerms(transferClause, permutaTerms)}</p>
        </div>

        {generalDispositions && generalDispositions.trim() !== '' && (
            <div style={{ pageBreakInside: 'avoid' }}>
                <p><strong className="font-bold">CLÁUSULA {clauseNumber++} - DAS DISPOSIÇÕES GERAIS</strong><br/>
                {boldenContractTerms(generalDispositions, permutaTerms)}</p>
            </div>
        )}
        
        <div style={{ pageBreakInside: 'avoid' }}>
            <p><strong className="font-bold">CLÁUSULA {clauseNumber++} - DO FORO</strong><br/>
            {boldenContractTerms(`Para dirimir eventuais dúvidas ou conflitos oriundos deste contrato, as partes elegem o foro da comarca de ${foro}.`, permutaTerms)}
            </p>
        </div>
      </div>
      
      <div>
        <p className="mt-8 mb-8">E, por estarem assim justos e contratados, firmam o presente instrumento em duas vias de igual teor.</p>
        
        <div className="mt-12 space-y-10">
          <p className="text-center">__________________________________________<br/>{permutante.name || 'PERMUTANTE'}</p>
          <p className="text-center">__________________________________________<br/>{companyInfo.name || 'PERMUTADO'}</p>
        </div>

        <p className="mt-12 text-right">{contractCity || '___________________'}, {contractFullDate || '___________________'}.</p>
      </div>
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

  const serviceTerms = ["CONTRATANTE", "CONTRATADA", "CONTRATANTES", "CONTRATO DE PRESTAÇÃO DE SERVIÇOS DE GRAVAÇÃO E EDIÇÃO DE VÍDEOS"]; 
  const totalValueFormatted = formatCurrency(totalValue);
  const totalValueInWords = numberToWords(totalValue);
  
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
      return trimmedItem ? <li key={index} className="mb-1">{boldenContractTerms(trimmedItem, termsToBold)}</li> : null;
    }).filter(Boolean);
  };

  return (
    <div className="text-sm leading-relaxed" style={{ fontFamily: 'Arial, Helvetica, sans-serif', color: '#333' }}>
      <h1 className="text-center font-bold text-lg mb-6 uppercase">{boldenContractTerms(contractTitle, serviceTerms)}</h1>

      <div style={{ pageBreakInside: 'avoid' }}>
        {contratantes.map((contratante, index) => (
          <PartyDetails key={contratante.id || index} party={contratante} title="CONTRATANTE" index={contratantes.length > 1 ? index : undefined} />
        ))}
        <CompanyAsPartyDetails companyInfo={companyInfo} title="CONTRATADA" />
      </div>

      <div style={{ pageBreakInside: 'avoid' }}>
        <p className="mb-4"><strong className="font-bold">OBJETO DO CONTRATO:</strong><br/>
        {boldenContractTerms(objectDescription, serviceTerms)}
        </p>
      </div>

      <div style={{ pageBreakInside: 'avoid' }}>
        <p className="mb-4"><strong className="font-bold">VALOR E FORMA DE PAGAMENTO:</strong><br/>
        {boldenContractTerms(`O valor total pelos serviços é de ${totalValueFormatted}${totalValueInWords}, a ser pago da seguinte forma: ${paymentDescription}`, serviceTerms)}
        </p>
      </div>
      
      <div style={{ pageBreakInside: 'avoid' }}>
        <p className="mb-4"><strong className="font-bold">PRAZO DE ENTREGA:</strong><br/>
        {boldenContractTerms(deliveryDeadline, serviceTerms)}</p>
      </div>

      <div style={{ pageBreakInside: 'avoid' }}>
        <p className="mb-2 font-bold">RESPONSABILIDADES DA CONTRATADA:</p>
        <ul className="list-disc list-inside ml-4 mb-4">
            {renderList(responsibilitiesContratada, serviceTerms)}
            {!responsibilitiesContratada?.trim() && <li>___________________</li>}
        </ul>
      </div>
      
      <div style={{ pageBreakInside: 'avoid' }}>
        <p className="mb-2 font-bold">RESPONSABILIDADES DO(S) CONTRATANTE(S):</p>
        <ul className="list-disc list-inside mb-4 ml-4">
            {renderList(responsibilitiesContratante, serviceTerms)}
            {!responsibilitiesContratante?.trim() && <li>___________________</li>}
        </ul>
      </div>

      <div style={{ pageBreakInside: 'avoid' }}>
        <p className="mb-4"><strong className="font-bold">DIREITOS AUTORAIS:</strong><br/>
        {boldenContractTerms(copyrightClause, serviceTerms)}</p>
      </div>

      <div style={{ pageBreakInside: 'avoid' }}>
        <p className="mb-4"><strong className="font-bold">RESCISÃO:</strong><br/>
        {boldenContractTerms(`O contrato poderá ser rescindido por qualquer das partes mediante aviso prévio de ${rescissionNoticePeriodDays || '__'} (${rescissionNoticePeriodInWords || '______'}) dias. Em caso de rescisão sem justa causa, a parte que der causa pagará à outra uma multa de ${rescissionPenaltyPercentage || '__'}% (${rescissionPenaltyInWords || '______ por cento'}) sobre o valor do contrato.`, serviceTerms)}
        </p>
      </div>

      {generalDispositions && generalDispositions.trim() !== '' && (
        <div style={{ pageBreakInside: 'avoid' }}>
            <p className="mb-4"><strong className="font-bold">DISPOSIÇÕES GERAIS:</strong><br/>
            {boldenContractTerms(generalDispositions, serviceTerms)}</p>
        </div>
      )}

      <div style={{ pageBreakInside: 'avoid' }}>
        <p className="mb-4"><strong className="font-bold">FORO:</strong><br/>
        {boldenContractTerms(`As partes elegem o foro da comarca de ${foro} para dirimir eventuais dúvidas ou conflitos oriundos deste contrato.`, serviceTerms)}</p>
      </div>

      <div>
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
    </div>
  );
};

const FreelanceFilmmakerPreview: React.FC<{ contractData: FreelanceFilmmakerContractData, companyInfo: CompanyInfo }> = ({ contractData, companyInfo }) => {
  const {
    contractTitle,
    contratado,
    remunerationValue,
    remunerationUnit,
    paymentMethodDescription,
    deliveryDeadlineDetails,
    equipmentDetails,
    confidentialityBreachPenaltyValue,
    rescissionNoticeDays,
    unjustifiedRescissionPenaltyPercentage,
    foro,
    contractCity,
    contractFullDate,
  } = contractData;

  const freelanceTerms = ["CONTRATANTE", "CONTRATADO", "CONTRATO DE PRESTAÇÃO DE SERVIÇOS FREELANCER PARA CAPTAÇÃO DE VÍDEO"];
  const remunerationValueFormatted = formatCurrency(remunerationValue);
  const remunerationValueInWords = numberToWords(remunerationValue);
  const confidentialityPenaltyFormatted = formatCurrency(confidentialityBreachPenaltyValue);
  const confidentialityPenaltyInWords = numberToWords(confidentialityBreachPenaltyValue);
  const rescissionNoticeDaysInWords = rescissionNoticeDays ? converterInteiroParaExtensoPTBR(parseInt(rescissionNoticeDays)) : '______';
  
  return (
    <div className="text-sm leading-relaxed" style={{ fontFamily: 'Arial, Helvetica, sans-serif', color: '#333' }}>
      <h1 className="text-center font-bold text-lg mb-6 uppercase">{boldenContractTerms(contractTitle, freelanceTerms)}</h1>

      <div style={{ pageBreakInside: 'avoid' }}>
        <CompanyAsPartyDetails companyInfo={companyInfo} title="CONTRATANTE" />
        <PartyDetails party={contratado} title="CONTRATADO" />
      </div>
      

      <div style={{ pageBreakInside: 'avoid' }}>
        <p className="mb-4"><strong className="font-bold">CLÁUSULA 1 – DO OBJETO</strong></p>
        <p className="mb-1">{boldenContractTerms('1.1. O presente contrato tem como objeto a prestação de serviços de captação de vídeo, conforme demandas da CONTRATANTE, incluindo, mas não se limitando a:', freelanceTerms)}</p>
        <ul className="list-disc list-inside ml-4 mb-4">
            <li>{boldenContractTerms('Gravação de eventos, cenas externas ou internas;', freelanceTerms)}</li>
            <li>{boldenContractTerms('Operação de câmeras e equipamentos fornecidos;', freelanceTerms)}</li>
            <li>{boldenContractTerms('Cumprimento do roteiro e direção pré-estabelecida.', freelanceTerms)}</li>
        </ul>
      </div>

      <div style={{ pageBreakInside: 'avoid' }}>
        <p className="mb-4"><strong className="font-bold">CLÁUSULA 2 – DA NATUREZA DO VÍNCULO</strong></p>
        <p className="mb-4">{boldenContractTerms('2.1. Este contrato não estabelece vínculo empregatício entre as partes, sendo o CONTRATADO responsável por seus encargos tributários, previdenciários, trabalhistas e civis.', freelanceTerms)}</p>
      </div>
      
      <div style={{ pageBreakInside: 'avoid' }}>
        <p className="mb-4"><strong className="font-bold">CLÁUSULA 3 – DA REMUNERAÇÃO</strong></p>
        <p className="mb-1">{boldenContractTerms(`3.1. O CONTRATADO receberá o valor de ${remunerationValueFormatted}${remunerationValueInWords} por ${remunerationUnit}, conforme acordado previamente entre as partes.`, freelanceTerms)}</p>
        <p className="mb-1">{boldenContractTerms('3.2. A CONTRATANTE realiza seus pagamentos mediante sinal de 50% do valor contratado junto ao cliente e os 50% restantes na entrega final. O CONTRATADO somente fará jus ao pagamento após a entrega e aceitação do projeto pelo cliente da CONTRATANTE, no qual o CONTRATADO tenha efetivamente prestado os serviços.', freelanceTerms)}</p>
        <div style={{ pageBreakBefore: 'always' }}>
          <p className="mb-4">{boldenContractTerms(`3.3. ${paymentMethodDescription}`, freelanceTerms)}</p>
        </div>
      </div>

      <div style={{ pageBreakInside: 'avoid' }}>
        <p className="mb-4"><strong className="font-bold">CLÁUSULA 4 – DOS PRAZOS E ENTREGAS</strong></p>
        <p className="mb-1">{boldenContractTerms(`4.1. ${deliveryDeadlineDetails}`, freelanceTerms)}</p>
        <p className="mb-4">{boldenContractTerms('4.2. A não entrega dentro do prazo sem justificativa plausível implicará multa de 20% sobre o valor do serviço e possível rescisão contratual.', freelanceTerms)}</p>
      </div>

      <div style={{ pageBreakInside: 'avoid' }}>
        <p className="mb-4"><strong className="font-bold">CLÁUSULA 5 – DOS EQUIPAMENTOS</strong></p>
        <p className="mb-1">{boldenContractTerms(`5.1. ${equipmentDetails}`, freelanceTerms)}</p>
        <p className="mb-4">{boldenContractTerms('5.2. Em caso de dano, extravio ou mau uso de equipamento fornecido pela CONTRATANTE, o CONTRATADO se compromete a ressarcir integralmente o valor de mercado do item afetado.', freelanceTerms)}</p>
      </div>

      <div style={{ pageBreakInside: 'avoid' }}>
        <p className="mb-4"><strong className="font-bold">CLÁUSULA 6 – DOS DIREITOS AUTORAIS E DE IMAGEM</strong></p>
        <p className="mb-1">{boldenContractTerms('6.1. Todo o material captado durante os serviços prestados será de propriedade integral e irrevogável da CONTRATANTE.', freelanceTerms)}</p>
        <p className="mb-4">{boldenContractTerms('6.2. O CONTRATADO cede, de forma gratuita, definitiva e irretratável, todos os direitos autorais patrimoniais sobre o material captado, não podendo utilizá-lo em portfólios, redes sociais ou fins pessoais sem autorização por escrito da CONTRATANTE.', freelanceTerms)}</p>
      </div>

      <div style={{ pageBreakInside: 'avoid' }}>
        <p className="mb-4"><strong className="font-bold">CLÁUSULA 7 – DA CONFIDENCIALIDADE</strong></p>
        <p className="mb-1">{boldenContractTerms('7.1. O CONTRATADO compromete-se a manter sigilo absoluto sobre informações, roteiros, imagens e quaisquer dados da CONTRATANTE ou de seus clientes, sendo vedada a divulgação ou compartilhamento sob qualquer forma.', freelanceTerms)}</p>
        <p className="mb-4">{boldenContractTerms(`7.2. Em caso de quebra de confidencialidade, será aplicada multa de ${confidentialityPenaltyFormatted}${confidentialityPenaltyInWords}, sem prejuízo de eventuais indenizações por perdas e danos.`, freelanceTerms)}</p>
      </div>

      <div style={{ pageBreakInside: 'avoid' }}>
        <p className="mb-4"><strong className="font-bold">CLÁUSULA 8 – DAS PENALIDADES</strong></p>
        <p className="mb-1">{boldenContractTerms('8.1. O não cumprimento das obrigações previstas neste contrato sujeitará o CONTRATADO às seguintes penalidades:', freelanceTerms)}</p>
        <ul className="list-disc list-inside ml-4 mb-4">
            <li>{boldenContractTerms('Advertência formal;', freelanceTerms)}</li>
            <li>{boldenContractTerms('Multa de até 50% do valor acordado;', freelanceTerms)}</li>
            <li>{boldenContractTerms('Rescisão imediata do contrato;', freelanceTerms)}</li>
            <li>{boldenContractTerms('Responsabilização cível e criminal, conforme o caso.', freelanceTerms)}</li>
        </ul>
      </div>

      <div style={{ pageBreakInside: 'avoid' }}>
        <p className="mb-4"><strong className="font-bold">CLÁUSULA 9 – DA RESCISÃO</strong></p>
        <p className="mb-1">{boldenContractTerms(`9.1. O contrato poderá ser rescindido por qualquer das partes mediante aviso prévio de ${rescissionNoticeDays} (${rescissionNoticeDaysInWords}) dias corridos.`, freelanceTerms)}</p>
        <p className="mb-4">{boldenContractTerms(`9.2. Em caso de rescisão sem justificativa após aceite formal de um serviço, o CONTRATADO deverá arcar com multa equivalente a ${unjustifiedRescissionPenaltyPercentage}% do valor do serviço acordado.`, freelanceTerms)}</p>
      </div>

      <div style={{ pageBreakInside: 'avoid' }}>
        <p className="mb-4"><strong className="font-bold">CLÁUSULA 10 – DO FORO</strong></p>
        <p className="mb-4">{boldenContractTerms(`10.1. Para dirimir quaisquer dúvidas oriundas deste contrato, as partes elegem o foro da comarca de ${foro}, com renúncia a qualquer outro, por mais privilegiado que seja.`, freelanceTerms)}</p>
      </div>

      <div>
        <p className="mt-8 mb-8">E por estarem assim justas e contratadas, firmam o presente instrumento em duas vias de igual teor.</p>

        <div className="mt-12 space-y-10">
          <p className="text-center">__________________________________________<br/>{companyInfo.name || 'CONTRATANTE'}<br/>(CONTRATANTE)</p>
          <p className="text-center">__________________________________________<br/>{contratado.name || 'CONTRATADO'}<br/>(CONTRATADO)</p>
        </div>
        
        <p className="mt-12 text-right">{contractCity || '___________________'}, {contractFullDate || '___________________'}.</p>
      </div>
    </div>
  );
};

const FreelancerMaterialAuthorizationPreview: React.FC<{ contractData: FreelancerMaterialAuthorizationData, companyInfo: CompanyInfo }> = ({ contractData, companyInfo }) => {
  const {
    contractTitle,
    autorizado,
    projectName,
    finalClientName,
    executionDate,
    authorizedLinks,
    penaltyValue,
    foro,
    contractCity,
    contractFullDate,
  } = contractData;

  const authTerms = ["AUTORIZANTE", "AUTORIZADO(A)", "AUTORIZADO", "TERMO DE AUTORIZAÇÃO ESPECÍFICA DE USO DE MATERIAL – FREELANCER"];
  const penaltyValueFormatted = formatCurrency(penaltyValue);
  const penaltyValueInWords = numberToWords(penaltyValue);
  
  return (
    <div className="text-sm leading-relaxed" style={{ fontFamily: 'Arial, Helvetica, sans-serif', color: '#333' }}>
      <h1 className="text-center font-bold text-lg mb-6 uppercase">{boldenContractTerms(contractTitle, authTerms)}</h1>

      <div style={{ pageBreakInside: 'avoid' }}>
        <CompanyAsPartyDetails 
            companyInfo={companyInfo} 
            title="AUTORIZANTE" 
            cnpj={companyInfo.cnpj || 'N/A'} // Assuming companyInfo might have cnpj
            sede={companyInfo.address}
        />
        <PartyDetails party={autorizado} title="AUTORIZADO(A)" />
        <p className="mb-6">firmam o presente {boldenContractTerms(contractTitle?.toUpperCase(), authTerms)}, mediante as cláusulas seguintes:</p>
      </div>
      
      <div className="space-y-3">
        <div style={{ pageBreakInside: 'avoid' }}>
            <p className="mb-1"><strong className="font-bold">CLÁUSULA 1 – DO OBJETO</strong></p>
            <p className="mb-1">{boldenContractTerms('1.1. Este termo trata da autorização exclusiva e pontual para o uso de material audiovisual captado pelo AUTORIZADO(A) no projeto abaixo identificado:', authTerms)}</p>
            <ul className="list-none ml-4 mb-2">
                <li><strong className="font-bold">Projeto:</strong> {projectName || '____________________________________________'}</li>
                <li><strong className="font-bold">Cliente final:</strong> {finalClientName || '____________________________________________'}</li>
                <li><strong className="font-bold">Data de execução:</strong> {executionDate || '____________________________________________'}</li>
                <li><strong className="font-bold">Link(s) autorizado(s):</strong> {authorizedLinks || '____________________________________________'}</li>
            </ul>
            <p>{boldenContractTerms('1.2. A presente autorização é limitada a este único projeto, e não se estende automaticamente a outros trabalhos executados para a AUTORIZANTE.', authTerms)}</p>
        </div>

        <div style={{ pageBreakInside: 'avoid' }}>
            <p className="mb-1"><strong className="font-bold">CLÁUSULA 2 – FINALIDADE E LIMITAÇÕES DE USO</strong></p>
            <p className="mb-1">{boldenContractTerms('2.1. O material descrito na Cláusula 1 poderá ser utilizado exclusivamente para fins de portfólio pessoal ou currículo profissional, em:', authTerms)}</p>
            <ul className="list-disc list-inside ml-8 mb-2">
                <li>{boldenContractTerms('Sites pessoais, plataformas de portfólio;', authTerms)}</li>
                <li>{boldenContractTerms('Redes sociais de uso profissional (LinkedIn, Instagram, Vimeo etc.);', authTerms)}</li>
                <li>{boldenContractTerms('Apresentações a clientes ou contratantes.', authTerms)}</li>
            </ul>
            <p className="mb-1">{boldenContractTerms('2.2. É vedado:', authTerms)}</p>
            <ul className="list-disc list-inside ml-8 mb-2">
                <li>{boldenContractTerms('Monetizar ou veicular o conteúdo em campanhas publicitárias;', authTerms)}</li>
                <li>{boldenContractTerms('Utilizar imagens com pessoas identificáveis sem autorização expressa destas;', authTerms)}</li>
                <li>{boldenContractTerms('Fazer edições que distorçam o trabalho, a identidade visual ou a marca do projeto;', authTerms)}</li>
                <li>{boldenContractTerms('Sugerir que o projeto foi realizado exclusivamente pelo AUTORIZADO(A), sem citar a FastFilms.', authTerms)}</li>
            </ul>
            <p>{boldenContractTerms('2.3. O material deve conter o crédito à FastFilms como produtora do projeto.', authTerms)}</p>
        </div>

        <div style={{ pageBreakInside: 'avoid' }}>
            <p className="mb-1"><strong className="font-bold">CLÁUSULA 3 – VIGÊNCIA E REVOGAÇÃO</strong></p>
            <p>{boldenContractTerms('3.1. Esta autorização entra em vigor na data da assinatura e é válida por tempo indeterminado, podendo ser revogada a qualquer tempo pela AUTORIZANTE, mediante aviso prévio de 5 (cinco) dias.', authTerms)}</p>
        </div>
        
        <div style={{ pageBreakInside: 'avoid' }}>
            <p className="mb-1"><strong className="font-bold">CLÁUSULA 4 – DAS PENALIDADES</strong></p>
            <p className="mb-1">{boldenContractTerms(`4.1. O uso indevido ou o descumprimento deste termo sujeitará o AUTORIZADO(A) às seguintes penalidades:`, authTerms)}</p>
            <ul className="list-disc list-inside ml-8 mb-2">
                <li>{boldenContractTerms('Cancelamento imediato da autorização;', authTerms)}</li>
                <li>{boldenContractTerms(`Multa de ${penaltyValueFormatted}${penaltyValueInWords};`, authTerms)}</li>
                <li>{boldenContractTerms('Eventual responsabilização cível e criminal.', authTerms)}</li>
            </ul>
        </div>
        
        <div style={{ pageBreakInside: 'avoid' }}>
            <p><strong className="font-bold">CLÁUSULA 5 – DO FORO</strong><br/>
            {boldenContractTerms(`5.1. Para dirimir quaisquer controvérsias oriundas deste termo, as partes elegem o foro da comarca de ${foro}, com renúncia a qualquer outro, por mais privilegiado que seja.`, authTerms)}
            </p>
        </div>
      </div>
      
      <div>
        <p className="mt-8 mb-8">E, por estarem assim justos e contratados, firmam o presente instrumento em duas vias de igual teor.</p>
        
        <div className="mt-12 space-y-10">
          <p className="text-center">__________________________________________<br/>{companyInfo.name || 'AUTORIZANTE'}<br/>(AUTORIZANTE)</p>
          <p className="text-center">__________________________________________<br/>{autorizado.name || 'AUTORIZADO(A)'}<br/>(AUTORIZADO(A))</p>
        </div>
        
        <p className="mt-12 text-right">{contractCity || '___________________'}, {contractFullDate || '___________________'}.</p>
      </div>
    </div>
  );
};


const ContractPreview: React.FC<{ data: AnyContractData | null, companyInfo: CompanyInfo }> = ({ data, companyInfo }) => {
  if (!data) {
    return (
      <div className="text-center text-gray-500 flex flex-col items-center justify-center min-h-[300px] bg-white">
        <FileText className="h-16 w-16 mb-4 text-gray-400" />
        <p className="text-lg">Nenhum contrato selecionado ou dados preenchidos.</p>
        <p className="text-sm">Escolha um tipo de contrato e preencha o formulário.</p>
      </div>
    );
  }

  return (
    <div id="contract-preview-content" className="bg-white text-black print:shadow-none print:border-none">
      {data.contractType === 'PERMUTA_EQUIPMENT_SERVICE' && (
        <PermutaEquipmentServicePreview contractData={data as PermutaEquipmentServiceContractData} companyInfo={companyInfo} />
      )}
      {data.contractType === 'SERVICE_VIDEO' && (
        <ServiceVideoPreview contractData={data as ServiceVideoContractData} companyInfo={companyInfo} />
      )}
      {data.contractType === 'FREELANCE_HIRE_FILMMAKER' && (
        <FreelanceFilmmakerPreview contractData={data as FreelanceFilmmakerContractData} companyInfo={companyInfo} />
      )}
      {data.contractType === 'FREELANCER_MATERIAL_AUTHORIZATION' && (
        <FreelancerMaterialAuthorizationPreview contractData={data as FreelancerMaterialAuthorizationData} companyInfo={companyInfo} />
      )}
      {(data.contractType !== 'PERMUTA_EQUIPMENT_SERVICE' && 
        data.contractType !== 'SERVICE_VIDEO' && 
        data.contractType !== 'FREELANCE_HIRE_FILMMAKER' &&
        data.contractType !== 'FREELANCER_MATERIAL_AUTHORIZATION'
        ) && (
        <p>Pré-visualização para este tipo de contrato ainda não implementada.</p>
      )}
    </div>
  );
};

export default ContractPreview;
    
