import {companies,decisionBrief,financialProfile,notice,ratios,requireCompany} from './data.js';

export const capabilityMap={search_company:['find-company','retrieve-company-profile'],get_financial_profile:['retrieve-financial-profile'],assess_credit_risk:['assess-company-credit-risk','explain-credit-risk'],estimate_company_value:['estimate-company-value','explain-valuation-drivers'],compare_companies:['compare-companies','retrieve-financial-profile'],create_decision_brief:['create-company-decision-brief','retrieve-company-profile','retrieve-financial-profile','assess-company-credit-risk','estimate-company-value'],list_capabilities:[]};

export const actions={
  search_company:({query}:{query:string})=>({matches:companies.filter(c=>`${c.name} ${c.identifier} ${c.ticker||''}`.toLowerCase().includes(query.toLowerCase())).map(({id,name,country,identifier,industry,listed,ticker})=>({id,name,country,identifier,industry,listed,ticker})),notice}),
  get_financial_profile:({company_id,period}:{company_id:string;period?:string})=>({company:{id:company_id,name:requireCompany(company_id).name},financial:financialProfile(requireCompany(company_id),period),notice}),
  assess_credit_risk:({company_id}:{company_id:string})=>({company:{id:company_id,name:requireCompany(company_id).name},assessment:requireCompany(company_id).creditRisk,explanation:requireCompany(company_id).creditRisk.drivers.join('; '),notice}),
  estimate_company_value:({company_id,scenario='base'}:{company_id:string;scenario?:string})=>({company:{id:company_id,name:requireCompany(company_id).name},scenario,valuation:requireCompany(company_id).valuation,disclaimer:notice}),
  compare_companies:({company_ids,dimensions=[]}:{company_ids:string[];dimensions?:string[]})=>({dimensions:dimensions.length?dimensions:['turnover','operatingMargin','equityRatio','riskLevel'],companies:company_ids.map(id=>{const c=requireCompany(id);const f=c.financials.at(-1)!;return {id,name:c.name,period:f.period,turnover:f.turnover,...ratios(f),riskLevel:c.creditRisk.riskLevel,rating:c.creditRisk.rating}}),summary:'Synthetic normalized comparison; interpret differences in context.',notice}),
  create_decision_brief:({company_id,decision_context}:{company_id:string;decision_context:string})=>decisionBrief(requireCompany(company_id),decision_context)
};

