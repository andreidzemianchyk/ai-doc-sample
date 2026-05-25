# Project H — Sample Documentation

A demonstration documentation artifact authored by AndersenLab. Applies the methodology described in *SourceWare Technical Approach* to a real anonymised healthcare presale substrate (anonymised as *Project H*). The artifact is honest demonstration work, not redacted client documentation.

**Live site:** https://andreidzemianchyk.github.io/ai-doc-sample/

## What's here

| Path | What it shows |
| --- | --- |
| `docs/` | The published sample site — 19 markdown deliverables arranged in the full engagement layout from *SourceWare Technical Approach* §3 (root AI conventions, `architecture/`, `schema/`, `modules/<module>/`, `companion/`). Methodology-evidence logs live separately under `internal/review/` and are excluded from the published site. |
| `docs/architecture/overview.md` | The architecture document, with C4 L1/L2/L3 in Mermaid and two embedded architect-grade analysis callouts. |
| `docs/architecture/diagrams/` | Five standalone diagram pages (C4 L1, C4 L2, two L3 component views, MVP deployment) with full-screen viewer support. |
| `docs/schema/tables/patient-profile.md` | The worked example of the wide-table iterative column-classification methodology (TA §5.1). Highest-leverage artifact in the sample. |
| `docs/modules/auth-authorization/` | Per-module documentation set: overview with flowchart + state diagram, business-rule catalog with stable IDs, EPIC vs non-EPIC variations doc. |
| `docs/architecture/decisions/` | MADR ADRs in both modes per TA §2 — ADR-0001 retrospective (MyChart as per-clinic SSO), ADR-0002 forward (Mermaid for inline diagrams). |
| `internal/review/` | Methodology-evidence logs (cross-LLM peer review template, AI-readability acceptance test battery). Excluded from the published site — they are process artefacts for an internal reader. |
| `context/project-h/` | Source-of-truth context bundle used to author the sample. The doc-generation brief here is the substrate-adaptation contract; the diagrams index and Mermaid reconstructions are the raw inputs. |

## How to read it

- **First-time visitor (15 min):** [architecture overview](https://andreidzemianchyk.github.io/ai-doc-sample/architecture/overview/) → [patient-profile table](https://andreidzemianchyk.github.io/ai-doc-sample/schema/tables/patient-profile/) → [business rules](https://andreidzemianchyk.github.io/ai-doc-sample/modules/auth-authorization/business-rules/).
- **AI agent:** start at [CLAUDE.md](https://andreidzemianchyk.github.io/ai-doc-sample/CLAUDE/).
- **Methodology reviewer:** [ADR-0001](https://andreidzemianchyk.github.io/ai-doc-sample/architecture/decisions/0001-mychart-as-per-clinic-sso/) → architectural-assessment callouts in [overview](https://andreidzemianchyk.github.io/ai-doc-sample/architecture/overview/#architectural-assessments) → per-doc `## Open questions` sections.

## Substrate note for the presale reader

The sample demonstrates **method and quality bar**. The substrate (Project H, healthcare presale) differs from a legacy commercial-system substrate like SourceWare: there is no committed code, so the column-classification methodology in `docs/schema/tables/patient-profile.md` cites Confluence page IDs and user-story IDs in place of `file_path:line` references. The methodology and discipline transfer; the *citation surface* differs by substrate. A companion artifact at [`docs/companion/erpnext-tab-sales-invoice.md`](docs/companion/erpnext-tab-sales-invoice.md) (published at [andreidzemianchyk.github.io/ai-doc-sample/companion/erpnext-tab-sales-invoice/](https://andreidzemianchyk.github.io/ai-doc-sample/companion/erpnext-tab-sales-invoice/)) applies the same methodology to a real open-source legacy substrate (ERPNext's `tabSales Invoice`) so the reader sees the citation-against-real-code variant of the same beats.

## Local development

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
mkdocs serve
```

Site available at `http://127.0.0.1:8000`.

## Deployment

Every push to `main` triggers `.github/workflows/deploy.yml`, which installs MkDocs Material, builds with `mkdocs build --strict`, and publishes to GitHub Pages.

## Branding

This is AndersenLab work. Grep for "Innowise" must return zero before any delivery push.
