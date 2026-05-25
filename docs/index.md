# Project H — Documentation

Project H is a precision-psychiatry SaaS platform for US primary-care providers. It addresses an estimated 50–80 % mental-health misdiagnosis rate by embedding validated diagnostic questionnaires and gamified cognitive assessments into clinician workflow via EPIC EHR integration. The architecture runs on AWS HIPAA-eligible managed services, is classified as a Class I CDSS (FDA premarket-exempt), and targets HIPAA, SOC 2 Type II, OWASP ASVS, and WCAG 2.1 AA compliance.

This site is the engineering documentation: architecture, schema, modules, decisions, and conventions.

## Documentation map

| Section | What's there |
| --- | --- |
| [Architecture overview](architecture/overview.md) | System scope, key design decisions, living risks, architectural drivers, quality attributes, C4 L1/L2/L3 diagrams, deployment view, operations, and embedded architectural assessments. |
| [Diagrams](architecture/diagrams/c4-l1-system-context.md) | Standalone, full-size renderings of each C4 view (System Context, Container, Component) and the MVP deployment topology. |
| [Integration points](architecture/integration-points.md) | External systems Project H integrates with — EPIC / MyChart, FDB, Stripe, Intercom, plus the AWS managed-service surface — each with auth, direction, cardinality, and failure mode. |
| [Data flows](architecture/data-flows/patient-onboarding.md) | End-to-end flows for the highest-stakes paths: patient onboarding, report-to-clinician. |
| [Release coexistence](architecture/release-coexistence.md) | How MVP, 2nd-release, and 3rd-release feature sets coexist on the same code base and data store. |
| [Architecture decisions](architecture/decisions/0001-mychart-as-per-clinic-sso.md) | MADR decision records. |
| [Schema](schema/overview.md) | Database schema layer: framing, naming conventions, implicit-FK catalogue, naming-inconsistency register, table-level documentation (worked example: `patient_profile`). |
| [Auth & Authorization](modules/auth-authorization/overview.md) | Per-module documentation: module overview, business-rule catalogue with stable IDs, and the EPIC-vs-non-EPIC variations doc. |
| [Conventions](CONVENTIONS.md) | Annotation legend, validate-flag syntax, decision-record format, diagram-tool defaults. |
| [Glossary](GLOSSARY.md) | Domain vocabulary with source citations per term. |
| [AI entry points](CLAUDE.md) | Routing rules + known gotchas for AI agents working in this repository. |

## How to read it

- **First-time visitor (15 min):** [Architecture overview](architecture/overview.md) → [Patient profile table](schema/tables/patient-profile.md) → [Business rules](modules/auth-authorization/business-rules.md).
- **AI agent:** start at [CLAUDE.md](CLAUDE.md).
- **Architect / peer reviewer:** [ADR-0001](architecture/decisions/0001-mychart-as-per-clinic-sso.md) → the [architectural-assessment callouts](architecture/overview.md#architectural-assessments) in the overview → the `## Open questions` section at the bottom of each major document.

## Citations

The architecture and business rules are sourced from the project's Confluence specs. Citations through the docs point to Confluence page IDs and user-story IDs (e.g., `Epic-1 Mobile US-1.5 Scenario 2`).
