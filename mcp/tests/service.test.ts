import test from 'node:test';
import assert from 'node:assert/strict';
process.env.NODE_ENV='test';
const {app}=await import('../src/server.js');

test('health, controlled errors, and composition work',async()=>{
  const server=app.listen(0,'127.0.0.1');
  await new Promise<void>(resolve=>server.once('listening',resolve));
  const address=server.address(); assert.ok(address&&typeof address==='object'); const base=`http://127.0.0.1:${address.port}`;
  const health=await fetch(`${base}/healthz`); assert.equal(health.status,200); assert.equal((await health.json()).mode,'prototype');
  const bad=await fetch(`${base}/api/get_financial_profile`,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({company_id:'missing'})}); assert.equal(bad.status,400);
  const brief=await fetch(`${base}/api/create_decision_brief`,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({company_id:'northstar-components-oy',decision_context:'supplier'})}); const value=await brief.json(); assert.equal(brief.status,200); assert.match(value.notice,/synthetic data/); assert.equal(value.company.name,'Northstar Components Oy');
  const mcpHeaders={'content-type':'application/json','accept':'application/json, text/event-stream','mcp-protocol-version':'2025-11-25'};
  const initialize=await fetch(`${base}/mcp`,{method:'POST',headers:mcpHeaders,body:JSON.stringify({jsonrpc:'2.0',id:1,method:'initialize',params:{protocolVersion:'2025-11-25',capabilities:{},clientInfo:{name:'test',version:'1.0.0'}}})}); assert.equal(initialize.status,200); assert.match(await initialize.text(),/vf-capability/);
  const tools=await fetch(`${base}/mcp`,{method:'POST',headers:mcpHeaders,body:JSON.stringify({jsonrpc:'2.0',id:2,method:'tools\/list',params:{}})}); assert.equal(tools.status,200); const toolsBody=await tools.text(); assert.match(toolsBody,/create_decision_brief/); assert.match(toolsBody,/search_company/);
  server.close();
});
