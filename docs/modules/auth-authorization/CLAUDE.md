# Auth & Authorization — AI Agent Entry Point

## Purpose

Module covering patient sign up + sign in. Spans the MyChart SMART OAuth2 path (EPIC clinics) and the Cognito + Amplify Authenticator path (non-EPIC clinics) — see [variations](variations.md). Includes invite-link / backup-code validation, consent collection, MyChart authentication, biometric / passcode setup, and dashboard handoff. Does **not** cover the report-to-clinician flow (that's in [data-flows/report-to-clinician](../../architecture/data-flows/report-to-clinician.md)) or the patient-profile data model (that's in [schema/tables/patient-profile](../../schema/tables/patient-profile.md)).

## Before editing

Read in this order:

1. [`overview.md`](overview.md) — module purpose, primary workflows, embedded login flowchart, embedded session-lifecycle state diagram.
2. [`business-rules.md`](business-rules.md) — BR-001 through BR-010+, each with source citations.
3. [`variations.md`](variations.md) — the EPIC vs non-EPIC fork.

For any change touching token storage or refresh logic:

- Re-read [`../../architecture/decisions/0001-mychart-as-per-clinic-sso.md`](../../architecture/decisions/0001-mychart-as-per-clinic-sso.md) — the canonical decision this module operationalises.
- Re-read the OWASP ASVS L2 token-handling requirements (external; not in repo).

For any change touching consent collection:

- Re-read BR-002 in [`business-rules.md`](business-rules.md).
- Re-read [`../../GLOSSARY.md`](../../GLOSSARY.md) on PGHD and HIPAA.

## Known gotchas

- **Consents are collected *before* MyChart OAuth completes** (BR-002). Reordering breaks the HIPAA-alignment claim. The consent flow is part of the onboarding pre-amble, not a post-auth step.
- **The "Set Up Later" path on biometric setup is allowed only once** (BR-008). On the next login the setup screen reappears and is mandatory. The implementation must track the skip count.
- **On token refresh failure (both access and refresh invalid), the user is redirected to the MyChart login screen** regardless of which clinic they belong to. The URL is resolved from local storage (saved on first login) or from a backend lookup. There is an open question about what happens when local storage is cleared *and* the refresh token is invalid simultaneously — see the open questions in [overview.md](overview.md).
- **The login flow has 14 decision points in the AVD 4.5 diagram** (rendered as Mermaid in [`../../architecture/data-flows/patient-onboarding.md`](../../architecture/data-flows/patient-onboarding.md)). Edits touching any decision must be checked against the diagram before merging — the diagram is the source of truth for the flow.
- **Two parallel auth paths** — EPIC (MyChart) and non-EPIC (Cognito). They converge at step 15 (Post Login component) but diverge significantly before that. See [variations](variations.md). Many bugs hide in the assumption that one path is "the" path.
- **Consent storage is per-version, not per-update.** A patient consents to a specific version of the consent text; if the text changes, the old acceptance does not auto-carry forward. The consent versioning policy is currently TBD — see open questions in [overview.md](overview.md).

## Conventions

Same as repo-root [CONVENTIONS](../../CONVENTIONS.md). One module-specific addition:

- **Business-rule IDs.** Every rule in [`business-rules.md`](business-rules.md) has a stable ID `BR-NNN`. Code that implements a rule should reference its ID in a comment. The rule lifecycle is in [CONVENTIONS §6](../../CONVENTIONS.md).
