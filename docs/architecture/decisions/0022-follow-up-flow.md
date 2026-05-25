# ADR-0022 — Follow-up flow

## Status

**Proposed (diagram-only in source).** Source page `466868299`.

## Context

After the initial intake + screener completes, Project H's clinical model requires follow-up assessments at clinical-rule-driven intervals (3rd-release feature). Follow-ups differ from intake / screener in two ways: they are triggered by *time* rather than by completion of a previous assessment, and they are rate-limited per patient to avoid alert fatigue. The discovery corpus has a flowchart for follow-up generation but no narrative.

> [!warning]
> The source Confluence page is diagram-only. The decision below outlines the working understanding; specifics need confirmation once the source page is filled in.

## Decision

A nightly scheduled job in the Patient Mobile App Backend evaluates every patient for follow-up eligibility, using:

1. **Time-driven rules.** Each follow-up template has a cadence (e.g. "30 days after intake completion", "every 90 days for diagnosed patients") evaluated against `assessment.completed_at` and `patient.diagnosis_*` columns.
2. **Rate limiting via `follow_up_attempts`.** A counter table tracks attempts per patient; if a previous follow-up was sent within the configured floor window (or unanswered), the job skips generation.
3. **Eligibility evaluation** uses the same SurveyJS template engine as intake / screener ([ADR-0006](0006-dashboard-endpoint.md)) — the same condition syntax, the same `assessment` table shape.

When eligibility passes, the job creates an `assessment` row of `type=FOLLOWUP` with the template's JSON snapshot and increments `follow_up_attempts`.

## Alternatives considered

- **Event-driven follow-up generation** (triggered by a previous assessment's completion). Pros: simpler reasoning, no scheduler needed. Cons: doesn't fit the *time*-driven nature of clinical follow-ups (the trigger is calendar time, not patient action). *Rejected* — schedulers fit the use case.
- **Push-notification-only follow-ups** without persistent assessment records. Pros: lighter data model. Cons: no auditability, no patient-visible queue, no offline support. *Rejected.*

## Consequences

### Positive

- Follow-up generation reuses the existing assessment infrastructure — same dashboard endpoint, same conflict resolution, same offline behaviour.
- Rate limiting via `follow_up_attempts` prevents the most common UX failure mode (assessment-fatigue churn).
- Time-driven trigger is auditable — every generation event lands in `patient_audit_log` per [ADR-0016](0016-audit-log.md).

### Negative

- Nightly scheduler latency means follow-ups are visible at most 24 hours after their eligibility window opens. Acceptable for the use case but not zero-latency.
- Source page is sparse — the decision is in-flight enough that downstream rule changes are likely.

### Open

- **Per-clinic rule overrides.** A clinic in an acute-care setting wants tighter cadence; a chronic-condition clinic wants longer windows. *Owner:* Product + Clinical SME. *Outcome:* policy decision before 3rd-release ships.
- **Follow-up tap-out** (patient opts out of follow-ups). *Owner:* Product + Compliance. *Outcome:* design decision.

## Notes

Sourced from Confluence page `466868299` (diagram only). Reuses the assessment-template machinery from [ADR-0006](0006-dashboard-endpoint.md) and [ADR-0008](0008-legacy-assessment-template-uploading.md).
