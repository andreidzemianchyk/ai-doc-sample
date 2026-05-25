# ADR-0003 — Backup code validation endpoint

## Status

**Accepted.** Source page `425569225`.

## Context

Patient onboarding has two entry paths — Universal Link with embedded invite token, and a 6-character backup code entered manually if the link fails ([ADR-0001](0001-mychart-as-per-clinic-sso.md)). Both paths need the same backend treatment: resolve the patient's clinic, return the correct OAuth login URL, decide EPIC vs non-EPIC flow, and create the minimum patient record needed for downstream auth. A single unauthenticated endpoint that handles both inputs keeps the mobile state machine simple.

## Decision

One unauthenticated POST endpoint accepts the code (from the link or manual entry) plus the list of consent IDs the patient just accepted. Backend validates the 6-character format, looks up the code in `registration_code` filtered by expiration, and returns `flow_type` (epic | non-epic), `auth_url` (MyChart for EPIC, Cognito for non-EPIC), `patient_code` (EPIC patient code for EPIC flow, internal patient code for non-EPIC), and `clinic_code` (used for all subsequent authenticated requests). For non-EPIC flow the backend additionally creates the Cognito user (Admin REST API, temp password, email as login) before responding. Patient and consent rows are written transactionally so onboarding cannot half-succeed.

## Alternatives considered

- **Two separate endpoints (link-token vs backup-code).** Pros: clearer API surface. Cons: doubles the test matrix and the mobile state machine; the validation logic is identical so the only difference would be the input field name. *Rejected.*
- **Defer Cognito user creation until first sign-in.** Pros: smaller blast radius on validation failure. Cons: introduces a "patient row exists but no Cognito user yet" state that complicates re-entry. *Rejected* — create up-front, roll back on transaction failure.

## Consequences

### Positive

- Mobile app calls one endpoint regardless of input path; offline/online retry logic stays simple.
- Consent capture is atomic with patient creation — no orphaned consent rows.
- The same endpoint shape can carry a third future path (e.g. clinician-initiated re-onboarding) without an API break.

### Negative

- Unauthenticated endpoint expanding the attack surface; mitigated by rate limiting on `code` + expiration window enforced at DB lookup.
- Backup-code length is the entropy budget for the whole onboarding flow ([BR-003](../../modules/auth-authorization/business-rules.md)); the 6-character choice is TBD pending workshop.

### Open

- **Brute-force protection.** Is rate-limiting by source IP enough, or do we also need per-`clinic_code` throttling? *Owner:* Security Lead. *Outcome:* policy decision before endpoint ships.

## Notes

Sourced from Confluence page `425569225`. Operationalises [BR-003](../../modules/auth-authorization/business-rules.md) and [BR-004](../../modules/auth-authorization/business-rules.md).
