# Architecture

```mermaid
flowchart LR
  E[Public evidence] --> C[CRD capability inventory]
  C --> W[Generated static website]
  C --> M[MCP tool mapping]
  D[Synthetic company data] --> F[Shared capability functions]
  F --> H[HTTP playground API]
  F --> M
```

The diagram is illustrative. The CRD files are the semantic source of truth. Website pages are generated projections. MCP tools and HTTP routes call the same software-primary capability functions. The decision brief composes several capabilities while retaining their separate CRDs.

