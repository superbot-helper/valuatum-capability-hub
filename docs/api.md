# MCP and HTTP interface

- Health in the local service: `GET /healthz`
- Health through the deployed Cloud Run frontend: `GET /healthz/` (the exact no-slash path is intercepted by the platform frontend in this deployment)
- MCP: `POST /mcp`
- Browser demo: `POST /api/create_decision_brief`
- Company list: `GET /api/companies`

MCP tools: `search_company`, `get_financial_profile`, `assess_credit_risk`, `estimate_company_value`, `compare_companies`, `create_decision_brief`, and `list_capabilities`.

The service pins official `@modelcontextprotocol/sdk` version 1.30.0. It uses stateless Streamable HTTP through one `/mcp` endpoint. The requested `2026-07-28` protocol target is recorded as prototype metadata; actual wire-version negotiation is controlled by the SDK and client, so the repository does not claim unsupported protocol conformance.

Deployed MCP endpoint: `https://vf-capability-tuasvqm3oa-lz.a.run.app/mcp`
