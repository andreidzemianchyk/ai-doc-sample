# ADR-0024 — Merge policies and branch protection

## Status

**Accepted.** Source page `477694725`.

## Context

The four Project H repositories (per [ADR-0002](0002-components-initialization-dev-environment.md)) share a release flow `develop → stage → preprod → main`. Without enforced branch protection, this flow drifts — direct pushes, missing reviews on critical branches, off-pattern source branches — each of which can break the mobile-backend release coordination defined in [ADR-0018](0018-consistency-of-production-releases.md). Branch protection rules make the policy machine-checkable.

## Decision

Two protection tiers and a strict branch-naming policy across all four repositories.

**Relaxed protection** (`develop`, `stage`):

- Direct push forbidden; merge only via PR.
- No mandatory approvals.
- Status checks must pass; branch must be up-to-date before merge.
- Branch deletion forbidden.
- PR source restricted to allowed branch types (see below).

**Strict protection** (`preprod`, `main`):

- Direct push forbidden; merge only via PR.
- **At least 2 approvals required.**
- Status checks must pass; branch must be up-to-date.
- Branch deletion forbidden.
- PR source restricted (below).

**Allowed branch naming:**

- `feature-ph-<NN>-<description>` — feature work.
- `fix-ph-<NN>-<description>` — bug fixes.
- `release-x.y.z` — releases (including hotfix variants like `x.y.z+1`).

**Allowed PR sources:**

- Into `develop`, `stage`: `feature-ph-*`, `fix-ph-*`, `release-*` (back-merge).
- Into `preprod`, `main`: `release-*` only.

## Alternatives considered

- **Single protection tier across all branches.** Pros: simpler config. Cons: requiring 2 approvals on `develop` would slow daily feature work; not requiring any on `main` weakens the release gate. *Rejected.*
- **Trunk-based development with no `develop`/`stage`/`preprod`.** Pros: simpler mental model. Cons: doesn't match the four-environment promotion model Project H needs for QA / clinic sandbox / preprod validation. *Rejected.*
- **No enforced branch-name pattern.** Pros: developer freedom. Cons: CI / status-check tooling depends on matching the ticket prefix; loses the cheap ticket-to-branch traceability. *Rejected.*

## Consequences

### Positive

- The release flow is mechanically enforced — accidental direct pushes to `main` are impossible.
- Two approvals on `preprod` / `main` mean every production change has at least two engineer-eyes on it.
- Branch-name pattern lets CI auto-link the PR to its ticket and lets release notes generate themselves from `release-*` PRs.

### Negative

- Stricter rules slow emergency hotfix path — a true outage fix still requires a `release-*` branch and two approvals. Mitigation: clear documented incident process.
- Branch-name enforcement requires GitHub branch-naming rule + a CI check (the rule alone doesn't reject mismatched names on push).

### Open

- **Emergency-hotfix bypass.** Should there be an explicit "incident" approval-1 path on `main` for true outage fixes? *Owner:* Engineering Manager + Security Lead. *Outcome:* policy decision; document in incident runbook.
- **Codeowners / reviewer auto-assignment.** Not in this ADR but a natural next step.

## Notes

Sourced from Confluence page `477694725`. Builds on [ADR-0002](0002-components-initialization-dev-environment.md). Release-coordination shape is in [ADR-0018](0018-consistency-of-production-releases.md).
