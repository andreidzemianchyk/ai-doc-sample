# Relationships

Catalogue of implicit FK relationships and cross-system references. Many of these are not yet declared as FK constraints — either because the implementation is pending (greenfield substrate) or because the relationship crosses the system boundary (Project H ↔ EPIC, Project H ↔ S3). Per TA §5.2, every implicit FK is a workshop topic until validated.

## Catalogue

| Source | Target | Cardinality | Evidence | Status |
| --- | --- | --- | --- | --- |
| `patient_profile.epic_patient_id` | EPIC FHIR `Patient.id` (per-clinic instance) | 1:1 per clinic | AVD 4.4 + Epic-2 F1 US-1.1 (page `425558452`) | Resolved (cross-system; not a DB FK by nature). |
| `patient_profile.mychart_token_ref` | `mychart_tokens.id` *(table TBD)* | 1:1 | US-1.5 token-storage flow (page `425558367`) | `VALIDATE:` table name not committed. |
| `patient_profile.consent_version` | `consents_catalog.version` *(table TBD)* | N:1 | Epic-1 Mobile F1 US-1.2 (page `425558346`): "consent acceptance stored with patient ID, timestamp, and consent_version" | `VALIDATE:` `consents_catalog` schema not specified. |
| `patient_profile.clinic_id` | `clinics.id` | N:1 | implicit from per-clinic patient ownership; Epic-1 WebApp F1 (page `424477946`) | Resolved (Project H internal). |
| `intake_responses.patient_id` | `patient_profile.patient_id` | N:1 | Epic-2 F2 store interim + final results | Resolved (Project H internal). |
| `intake_responses.questionnaire_id` | `questionnaires.id` *(table TBD)* | N:1 | Epic-2 F2 logic & UI; SurveyJS-driven | `VALIDATE:` whether questionnaires are versioned same way as consents. |
| `game_results.patient_id` | `patient_profile.patient_id` | N:1 | Epic-4 cognitive games (2nd release) | Resolved (Project H internal). |
| `reports.patient_id` | `patient_profile.patient_id` | N:1 | Epic-3 F1 report assembly | Resolved (Project H internal). |
| `reports.documentreference_url` | external Project H S3 PDF storage | 1:1 | AVD §2.2 D8 + D31 + AVD 4.4 | Resolved (cross-system; S3 URL is the contract). |
| `follow_up_attempts.patient_id` | `patient_profile.patient_id` | N:1 | Epic-5 F4 rate-limiting (3rd release) | `> [!deprecated]` candidate? Self-started rate-limiting is 3rd-release scope — column / table may not appear in MVP DDL. |
| `subscriptions.clinic_id` | `clinics.id` | 1:1 | Epic-6 Clinic Web App F1 | Resolved (Stripe webhook keeps state in sync). |
| `subscriptions.stripe_subscription_id` | Stripe `subscription` object | 1:1 | Stripe webhook spec | Resolved (cross-system). |
| `invites.patient_id` | `patient_profile.patient_id` (nullable until claimed) | 1:1 when claimed | Epic-1 WebApp F1 invite-link generation | Resolved. |
| `invites.clinician_id` | `clinicians.id` *(table TBD)* | N:1 | Epic-1 WebApp F1 — clinicians generate invites | `VALIDATE:` `clinicians` table not specified; may be implicit (an authenticated EPIC user, not a Project H-side record). |

## Cross-system relationships callout

EPIC FHIR resource references are **not FK constraints** inside Project H's DB but **must be treated as load-bearing**. `patient_profile` changes that drop `epic_patient_id` would break the report-to-clinician flow ([data flow doc](../architecture/data-flows/report-to-clinician.md)) — the FHIR Bundle assembly relies on this column being present and non-null for any EPIC-flow patient.

Similarly, `reports.documentreference_url` points to an S3 object Project H hosts. The S3 object's lifecycle is *not* tied to the row's lifecycle via a FK — a row delete in `reports` should explicitly delete the S3 object. This is the kind of implicit coupling that an agent (or a new developer) can miss when refactoring; surfacing it here is the point of the catalogue.

> [!warning]
> Any row whose target table is marked *(TBD)* above is an explicit `VALIDATE:` flag. These are workshop topics — a 60-minute Architect session can resolve most of them in batch. Until resolved, the patient-profile column doc carries the same `VALIDATE:` flag on the corresponding column.

## Cross-references

- [Patient profile table](tables/patient-profile.md) — the column reference where each implicit FK shows up at column level.
- [Schema overview — Naming conventions](overview.md#naming-conventions) — `_ref` vs `_id` suffix policy.
- [Naming inconsistencies](naming-inconsistencies.md) — captures the unresolved suffix-convention decision and several `_ref` / `_id` mismatches.
- [Auth & Authorization variations](../modules/auth-authorization/variations.md) — `mychart_tokens` table presence depends on the EPIC vs non-EPIC fork.

## Open questions

- **Consents stored per-version (immutable) or per-patient-current (mutable)?** The `consent_version` reference shape depends on this. Owner: Compliance Engineer + Architect. *Outcome:* policy decision before MVP DDL.
- **How does `mychart_tokens` reconcile with the AWS Cognito non-EPIC path?** Cognito has its own token store; do we keep them in separate tables, or unify under a `patient_tokens` table with a provider discriminator? Owner: Tech Lead + Architect. *Outcome:* design pass in week 1.
- **Is `invites` a separate table or a state machine inside `patient_profile`?** If state, `patient_profile` carries `invite_state`, `invite_token`, `invite_expires_at` columns; if separate, the columns live in `invites` and `patient_profile.invite_id` is nullable. *Owner:* Architect. *Outcome:* DDL design decision.
