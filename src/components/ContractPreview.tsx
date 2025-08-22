
"use client";

import React from 'react';
import type { AnyContractData, PermutaEquipmentServiceContractData, ServiceVideoContractData, ContractParty, FreelanceFilmmakerContractData, FreelancerMaterialAuthorizationData, FreelanceEditorContractData } from '@/types/contract';
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

const Clause: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <div style={{ pageBreakInside: 'avoid' }} className={className}>
    {children}
  </div>
);

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
    <div className="text-sm leading-relaxed text-justify" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
      <h1 className="text-center font-bold text-lg mb-6 uppercase break-words">{boldenContractTerms(contractTitle, permutaTerms)}</h1>

      <Clause>
        <p className="mb-4">Pelo presente instrumento particular, as partes abaixo identificadas:</p>
        <PartyDetails party={permutante} title="PERMUTANTE (Cede o equipamento e recebe os serviços)" />
        <CompanyAsPartyDetails companyInfo={companyInfo} title="PERMUTADO (Recebe o equipamento e presta os serviços)" />
        <p className="mb-6">têm, entre si, justo e contratado o presente {boldenContractTerms(contractTitle?.toUpperCase(), permutaTerms)}, que se regerá pelas cláusulas e condições seguintes:</p>
      </Clause>
      

      <div className="space-y-3">
        <Clause>
            <p><strong className="font-bold">CLÁUSULA {clauseNumber++} - DO OBJETO</strong></p>
            <p><strong className="font-bold">1.1.</strong> {boldenContractTerms(`O presente contrato tem como objeto a permuta de ${equipmentDescription}, de propriedade do PERMUTANTE, avaliada em ${equipmentValueFormatted}${equipmentValueInWords}, pelo serviço de ${serviceDescription} a ser prestado pelo PERMUTADO.`, permutaTerms)}</p>
        </Clause>

        {paymentClause && paymentClause.trim() !== '' && (
            <Clause>
                <p><strong className="font-bold">CLÁUSULA {clauseNumber++} - DA FORMA DE PAGAMENTO</strong></p>
                <p><strong className="font-bold">2.1.</strong> {boldenContractTerms(paymentClause, permutaTerms)}</p>
            </Clause>
        )}

        <Clause>
            <p><strong className="font-bold">CLÁUSULA {clauseNumber++} - DAS CONDIÇÕES</strong></p>
            <p><strong className="font-bold">3.1.</strong> {boldenContractTerms(conditions, permutaTerms)}</p>
        </Clause>
        
        <Clause>
            <p><strong className="font-bold">CLÁUSULA {clauseNumber++} - DA TRANSFERÊNCIA DE PROPRIEDADE</strong></p>
            <p><strong className="font-bold">4.1.</strong> {boldenContractTerms(transferClause, permutaTerms)}</p>
        </Clause>

        {generalDispositions && generalDispositions.trim() !== '' && (
            <Clause>
                <p><strong className="font-bold">CLÁUSULA {clauseNumber++} - DAS DISPOSIÇÕES GERAIS</strong></p>
                <p><strong className="font-bold">5.1.</strong> {boldenContractTerms(generalDispositions, permutaTerms)}</p>
            </Clause>
        )}
        
        <Clause>
            <p><strong className="font-bold">CLÁUSULA {clauseNumber++} - DO FORO</strong></p>
            <p><strong className="font-bold">6.1.</strong> {boldenContractTerms(`Para dirimir eventuais dúvidas ou conflitos oriundos deste contrato, as partes elegem o foro da comarca de ${foro}.`, permutaTerms)}</p>
        </Clause>
      </div>
      
      <Clause>
        <p className="mt-8 mb-8 text-center">E, por estarem assim justos e contratados, firmam o presente instrumento em duas vias de igual teor.</p>
        
        <div className="mt-12 space-y-10 text-center">
          <p>__________________________________________<br/>{permutante.name || 'PERMUTANTE'}</p>
          <p>__________________________________________<br/>{companyInfo.name || 'PERMUTADO'}</p>
        </div>

        <p className="mt-12 text-center">{contractCity || '___________________'}, {contractFullDate || '___________________'}.</p>
      </Clause>
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
    <div className="text-sm leading-relaxed text-justify" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
      <h1 className="text-center font-bold text-lg mb-6 uppercase break-words">{boldenContractTerms(contractTitle, serviceTerms)}</h1>

      <Clause>
        {contratantes.map((contratante, index) => (
          <PartyDetails key={contratante.id || index} party={contratante} title="CONTRATANTE" index={contratantes.length > 1 ? index : undefined} />
        ))}
        <CompanyAsPartyDetails companyInfo={companyInfo} title="CONTRATADA" />
      </Clause>

      <Clause>
        <p className="mb-4"><strong className="font-bold">OBJETO DO CONTRATO:</strong><br/>
        {boldenContractTerms(objectDescription, serviceTerms)}
        </p>
      </Clause>

      <Clause>
        <p className="mb-4"><strong className="font-bold">VALOR E FORMA DE PAGAMENTO:</strong><br/>
        {boldenContractTerms(`O valor total pelos serviços é de ${totalValueFormatted}${totalValueInWords}, a ser pago da seguinte forma: ${paymentDescription}`, serviceTerms)}
        </p>
      </Clause>
      
      <Clause>
        <p className="mb-4"><strong className="font-bold">PRAZO DE ENTREGA:</strong><br/>
        {boldenContractTerms(deliveryDeadline, serviceTerms)}</p>
      </Clause>

      <Clause>
        <p className="mb-2 font-bold">RESPONSABILIDADES DA CONTRATADA:</p>
        <ul className="list-disc list-inside ml-4 mb-4">
            {renderList(responsibilitiesContratada, serviceTerms)}
            {!responsibilitiesContratada?.trim() && <li>___________________</li>}
        </ul>
      </Clause>
      
      <Clause>
        <p className="mb-2 font-bold">RESPONSABILIDADES DO(S) CONTRATANTE(S):</p>
        <ul className="list-disc list-inside mb-4 ml-4">
            {renderList(responsibilitiesContratante, serviceTerms)}
            {!responsibilitiesContratante?.trim() && <li>___________________</li>}
        </ul>
      </Clause>

      <Clause>
        <p className="mb-4"><strong className="font-bold">DIREITOS AUTORAIS:</strong><br/>
        {boldenContractTerms(copyrightClause, serviceTerms)}</p>
      </Clause>

      <Clause>
        <p className="mb-4"><strong className="font-bold">RESCISÃO:</strong><br/>
        {boldenContractTerms(`O contrato poderá ser rescindido por qualquer das partes mediante aviso prévio de ${rescissionNoticePeriodDays || '__'} (${rescissionNoticePeriodInWords || '______'}) dias. Em caso de rescisão sem justa causa, a parte que der causa pagará à outra uma multa de ${rescissionPenaltyPercentage || '__'}% (${rescissionPenaltyInWords || '______ por cento'}) sobre o valor do contrato.`, serviceTerms)}
        </p>
      </Clause>

      {generalDispositions && generalDispositions.trim() !== '' && (
        <Clause>
            <p className="mb-4"><strong className="font-bold">DISPOSIÇÕES GERAIS:</strong><br/>
            {boldenContractTerms(generalDispositions, serviceTerms)}</p>
        </Clause>
      )}

      <Clause>
        <p className="mb-4"><strong className="font-bold">FORO:</strong><br/>
        {boldenContractTerms(`As partes elegem o foro da comarca de ${foro} para dirimir eventuais dúvidas ou conflitos oriundos deste contrato.`, serviceTerms)}</p>
      </Clause>

      <Clause>
        <p className="mt-8 mb-8 text-center">E, por estarem assim justos e contratados, firmam o presente instrumento em duas vias de igual teor.</p>

        <div className="mt-12 space-y-10 text-center">
          {contratantes.length === 1 && contratantes[0] && (
              <p>__________________________________________<br/>{contratantes[0].name || 'CONTRATANTE'}</p>
          )}
          {contratantes.length > 1 && (
              <>
                  <p className="font-semibold">CONTRATANTES:</p>
                  {contratantes.map((contratante, index) => (
                      <p key={contratante.id || index} className="mt-2">__________________________________________<br/>{contratante.name || `CONTRATANTE ${index + 1}`}</p>
                  ))}
              </>
          )}
          <p>__________________________________________<br/>{companyInfo.name || 'CONTRATADA'}</p>
        </div>

        <p className="mt-12 text-center">{contractCity || '___________________'}, {contractFullDate || '___________________'}.</p>
      </Clause>
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
    <div className="text-sm leading-relaxed text-justify" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
      <h1 className="text-center font-bold text-lg mb-6 uppercase break-words">{boldenContractTerms(contractTitle, freelanceTerms)}</h1>

      <Clause>
        <CompanyAsPartyDetails companyInfo={companyInfo} title="CONTRATANTE" />
        <PartyDetails party={contratado} title="CONTRATADO" />
      </Clause>
      

      <Clause>
        <p className="mb-4"><strong className="font-bold">CLÁUSULA 1 – DO OBJETO</strong></p>
        <p className="mb-1"><strong className="font-bold">1.1.</strong> {boldenContractTerms('O presente contrato tem como objeto a prestação de serviços de captação de vídeo, conforme demandas da CONTRATANTE, incluindo, mas não se limitando a:', freelanceTerms)}</p>
        <ul className="list-disc list-inside ml-4 mb-4">
            <li>{boldenContractTerms('Gravação de eventos, cenas externas ou internas;', freelanceTerms)}</li>
            <li>{boldenContractTerms('Operação de câmeras e equipamentos fornecidos;', freelanceTerms)}</li>
            <li>{boldenContractTerms('Cumprimento do roteiro e direção pré-estabelecida.', freelanceTerms)}</li>
        </ul>
      </Clause>

      <Clause>
        <p className="mb-4"><strong className="font-bold">CLÁUSULA 2 – DA NATUREZA DO VÍNCULO</strong></p>
        <p className="mb-4"><strong className="font-bold">2.1.</strong> {boldenContractTerms('Este contrato não estabelece vínculo empregatício entre as partes, sendo o CONTRATADO responsável por seus encargos tributários, previdenciários, trabalhistas e civis.', freelanceTerms)}</p>
      </Clause>
      
      <Clause>
        <p className="mb-4"><strong className="font-bold">CLÁUSULA 3 – DA REMUNERAÇÃO</strong></p>
        <p className="mb-1"><strong className="font-bold">3.1.</strong> {boldenContractTerms(`O CONTRATADO receberá o valor de ${remunerationValueFormatted}${remunerationValueInWords} por ${remunerationUnit}, conforme acordado previamente entre as partes.`, freelanceTerms)}</p>
        <p className="mb-1"><strong className="font-bold">3.2.</strong> {boldenContractTerms('A CONTRATANTE realiza seus pagamentos mediante sinal de 50% do valor contratado junto ao cliente e os 50% restantes na entrega final. O CONTRATADO somente fará jus ao pagamento após a entrega e aceitação do projeto pelo cliente da CONTRATANTE, no qual o CONTRATADO tenha efetivamente prestado os serviços.', freelanceTerms)}</p>
        <p className="mb-4"><strong className="font-bold">3.3.</strong> {boldenContractTerms(`${paymentMethodDescription}`, freelanceTerms)}</p>
      </Clause>

      <Clause>
        <p className="mb-4"><strong className="font-bold">CLÁUSULA 4 – DOS PRAZOS E ENTREGAS</strong></p>
        <p className="mb-1"><strong className="font-bold">4.1.</strong> {boldenContractTerms(`${deliveryDeadlineDetails}`, freelanceTerms)}</p>
        <p className="mb-4"><strong className="font-bold">4.2.</strong> {boldenContractTerms('A não entrega dentro do prazo sem justificativa plausível implicará multa de 20% sobre o valor do serviço e possível rescisão contratual.', freelanceTerms)}</p>
      </Clause>

      <Clause>
        <p className="mb-4"><strong className="font-bold">CLÁUSULA 5 – DOS EQUIPAMENTOS</strong></p>
        <p className="mb-1"><strong className="font-bold">5.1.</strong> {boldenContractTerms(`${equipmentDetails}`, freelanceTerms)}</p>
        <p className="mb-4"><strong className="font-bold">5.2.</strong> {boldenContractTerms('Em caso de dano, extravio ou mau uso de equipamento fornecido pela CONTRATANTE, o CONTRATADO se compromete a ressarcir integralmente o valor de mercado do item afetado.', freelanceTerms)}</p>
      </Clause>

      <Clause>
        <p className="mb-4"><strong className="font-bold">CLÁUSULA 6 – DOS DIREITOS AUTORAIS E DE IMAGEM</strong></p>
        <p className="mb-1"><strong className="font-bold">6.1.</strong> {boldenContractTerms('Todo o material captado durante os serviços prestados será de propriedade integral e irrevogável da CONTRATANTE.', freelanceTerms)}</p>
        <p className="mb-4"><strong className="font-bold">6.2.</strong> {boldenContractTerms('O CONTRATADO cede, de forma gratuita, definitiva e irretratável, todos os direitos autorais patrimoniais sobre o material captado, não podendo utilizá-lo em portfólios, redes sociais ou fins pessoais sem autorização por escrito da CONTRATANTE.', freelanceTerms)}</p>
      </Clause>

      <Clause>
        <p className="mb-4"><strong className="font-bold">CLÁUSULA 7 – DA CONFIDENCIALIDADE</strong></p>
        <p className="mb-1"><strong className="font-bold">7.1.</strong> {boldenContractTerms('O CONTRATADO compromete-se a manter sigilo absoluto sobre informações, roteiros, imagens e quaisquer dados da CONTRATANTE ou de seus clientes, sendo vedada a divulgação ou compartilhamento sob qualquer forma.', freelanceTerms)}</p>
        <p className="mb-4"><strong className="font-bold">7.2.</strong> {boldenContractTerms(`Em caso de quebra de confidencialidade, será aplicada multa de ${confidentialityPenaltyFormatted}${confidentialityPenaltyInWords}, sem prejuízo de eventuais indenizações por perdas e danos.`, freelanceTerms)}</p>
      </Clause>

      <Clause>
        <p className="mb-4"><strong className="font-bold">CLÁUSULA 8 – DAS PENALIDADES</strong></p>
        <p className="mb-1"><strong className="font-bold">8.1.</strong> {boldenContractTerms('O não cumprimento das obrigações previstas neste contrato sujeitará o CONTRATADO às seguintes penalidades:', freelanceTerms)}</p>
        <ul className="list-disc list-inside ml-4 mb-4">
            <li>{boldenContractTerms('Advertência formal;', freelanceTerms)}</li>
            <li>{boldenContractTerms('Multa de até 50% do valor acordado;', freelanceTerms)}</li>
            <li>{boldenContractTerms('Rescisão imediata do contrato;', freelanceTerms)}</li>
            <li>{boldenContractTerms('Responsabilização cível e criminal, conforme o caso.', freelanceTerms)}</li>
        </ul>
      </Clause>

      <Clause>
        <p className="mb-4"><strong className="font-bold">CLÁUSULA 9 – DA RESCISÃO</strong></p>
        <p className="mb-1"><strong className="font-bold">9.1.</strong> {boldenContractTerms(`O contrato poderá ser rescindido por qualquer das partes mediante aviso prévio de ${rescissionNoticeDays} (${rescissionNoticeDaysInWords}) dias corridos.`, freelanceTerms)}</p>
        <p className="mb-4"><strong className="font-bold">9.2.</strong> {boldenContractTerms(`Em caso de rescisão sem justificativa após aceite formal de um serviço, o CONTRATADO deverá arcar com multa equivalente a ${unjustifiedRescissionPenaltyPercentage}% do valor do serviço acordado.`, freelanceTerms)}</p>
      </Clause>

      <Clause>
        <p className="mb-4"><strong className="font-bold">CLÁUSULA 10 – DO FORO</strong></p>
        <p className="mb-4"><strong className="font-bold">10.1.</strong> {boldenContractTerms(`Para dirimir quaisquer dúvidas oriundas deste contrato, as partes elegem o foro da comarca de ${foro}, com renúncia a qualquer outro, por mais privilegiado que seja.`, freelanceTerms)}</p>
      </Clause>

      <Clause>
        <p className="mt-8 mb-8 text-center">E por estarem assim justas e contratadas, firmam o presente instrumento em duas vias de igual teor.</p>

        <div className="mt-12 space-y-10 text-center">
          <p>__________________________________________<br/>{companyInfo.name || 'CONTRATANTE'}<br/>(CONTRATANTE)</p>
          <p>__________________________________________<br/>{contratado.name || 'CONTRATADO'}<br/>(CONTRATADO)</p>
        </div>
        
        <p className="mt-12 text-center">{contractCity || '___________________'}, {contractFullDate || '___________________'}.</p>
      </Clause>
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
    <div className="text-sm leading-relaxed text-justify" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
      <h1 className="text-center font-bold text-lg mb-6 uppercase break-words">{boldenContractTerms(contractTitle, authTerms)}</h1>

      <Clause>
        <CompanyAsPartyDetails 
            companyInfo={companyInfo} 
            title="AUTORIZANTE" 
            cnpj={companyInfo.cnpj || 'N/A'} // Assuming companyInfo might have cnpj
            sede={companyInfo.address}
        />
        <PartyDetails party={autorizado} title="AUTORIZADO(A)" />
        <p className="mb-6">firmam o presente {boldenContractTerms(contractTitle?.toUpperCase(), authTerms)}, mediante as cláusulas seguintes:</p>
      </Clause>
      
      <div className="space-y-3">
        <Clause>
            <p className="mb-1"><strong className="font-bold">CLÁUSULA 1 – DO OBJETO</strong></p>
            <p className="mb-1"><strong className="font-bold">1.1.</strong> {boldenContractTerms('Este termo trata da autorização exclusiva e pontual para o uso de material audiovisual captado pelo AUTORIZADO(A) no projeto abaixo identificado:', authTerms)}</p>
            <ul className="list-none ml-4 mb-2">
                <li><strong className="font-bold">Projeto:</strong> {projectName || '____________________________________________'}</li>
                <li><strong className="font-bold">Cliente final:</strong> {finalClientName || '____________________________________________'}</li>
                <li><strong className="font-bold">Data de execução:</strong> {executionDate || '____________________________________________'}</li>
                <li><strong className="font-bold">Link(s) autorizado(s):</strong> {authorizedLinks || '____________________________________________'}</li>
            </ul>
            <p><strong className="font-bold">1.2.</strong> {boldenContractTerms('A presente autorização é limitada a este único projeto, e não se estende automaticamente a outros trabalhos executados para a AUTORIZANTE.', authTerms)}</p>
        </Clause>

        <Clause>
            <p className="mb-1"><strong className="font-bold">CLÁUSULA 2 – FINALIDADE E LIMITAÇÕES DE USO</strong></p>
            <p className="mb-1"><strong className="font-bold">2.1.</strong> {boldenContractTerms('O material descrito na Cláusula 1 poderá ser utilizado exclusivamente para fins de portfólio pessoal ou currículo profissional, em:', authTerms)}</p>
            <ul className="list-disc list-inside ml-8 mb-2">
                <li>{boldenContractTerms('Sites pessoais, plataformas de portfólio;', authTerms)}</li>
                <li>{boldenContractTerms('Redes sociais de uso profissional (LinkedIn, Instagram, Vimeo etc.);', authTerms)}</li>
                <li>{boldenContractTerms('Apresentações a clientes ou contratantes.', authTerms)}</li>
            </ul>
            <p className="mb-1"><strong className="font-bold">2.2.</strong> {boldenContractTerms('É vedado:', authTerms)}</p>
            <ul className="list-disc list-inside ml-8 mb-2">
                <li>{boldenContractTerms('Monetizar ou veicular o conteúdo em campanhas publicitárias;', authTerms)}</li>
                <li>{boldenContractTerms('Utilizar imagens com pessoas identificáveis sem autorização expressa destas;', authTerms)}</li>
                <li>{boldenContractTerms('Fazer edições que distorçam o trabalho, a identidade visual ou a marca do projeto;', authTerms)}</li>
                <li>{boldenContractTerms('Sugerir que o projeto foi realizado exclusivamente pelo AUTORIZADO(A), sem citar a FastFilms.', authTerms)}</li>
            </ul>
            <p><strong className="font-bold">2.3.</strong> {boldenContractTerms('O material deve conter o crédito à FastFilms como produtora do projeto.', authTerms)}</p>
        </Clause>

        <Clause>
            <p className="mb-1"><strong className="font-bold">CLÁUSULA 3 – VIGÊNCIA E REVOGAÇÃO</strong></p>
            <p><strong className="font-bold">3.1.</strong> {boldenContractTerms('Esta autorização entra em vigor na data da assinatura e é válida por tempo indeterminado, podendo ser revogada a qualquer tempo pela AUTORIZANTE, mediante aviso prévio de 5 (cinco) dias.', authTerms)}</p>
        </Clause>
        
        <Clause>
            <p className="mb-1"><strong className="font-bold">CLÁUSULA 4 – DAS PENALIDADES</strong></p>
            <p className="mb-1"><strong className="font-bold">4.1.</strong> {boldenContractTerms(`O uso indevido ou o descumprimento deste termo sujeitará o AUTORIZADO(A) às seguintes penalidades:`, authTerms)}</p>
            <ul className="list-disc list-inside ml-8 mb-2">
                <li>{boldenContractTerms('Cancelamento imediato da autorização;', authTerms)}</li>
                <li>{boldenContractTerms(`Multa de ${penaltyValueFormatted}${penaltyValueInWords};`, authTerms)}</li>
                <li>{boldenContractTerms('Eventual responsabilização cível e criminal.', authTerms)}</li>
            </ul>
        </Clause>
        
        <Clause>
            <p><strong className="font-bold">CLÁUSULA 5 – DO FORO</strong></p>
            <p><strong className="font-bold">5.1.</strong> {boldenContractTerms(`Para dirimir quaisquer controvérsias oriundas deste termo, as partes elegem o foro da comarca de ${foro}, com renúncia a qualquer outro, por mais privilegiado que seja.`, authTerms)}</p>
        </Clause>
      </div>
      
      <Clause>
        <p className="mt-8 mb-8 text-center">E, por estarem assim justos e contratados, firmam o presente instrumento em duas vias de igual teor.</p>
        
        <div className="mt-12 space-y-10 text-center">
          <p>__________________________________________<br/>{companyInfo.name || 'AUTORIZANTE'}<br/>(AUTORIZANTE)</p>
          <p>__________________________________________<br/>{autorizado.name || 'AUTORIZADO(A)'}<br/>(AUTORIZADO(A))</p>
        </div>
        
        <p className="mt-12 text-center">{contractCity || '___________________'}, {contractFullDate || '___________________'}.</p>
      </Clause>
    </div>
  );
};


