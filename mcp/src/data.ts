import fs from 'node:fs';
import path from 'node:path';

export type Financial = {period:string;turnover:number;operatingResult:number;assets:number;equity:number;debt:number;cash:number};
export type Company = {id:string;name:string;identifier:string;country:string;industry:string;status:string;listed:boolean;ticker?:string;context:string;financials:Financial[];creditRisk:{rating:string;riskLevel:string;confidence:number;drivers:string[];creditLimit:number};valuation:{low:number;midpoint:number;high:number;currency:string;drivers:string[];assumptions:string[]};equity?:Record<string,unknown>};

const dataPath = process.env.MOCK_DATA_PATH || path.resolve(process.cwd(), '../mock-data/companies.json');
export const companies: Company[] = JSON.parse(fs.readFileSync(dataPath,'utf8'));
export const notice = 'Prototype / synthetic data. Not a real Valuatum assessment.';

export function requireCompany(id:string):Company {
  const company=companies.find(c=>c.id===id);
  if(!company) throw new Error(`Unknown synthetic company_id: ${id}`);
  return company;
}

export function ratios(f:Financial){
  return {operatingMargin:Number((f.operatingResult/f.turnover*100).toFixed(1)),equityRatio:Number((f.equity/f.assets*100).toFixed(1)),debtToEquity:Number((f.debt/f.equity).toFixed(2)),cashToDebt:Number((f.cash/f.debt).toFixed(2))};
}

export function financialProfile(company:Company,period?:string){
  const financial=period?company.financials.find(f=>f.period===period):company.financials.at(-1);
  if(!financial) throw new Error(`No synthetic financial period ${period} for ${company.id}`);
  return {...financial,ratios:ratios(financial)};
}

export function decisionBrief(company:Company,context:string){
  const current=financialProfile(company); const previous=company.financials.at(-2)!;
  const growth=(current.turnover/previous.turnover-1)*100;
  return {decisionContext:context,company:{id:company.id,name:company.name,country:company.country,industry:company.industry},summary:company.context,financialCondition:{latest:current,turnoverGrowthPercent:Number(growth.toFixed(1)),observation:current.operatingResult>0?'Currently profitable in the synthetic dataset.':'Currently loss-making in the synthetic dataset.'},creditRisk:company.creditRisk,valuationContext:company.valuation,uncertainties:['Synthetic figures cannot establish real creditworthiness or company value.','No qualitative due diligence, legal review, payment history, or current market data is included.'],nextQuestions:['What exposure and payment terms are being considered?','What recent events are not represented by the historical figures?','Which human approvals and external checks are required?'],notice};
}

