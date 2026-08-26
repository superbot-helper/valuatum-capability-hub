# Valuatum Financial Intelligence Capability Hub

Unofficial recruitment-task prototype demonstrating how publicly observable Valuatum financial-intelligence products can be documented as reusable Capability MLEs and projected into a website, an HTTP playground, and MCP tools.

## What is here

- `crd/`: canonical capability inventory, one structured CRD per capability, evidence, and source context.
- `mock-data/`: fictional companies and synthetic analytical outputs.
- `mcp/`: stateless TypeScript MCP and HTTP demo service.
- `site/`: dependency-light static site generated directly from the CRD files.
- `docs/`: architecture, assumptions, API notes, decision log, and demo script.

## Local use

```bash
cd mcp
npm install
npm test
npm run dev

cd ../site
npm run build
npm run serve
```

The MCP service defaults to `http://localhost:8080`; the generated site defaults to `http://localhost:4173`.

## Status

Cloud Run MCP service: `https://vf-capability-tuasvqm3oa-lz.a.run.app/mcp`

Public repository: `https://github.com/valto/valuatum-capability-hub`

Public capability site: `https://valto.github.io/valuatum-capability-hub/`

See `docs/assumptions.md` for limitations.