const FreelanceEditorPreview: React.FC<{ contractData: FreelanceEditorContractData, companyInfo: CompanyInfo }> = ({ contractData, companyInfo }) => {
  const {
    contractTitle,
    contratado,
    remunerationType,
    remunerationValue,
    paymentDay,
    paymentDetails,
    lateDeliveryPenalty,
    confidentialityPenalty,
    rescissionNoticeDays,
    unjustifiedRescissionPenalty,
    foro,
    includeNonCompeteClause,
    contractCity,
    contractFullDate,
  } = contractData;

  const editorTerms = ["CONTRATANTE", "CONTRATADO", "CONTRATO DE PRESTAÇÃO DE SERVIÇOS DE EDIÇÃO DE VÍDEO"];
  const confidentialityPenaltyFormatted = formatCurrency(confidentialityPenalty);
  const confidentialityPenaltyInWords = numberToWords(confidentialityPenalty);
  let clauseCounter = 1;

  const getRemunerationText = () => {
    const valueNum = parseFloat(remunerationValue);
    if (isNaN(valueNum)) return { main: '', subclause: '' };
    
    let mainText = '';
    
    switch(remunerationType) {
        case 'MENSAL':
            mainText = `O CONTRATADO receberá um valor fixo mensal de ${formatCurrency(remunerationValue)}${numberToWords(remunerationValue)}.`;
            break;
        case 'SEMANAL':
            mainText = `O CONTRATADO receberá um valor fixo semanal de ${formatCurrency(remunerationValue)}${numberToWords(remunerationValue)}.`;
            break;
        case 'PROJETO':
            mainText = `O CONTRATADO receberá o valor de ${formatCurrency(remunerationValue)}${numberToWords(remunerationValue)} por projeto.`;
            break;
        case 'PERCENTUAL':
            mainText = `O CONTRATADO receberá uma porcentagem de ${remunerationValue}% (${converterInteiroParaExtensoPTBR(valueNum)} por cento) do valor de cada orçamento fechado com o cliente.`;
            break;
    }

    let subclauseText = `A remuneração será paga após a emissão da Nota Fiscal Eletrônica (NFE) pelo CONTRATADO e a finalização de todas as demandas mensais acordadas.`;
    if(paymentDay) {
        subclauseText += ` O dia de pagamento foi escolhido pelo CONTRATADO como todo dia ${paymentDay} e acordado com a CONTRATANTE.`
    }
    if(paymentDetails) {
        subclauseText += ` ${paymentDetails}`;
    }


    return { main: mainText, subclause: subclauseText };
  };

  const remunerationClause = getRemunerationText();

  return (
    <div className="text-sm leading-relaxed text-justify" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
      <div>
        <h1 className="text-center font-bold text-lg mb-6 uppercase break-words">{boldenContractTerms(contractTitle, editorTerms)}</h1>
        <Clause>
          <CompanyAsPartyDetails companyInfo={companyInfo} title="CONTRATANTE" />
          <PartyDetails party={contratado} title="CONTRATADO" />
        </Clause>
        <Clause>
          <p><strong className="font-bold">CLÁUSULA {clauseCounter++} - DO OBJETO</strong></p>
          <p><strong className="font-bold">1.1.</strong> {boldenContractTerms(' O presente contrato tem como objeto a prestação de serviços de edição de vídeo, conforme demandas da CONTRATANTE, incluindo, mas não se limitando a:', editorTerms)}</p>
          <ul className="list-disc list-inside ml-4">
              <li>{boldenContractTerms('Edição de vídeos captados pela CONTRATANTE;', editorTerms)}</li>
              <li>{boldenContractTerms('Pós-produção, incluindo correção de cor, efeitos visuais, montagem e finalização;', editorTerms)}</li>
              <li>{boldenContractTerms('Cumprimento das diretrizes e roteiro de edição pré-estabelecidos.', editorTerms)}</li>
          </ul>
        </Clause>
      </div>
      
      <Clause>
        <p><strong className="font-bold">CLÁUSULA {clauseCounter++} - DA NATUREZA DO VÍNCULO</strong></p>
        <p><strong className="font-bold">2.1.</strong> {boldenContractTerms(' Este contrato não estabelece vínculo empregatício entre as partes, sendo o CONTRATADO responsável por seus encargos tributários, previdenciários, trabalhistas e civis. O CONTRATADO atuará como prestador de serviços autônomo.', editorTerms)}</p>
      </Clause>
      
      <Clause>
        <p>
          <strong className="font-bold">CLÁUSULA {clauseCounter++} - DA REMUNERAÇÃO E PAGAMENTO</strong><br />
          <strong className="font-bold">3.1.</strong> {boldenContractTerms(remunerationClause.main, editorTerms)}<br />
          <strong className="font-bold">3.2.</strong> {boldenContractTerms(remunerationClause.subclause, editorTerms)}
        </p>
      </Clause>

      <Clause>
          <p><strong className="font-bold">CLÁUSULA {clauseCounter++} - DOS PRAZOS E ENTREGAS</strong></p>
          <p><strong className="font-bold">4.1.</strong> {boldenContractTerms(` Os prazos para execução e entrega dos arquivos de vídeo editados serão definidos por e-mail ou outro meio digital, sendo obrigatória sua confirmação pelo CONTRATADO.`, editorTerms)}</p>
          <p><strong className="font-bold">4.2.</strong> {boldenContractTerms(` A não entrega dentro do prazo sem justificativa plausível implicará multa de ${lateDeliveryPenalty}% sobre o valor do serviço específico não entregue e possível rescisão contratual.`, editorTerms)}</p>
      </Clause>
      
      <Clause>
          <p><strong className="font-bold">CLÁUSULA {clauseCounter++} - DOS SOFTWARES</strong></p>
          <p><strong className="font-bold">5.1.</strong> {boldenContractTerms(' Os softwares utilizados para a edição de vídeo serão de responsabilidade do CONTRATADO, devendo ser de qualidade e versões adequadas para a realização dos serviços. O CONTRATADO deve garantir que possui licenças válidas para todos os softwares utilizados.', editorTerms)}</p>
          <p><strong className="font-bold">5.2.</strong> {boldenContractTerms(' Em caso de uso de softwares específicos fornecidos pela CONTRATANTE, o CONTRATADO deverá utilizá-los conforme as instruções e com diligência. O CONTRATADO se compromete a manter a confidencialidade e a segurança de quaisquer softwares ou ferramentas proprietárias fornecidas pela CONTRATANTE.', editorTerms)}</p>
          <p><strong className="font-bold">5.3.</strong> {boldenContractTerms(' Se houver dano ou uso indevido de softwares ou ferramentas proprietárias da CONTRATANTE, o CONTRATADO se compromete a arcar com os custos de reparação ou substituição, além de eventuais perdas e danos.', editorTerms)}</p>
      </Clause>

      <Clause>
          <p><strong className="font-bold">CLÁUSULA {clauseCounter++} - DOS DIREITOS AUTORAIS E DE IMAGEM</strong></p>
          <p><strong className="font-bold">6.1.</strong> {boldenContractTerms(' Todo o material editado durante a prestação dos serviços será de propriedade integral e irrevogável da CONTRATANTE.', editorTerms)}</p>
          <p><strong className="font-bold">6.2.</strong> {boldenContractTerms(' O CONTRATADO cede, de forma gratuita, definitiva e irretratável, todos os direitos autorais patrimoniais sobre o material editado, não podendo utilizá-lo em portfólios, redes sociais ou fins pessoais sem autorização por escrito da CONTRATANTE.', editorTerms)}</p>
      </Clause>

      <Clause>
          <p><strong className="font-bold">CLÁUSULA {clauseCounter++} - DA CONFIDENCIALIDADE</strong></p>
          <p><strong className="font-bold">7.1.</strong> {boldenContractTerms(' O CONTRATADO compromete-se a manter sigilo absoluto sobre informações, roteiros, imagens e quaisquer dados da CONTRATANTE ou de seus clientes, sendo vedada a divulgação ou compartilhamento sob qualquer forma.', editorTerms)}</p>
          <p><strong className="font-bold">7.2.</strong> {boldenContractTerms(` Em caso de quebra de confidencialidade, será aplicada multa de ${confidentialityPenaltyFormatted}${confidentialityPenaltyInWords}, sem prejuízo de eventuais indenizações por perdas e danos.`, editorTerms)}</p>
      </Clause>
      
      <Clause>
        <div>
            <p><strong className="font-bold">CLÁUSULA {clauseCounter++} - DAS PENALIDADES</strong></p>
            <p><strong className="font-bold">8.1.</strong> {boldenContractTerms('O não cumprimento das obrigações previstas neste contrato sujeitará o CONTRATADO às seguintes penalidades:', editorTerms)}</p>
            <ul className="list-disc list-inside ml-4">
                <li>{boldenContractTerms('Advertência formal;', editorTerms)}</li>
                <li>{boldenContractTerms('Multa de até 50% do valor do serviço específico não cumprido;', editorTerms)}</li>
                <li>{boldenContractTerms('Rescisão imediata do contrato;', editorTerms)}</li>
                <li>{boldenContractTerms('Responsabilização cível e criminal, conforme o caso.', editorTerms)}</li>
            </ul>
        </div>
      </Clause>
      
      <Clause>
        <p><strong className="font-bold">CLÁUSULA {clauseCounter++} - DO TRABALHO REMOTO E HÍBRIDO</strong></p>
        <p><strong className="font-bold">9.1.</strong> {boldenContractTerms(' O CONTRATADO prestará os serviços de forma remota (home office), sendo responsável por todas as despesas relacionadas, incluindo, mas não se limitando a, internet, energia elétrica e espaço de trabalho adequado.', editorTerms)}</p>
        <p><strong className="font-bold">9.2.</strong> {boldenContractTerms(' Em casos excepcionais, como eventos que exijam edição em tempo real ou quando a CONTRATANTE estabelecer um escritório próprio, o CONTRATADO poderá ser solicitado a trabalhar presencialmente, em regime híbrido. As despesas de deslocamento e outras relacionadas à prestação presencial dos serviços serão discutidas e acordadas entre as partes.', editorTerms)}</p>
        <p><strong className="font-bold">9.3.</strong> {boldenContractTerms(' O CONTRATADO deve estar disponível para reuniões virtuais e presenciais conforme a necessidade da CONTRATANTE, garantindo a comunicação eficiente e a entrega dos serviços contratados.', editorTerms)}</p>
      </Clause>
      
      <Clause>
          <p><strong className="font-bold">CLÁUSULA {clauseCounter++} - DA RESCISÃO</strong></p>
          <p><strong className="font-bold">10.1.</strong> {boldenContractTerms(` O contrato poderá ser rescindido por qualquer das partes mediante aviso prévio de ${rescissionNoticeDays} dias corridos.`, editorTerms)}</p>
          <p><strong className="font-bold">10.2.</strong> {boldenContractTerms(` Em caso de rescisão sem justificativa após aceite formal de um serviço, o CONTRATADO deverá arcar com multa equivalente a ${unjustifiedRescissionPenalty}% do valor do serviço acordado.`, editorTerms)}</p>
      </Clause>
      
      <Clause>
          <p><strong className="font-bold">CLÁUSULA {clauseCounter++} - DO FORO</strong></p>
          <p><strong className="font-bold">11.1.</strong> {boldenContractTerms(` Para dirimir quaisquer dúvidas oriundas deste contrato, as partes elegem o foro da comarca de ${foro}, com renúncia a qualquer outro, por mais privilegiado que seja.`, editorTerms)}</p>
      </Clause>
      
      <Clause>
          <p><strong className="font-bold">CLÁUSULA {clauseCounter++} - DAS DISPOSIÇÕES GERAIS</strong></p>
          <p><strong className="font-bold">12.1.</strong> {boldenContractTerms(' Este contrato é celebrado em caráter irretratável e irrevogável, obrigando as partes por si e seus sucessores.', editorTerms)}</p>
          <p><strong className="font-bold">12.2.</strong> {boldenContractTerms(' Qualquer alteração ou aditamento a este contrato deverá ser feito por escrito e assinado por ambas as partes.', editorTerms)}</p>
          <p><strong className="font-bold">12.3.</strong> {boldenContractTerms(' A tolerância de uma parte para com a outra quanto ao descumprimento de qualquer das obrigações assumidas neste contrato não implicará em novação ou renúncia de direitos, podendo a parte tolerante exigir o cumprimento das obrigações a qualquer tempo.', editorTerms)}</p>
      </Clause>

      <Clause>
          <p><strong className="font-bold">CLÁUSULA {clauseCounter++} - DA DISPONIBILIDADE E COMUNICAÇÃO</strong></p>
          <p><strong className="font-bold">13.1.</strong> {boldenContractTerms(' O CONTRATADO deve estar disponível para comunicação e atendimento das demandas da CONTRATANTE em horários pré-estabelecidos, devendo responder a comunicações em até 24 horas úteis.', editorTerms)}</p>
          <p><strong className="font-bold">13.2.</strong> {boldenContractTerms(' As comunicações entre as partes serão realizadas preferencialmente por e-mail, mas também poderão ocorrer por telefone, mensagens instantâneas ou videoconferência.', editorTerms)}</p>
      </Clause>
      
      <Clause>
          <p><strong className="font-bold">CLÁUSULA {clauseCounter++} - DA QUALIDADE DOS SERVIÇOS</strong></p>
          <p><strong className="font-bold">14.1.</strong> {boldenContractTerms(' O CONTRATADO deve prestar os serviços de edição de vídeo seguindo os padrões de qualidade estabelecidos pela CONTRATANTE.', editorTerms)}</p>
          <p><strong className="font-bold">14.2.</strong> {boldenContractTerms(' A CONTRATANTE reserva-se o direito de solicitar correções ou ajustes nos vídeos editados até que sejam atendidos os padrões de qualidade acordados.', editorTerms)}</p>
      </Clause>

      {includeNonCompeteClause && (
          <Clause>
              <p><strong className="font-bold">CLÁUSULA {clauseCounter++} - DA NÃO CONCORRÊNCIA</strong></p>
              <p><strong className="font-bold">15.1.</strong> {boldenContractTerms(' Durante a vigência deste contrato, o CONTRATADO compromete-se a não prestar serviços de edição de vídeo para empresas concorrentes da CONTRATANTE, sob pena de rescisão contratual e aplicação de multa.', editorTerms)}</p>
          </Clause>
      )}

      <Clause>
           <p><strong className="font-bold">CLÁUSULA {clauseCounter++} - DA VIGÊNCIA</strong></p>
           <p><strong className="font-bold">{`${clauseCounter - 1}.1.`}</strong> {boldenContractTerms(`Este contrato entra em vigor na data de sua assinatura e terá vigência por prazo indeterminado, podendo ser rescindido conforme a CLÁUSULA 10.`, editorTerms)}</p>
      </Clause>

      <Clause>
        <p className="mt-8 mb-8 text-center">E por estarem assim justas e contratadas, firmam o presente instrumento em duas vias de igual teor.</p>
        
        <p className="my-4 text-center">{contractCity || '___________________'}, {contractFullDate || '___________________'}.</p>
        
        <div className="mt-12 space-y-10 text-center">
            <p>__________________________________________<br/>{companyInfo.name || 'CONTRATANTE'}</p>
            <p>__________________________________________<br/>{contratado.name || 'CONTRATADO'}</p>
        </div>
      </Clause>
    </div>
  );
};


