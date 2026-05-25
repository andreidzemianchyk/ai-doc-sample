# `patient_profile` — wide-table reference

The composite that every other Project H table joins against. One row per patient. Combines EPIC-fetched demographics + clinical history + lab results with patient-supplied intake answers, FDB-coded normalisations, consent metadata, token references, and audit metadata.

## Business purpose

`patient_profile` is the structured composite of every fact Project H carries about a single patient. It is one row per patient. The columns combine data fetched from EPIC (demographics + clinical history + lab results), patient-supplied values from the intake / screener UI, FDB-coded normalisations of medications / conditions / allergies, consent metadata, token references, and audit metadata. The composite is the input to the report-to-clinician flow and the reference that every downstream Project H table (`intake_responses`, `game_results`, `reports`, `follow_up_attempts`) links to.

The table is **logical**, not necessarily physical — at DDL commit time, some clusters may be normalised out into satellite tables (allergies, medications, comorbidities). The doc is structured around the logical composite because that is what a clinician or a developer reasoning about a single patient cares about.

> [!warning]
> DDL is not yet committed. The column shape below is sourced from product / engineering specs and is re-verified column-by-column against the committed schema once it lands. Status flags (`Resolved` / `VALIDATE:` / `> [!deprecated]`) follow the convention in [schema/overview.md](../overview.md).

## Logical groupings

The composite naturally splits into 12 clusters. Each is documented in the column reference below.

1. **Identity and linkage.** `patient_id`, `epic_patient_id`, `clinic_id`, `mychart_token_ref`, `cognito_user_id`.
2. **Demographics from EPIC.** `dob`, `gender`, `race`, `ethnicity`, `preferred_language`, `marital_status`, `number_of_children`, `years_of_education`, `height_cm`.
3. **Clinical history from EPIC.** `allergies` (drug + non-drug), `current_medications`, `comorbidities`. Likely normalised to satellite tables at DDL time.
4. **Comorbidity flags (FDB-coded).** `has_diabetes`, `has_hypertension`, `has_hypertriglyceridemia`, `has_cardiovascular_history`, `has_mental_health_history`, `has_substance_use_history`, `has_autism_spectrum`.
5. **Labs.** Blood panels, hormones, other relevant clinical results.
6. **FDB-coded medication list.** Derived from `current_medications` mapped to FDB Dispensable Drug IDs.
7. **FDB-coded medical conditions.** Derived from `comorbidities` mapped to FDB Medical Condition IDs.
8. **FDB-coded allergens.** Derived from `allergies` mapped to FDB AllergenPicklist.
9. **Pregnancy status.** Explicitly listed in US-3.5 as an input to the patient profile (FDB DDC / DPT screening).
10. **Consent and authorisation.** `consent_version`, `consented_at`, granular consent flags (HIPAA / EHR access / R&D de-identified data / emergency notifications).
11. **Token and auth metadata.** `mychart_token_ref` (from cluster 1), `refresh_token_ref`, `access_token_ref`, `last_login_at`, `last_token_refresh_at`, `biometric_configured`.
12. **Audit.** `created_at`, `updated_at`, `source_of_last_update`.

## Column reference

The full table will carry ~50 columns once normalised; the slice below covers each logical grouping. Status column uses the three states: **Resolved** / **`VALIDATE:` ...** / **`> [!deprecated]` ...** Each `VALIDATE:` row is a workshop topic.

