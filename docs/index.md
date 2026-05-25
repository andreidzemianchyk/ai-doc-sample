# Project H — Sample Documentation

!!! note "What this is"
    This site is a **demonstration documentation artifact** authored by AndersenLab. It applies the methodology described in *SourceWare Technical Approach* to a real anonymised presale substrate (anonymised as *Project H*). The artifact is honest demonstration work, not redacted client documentation.

## One-paragraph framing

Project H is a precision-psychiatry SaaS platform targeting US primary-care providers, designed to address an estimated 50–80 % mental-health misdiagnosis rate. The platform embeds validated questionnaires and cognitive games into clinician workflow via EPIC EHR integration. The architecture is hosted on AWS HIPAA-eligible managed services, classified as a Class I CDSS (FDA premarket-exempt), and targets HIPAA, SOC 2 Type II, OWASP ASVS, and WCAG 2.1 AA compliance. This sample documents the **MVP design as captured during discovery** — the substrate is pre-implementation, so where the SourceWare engagement would cite `file_path:line` from a legacy codebase, this sample cites source page IDs and user-story IDs from the discovery corpus.

## Scope of this sample

This sample mirrors the **full engagement repository layout** from *SourceWare Technical Approach* §3 so the reader sees the same shape a real engagement would deliver. We expand beyond the demo minimum (8 files) to 19 markdown deliverables + 2 methodology-evidence logs because the goal is to foreshadow the real deliverable, not to hit the demo floor.

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
| [Cross-LLM review log](_review/cross-llm-review.md) and [AI-readability test log](_review/ai-readability-test.md) | Methodology evidence — Prompt §10 deliverables |

## Future expansion

TA §3 lists several folders intentionally omitted from this slice:

- `business-logic/` analog (`clinical-logic/recommendation-rules.md`, `clinical-logic/screening-criteria.md`, `clinical-logic/cpt-coding.md`)
- `process/` (integration plan, sync-with-code, authoring-cadence)
- Extended `data-flows/` set (subscription lifecycle, follow-up cycle, red-flag alert, data-deletion request)
- Rolled-up `open-questions.md` files at `schema/` and `modules/.../` levels (sample uses per-doc `## Open questions` sections instead)
- `llms.txt` — deferred until the MkDocs Material toolchain support is verified

## How this sample was produced

Authored end-to-end against TA §4's five-stage loop:

1. **Stage 1 — Corpus ingestion.** 54 source Confluence pages, 9 draw.io diagrams (PNG + .mxfile sources), Vision & Scope artefacts, and the AVD template were captured into a single context bundle (`context/project-h/` in this repo). Every substantive claim downstream cites a source page ID or user-story ID.
2. **Stage 2 — Draft generation.** Each document was generated against the combined corpus; the source page and US ID is cited inline.
3. **Stage 3 — Explicit uncertainty.** `> [!warning]` callouts and per-doc `## Open questions` sections capture what is not yet pinned. The full master list of source-level TBDs is in `context/project-h/project-h-doc-generation-brief.md` §7.
4. **Stage 4a — Cross-LLM peer review.** Run on the three high-stakes documents (architecture overview, patient-profile wide-table, business-rules) — the [log](_review/cross-llm-review.md) records each finding and its resolution.
5. **Stage 4b — Embedded architect-grade analysis.** The two `> [!note] Architectural assessment` callouts in the [architecture overview](architecture/overview.md) surface weak spots discovered during authoring (per-clinic EPIC integration cost; CDSS Class I boundary). No live architect-review session in this demonstration.
6. **Stage 5 — Resolution and merge.** Resolved items updated the docs; unresolved items live in per-doc `## Open questions` sections.

The [AI-readability test log](_review/ai-readability-test.md) is a separate methodology artefact — it captures the scripted task battery the CLAUDE.md / AGENTS.md / module-CLAUDE.md entry points are tested against.

## How to read this

- **First-time visitor (15-minute scan):** [Architecture overview](architecture/overview.md) → [Patient profile table](schema/tables/patient-profile.md) → [Business rules](modules/auth-authorization/business-rules.md). These three documents anchor everything else and demonstrate the highest-stakes methodology beats (column classification, business-rule catalog, embedded architect notes).
- **AI agent:** start at [CLAUDE.md](CLAUDE.md). The routing rules and known-gotchas list are designed to be parsed by an agent before any substantive task.
- **Architect peer reviewer:** [ADR-0001](architecture/decisions/0001-mychart-as-per-clinic-sso.md) → [Architectural-assessment callouts](architecture/overview.md) → [Open questions across docs] (each major doc has its own `## Open questions` section).

---

*This sample is the methodology and quality bar AndersenLab would apply to a real engagement. The artefact deliberately stops at "representative slice" — see *Future expansion* above for what a complete engagement would add.*
