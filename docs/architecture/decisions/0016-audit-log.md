# ADR-0016 — Audit log

## Status

**Accepted.** Source page `447457642`.

## Context

HIPAA, SOC 2, and Project H's own compliance framework require an immutable trail of patient-touching and system-management actions — who did what, when, against which patient, and the outcome. Application logs ([ADR-0010](0010-logging.md)) are tuned for engineering observability and are not the right shape for compliance evidence; an explicit audit log is needed. The audit surface must work asynchronously so business actions are not blocked by audit-write failures.

## Decision

Two audit tables capture the two distinct event categories.

**`patient_audit_log`** records every patient-touching event:

- `id`, `clinic_id` (FK, nullable for Project H Admin actions), `backoffice_user_id` (FK, nullable for system or patient-driven events), `patient_id` (FK, nullable for pre-onboarding events like link generation).
- `action_type` enum: `CLINIC_USER` / `PATIENT` / `SYSTEM`.
- `source` enum: `CLINIC_WEB_APP` / `PATIENT_APP`.
- `action` (enum, required), `parameters` (JSONB, optional), `status` (`COMPLETED` / `FAILED`), `ip_address`, `created_at`.

**`system_audit_log`** records backoffice / system-management events with `action_type` enum `PROJECTH_ADMIN` / `CLINIC_USER` / `SYSTEM` and `subject_backoffice_user_id` capturing the user being acted upon (for user-management actions).

Writes are **asynchronous and non-blocking** — audit-write failure must not cancel the underlying action. Retention is enforced via the scheduled cleanup task in [ADR-0012](0012-data-retention.md); the `n`-years window is env-configurable. Each app (Patient Mobile App Backend, Clinic Web App) implements two write methods, one per table.

## Alternatives considered

- **Single audit table with discriminator column.** Pros: simpler schema. Cons: forces every column to be nullable, complicates indexes on patient-centric queries vs system-centric queries. *Rejected.*
- **Synchronous audit writes inside the business transaction.** Pros: stronger consistency guarantee. Cons: any DB hiccup blocks user-facing actions — unacceptable for clinical workflow. *Rejected* — async, fire-and-forget with a dead-letter queue is the right trade.
- **Append-only audit log in a separate datastore (e.g. CloudTrail-style S3).** Pros: stronger immutability story. Cons: harder to query, breaks the relational join model with `patient_id` / `clinic_id`. *Rejected for MVP*; revisit if compliance demands.

## Consequences

### Positive

- Two tables let patient-centric and system-centric queries use their own indexes without conflict.
- Async writes mean the audit path is invisible to user-facing latency.
- JSONB `parameters` column accommodates new action shapes without schema migration.

### Negative

- Async write + retention deletion means the audit log is not technically append-only; immutability is enforced procedurally, not at the storage layer.
- Two write methods per app is duplicate plumbing; consider extracting a shared library if a third writer (e.g. Project H Admin Web App) ever lands.

### Open

- **Retention period `n`.** Federal HIPAA minimum is 6 years; state laws vary. Aligned with [ADR-0012](0012-data-retention.md) default but per-clinic override is open.
- **Append-only enforcement.** Should we add a Postgres rule or trigger to forbid UPDATE / DELETE except via the retention scheduler? *Owner:* Architect + Compliance Engineer. *Outcome:* policy decision.

## Notes

Sourced from Confluence page `447457642`. Retention cleanup is the scheduler defined in [ADR-0012](0012-data-retention.md). Action enums are populated incrementally as features ship; the MVP1 list is captured in the source page.
