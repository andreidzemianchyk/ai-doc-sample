# Release coexistence (MVP / 2nd / 3rd)

How **MVP, 2nd-release, and 3rd-release feature sets coexist** on the same code base and data store: features ship in parallel during MVP+1 and MVP+2 while older patient cohorts stay on earlier feature sets. Walked in four questions — current state, where coexistence happens, known divergences, rollout trajectory.

## 1. What is the current planned state?

| Release | Mobile App scope | Clinic Web App scope |
| --- | --- | --- |
| **MVP** | Onboarding (Welcome → Consents → Invite/code → MyChart auth → Biometric → Dashboard); Intake & Screener (SurveyJS + adaptive branching); FDB-coded patient profile; Report assembly + delivery to EPIC; intake/screener offline mode. | EPIC plugin (Custom Action + App Orchard registration); clinician PDF download module; clinic-admin sign-up / login / profile basics; Stripe subscription setup (per-seat monthly + annual + bulk + Stripe Tax + Customer Portal). |
| **2nd release** | Cognitive games (WCST / ERT / Trail Making) + game results into report; follow-up questionnaires (logic + UI); assessment-completion history; intake/screener reminders. | Clinic-admin profile updates (password + personal details); Intercom support widget; subscription management endpoints (plan change, seat-count change). |
| **3rd release** | Red-flag detection + reduced-scope follow-up + clinic email alert; Intercom mobile chat; patient data-deletion request; self-started follow-up rate limiting; ML-driven recommendation refinements. | Clinic-admin full profile (delete account); advanced subscription features; Intercom support; Project H app endpoint (seat assignment, etc.); patient export under HIPAA right of access. |

## 2. Where does coexistence happen?

Three cross-cutting surfaces where the releases must coexist on the same code base and data store:

- **Patient profile schema.** Fields that ship in 2nd / 3rd release (`follow_up_self_started_count`, game-result aggregates, deletion_request_state) **must be nullable from MVP onward** to avoid migrations during release cuts. The [patient-profile table doc](../schema/tables/patient-profile.md) flags these columns explicitly with their release tier.
- **Notification infrastructure.** AWS SNS + APNS + SES are provisioned from MVP (visible in the [deployment view](overview.md#deployment-view)). MVP wires only the consent-collection email path; assessment-reminder push notifications (2nd release Epic-7) and red-flag clinic alerts (3rd release Epic-5 F5) reuse the same fabric without re-provisioning.
- **Intercom SDK.** Bundled in both the Mobile App and the Clinic Web App from MVP, but **feature-flagged off**. 2nd release switches it on for the clinic; 3rd release switches it on for the mobile. This lets the integration mature on the clinic side before patient-facing exposure.

## 3. What are the known divergences?

- **Pre-2nd-release patient cohorts have no game-result data.** MVP patients onboarded before the games feature ships will never have game results in their patient profile. The recommendation library (Project H side) must accept absence gracefully — falling back to the assessment-only ranking. See AVD §2.2 D30 (recommendation as black-box library; page `420911663`).
- **3rd-release self-started follow-up rate limit retroactively applies to MVP patients.** When the rate limit ships, MVP patients who have been self-starting follow-ups for months are now bound by a new monthly cap. The exact policy on rollout — reset counter? carry forward? — is currently TBD (see open questions).
- **Red-flag detection (3rd release) changes the follow-up cadence.** Pre-3rd-release patients with red-flag-relevant assessment scores were on standard follow-up cadence; post-3rd-release, the same scores trigger accelerated follow-up. Whether to retroactively rescore existing assessments is a clinical-policy question, not an engineering one (see open questions).

## 4. What is the rollout trajectory?

Linear (MVP → 2nd → 3rd). No A/B testing. No per-clinic feature flags planned in MVP — every clinic gets the same feature set at any point in time.

> [!warning]
> Whether per-clinic feature-flag scaffolding is needed for staged rollout is **not pinned in the current spec**. A clinic that signs in month 2 of the rollout will see different features than a clinic that signed in month 1. If a per-clinic gate is added later (e.g., to keep a pilot clinic on the previous release for an extra month while a 2nd-release issue is hotfixed), the schema must support it. Today it does not.

## Cross-references

- [Architecture overview — Architectural drivers](overview.md#architectural-drivers) — CT-1 through CT-8 constrain release coexistence (no third-party drift, US-only data store, etc.).
- [Patient profile table](../schema/tables/patient-profile.md) — release-tier flags on each new-in-2nd / new-in-3rd column.
- [Auth & Authorization business rules](../modules/auth-authorization/business-rules.md) — BR-010 (logout) ships in MVP; rate-limit BRs would join in 3rd release.

## Open questions

- **Schema-versioning policy.** Forward-compatible columns (nullable + default) vs explicit migrations between releases. *Owner:* DBA / DevOps. *Outcome:* policy decision before MVP DDL is committed.
- **Per-clinic feature-flag service / library choice.** Not in current spec. *Owner:* Architect. *Outcome:* decide whether a 2nd-release feature flag (e.g., LaunchDarkly, Unleash, or a homegrown table) is needed.
- **Retroactive policy on 3rd-release rate-limit rollout.** Reset counters? Carry forward? *Owner:* Project H clinical lead + Tech Lead. *Outcome:* clinical-policy decision before Epic-5 F4 ships.
- **Retroactive rescoring on red-flag detection rollout.** Whether MVP-era assessments with red-flag-relevant scores are reprocessed on rollout. *Owner:* Project H clinical lead. *Outcome:* clinical-policy decision.
