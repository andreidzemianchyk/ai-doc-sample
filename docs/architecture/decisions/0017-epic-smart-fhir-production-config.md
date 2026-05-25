# ADR-0017 — EPIC SMART on FHIR production app configuration

## Status

**Accepted (configuration baseline).** Source page `451851359`.

## Context

The Patient Mobile App is a SMART on FHIR client against each clinic's EPIC instance ([ADR-0001](0001-mychart-as-per-clinic-sso.md)). EPIC's App Orchard requires every production-bound app to register a fixed configuration: incoming-API list, redirect URI, client type (confidential vs public), token refresh policy, FHIR ID generation scheme, and disclosure metadata. The discovery corpus captures the in-scope configuration; the gaps are flagged where the sandbox behaves differently from production.

## Decision

The Project H Patient App is registered as a **confidential client**, **R4** FHIR version, **SMART Scope v1**, with **unconstrained FHIR IDs**. Redirect URI is `https://clinic.project-h.health/callback`. The app requests **persistent access** and **rolling refresh tokens** — these flags do not behave on the public sandbox but are required for the production target.

In-scope incoming APIs (Read + Search for each, R4):

- `Patient.Read/Search (Demographics)`
- `AllergyIntolerance.Read/Search (Patient Chart)`
- `Condition.Search (Problems)`, `List.Search (Problems)`
- `Medication.Read/Search`, `MedicationRequest.Read/Search (Signed Medication Order)`
- `Observation.Read/Search (Labs)`, `Observation.Read/Search (Social History)`, `Observation.Read/Search (Vital Signs)`
- `Procedure.Read/Search (Orders)`, `Procedure.Read/Search (Patient-Reported Surgical History)`

App-Orchard descriptive fields (Audience, Intended Users, Disclosure URL, Thumbnail, Screenshots, T&Cs URL, Open Data Use Questionnaire) are deferred to the submission package and are not yet populated.

## Alternatives considered

- **Public client (no client secret).** Pros: simpler mobile-app trust model. Cons: weakens the MyChart→Project H token-exchange path; EPIC's App Orchard treatment of public clients is more restrictive. *Rejected* — confidential client with PKCE.
- **R4B or USCDI-aligned scoping.** Pros: forward-compatible with newer USCDI versions. Cons: not yet broadly supported across the target clinics' EPIC versions. *Rejected for MVP*; revisit when target clinics upgrade.
- **Use the JWK Set URL for production key management.** Pros: matches App Orchard's preferred model. Cons: not required for the Patient App's auth shape per current understanding; deferred until App Orchard reviewer flags it. *Deferred.*

## Consequences

### Positive

- A clear, minimal incoming-API list keeps the App Orchard review scope small and the consent screen reasonable.
- Confidential-client + PKCE is the configuration EPIC's App Orchard certifies most readily.
- Sandbox vs production differences (persistent access, rolling refresh tokens) are explicit, so QA knows to validate against production behavior, not sandbox.

### Negative

- Per-clinic registration cost remains (Living Risk R3 in [overview](../overview.md)). Each clinic's production registration repeats the same form.
- Several App Orchard metadata fields (Description, Summary, Thumbnail, Screenshots, T&Cs URL) are unpopulated — submission package risk if reviewers block on them.

### Open

- **JWK Set URL configuration.** Required by some App Orchard reviewers; deferred until flagged. *Owner:* Tech Lead.
- **SMART Scope version upgrade path** (v1 → v2) — TBD per clinic readiness. *Owner:* Architect.
- **FHIR ID scheme** (Unconstrained vs constrained) — pinned to Unconstrained for now but changeable. *Owner:* Architect.

## Notes

Sourced from Confluence page `451851359`. Operationalises [ADR-0001](0001-mychart-as-per-clinic-sso.md) on the production-config side; complements the per-clinic-config architectural-assessment callout in [overview](../overview.md#architectural-assessments).
