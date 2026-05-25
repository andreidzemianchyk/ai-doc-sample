# ADR-0023 — Externalise Django static assets to S3 + CloudFront for CWA

## Status

**Accepted.** Source page `473719415`.

## Context

The Clinic Web App (CWA) and the Project H Admin Web App are Django services that currently serve their own static assets (JS, CSS, images) from inside the application container. For the Admin Web App — low-traffic, internal — this is acceptable. For CWA — used by clinicians, clinic administrators, and patient onboarding flows — it couples static delivery to Django release cadence, eats application-container CPU on every static request, and inflates Docker image sizes. Cache headers and edge delivery are not optimised because Django is not a CDN.

## Decision

Introduce **CloudFront as the single public entry point** for the CWA domain (`provider.{env}.project-h.health`) and split traffic by path:

- `/static/*` → S3 origin (private bucket `cwa_static_content`, accessed via Origin Access Control), cached at edge.
- All other paths → ALB → Django.

Django config remains `STATIC_URL = "/static/"`. Static asset URLs (`https://provider.{env}.project-h.health/static/...`) do not change from the user's perspective. The CI/CD pipeline gains a static-assets step (`collectstatic` → `aws s3 sync` with one-year `Cache-Control` + `immutable`) decoupled from the Django Docker build. Hashed filenames are optionally enabled for cache busting. Optional ALB-side hardening restricts direct ALB access to CloudFront only. Media uploads (user-generated content), advanced CDN optimisation, and frontend redesign are explicitly **out of scope** for this ADR.

## Alternatives considered

- **Direct S3 static bucket without CloudFront.** Pros: simpler. Cons: no edge caching, S3 cost per request, exposes a separate bucket URL. *Rejected* — CloudFront is the value-add.
- **Keep static assets inside Django.** Pros: zero infra change. Cons: same problems that motivated the ADR. *Rejected.*
- **Self-host an Nginx-based static server in front of Django.** Pros: gets caching without CDN. Cons: still single-region, still operational burden, still no edge presence. *Rejected.*

## Consequences

### Positive

- Static-asset and Django release cadence decouple — frontend tweaks can ship without a Django redeploy.
- Application-container CPU stops serving static content; per-environment Django worker count can shrink.
- Edge caching meaningfully improves clinician page load times outside the application's deployment region.

### Negative

- CloudFront + S3 + Origin Access Control + ALB-restriction is more moving parts to provision and monitor; per-environment Terraform grows.
- Cache invalidation is now its own concern — long-cache static + hashed filenames is the recommended pattern, but in-place asset overwrites no longer self-invalidate.

### Open

- **Cache-bust strategy.** Hashed filenames (`collectstatic --post-process`) vs CloudFront invalidation API per release. *Owner:* Tech Lead + DevOps. *Outcome:* pick before first PROD rollout.
- **ALB→CloudFront-only enforcement.** Optional hardening, deferred. *Owner:* DevOps + Architect.

## Notes

Sourced from Confluence page `473719415`. Deployment-view diagram needs an update to reflect CloudFront + S3 static origin — see the related Architect task in the source page. Builds on the Terraform scaffolding from [ADR-0002](0002-components-initialization-dev-environment.md).
