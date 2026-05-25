# ADR-0020 — Clinician management

## Status

**Proposed (diagram-only in source).** Source page `456632062`.

## Context

Clinic Web App users include clinic administrators and clinicians. The clinical workflow needs a way to enrol clinicians under a clinic, manage their access, and bind each clinician's identity to the reports they receive in their EPIC In Basket. The discovery corpus contains a flowchart for clinician management but no narrative description of the decision; this ADR captures the working understanding pending fill-in.

> [!warning]
> The source Confluence page is currently diagram-only. The decision shape below is reconstructed from adjacent context (Clinic Web App role, EPIC In Basket binding, audit-log expectations from [ADR-0016](0016-audit-log.md)). Validate before relying on specifics.

## Decision

Clinicians are first-class users in the Clinic Web App, scoped per clinic and managed by clinic administrators. Identity is backed by AWS Cognito (clinic user pool); the clinician's EPIC identity (provider id used in HL7 / FHIR routing) is linked via a `backoffice_user.epic_provider_id` field. Clinic administrators can invite, activate, deactivate, and reassign patients between clinicians within their clinic. Every clinician-management action writes to `system_audit_log` per [ADR-0016](0016-audit-log.md).

## Alternatives considered

- **Single global clinician directory at the Project H level.** Pros: one source of truth. Cons: violates the per-clinic isolation invariant; a Project H Admin shouldn't manage individual clinic clinicians. *Rejected.*
- **Clinicians self-register via EPIC SSO without clinic-admin gating.** Pros: lower friction. Cons: no clinic-side approval gate; mismatched with how clinics expect provisioning to work. *Rejected.*

## Consequences

### Positive

- Per-clinic isolation is preserved at the user-management layer.
- EPIC provider id is the link from a clinician identity to their EPIC In Basket — concrete and auditable.
- Audit-log integration is consistent with the broader compliance story.

### Negative

- Clinic administrators bear the burden of clinician lifecycle management — no automated provisioning. Lift via SCIM or EPIC-driven sync is a future task.
- Specifics (invite mechanism, password reset for clinicians on a clinic that uses MyChart, etc.) are not nailed down in the source.

### Open

- **Source page is diagram-only** — every field listed above needs validation. *Owner:* BA + Architect. *Outcome:* fill the Confluence page, then re-cite here.
- **SCIM or EPIC-driven clinician sync** — future feature; not in MVP scope.

## Notes

Sourced from Confluence page `456632062` (diagram only). Audit shape derives from [ADR-0016](0016-audit-log.md); identity shape derives from [ADR-0001](0001-mychart-as-per-clinic-sso.md) and the per-clinic Cognito pool in [ADR-0002](0002-components-initialization-dev-environment.md).
