# ADR-0001 — MyChart as per-clinic SSO

## Status

**Accepted** (retrospective — surfaced from discovery).

Date of original decision: documented in AVD §2.2 D3 (Confluence page `420911663`) and the User invitation links comparison page (page `419469068`). This ADR captures that decision in MADR form so it is searchable, citable, and reviewable in the same shape as forward decisions.

## Context

Each US primary-care clinic that licenses Project H runs its own EPIC EHR + MyChart instance. The patient onboarding flow must authenticate the patient against the *correct* MyChart (the one belonging to the clinic that invited them), link the resulting tokens to the patient's record in Project H, and do so without a Project H-managed credential layer.

Constraints on the decision:

- **HIPAA-friendly auth surface.** A Project H password store would expand the PHI-adjacent attack surface without providing value the clinic does not already cover via MyChart.
- **No clinician workflow change.** Clinicians already invite patients to MyChart-adjacent tooling all the time; adding a parallel Project H credential would be a learnability tax.
- **Per-clinic instance reality.** MyChart is not a single global endpoint; the patient's clinic determines the login URL.
- **iOS deep-link mechanics.** The invite-link must open the Project H app directly when installed, fall through to the App Store otherwise.

## Decision

Use MyChart as the SSO provider for patient authentication, **per clinic**. The Project H Patient Mobile App opens an embedded MyChart login page whose URL is resolved by the Project H backend *after* invite-link / backup-code validation determines the patient's clinic. Authentication uses SMART on FHIR OAuth2 with PKCE. Access and refresh tokens are stored encrypted on the device (Secure Enclave on iOS) and on the Project H backend; subsequent logins re-validate or refresh via the backend.

Patient onboarding kicks off via either of two paths:

- **Universal Link.** Clinician generates the link in EPIC via the Project H Custom Action button; patient taps the link, which opens the installed app with the invite token in the URL (or routes to the App Store first).
- **Backup code.** 6-character single-use code (length TBD per US-1.4); patient enters it in the app manually if the link mechanism fails. Retry-limited.

The MyChart URL is resolved from the per-clinic configuration on the backend. Today that configuration is a set of literals scattered across the codebase — see the [Architectural assessment](../overview.md#architectural-assessments) callout for the proposed extraction.

## Alternatives considered

Five approaches were evaluated in the source comparison table (Confluence page `419469068`). They are summarised here in order of UX quality:

| # | Approach | UX | Access restriction | Effort |
| --- | --- | --- | --- | --- |
| **1** | **Unique per-patient link generated in EPIC EHR (Custom Action + SMART FHIR plugin)** | **Excellent** | **High** | **High** |
| 2 | Unique per-patient link generated in Clinic Web App (clinic admin / public page) | Bad | Medium | Medium |
| 3 | Unique per-patient link generated in Clinician Web App | Medium | High | High (requires Clinician Web App) |
| 4 | Common per-clinic link (clinic admin shares with clinicians) | Medium | Poor / Medium | Medium |
| 5 | Common static link (Project H admin shares during onboarding) | Medium | Poor | Easy |

**#1 chosen.** It is the only approach with both "Excellent" UX and "High" access restriction, and it keeps the clinician's workflow inside EPIC. The cost is the development effort (a SMART FHIR Custom Action plugin registered in App Orchard) and the per-clinic operational cost — which is acknowledged as Living Risk R3.

Approaches #4 and #5 were rejected because they leak access (anyone with the link can attempt to claim a patient onboarding); #2 was rejected because the patient onboarding has to start *inside* the clinical workflow, not in a public web page; #3 was rejected because the Clinician Web App does not exist in Project H scope.

## Consequences

### Positive

- **Reduced PHI exposure surface.** Project H never sees patient passwords. Token storage is the only secret-handling responsibility.
- **Clinician workflow unchanged.** Clinicians invite patients via a Custom Action on the Patient profile page in EPIC — the same gesture they use for other patient-portal integrations.
- **App Orchard certification path.** The SMART FHIR plugin model is what App Orchard explicitly certifies; this aligns the architecture with the certification track.
- **HIPAA alignment.** OAuth2 + PKCE meets OWASP ASVS L2; encrypted token storage meets HIPAA at-rest requirement.

### Negative

- **Per-clinic operational cost.** Every new clinic requires App Orchard configuration, OAuth2 redirect URI registration, FHIR endpoint base, sandbox setup, and integration-test pass. Linear-cost as clinic count grows (Living Risk R3, *High*). See [Architectural assessment](../overview.md#architectural-assessments) — the proposed config-store extraction.
- **Offline-mode token refresh complexity.** If a patient is offline when the refresh token expires, they must re-authenticate online with MyChart. The offline mode is therefore time-bounded by the refresh-token TTL.
- **Hard dependency on Clinic Admin generating the invite.** The patient cannot self-onboard. A patient who loses the invite link must contact the clinic. This is a stated UX trade-off (Approach #1 vs #5).

### Open

- **Non-EPIC clinics.** What happens if a clinic transitions away from EPIC? The architecture has a parallel Cognito-based path (see [variations](../../modules/auth-authorization/variations.md)), but the operational handover model is undocumented. If a clinic migrates, do all its patients re-authenticate via Cognito? Are tokens preserved? *Open* — needs a policy decision and a migration runbook.
- **What if EPIC's App Orchard policy changes?** Project H's plugin model depends on App Orchard remaining open to third-party SMART FHIR apps. If EPIC restricts this path (charges higher, narrows the certification), the per-clinic plugin model has no fallback. *Open* — vendor-risk register item.

## Notes

- **Provenance.** The decision was discovered in the User invitation links comparison page (`419469068`), which explicitly captured the 5-option table and marked approach #1 as approved. AVD §2.2 D3 records the resulting key decision.
- **Cross-references.** Token-storage rule D9 (AVD §2.2) operationalises the encryption requirement. ADR-0002 — forward — records the diagram-tooling decision used to render the C4 views and the auth flow.
- **Downstream rules.** BR-005 (MyChart OAuth2 + PKCE), BR-006 (token refresh on expiry), BR-007 (EPIC data fetch on each authenticated login), BR-008 (biometric gate) all derive from this decision. See [business-rules](../../modules/auth-authorization/business-rules.md).
