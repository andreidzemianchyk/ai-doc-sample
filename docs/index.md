# Project H — Sample Documentation

!!! note "What this is"
    A **demonstration documentation artifact** authored by AndersenLab, applying the methodology described in *SourceWare Technical Approach* to a real anonymised presale substrate (anonymised as *Project H*). Honest demonstration work — not redacted client documentation.

## One-paragraph framing

Project H is a precision-psychiatry SaaS platform targeting US primary-care providers, designed to address an estimated 50–80 % mental-health misdiagnosis rate. The platform embeds validated questionnaires and cognitive games into clinician workflow via EPIC EHR integration. The architecture is hosted on AWS HIPAA-eligible managed services, classified as a Class I CDSS (FDA premarket-exempt), and targets HIPAA, SOC 2 Type II, OWASP ASVS, and WCAG 2.1 AA compliance. This sample documents the **MVP design as captured during discovery** — the substrate is pre-implementation, so where the SourceWare engagement would cite `file_path:line` from a legacy codebase, this sample cites source page IDs and user-story IDs from the discovery corpus.

## Scope of this sample

A representative slice of a full engagement deliverable: architecture (with C4 L1/L2/L3), schema layer, one fully-documented module (Auth & Authorization), MADR ADRs in both retrospective and forward modes, AI-agent entry points, and a companion artifact applying the same methodology against a real open-source legacy codebase.

> **Substrate note.** The sample demonstrates *method and quality bar*. The substrate here (Project H, healthcare presale, discovery-phase) differs from a legacy commercial-system substrate like the one in the original *SourceWare Technical Approach* §5.1 examples: there is no committed code, so the column-classification methodology in [`schema/tables/patient-profile.md`](schema/tables/patient-profile.md) cites Confluence page IDs and user-story IDs in place of `file_path:line` references. **The methodology and discipline transfer; the citation surface differs by substrate.** A companion artifact under [`companion/erpnext-tab-sales-invoice/`](companion/erpnext-tab-sales-invoice.md) applies the same column-classification beats to a real open-source legacy substrate (ERPNext's `tabSales Invoice`, ~150 columns, real code-citable references) so the reader sees the citation-against-real-code variant alongside the discovery-phase variant.

| Section | What it demonstrates |
| --- | --- |
| [Architecture overview](architecture/overview.md) | Standing legacy-system architecture template + C4 L1/L2/L3 in Mermaid + embedded architect-grade analysis notes |
| [Integration points](architecture/integration-points.md) | External-systems catalog with a consistent per-system contract shape |
| [Data flows](architecture/data-flows/patient-onboarding.md) | High-stakes flows surfaced as standalone artefacts |
| [Release coexistence](architecture/release-coexistence.md) | Cross-cutting coexistence view (analog of legacy-2.0-coexistence) |
| [ADR-0001](architecture/decisions/0001-mychart-as-per-clinic-sso.md) (retrospective) and [ADR-0002](architecture/decisions/0002-mermaid-for-inline-diagrams.md) (forward) | MADR in both modes per TA §2 |
| [Schema overview](schema/overview.md) + [Relationships](schema/relationships.md) + [Naming inconsistencies](schema/naming-inconsistencies.md) | Schema-layer framing, implicit FK catalog, spec-level gaps |
| [Patient profile table](schema/tables/patient-profile.md) | Wide-table iterative column-classification process — the highest-leverage artefact |
| [Auth & Authorization module](modules/auth-authorization/overview.md) | Per-module documentation template with flowchart + state diagram |
| [Business rules](modules/auth-authorization/business-rules.md) | Catalog-first business-rule documentation with stable IDs |
| [Variations](modules/auth-authorization/variations.md) | Multi-implementation documentation (analog of legacy-vs-2.0, EPIC vs non-EPIC fork) |
| [CLAUDE.md](CLAUDE.md) · [AGENTS.md](AGENTS.md) · [module CLAUDE.md](modules/auth-authorization/CLAUDE.md) | AI-native entry points with task routing |
| [CONVENTIONS.md](CONVENTIONS.md) | Annotation legend, validate-flag syntax, doc structure rules, reader modes, tooling expectations |
| [GLOSSARY.md](GLOSSARY.md) | Domain ubiquitous-language with source citations per term |

## Future expansion

A complete engagement would add the folders intentionally omitted from this slice:

- Clinical-logic catalog (`clinical-logic/recommendation-rules.md`, `clinical-logic/screening-criteria.md`, `clinical-logic/cpt-coding.md`)
- Process docs (integration plan, sync-with-code, authoring-cadence)
- Extended data-flows set (subscription lifecycle, follow-up cycle, red-flag alert, data-deletion request)
- Rolled-up open-question registers at the `schema/` and `modules/` levels (this slice uses per-doc `## Open questions` sections instead)
- `llms.txt` — deferred until MkDocs Material toolchain support is verified

## How this sample was produced

The sample was produced using AI-assisted drafting against the discovery corpus, with structured validation, explicit uncertainty tracking, and architect-level review embedded in the deliverables. Every substantive claim cites a source page ID or user-story ID; unresolved items live as `> [!warning]` callouts and per-doc `## Open questions` sections rather than as silent guesses.

## How to read this

- **First-time visitor (15-minute scan):** [Architecture overview](architecture/overview.md) → [Patient profile table](schema/tables/patient-profile.md) → [Business rules](modules/auth-authorization/business-rules.md). These three documents anchor everything else and demonstrate the highest-stakes methodology beats (column classification, business-rule catalog, embedded architect notes).
- **AI agent:** start at [CLAUDE.md](CLAUDE.md). The routing rules and known-gotchas list are designed to be parsed by an agent before any substantive task.
- **Architect peer reviewer:** [ADR-0001](architecture/decisions/0001-mychart-as-per-clinic-sso.md) → the [architectural-assessment callouts](architecture/overview.md#architectural-assessments) in the overview → the `## Open questions` section at the bottom of each major document.

---

*This sample is the methodology and quality bar AndersenLab would apply to a real engagement. The artefact deliberately stops at "representative slice" — see *Future expansion* above for what a complete engagement would add.*
