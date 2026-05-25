# Project H — AI Agent Entry Point

> **Canonical AI instructions for every agent** operating in this repository — Claude Code primary; Cursor, GitHub Copilot, Codex CLI, OpenHands, and other AGENTS.md-aware tools read the same content via the [AGENTS.md](AGENTS.md) filename alias. **This file is the single source of truth.**

## What this system is

Project H is a precision-psychiatry SaaS platform targeting US primary-care providers. Three apps in delivery scope: a React Native iOS-only MVP **Patient Mobile App**; a Python/Django Admin **Clinic Web App** with an EPIC plugin for patient onboarding; and a **Clinician Report** assembled server-side and delivered into EPIC via three FHIR resources (Observation, Condition, DocumentReference). A fourth app — the Project H Admin Web App — is explicitly out of Andersen's delivery scope.

Code is not yet committed for the MVP. The architecture and business rules are sourced from the project's Confluence specs; citations through the docs point to Confluence page IDs and user-story IDs (e.g., `Epic-1 Mobile US-1.5 Scenario 2`). Once code lands, `file_path:line` references are added alongside the existing citations — see [Conventions](CONVENTIONS.md).

## Read these before doing anything substantive

- [Architecture overview](architecture/overview.md) — system boundaries, key design decisions, living risks, C4 L1/L2/L3.
- [CONVENTIONS.md](CONVENTIONS.md) — annotation legend, validate-flag syntax, MADR convention, reader modes.
- [GLOSSARY.md](GLOSSARY.md) — domain vocabulary with source citations.

## Task routing

| If you are about to… | Read first |
| --- | --- |
| Touch the architecture, system shape, integration boundaries | [architecture/overview.md](architecture/overview.md) → [integration-points.md](architecture/integration-points.md) |
| Work on patient sign-up / MyChart / invite link / backup code / biometric | [modules/auth-authorization/overview.md](modules/auth-authorization/overview.md) → [business-rules.md](modules/auth-authorization/business-rules.md) → [variations.md](modules/auth-authorization/variations.md) |
| Touch the patient data model, FHIR mapping, FDB-coded fields | [schema/overview.md](schema/overview.md) → [tables/patient-profile.md](schema/tables/patient-profile.md) → [relationships.md](schema/relationships.md) |
| Add or evaluate a design decision | [Decision log](architecture/decisions/0001-mychart-as-per-clinic-sso.md) — 23 MADR ADRs covering auth/SSO, tokens, biometric, FDB integration, logging, audit, retention, HL7 / FHIR delivery to EPIC, release coordination, branch policy. See [CONVENTIONS.md](CONVENTIONS.md) for the MADR format. |
| Work on a high-stakes flow (onboarding, report exchange) | [architecture/data-flows/](architecture/data-flows/patient-onboarding.md) |

## Known gotchas

- **Per-clinic EPIC/MyChart instance.** Never assume a single EPIC backend. Each clinic has its own EPIC EHR + MyChart, and the patient's clinic is resolved from the invite link or backup code *before* the MyChart login URL can be built. The architectural-assessment note in [overview.md](architecture/overview.md) calls out a refactor surface for this.
- **Consents come before MyChart OAuth.** Reordering breaks the HIPAA-alignment claim. See BR-002 in [business-rules.md](modules/auth-authorization/business-rules.md).
- **Reports are clinician-facing by default.** Patients can request them via HIPAA, never automatically pushed back into MyChart.
- **FHIR Observation is mandatory for clinician notification.** Sending Condition + DocumentReference without Observation does NOT trigger the EPIC Inbound Queue / In Basket notification — the clinician never sees the report. See AVD 4.4 EPIC EHR Integration View and the [report-to-clinician data flow](architecture/data-flows/report-to-clinician.md).
- **CDSS Class I boundary.** Recommendations live inside the PDF (via DocumentReference link), not as structured FHIR (MedicationRequest / CarePlan). Pushing recommendations through structured resources would cross into Class II territory — the architectural-assessment callout in [overview.md](architecture/overview.md) flags this as a future-feature gate.
- **Per-clinic config not abstracted in the discovery design.** OAuth2 redirect URIs, App Orchard client IDs, FHIR endpoint bases, sandbox-vs-prod flags are spec'd as per-clinic literals with no central store. The architectural-assessment note proposes a config-store extraction. Under the design as-is, every new clinic onboarding is linear-cost.

## Conventions you must follow

- **`> [!warning]` callouts** for paragraph-level uncertainty visible in the rendered docs site; **`<!-- VALIDATE: … -->`** inline comments for line-level uncertainty (invisible to humans, visible to agents). Both are catalogued in [CONVENTIONS.md](CONVENTIONS.md).
- **`## Open questions` section at the bottom of every major doc.** Never silently complete a doc with guessed information — the open-questions section is a first-class artefact, not a footnote.
- **MADR ADR** for any new design decision. File pattern `architecture/decisions/NNNN-short-slug.md`. Sections: Status / Context / Decision / Alternatives considered / Consequences / Notes.
- **Diagrams in Mermaid by default.** See the diagram-tool decision rule in [CONVENTIONS](CONVENTIONS.md) for the per-diagram-type rule (PlantUML is the escalation target for complex sequences).
- **Andersen branding only.** Never "Innowise". Grep before delivery.

## Notes

- **Filename alias.** [AGENTS.md](AGENTS.md) at the repository root is a thin pointer back to this file. Some agent runtimes (Cursor, Copilot, Codex CLI, OpenHands) discover their entry point by the filename `AGENTS.md` rather than `CLAUDE.md`; the alias makes the same canonical content reachable under both names without duplicating the routing table or the gotcha list.
- The routing rules and gotchas here are refined as the codebase grows — anything that surprises a new agent or a new engineer should be added to the gotchas list.
