# ADR-0006 — Dashboard endpoint

## Status

**Accepted.** Source page `429059129`.

## Context

The Patient Mobile App's Dashboard must show the patient's active and upcoming assessments immediately on every cold start, and continue to work offline once data has been fetched. Assessments are created in two ways — event-triggered (e.g. intake completion schedules the screener) and nightly scheduled jobs (rule-driven). Conflict between offline edits and server-side updates must be resolved deterministically.

## Decision

A single `GET /assessments` endpoint returns every active item — incomplete (new or in-progress), assigned-but-not-started, and items becoming visible within a configurable lookahead window (default 7 days) — plus the patient profile fields used for the dashboard title. Each item carries `assignment_date`, `visibility_date`, `status`, `type`, `expiration_date`, and the full SurveyJS JSON (questions + any saved answers). The mobile app caches the full response locally for offline use and updates assessment progress through `POST /assessment` calls drawn from a local queue. The backend uses **optimistic concurrency** keyed on `last_modified`: on conflict the server returns `409`, the client refreshes and retries. A companion `GET /assessments/history` returns only `COMPLETED` items as metadata (no questions/answers payload).

## Alternatives considered

- **Pessimistic locking on assessments.** Pros: no client-side conflict UI. Cons: mobile clients drop connectivity routinely — held locks would strand assessments. *Rejected* — optimistic concurrency with `last_modified` matches the offline reality.
- **Three separate endpoints (active / upcoming / in-progress).** Pros: smaller payloads. Cons: triples the cache-invalidation matrix on the mobile side; dashboard renders need all three anyway. *Rejected* — single response shape simplifies caching.

## Consequences

### Positive

- One endpoint per cold start drives the dashboard; offline cache is the same payload structure.
- Optimistic concurrency means the first writer wins predictably; no silent overwrites.
- Lookahead window is config-driven, so a clinic with different cadence can be tuned without code change.

### Negative

- Full assessment JSON in every response can be heavy (intake forms have many questions). Mitigated by lookahead-window cap and the history endpoint returning metadata only.
- Conflict UX must be designed — patients will occasionally see a "reload" prompt mid-flow.

### Open

- **Assessment-creation rules engine** for intake and screener prefill from EPIC FHIR fetch — partially scoped, full scope deferred. *Owner:* Tech Lead. *Outcome:* Epic-2 F1/F2 design spike.
- **Nightly scheduler for follow-ups** is out of scope for MVP1; lift in MVP2.

## Notes

Sourced from Confluence page `429059129`. Patient profile fields returned here are the same composite documented in [`schema/tables/patient-profile.md`](../../schema/tables/patient-profile.md). FDB-coded lookup payloads referenced from question types depend on [ADR-0007](0007-fdb-integration.md) and [ADR-0009](0009-reference-data.md).
