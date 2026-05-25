# ADR-0008 — Legacy assessment template uploading logic

## Status

**Accepted.** Source page `434017364`.

## Context

Project H inherits a corpus of assessment templates from the legacy spec format and needs an admin-controlled path to bring those into the system as SurveyJS-shaped records, versioned so future edits do not silently overwrite prior content. The path must be auditable, idempotent on equal content, and convert format mistakes into actionable error messages rather than silent drops.

## Decision

System-admin users upload legacy JSON templates through a single Swagger-protected endpoint in the Clinic Web App. The backend (1) logs the request and authenticated user, (2) parses + validates the JSON against the legacy schema (returning an error with concrete cause on failure), (3) converts to the internal SurveyJS structure, (4) re-validates the converted form against required-field and supported-question-type rules, (5) looks up the current `PUBLISHED` row in `assessment_template` by `type` (INTAKE / SCREENER / …). On exact-content match the upload is rejected with "content unchanged". On content mismatch a new row is inserted (`parent_id` = previous template id, `version` incremented, `status` = `PUBLISHED`); the previous row transitions to `ARCHIVE` atomically. On no prior template the new row is inserted with `parent_id` = null, `version` = 1.

## Alternatives considered

- **Replace-in-place (single-row template table).** Pros: simpler schema. Cons: no audit trail, no rollback, breaks consent versioning ([BR-002](../../modules/auth-authorization/business-rules.md)) which depends on stable template identity. *Rejected.*
- **Manual SurveyJS authoring directly in Project H Admin Web App.** Pros: avoids legacy-format coupling. Cons: the Admin Web App is out of Andersen's delivery scope and the legacy corpus already exists. *Rejected* — upload path is the bridge.

## Consequences

### Positive

- Templates are versioned with a `parent_id` chain — every patient assessment can be traced to the exact template revision that produced it.
- No-op uploads are rejected explicitly, so admins get fast feedback when reuploading the same content.
- Each upload step logs both success and failure with the specific error class — easier to triage than a generic 4xx.

### Negative

- Two validation passes (legacy schema + post-conversion required-fields) double the maintenance surface; both must stay in sync as supported question types evolve.
- The endpoint is Swagger-protected with username/password, not a dedicated admin auth flow — adequate for MVP but should harden before clinic-side admins gain upload access.

### Open

- **Conversion test corpus.** Which legacy templates are the canonical fixtures for the converter? *Owner:* Tech Lead + Clinical SME. *Outcome:* identify before first conversion run.

## Notes

Sourced from Confluence page `434017364`. Template-versioning columns feed into the assessment payload returned by [ADR-0006](0006-dashboard-endpoint.md).