const ContractPreview: React.FC<{ data: AnyContractData | null, companyInfo: CompanyInfo }> = ({ data, companyInfo }) => {
  if (!data) {
    return (
      <div className="text-center text-gray-500 flex flex-col items-center justify-center min-h-[300px] bg-white text-black">
        <FileText className="h-16 w-16 mb-4 text-gray-400" />
        <p className="text-lg">Nenhum contrato selecionado ou dados preenchidos.</p>
        <p className="text-sm">Escolha um tipo de contrato e preencha o formulário.</p>
      </div>
    );
  }

  return (
    <div id="contract-preview-content" className="bg-white text-black p-8 shadow-lg rounded-lg print:shadow-none print:border-none">
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
      {data.contractType === 'FREELANCE_HIRE_EDITOR' && (
        <FreelanceEditorPreview contractData={data as FreelanceEditorContractData} companyInfo={companyInfo} />
      )}
      {(data.contractType !== 'PERMUTA_EQUIPMENT_SERVICE' && 
        data.contractType !== 'SERVICE_VIDEO' && 
        data.contractType !== 'FREELANCE_HIRE_FILMMAKER' &&
        data.contractType !== 'FREELANCER_MATERIAL_AUTHORIZATION' &&
        data.contractType !== 'FREELANCE_HIRE_EDITOR'
        ) && (
        <p>Pré-visualização para este tipo de contrato ainda não implementada.</p>
      )}
    </div>
  );
};

export default ContractPreview;

    