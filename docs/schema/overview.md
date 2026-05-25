# Schema overview

The data-layer entry point. Frames the per-table docs, names the conventions, and points the reader at the worked example (the [patient profile](tables/patient-profile.md) wide-table doc).

## Scope

Project H's data layer is **pre-implementation**. There is no committed DDL yet — the schema described here is the proposed shape derived from the discovery corpus (Confluence pages on user stories, Vision & Scope, AVD §2.2 key decisions, AVD 4.4 EPIC integration views). Each table doc carries an explicit "substrate is pre-code" caveat repeated from [CONVENTIONS](../CONVENTIONS.md).

Tables in scope (the canonical list — only the asterisked one has a full doc in this sample slice):

- **`patient_profile` ★** — composite of demographics + clinical history + FDB-coded fields + consent metadata + token references + audit. [Full doc](tables/patient-profile.md).
- `consents_catalog` — versioned consent text and metadata; referenced by `patient_profile.consent_version`.
- `intake_responses` — patient-submitted intake / screener / follow-up answers.
- `game_results` — cognitive-game session outputs (2nd release).
- `reports` — generated clinician PDF reports with FHIR resource pointers.
- `follow_up_attempts` — counter store for the 3rd-release rate-limiting feature.
- `subscriptions` — Stripe subscription state per clinic.
- `invites` — patient invite-token state.
- `clinics` — clinic record + per-clinic configuration (in the discovery design, the per-clinic configuration is enumerated as inline literals across the spec rather than centralised; see the [Architectural assessment in overview](../architecture/overview.md#architectural-assessments)).

A real engagement would have a `tables/[name].md` document per table. This sample documents `patient_profile` end-to-end as the worked example; the rest are shown as an **extension path for the full engagement** rather than authored here — the same methodology applies row by row, only the volume grows.

## How to read a table doc

Every table doc follows the same five-section shape, derived from TA §5.1:

1. **Business purpose.** One paragraph: what the table represents in the business. Not a column dump.
2. **Logical groupings.** 8–15 named column clusters with a one-line description of each cluster's role. Wide tables (200+ columns) are *not* 200 independent pieces of information; they are 8–15 logical groupings that historically accumulated. The grouping is the entry point.
3. **Column reference.** Table with: name · type (proposed) · nullable · business meaning · observed usage / source citation · status (Resolved / `VALIDATE:` / `> [!deprecated]`).
4. **Implicit relationships.** Columns that reference other tables without an enforced FK. Cross-referenced from [relationships.md](relationships.md).
5. **Known issues and historical artefacts.** Naming inconsistencies, deprecated columns, columns whose meaning has drifted. For Project H's greenfield substrate, this is the place for spec-process artefacts — cross-referenced from [naming-inconsistencies.md](naming-inconsistencies.md).

Every column has one of three states, per TA §5.1's column-classification process:

- **Resolved** — usage is consistent across sources; business meaning is clear; entry is complete.
- **`VALIDATE:`** — usage exists but interpretation is unclear, or sources disagree; entry is filled with a `VALIDATE:` flag describing the specific ambiguity. The flag's lifecycle is in [CONVENTIONS §6](../CONVENTIONS.md).
- **`> [!deprecated]`** — no references in code or source docs; tagged for confirmation of removal.

Workshop topics for column-classification batches: 10–15 ambiguous columns per session with the Architect or relevant developer, with a structured question for each.

## Naming conventions

- **snake_case for columns.** No camelCase, no kebab-case.
- **`epic_` prefix for fields originating from EPIC FHIR** — e.g., `epic_patient_id`, `epic_encounter_id`. Makes the cross-system boundary visible.
- **`_fdb` suffix or `_fdb_id` for FDB-coded fields** — e.g., `medical_condition_fdb_id`, `dispensable_drug_fdb_id`. Distinguishes the FDB-coded identifier from the free-text source.
- **`_ref` suffix for opaque references to other resources** (encrypted tokens, S3 object handles) — e.g., `mychart_token_ref`, `report_pdf_url`. Note the active inconsistency with `_id` suffixes — see [naming-inconsistencies.md](naming-inconsistencies.md).
- **Plural table names** — `patient_profile` is a deliberate exception (one row per patient). Most other tables (`intake_responses`, `game_results`, `reports`, `clinics`) are plural per default.
- **`created_at`, `updated_at`, `deleted_at`** — standard timestamp columns. Soft-delete only for tables with PHI; hard-delete elsewhere.

## Source of truth

All current schema documentation is derived from Confluence specs in the absence of committed DDL. Source-of-truth pages:

- AVD §2.2 D1–D40 key decisions (page `420911663`)
- AVD 4.4 EPIC EHR Integration View (page `420906849`)
- AVD 4.4.1 Inbound messages (page `420906626`) — full FHIR resource list
- AVD 4.4.2 Outbound messages (page `420906856`)
- Epic-2 F1 US-1.1 (page `425558452`) — EPIC patient-data retrieval
- Epic-2 F3 / F4 user stories — FDB-coded fields
- Epic-1 Mobile F1 US-1.2 (page `425558346`) — consent storage

Per [CONVENTIONS](../CONVENTIONS.md) substrate-adaptation note, schema documentation will be re-verified against committed DDL in week 1 of implementation.

## Cross-references

- [Patient profile table](tables/patient-profile.md) — the worked example of the column-classification process.
- [Relationships](relationships.md) — implicit FK catalogue across the schema.
- [Naming inconsistencies](naming-inconsistencies.md) — spec-level gaps surfaced during classification.
- [Architecture overview — Key design decisions](../architecture/overview.md#key-design-decisions) — D1, D9, D23 constrain how the schema is shaped.

## Open questions

- **Postgres extensions.** `uuid-ossp` (for UUID generation) and `pgcrypto` (for column-level encryption of e.g. token references) are likely needed. Are they on the AWS RDS pre-approved list? *Owner:* DevOps. *Outcome:* check in week 1.
- **Row-level security.** The discovery design assumes per-clinic data partitioning enforced at the application layer (queries filter by `clinic_id`). Should RLS be configured at the Postgres level as a defence-in-depth measure? *Owner:* Architect + DevOps. *Outcome:* policy decision before any prod data lands.
- **Intake answers — relational or JSON columns?** SurveyJS produces a JSON answer set; storing it as a JSON column simplifies schema but complicates indexing for downstream reporting. *Owner:* Architect + Tech Lead. *Outcome:* design spike before Epic-2 F2 ships.
