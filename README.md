# ai-doc-sample

Sample documentation site built with [MkDocs Material](https://squidfunk.github.io/mkdocs-material/) and deployed to GitHub Pages via GitHub Actions.

Live site: **https://andreidzemianchyk.github.io/ai-doc-sample/** (available after the first successful deploy)

## Local development

```bash
# 1. Create a virtual environment (optional but recommended)
python3 -m venv .venv
source .venv/bin/activate

# 2. Install dependencies
pip install -r requirements.txt

# 3. Start the local dev server with hot reload
mkdocs serve
```

The site will be available at `http://127.0.0.1:8000`.

## Project layout

```
.
├── mkdocs.yml              # site configuration
├── requirements.txt        # Python dependencies
├── docs/                   # documentation sources (Markdown)
│   ├── index.md
│   ├── architecture.md
│   ├── technical-approach.md
│   └── methodology.md
└── .github/workflows/
    └── deploy.yml          # CI: build and deploy to GitHub Pages
```

## Deployment

Deployment is automatic. Every push to `main` triggers the workflow in `.github/workflows/deploy.yml`, which:

1. Installs Python and `mkdocs-material`.
2. Builds the site with `mkdocs build --strict`.
3. Publishes the artifact to GitHub Pages via `actions/deploy-pages`.

### One-time GitHub Pages setup

After the first push, go to the repository once: **Settings → Pages → Build and deployment → Source: GitHub Actions**.

## Adding a new page

1. Create a `.md` file under `docs/` (or in a subdirectory).
2. Add it to the `nav:` section in `mkdocs.yml`.
3. Commit and push — deployment runs automatically.
