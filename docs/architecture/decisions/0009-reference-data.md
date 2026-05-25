# ADR-0009 — Reference data caching and refresh

## Status

**Accepted.** Source page `434028711`.

## Context

Several intake questions require reference dictionaries (drug names, common allergens, pregnancy contraindication severity levels, genders, conditions) so the patient sees consistent answer choices and the backend can store FDB-coded values. The mobile app is offline-first, so reference dictionaries must be available locally; they must also stay current as FDB updates the source.

## Decision

The backend maintains a `reference_dictionaries` table sourced from FDB. A periodic backend job (weekly cadence) calls each in-scope FDB endpoint, compares the new JSON to the stored value, and on diff persists the new JSON while archiving the previous one in `previous_value_json`. Drug-name and allergen feeds receive a deterministic transform — strip `conceptType`, drop rows with `"Inactive"` prefix, deduplicate allergens by concatenating `mediSpanId` with the brand name, and prepend two custom rows (`"Other"` / `"I don't know"`) so the patient can opt out without inventing free text. The mobile app fetches dictionaries via a delta endpoint (`max_updated_at` cursor), persists them in a local SQLite table per dictionary, and serves autosuggest queries (`%LIKE%`, min 2 characters) from the local store.

## Alternatives considered

- **Live FDB calls from the mobile app.** Pros: always-fresh data. Cons: breaks offline-first, exposes FDB credentials to the device, hits latency limits during patient flow. *Rejected.*
- **Push dictionaries via a server-initiated channel.** Pros: instant freshness. Cons: requires push infra not yet built; pull on cold start is sufficient for weekly cadence. *Rejected* for MVP; revisit if cadence tightens.

## Consequences

### Positive

- Patient sees consistent dictionaries online and offline; autosuggest is local and fast.
- The transform pipeline (strip inactives, dedupe, prepend opt-out rows) is documented and runs server-side — mobile clients see clean data.
- `previous_value_json` gives a one-step rollback if a malformed FDB refresh ever lands.

### Negative

- Full-dictionary delta payloads can be large for the drug-name list; incremental updates are flagged as a future optimisation.
- Weekly cadence means a brand-new drug isn't searchable for up to seven days. Acceptable per FDB SLA expectations but worth revisiting if clinicians flag it.

### Open

- **Incremental delta API.** Designed but not in MVP scope. *Owner:* Tech Lead. *Outcome:* lift to MVP2 if payload size becomes a problem.
- **Static dictionaries** (severity levels, conditions, genders) — these are manually linked to FDB IDs. Source-of-truth for the manual mapping needs an owner. *Owner:* Clinical SME.

## Notes

Sourced from Confluence page `434028711`. Depends on [ADR-0007](0007-fdb-integration.md) for the upstream FDB contract.
