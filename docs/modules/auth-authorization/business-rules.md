# Auth & Authorization — business rules

Catalogue of named business rules for the auth-authorization module. Each rule has a stable ID `BR-NNN`, a one-line statement, a source citation, variations (where the rule differs between EPIC and non-EPIC paths), and edge cases. Catalog-first / narrative-second — narrative docs that touch these rules cite them by ID rather than restating them.

## Catalogue

| ID | Statement | Source | Variations | Edge cases |
| --- | --- | --- | --- | --- |
| **BR-001** | The welcome carousel (3 screens: Privacy by design / Clinical AI precision / Human-centered care) is shown only on first launch. On subsequent launches the app skips it. | US-1.1 Scenario 3 AC1/AC2 (page `425558328`). | None. | If the welcome page fails to render, the app must silently advance to the Consent screen — no error message shown (US-1.1 Scenario 4 AC2). |
| **BR-002** | Consents must be accepted **before** MyChart authentication is initiated. If consents have already been collected for the patient (consent_version match), the screen is skipped. | US-1.2 Scenarios 1/3 (page `425558346`). | None — applies to EPIC and non-EPIC equally. | Failure to render Consent screen blocks progression; user sees a branded error message and cannot continue. Consent versioning policy is TBD — see open questions. |
| **BR-003** | A backup invite code is 6 characters. The Continue button on the backup-code screen is enabled only when 6 characters have been entered. | US-1.4 design reference + Tasks (page `425558359`). | None. | Length is marked TBD in the source spec — see [`> [!warning]` below](#br-003-callout) and the open questions. After 5 failed attempts (default, TBD), the code is invalidated and the patient must contact the clinic. |
| **BR-004** | The invite link or backup code resolves the patient's clinic, which determines the MyChart login URL. | US-1.3 technical flow + US-1.5 technical flow step 1 (pages `425558356`, `425558367`). | None at this layer; downstream the resolved URL differs per clinic. | If the link is invalid, the app falls back to the backup-code input page (BR-003). If the backup code is also invalid (or retry limit reached), the app blocks onboarding and presents a "Contact your clinic" message. |
| **BR-005** | MyChart authentication uses SMART on FHIR OAuth2 with PKCE. Access and refresh tokens are stored encrypted on the device (Secure Enclave on iOS) and on the Project H backend (D9). | US-1.5 Scope items 1–4 (page `425558367`); [ADR-0001](../../architecture/decisions/0001-mychart-as-per-clinic-sso.md). | EPIC path uses MyChart; non-EPIC path uses Cognito + Amplify Authenticator (see [`variations.md`](variations.md)). | If MyChart service is unavailable, the app displays *"Unable to connect to MyChart, please try again later"* and logs the event locally for sync. |
| **BR-006** | On access-token expiry, the app obtains a new access token via the refresh token (backend call). If the refresh token is also invalid, the patient is prompted to re-authenticate with MyChart (full PKCE flow). | US-1.5 Scenarios 2 and 3 (page `425558367`). | Same shape for the Cognito path. | When both tokens are invalid in offline mode, the app must not expose any PHI until reconnection + re-auth. Local storage of MyChart URL is the dependency — see open questions in [overview](overview.md). |
| **BR-007** | Patient demographic and medical-record fetch from EPIC runs on first MyChart sign-in and on every successful re-authentication (new token issued). | Epic-2 F1 US-1.1 trigger points (page `425558452`). | Non-EPIC clinics: no EPIC fetch; Cognito user profile + Project H-side patient profile only. | Missing or partial EPIC data does not block onboarding — empty fields are allowed (Epic-2 F1 US-1.1 AC4). FHIR resource fetch may be partial; UX of that is currently undefined. |
| **BR-008** | Biometric (Face ID or passcode 4–6 digits) setup is presented after successful MyChart auth and before the Dashboard. The patient may defer setup once via "Set Up Later"; the screen reappears on the next login and setup is enforced. | US-1.6 Scope + Scenario 4 (page `425558414`). | None. | If biometric API fails on the device, the app falls back to passcode entry (Scenario 3). Permanent-skip via repeated sign-out / sign-in is an open question. |
| **BR-009** | The Congratulations screen displays the patient's first name (sourced from EPIC demographics fetch, BR-007). Tapping "Start Questionnaire" routes to the Intake flow (Epic-2). | US-1.7 Scenarios (page `425558417`). | Non-EPIC: greeting may be empty in the edge case where Cognito sign-up did not capture the name. | What to display in the empty-name case is not specified — open question. |
| **BR-010** | Logout (US-2.1) revokes MyChart tokens server-side and clears local PHI; the next launch requires a full MyChart OAuth flow. Auto-logout (US-2.2) triggers after configured inactivity. "Lock app" is a faster middle ground — closes PHI surface but keeps tokens valid; re-entry requires biometric / passcode. | Epic-1 F2 US-2.1, US-2.2. | None. | Inactivity threshold value is TBD. "Lock app" vs "Sign out" UX distinction must be clear in the UI — see UX open question. |

## `> [!warning]` callouts {#br-003-callout}

> [!warning]
> **BR-003 backup-code length is TBD in the source.** US-1.4 helper text reads "Your code is usually 6 characters long" and the design reference shows 6 segmented input boxes, but the Tasks section explicitly marks the length as TBD. Workshop topic with the security lead before backup-code endpoint ships; the value affects the token entropy budget.

> [!warning]
> **BR-009 empty-name fallback unspecified.** If the EPIC demographics fetch returns no `Patient.name`, the Congratulations screen has nothing to greet the patient with. Current spec does not address this case. UX decision pending — likely fallback to a clinic-supplied first name (from the invite metadata) or to a neutral greeting.

> [!warning]
> **BR-010 auto-logout inactivity threshold is TBD.** HIPAA-aware applications typically auto-lock at 15 minutes; the source spec leaves the value open. Workshop topic with the Compliance Engineer before MVP launch.

## Cross-references

- [`overview.md`](overview.md) — workflows that compose these rules.
- [`variations.md`](variations.md) — where rules diverge between EPIC and non-EPIC paths.
- [`../../architecture/decisions/0001-mychart-as-per-clinic-sso.md`](../../architecture/decisions/0001-mychart-as-per-clinic-sso.md) — the decision BR-005 / BR-006 / BR-007 operationalise.
- [`../../schema/tables/patient-profile.md`](../../schema/tables/patient-profile.md) — `consent_version`, `mychart_token_ref`, `biometric_configured` columns that the rules touch.
- [`../../architecture/data-flows/patient-onboarding.md`](../../architecture/data-flows/patient-onboarding.md) — the flowchart these rules collectively describe.

## Open questions

- **Is the 5-attempt retry limit on backup codes per-code or per-patient?** Per-code (a fresh code resets the count) is friendlier; per-patient (the count carries across codes) is more secure against brute-force. *Owner:* Security lead + Tech Lead. *Outcome:* policy decision before BR-003 endpoint ships.
- **On token-refresh failure when the patient is at home (no clinic context),** how is the MyChart login URL re-resolved if local storage was cleared? Currently relies on backend lookup, but that lookup may itself require an authenticated call. *Owner:* Tech Lead. *Outcome:* design spike in week 1 (also open in [overview](overview.md)).
- **Are auto-logout inactivity windows configurable per clinic or fixed globally?** A clinic in an emergency-room context might want a shorter window; a clinic doing chronic-condition follow-up might want longer. *Owner:* Project H product + Compliance Engineer. *Outcome:* policy decision before MVP launch.
