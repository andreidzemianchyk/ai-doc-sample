# Project H — Documentation

Engineering documentation for Project H, a precision-psychiatry SaaS platform integrating with EPIC EHR. Published as a static site at **https://andreidzemianchyk.github.io/ai-doc-sample/**.

## What's here

| Path | What it shows |
| --- | --- |
| `docs/` | The published documentation site — architecture, schema, modules, decisions, conventions, and AI-agent entry points. |
| `docs/architecture/overview.md` | The architecture overview: scope, key design decisions, living risks, drivers, quality attributes, C4 L1/L2/L3, deployment view, operations, embedded architectural assessments. |
| `docs/architecture/diagrams/` | Standalone, full-size renderings of each C4 view and the MVP deployment topology. |
| `docs/schema/tables/patient-profile.md` | Worked example of the column-classification process on the `patient_profile` composite. |
| `docs/modules/auth-authorization/` | Per-module documentation: overview with flowchart + state diagram, business-rule catalogue with stable IDs, EPIC-vs-non-EPIC variations. |
| `docs/architecture/decisions/` | MADR decision records. |
| `internal/review/` | Cross-LLM peer-review log and AI-readability acceptance test battery. Excluded from the published site; lives in the repo for internal reviewers. |
| `context/project-h/` | Source-of-truth context bundle the docs were generated from — full-text snapshot of the Confluence corpus, diagrams index, Mermaid reconstructions. |

## How to read it

- **First-time visitor (15 min):** [architecture overview](https://andreidzemianchyk.github.io/ai-doc-sample/architecture/overview/) → [patient-profile table](https://andreidzemianchyk.github.io/ai-doc-sample/schema/tables/patient-profile/) → [business rules](https://andreidzemianchyk.github.io/ai-doc-sample/modules/auth-authorization/business-rules/).
- **AI agent:** start at [CLAUDE.md](https://andreidzemianchyk.github.io/ai-doc-sample/CLAUDE/).
- **Methodology reviewer:** [ADR-0001](https://andreidzemianchyk.github.io/ai-doc-sample/architecture/decisions/0001-mychart-as-per-clinic-sso/) → architectural-assessment callouts in [overview](https://andreidzemianchyk.github.io/ai-doc-sample/architecture/overview/#architectural-assessments) → per-doc `## Open questions` sections.

## Local development

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
mkdocs serve
```

Site at `http://127.0.0.1:8000`.

## Deployment

Every push to `main` triggers `.github/workflows/deploy.yml`, which installs MkDocs Material, builds with `mkdocs build --strict`, and publishes to GitHub Pages.
