# ADR-0015 — Sentry for mobile-app error logging and monitoring

## Status

**Accepted (MVP, free tier).** Source page `447455132`.

## Context

Project H's React Native mobile app needs centralised crash and error reporting so engineers can triage issues that only manifest on patient devices. Sentry's React Native SDK is the team's preferred error-monitoring tool. Sentry's free cloud tier does **not** offer a signed BAA — HIPAA-grade handling requires Sentry Enterprise. The integration must therefore be designed to leak zero PHI on the free tier and to be liftable to Enterprise later for richer analytics.

## Decision

Integrate `@sentry/react-native` initialised at the app entry point with the DSN supplied via environment variable (`SENTRY_DSN` per environment, never hard-coded). A mandatory `beforeSend` hook strips every event of `user`, `request`, `contexts`, and `extra` payloads before transmission. Only error type / message (sanitised), stack trace, and non-identifying device metadata (platform, OS version, app version) ship to Sentry.

A `logError(error, context?)` utility wraps `Sentry.captureException` / `captureMessage`; all in-app reporting goes through this wrapper. The wrapper accepts only non-PHI technical context (screen name, feature name). Error messages across the codebase are audited and refactored to remove patient identifiers — e.g. `Error saving answers for patient 12345` becomes `Error saving survey answers`. A React Error Boundary wraps the root navigator and routes uncaught exceptions through the same path; its fallback UI shows a generic message only.

## Alternatives considered

- **Sentry Enterprise from the start.** Pros: BAA in place, richer analytics, no PHI scrubbing constraint. Cons: cost and contract overhead for an MVP whose error volume and shape are still unknown. *Rejected for MVP*; lift later.
- **Self-hosted Sentry.** Pros: PHI never leaves Project H infrastructure. Cons: operational burden of running Sentry; not a Mobile-app priority at MVP1. *Rejected.*
- **Crashlytics / Bugsnag.** Pros: similar feature set. Cons: same PHI / BAA constraint applies; no team preference advantage. *Rejected* — Sentry is the team's tool of record.

## Consequences

### Positive

- Centralised error stream from day one means production issues surface in a single dashboard.
- `logError` wrapper centralises the PHI-scrub policy — a single review surface enforces the rule.
- Lifting to Enterprise later doesn't break the integration; only the DSN and the `beforeSend` policy change.

### Negative

- The PHI-scrub policy depends on developer discipline: every new `throw` and `console.error` needs review. Mitigation: lint rule + code-review checklist item.
- Free-tier event quota is finite — if error volume spikes, signal degrades. Mitigation: monitor monthly quota usage; lift to Enterprise if usage trends warrant.

### Open

- **Sentry Enterprise upgrade trigger.** Volume? Severity? Investor / clinic ask? *Owner:* Engineering Manager. *Outcome:* define trigger metric.
- **Backend error logging path.** Sentry is mobile-only here; backend errors go to CloudWatch ([ADR-0010](0010-logging.md)). Whether to unify on Sentry is open.

## Notes

Sourced from Confluence page `447455132`. PHI-redaction policy here applies only to mobile; backend logging convention is [ADR-0010](0010-logging.md). Audit-level user-action logging is separate — see [ADR-0016](0016-audit-log.md).
