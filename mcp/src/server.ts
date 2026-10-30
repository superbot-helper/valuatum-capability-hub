import express from 'express';
import {McpServer} from '@modelcontextprotocol/sdk/server/mcp.js';
import {StreamableHTTPServerTransport} from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import {z} from 'zod';
import {actions,capabilityMap} from './capabilities.js';
import {notice} from './data.js';

export const app=express();
app.use(express.json({limit:'64kb'}));
const allowed=(process.env.ALLOWED_ORIGINS||'http://localhost:4173').split(',').map(v=>v.trim());
app.use((req,res,next)=>{const origin=req.headers.origin;if(origin&&!allowed.includes(origin)) return res.status(403).json({error:'Origin not allowed'});if(origin){res.setHeader('Access-Control-Allow-Origin',origin);res.setHeader('Vary','Origin')}if(req.method==='OPTIONS'){res.setHeader('Access-Control-Allow-Methods','GET,POST,OPTIONS');res.setHeader('Access-Control-Allow-Headers','content-type,mcp-protocol-version');return res.sendStatus(204)}next()});

app.get('/healthz',(_req,res)=>res.json({status:'ok',service:'vf-capability',mode:'prototype',sdk:'@modelcontextprotocol/sdk 1.32.2',transportProfile:process.env.MCP_PROTOCOL_TARGET||'2026-07-28',sdkNegotiatedRevision:'2025-11-25',notice}));
app.get('/api/companies',(_req,res)=>res.json(actions.search_company({query:''})));
app.post('/api/:action',(req,res)=>{try{const fn=(actions as Record<string,(x:any)=>unknown>)[req.params.action];if(!fn)return res.status(404).json({error:'Unknown action'});res.json(fn(req.body||{}))}catch(error){res.status(400).json({error:error instanceof Error?error.message:'Invalid request',notice})}});

function createMcpServer(){
  const server=new McpServer({name:'vf-capability',version:'0.1.0'},{maxToolInputElements:10000});
  const result=(value:unknown)=>({content:[{type:'text' as const,text:JSON.stringify(value,null,2)}],structuredContent:value as Record<string,unknown>});
  server.registerTool('search_company',{description:'Resolve a name or synthetic identifier to a mock company entity. CRDs: find-company, retrieve-company-profile.',inputSchema:{query:z.string().min(1)}},async input=>result(actions.search_company(input)));
  server.registerTool('get_financial_profile',{description:'Return synthetic period-labelled financial context. CRD: retrieve-financial-profile.',inputSchema:{company_id:z.string(),period:z.string().optional()}},async input=>result(actions.get_financial_profile(input)));
  server.registerTool('assess_credit_risk',{description:'Return a synthetic rating, risk level, confidence, drivers, and explanation. CRDs: assess-company-credit-risk, explain-credit-risk.',inputSchema:{company_id:z.string()}},async input=>result(actions.assess_credit_risk(input)));
  server.registerTool('estimate_company_value',{description:'Return a synthetic illustrative valuation range and drivers. CRDs: estimate-company-value, explain-valuation-drivers.',inputSchema:{company_id:z.string(),scenario:z.string().optional()}},async input=>result(actions.estimate_company_value(input)));
  server.registerTool('compare_companies',{description:'Compare synthetic companies across common dimensions. CRD: compare-companies.',inputSchema:{company_ids:z.array(z.string()).min(2).max(6),dimensions:z.array(z.string()).optional()}},async input=>result(actions.compare_companies(input)));
  server.registerTool('create_decision_brief',{description:'Compose identity, financial, risk, and valuation capabilities into a synthetic decision brief. CRD: create-company-decision-brief.',inputSchema:{company_id:z.string(),decision_context:z.enum(['supplier','credit','acquisition-screening','general'])}},async input=>result(actions.create_decision_brief(input)));
  server.registerTool('list_capabilities',{description:'List MCP tool-to-CRD mappings for this prototype.',inputSchema:{}},async()=>result({tools:capabilityMap,notice}));
  return server;
}

app.post('/mcp',async(req,res)=>{try{const server=createMcpServer();const transport=new StreamableHTTPServerTransport({sessionIdGenerator:undefined});res.on('close',()=>{void transport.close();void server.close()});await server.connect(transport);await transport.handleRequest(req,res,req.body)}catch(error){if(!res.headersSent)res.status(500).json({jsonrpc:'2.0',error:{code:-32603,message:'Internal prototype error'},id:null})}});
app.get('/mcp',(_req,res)=>res.status(405).json({error:'Stateless prototype accepts MCP requests through POST /mcp.'}));
app.delete('/mcp',(_req,res)=>res.status(405).json({error:'Protocol-level sessions are not used.'}));

if(process.env.NODE_ENV!=='test'){const port=Number(process.env.PORT||8080);const host=process.env.K_SERVICE?'0.0.0.0':(process.env.HOST||'127.0.0.1');app.listen(port,host,()=>console.log(`Valuatum Capability Hub listening on ${host}:${port}`))}