| Column | Type (proposed) | Nullable | Business meaning | Observed usage / source | Status |
| --- | --- | --- | --- | --- | --- |
| `patient_id` | `uuid` | no | Project H internal stable patient identifier. UUID v4. | Referenced from every Project H table; see [relationships](../relationships.md). | Resolved. |
| `epic_patient_id` | `varchar(64)` | no | EPIC's `Patient.id` (FHIR). Used for token linkage and FHIR resource exchange. | AVD 4.4 EPIC EHR Integration View; Epic-2 F1 US-1.1 (page `425558452`). | Resolved. |
| `clinic_id` | `uuid` | no | The clinic the patient belongs to. Used for per-clinic data partitioning and per-clinic MyChart URL resolution. | Implicit from per-clinic onboarding; Epic-1 WebApp F1 (page `424477946`). | Resolved. |
| `mychart_token_ref` | `text` (encrypted) | yes | Opaque handle to the encrypted MyChart access + refresh token blob (KMS-encrypted at rest). Null for non-EPIC patients. | US-1.5 token-storage flow (page `425558367`); D9 token storage rule. | `VALIDATE:` whether stored inline or in a separate `mychart_tokens` table — see [relationships](../relationships.md). |
| `cognito_user_id` | `varchar(128)` | yes | AWS Cognito user identifier. Null for EPIC patients. | Epic-1 Mobile US-1.5 + non-EPIC variation (see [variations](../../modules/auth-authorization/variations.md)). | Resolved. |
| `dob` | `date` | yes | Patient date of birth. Sourced from EPIC `Patient.birthDate`. | Epic-2 F1 US-1.1; AVD §1.2 enumeration. | Resolved. |
| `gender` | `varchar(32)` | yes | Patient self-reported gender. EPIC's `Patient.gender` is the FHIR `administrative-gender` code set. | Epic-2 F1 US-1.1. | Resolved (FHIR code set is the standard). |
| `race` | `varchar(64)` | yes | Patient self-reported race. Sourced from EPIC. | Epic-2 F1 US-1.1 lists "race / ethnicity" collapsed; AVD §1.2 separates them. | `VALIDATE:` coding standard not specified (US Census 2020 vs OMB-1997 vs free-text). Workshop topic with Compliance Engineer. See [naming-inconsistencies](../naming-inconsistencies.md) #1. |
| `ethnicity` | `varchar(64)` | yes | Patient self-reported ethnicity. Often combined with race in some Project H source docs. | AVD §1.2 enumeration. | `VALIDATE:` whether to keep separate from `race` (FHIR pattern) or collapse (some Project H source pages). See [naming-inconsistencies](../naming-inconsistencies.md) #1. |
| `preferred_language` | `varchar(8)` | yes | BCP 47 language tag. From EPIC `Patient.communication`. | Epic-2 F1 US-1.1. | Resolved. |
| `marital_status` | `varchar(16)` | yes | FHIR `marital-status` code set. From EPIC. | Epic-2 F1 US-1.1. | Resolved. |
| `number_of_children` | `int` | yes | Patient-reported children count. Used as an FDB screening input for certain medications. | Epic-2 F1 US-1.1. | Resolved. |
| `years_of_education` | `int` | yes | Patient-reported years of formal education. | Epic-2 F1 US-1.1. | Resolved. |
| `height_cm` | `numeric(5,2)` | yes | Patient height in **centimetres**. Stored metric at the DB layer; converted at presentation. | Epic-2 F1 US-1.1 lists "height" with no unit; EPIC FHIR `Observation` supports cm and inches. | `VALIDATE:` source spec does not pin unit; this column resolves it metric-side. See [naming-inconsistencies](../naming-inconsistencies.md) #2. |
| `allergies_summary` | `text` | yes | Free-text drug + non-drug allergy summary from EPIC. Likely satellite to a normalised `patient_allergies` table at DDL time. | Epic-2 F1 US-1.1. | `VALIDATE:` whether to keep here as free-text mirror or rely on the normalised satellite. |
| `current_medications_summary` | `text` | yes | Free-text current-medication summary. Same normalisation question as `allergies_summary`. | Epic-2 F1 US-1.1; Epic-2 F3 US-3.2 (FDB drug search). | `VALIDATE:` same as above. |
| `comorbidities_summary` | `text` | yes | Free-text comorbidities summary. | Epic-2 F1 US-1.1; Epic-2 F3 US-3.3 (FDB conditions search). | `VALIDATE:` same as above. |
| `has_diabetes` | `boolean` | yes | FDB-coded flag for diabetes presence. | Epic-2 F3 US-3.5 patient-profile inputs. | Resolved. |
| `has_hypertension` | `boolean` | yes | FDB-coded flag for hypertension. | Epic-2 F3 US-3.5. | Resolved. |
| `has_hypertriglyceridemia` | `boolean` | yes | FDB-coded flag. | Epic-2 F3 US-3.5. | Resolved. |
| `has_cardiovascular_history` | `boolean` | yes | FDB-coded flag for CV history (stroke, heart attack). | Epic-2 F3 US-3.5. | Resolved. |
| `has_mental_health_history` | `boolean` | yes | FDB-coded flag for prior mental-health diagnosis. | Epic-2 F3 US-3.5. | Resolved. |
| `has_substance_use_history` | `boolean` | yes | FDB-coded flag for substance use. | Epic-2 F3 US-3.5. | Resolved. |
| `has_autism_spectrum` | `boolean` | yes | FDB-coded flag for autism spectrum disorder. | Epic-2 F3 US-3.5. | Resolved. |
| `pregnancy_status` | `varchar(16)` | yes | One of `pregnant` / `not_pregnant` / `unknown` / `not_applicable`. Used by FDB DDC (Drug-Disease Contraindications) and DPT (Duplicate Therapy) screening. | Epic-2 F3 US-3.5 lists explicitly as a patient-profile input; FHIR Observation/Condition return shape varies. | `VALIDATE:` value enum not enumerated in source spec; affects FDB query input shape — workshop topic with Project H clinical team. |
| `consent_version` | `varchar(16)` | no | The consent text version the patient accepted. References `consents_catalog.version`. | Epic-1 Mobile F1 US-1.2 (page `425558346`): "consent acceptance stored with patient ID, timestamp, and consent_version". | `VALIDATE:` versioning policy is "fixed content in MVP" per US-1.2 out-of-scope; no rule for re-prompting on bump. See [open questions](#open-questions). |
| `consented_at` | `timestamp` | no | When the patient accepted the consent text recorded in `consent_version`. | Epic-1 Mobile F1 US-1.2. | Resolved. |
| `consent_hipaa` | `boolean` | no | Patient consented to HIPAA-covered data handling. | Epic-1 Mobile F1 US-1.2. | Resolved (one row in `consents_catalog` per version, this column mirrors). |
| `consent_ehr_access` | `boolean` | no | Patient consented to EHR data fetch via MyChart OAuth. | Epic-1 Mobile F1 US-1.2. | Resolved. |
| `consent_r_and_d` | `boolean` | no | Patient consented to use of de-identified data for R&D. | Epic-1 Mobile F1 US-1.2. | Resolved. |
| `consent_emergency_notif` | `boolean` | no | Patient consented to emergency notifications (red-flag alerts in 3rd release). | Epic-1 Mobile F1 US-1.2; Epic-5 F5 red flags (3rd release). | Resolved. |
| `refresh_token_ref` | `text` (encrypted) | yes | Encrypted handle to the patient's refresh token (MyChart for EPIC, Cognito for non-EPIC). | US-1.5 token storage; D9. | `VALIDATE:` suffix-convention drift with `mychart_token_ref` / `access_token_ref` — see [naming-inconsistencies](../naming-inconsistencies.md) #5. |
| `access_token_ref` | `text` (encrypted) | yes | Encrypted handle to the current access token. Rotated on each refresh. | US-1.5. | `VALIDATE:` same as above. |
| `last_login_at` | `timestamp` | yes | Last time the patient successfully completed auth. Used to determine when to re-fetch EPIC data. | Epic-2 F1 US-1.1: data refresh on each successful re-auth. | Resolved. |
| `last_token_refresh_at` | `timestamp` | yes | Last time the access token was refreshed. | US-1.5; D9. | Resolved. |
| `biometric_configured` | `boolean` | no | Whether the patient has set up Face ID / passcode. Default false; gated on first onboarding. | Epic-1 Mobile F1 US-1.6 (page `425558414`). | Resolved. |
| `follow_up_self_started_count` | `int` | yes | Counter against the 3rd-release self-started follow-up rate limit (Epic-5 F4). | Epic-5 F4. | `> [!deprecated]` candidate? Self-started rate-limiting is 3rd-release feature — column may not appear in MVP DDL. Confirm scope. |
| `created_at` | `timestamp` | no | Row creation. | Standard. | Resolved. |
| `updated_at` | `timestamp` | no | Last update. | Standard. | Resolved. |
| `source_of_last_update` | `varchar(32)` | yes | One of `epic_reauth`, `intake_completion`, `report_sync_back`, `admin_correction`. | Implicit from EPIC re-auth + intake + report flows. | `VALIDATE:` enum not explicitly listed in source spec; proposed here for audit traceability. |

That is ~40 columns in the representative slice. The full DDL once committed is expected to be ~50–60 columns once allergies / medications / comorbidities are normalised to satellite tables.

## Implicit relationships

(Cross-references to [relationships.md](../relationships.md) for the full catalogue. The headline ones for this table:)

- `patient_profile.epic_patient_id` → EPIC FHIR `Patient.id` (cross-system; per clinic).
- `patient_profile.mychart_token_ref` → `mychart_tokens.id` (table TBD — see [naming-inconsistencies](../naming-inconsistencies.md) #6).
- `patient_profile.consent_version` → `consents_catalog.version`.
- `patient_profile.clinic_id` → `clinics.id`.
- Reverse references from `intake_responses.patient_id`, `game_results.patient_id`, `reports.patient_id`, `follow_up_attempts.patient_id`.

> [!warning]
> The `pregnancy_status` field appears explicitly only in Epic-2 F3 US-3.5, but FDB DDC and DPT screening shapes are not pinned, and EPIC `Observation` / `Condition` return shape for pregnancy is non-trivial — multiple FHIR Observation codes can represent it. A code-spike against the EPIC sandbox in week 1 is the natural resolution path.

## Known issues and historical artefacts

Artefacts of the specification process that surfaced during column classification:

- The source pages collapse `race` and `ethnicity` inconsistently (see [naming-inconsistencies](../naming-inconsistencies.md) #1).
- The source pages do not pin a unit for `height` (see [naming-inconsistencies](../naming-inconsistencies.md) #2).
- The proposed `mychart_token_ref` / `refresh_token_ref` / `access_token_ref` columns have an unresolved suffix convention (see [naming-inconsistencies](../naming-inconsistencies.md) #5).
- `consent_version` references a `consents_catalog` table that is not yet named in any source page (see [naming-inconsistencies](../naming-inconsistencies.md) #6).
- The follow-up rate-limit counter (`follow_up_self_started_count`) is 3rd-release scope; whether it lands in MVP DDL with `NULL`-default or only ships at 3rd-release time is a release-coexistence question — see [release-coexistence](../../architecture/release-coexistence.md).

## Open questions

- **Canonical FDB version at MVP launch.** Affects the FDB code mappings (Dispensable Drug IDs, Medical Condition IDs, AllergenPicklist) — FDB releases updates monthly. *Owner:* Tech Lead + Project H clinical lead. *Outcome:* pin version in week 1, document upgrade cadence.
- **Demographics refresh frequency.** Every successful re-auth (current spec reading) or only on first login (more conservative; preserves audit trail)? *Owner:* Architect + Compliance Engineer. *Outcome:* policy decision before Epic-2 F1 implementation.
- **Mutability vs immutability of `patient_profile` per re-auth.** Snapshot-immutable (every re-auth creates a new versioned row, never updates) or mutable in place (every re-auth overwrites)? Snapshot is friendlier to audit / HIPAA right-of-access; mutable is cheaper. *Owner:* Architect + Compliance Engineer. *Outcome:* design spike in week 1.
- **`patient_id` derivation.** Deterministic from `epic_patient_id` (means patients changing clinics keep their internal ID) or independent UUID v4 (means clinic-change creates a new internal ID)? *Owner:* Architect. *Outcome:* policy decision; downstream implications for `intake_responses`, `reports`, etc.
- **Minimum FHIR resource set on first login.** AVD 4.4.1 lists 15 resources; is each one required at first login or fetched on-demand? Affects token-scope requested at MyChart auth time. *Owner:* Tech Lead. *Outcome:* sandbox test against EPIC in week 1.
