# AI Doc Sample

!!! note "Placeholder content"
    This is temporary starter content. Real material will be added later, based on the project's source artifacts.

## About

This site is a sample of how project documentation can be published as a static website. It is built with [MkDocs](https://www.mkdocs.org/) and the [Material for MkDocs](https://squidfunk.github.io/mkdocs-material/) theme, and deployed to GitHub Pages via GitHub Actions.

## Documentation map

- [Architecture](architecture.md) — architecture vision and key decisions
- [Technical Approach](technical-approach.md) — technology stack and engineering practices
- [Methodology](methodology.md) — process, artifacts, and roles

## Local development

```bash
pip install -r requirements.txt
mkdocs serve
```

The site will be available at `http://127.0.0.1:8000`.

## Deployment

Every push to the `main` branch triggers a GitHub Actions workflow that builds the site and publishes it to GitHub Pages.
