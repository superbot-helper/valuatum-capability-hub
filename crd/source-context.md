# Source Context Reference — Valuatum public product surfaces

## Sources

Public pages inspected on 2026-08-26:

- Valuatum corporate site and product navigation: https://www.valuatum.com/
- Valuatum Credit Risk Platform pages, including Company Views, Comparisons, Automatic Credit Reports, and bankruptcy-risk material.
- Valuatum Equity Research pages, including Analysis Engine, Company Valuation Model, Investment Ideas, JavaScript Widgets and REST API.
- Luottoriskit.fi company search, financial-ratio, and credit-risk pages: https://www.luottoriskit.fi/
- Arvonmaaritys.fi valuation service and calculator pages: https://www.arvonmaaritys.fi/
- AI Equity Reports reports, methodology, pricing, and FAQ pages: https://www.aiequityreports.com/
- CreditReports.dk company search, report, valuation, comparison, and methodology pages: https://www.creditreports.dk/en/
- Recruitment assignment and applicant challenge-selection documents supplied locally by the owner.

## Product/system intent

`reasonable inference / rationale`: Across the public surfaces, Valuatum reduces uncertainty in company-related credit, valuation, and investment decisions through structured financial data, analytical models, comparisons, and reports.

`proposed rationale`: The Capability Hub tests whether those observable abilities can be documented and consumed independently instead of only through their current product surfaces.

## Scope

Included: capabilities supported by public evidence across the four named services, plus clearly labelled proposed composition capabilities. Excluded: claims about Valuatum's private architecture, proprietary formulas, internal APIs, customer data, production controls, or commercial terms.

## Cross-cutting constraints

| Constraint | Applies to | Semantic class | Source |
|---|---|---|---|
| Keep observed, inferred, proposed, and unknown claims distinct | all capabilities | rule/invariant | implementation brief |
| Runtime demonstration data must be visibly synthetic | all prototype realizations | rule/invariant | implementation brief |
| Public evidence must not be presented as private architecture knowledge | all capabilities | rule/invariant | implementation brief |
| CRDs remain canonical; MCP and website are projections/realizations | all capabilities | rule/invariant | implementation brief |

## Platform/client exposure matrix

| Capability family | Existing public web/report evidence | Prototype HTTP | Prototype MCP |
|---|---:|---:|---:|
| Company identity and profile | full | full | full |
| Financial information | full | full | full |
| Credit-risk intelligence | full | full | full |
| Valuation intelligence | full | full | full |
| Equity intelligence | full | documentation only | none |
| Comparison | full | full | full |
| Composed decision brief | proposed | full | full |

## Delivery/build sequencing

Non-normative sequence from the execution brief: research and CRD extraction; synthetic data; MCP realization; generated website; integration testing; publication and deployment.

## Test/verification material

The end-to-end scenario uses a fictional procurement manager evaluating a fictional supplier. It composes company identity, financial profile, credit risk, and valuation context into a decision brief while preserving uncertainties and a synthetic-data disclaimer.

## Unmapped or deferred source material

- Payment, account, and report-delivery mechanics are product operations rather than the financial-intelligence focus of this prototype.
- Exact scoring, valuation, and recommendation formulas remain unknown.
- Monitoring and change detection were considered but remain unimplemented because public evidence and time did not justify a complete operational contract.

