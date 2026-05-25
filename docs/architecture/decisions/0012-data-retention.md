# ADR-0012 — Data retention

## Status

**Accepted.** Source page `443834744`. (ADR-0011 in the numbering sequence is the placeholder for an outdated decision in the source corpus; the gap is intentional.)

## Context

Project H stores PHI in RDS, generated clinician PDFs in S3, and credentials in Cognito. The HIPAA compliance framework requires explicit retention schedules, periodic lifecycle review, and secure deletion at end-of-life. Without a documented retention policy, PHI either lingers indefinitely (compliance violation) or is deleted ad-hoc (audit gap).

## Decision

The retention policy is enforced by a scheduled service in the Clinic Web App running daily at 00:00. PDF-generation step records and the S3 objects they reference are deleted after `RETENTION_YEARS` (env-configured, **default 6 years**). Patient-initiated deletion is exposed via the Patient Mobile App. Clinician / clinic-admin-initiated deletion of patient data is exposed via the Clinic Web App. Every automatic or user-initiated deletion writes a row to the audit-log table ([ADR-0016](0016-audit-log.md)) capturing source, actor, and target. All PHI storage uses HIPAA-eligible AWS services exclusively — listed AWS HIPAA-eligible-services reference governs every new service.

| Requirement | Implementation status |
| --- | --- |
| Encrypt PHI at rest and in transit | HTTPS for REST, S3 default encryption, RDS default encryption — done. |
| Store PHI only in approved locations | `project-h-{env}-diagnostic-reports` S3 bucket, `{env}-project-h-database` RDS, patient / clinic Cognito pools — done. |
| Implement retention schedules | Scheduled deletion service in CWA — planned MVP2. |
| Perform secure deletion | Patient-initiated via mobile; clinician-initiated via CWA — planned MVP2. |
| Maintain audit evidence | All deletions logged in audit-log table — planned MVP2. |
| HIPAA/SOC2-only services | AWS HIPAA-eligible services list, validated during discovery — done. |

## Alternatives considered

- **Manual retention review.** Pros: no scheduler infrastructure. Cons: depends on human discipline; an audit gap is one missed quarterly review away. *Rejected.*
- **Per-clinic retention windows.** Pros: clinics with shorter regulatory exposure could opt in. Cons: complicates the scheduler, the audit story, and the documentation surface for MVP. *Rejected for MVP*; revisit if a clinic asks.

## Consequences

### Positive

- Default 6-year window is configurable per environment, so STAGE can run a short window for testing.
- Audit-log table is the single source of truth for "what was deleted, by whom, when" — feeds compliance reports directly.
- Single retention service means one place to update when the policy evolves.

### Negative

- The deletion implementation is planned for MVP2 — until then the production database accumulates PHI without an automatic purge. Acceptable while volume is low but tracked.
- 6-year default is the federal HIPAA minimum; some state laws require longer. Configurable, but admin onboarding must remember to set the value.

### Open

- **Per-clinic retention overrides.** *Owner:* Product + Compliance Engineer. *Outcome:* policy decision before first multi-state clinic onboards.

## Notes

Sourced from Confluence page `443834744` and the HIPAA compliance framework page `420904988`. Operational evidence flows into [ADR-0016](0016-audit-log.md).
