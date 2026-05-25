# ADR-0019 — Internal token for EPIC flow

## Status

**Proposed (page-stub in source).** Source page `456632059`.

## Context

Token issuance and validation for the non-EPIC (Cognito) flow is straightforward — the Cognito JWKS endpoint validates the external access token and the internal JWT exchange logic in [ADR-0004](0004-tokens-management.md) takes over. The EPIC flow requires an extra step: the MyChart access token is validated by calling EPIC's `/oauth2/userinfo` to extract the external patient id, which is then resolved against `patient.epic_patient_id`. Edge cases around clock skew, refresh-token rotation under EPIC's policy, and the userinfo-call latency budget all live on the EPIC side and warrant a dedicated ADR.

> [!warning]
> The source Confluence page for this ADR is currently a stub; the substance below is reconstructed from [ADR-0004](0004-tokens-management.md) and [ADR-0001](0001-mychart-as-per-clinic-sso.md). Validate against the page once it is filled in.

## Decision

For the EPIC flow, the token-exchange endpoint validates the incoming MyChart access token by calling `GET /oauth2/userinfo Authorization: Bearer <access_token>` against the clinic's MyChart instance, extracts the patient identifier from the response, and resolves the internal `patient_id` from `patient.epic_patient_id`. If no `patient` row matches, the backend fetches the patient's FHIR resources (Demographics, Allergies, Medications, Conditions, Observations, Procedures per [ADR-0017](0017-epic-smart-fhir-production-config.md)) and creates the row. The external refresh token is persisted (encrypted) into `patient_token`; the internal JWT signed with RS256 (per [ADR-0004](0004-tokens-management.md)) is returned to the mobile client.

## Alternatives considered

- **Trust the MyChart `id_token` without a userinfo round-trip.** Pros: one fewer network call per exchange. Cons: not all MyChart configurations issue an `id_token` reliably; userinfo is the canonical SMART on FHIR identity surface. *Rejected.*
- **Resolve the patient via a stored mapping table indexed on the MyChart subject claim** instead of `epic_patient_id`. Pros: no userinfo call. Cons: requires solving "where does the mapping come from on first login" — chicken-and-egg. *Rejected.*

## Consequences

### Positive

- Single token-exchange code path with an EPIC-specific branch keeps the middleware uniform across flows.
- First-login FHIR fetch happens in the exchange step, so by the time the mobile client gets its internal token the patient row is hydrated.

### Negative

- One extra MyChart round-trip per exchange — adds latency to cold-start auth.
- Userinfo endpoint behaviour and rate limits are per-clinic and need integration testing against each clinic's MyChart.

### Open

- **Userinfo latency budget and retry policy.** *Owner:* Tech Lead.
- **Confluence page content is sparse.** This ADR is reconstructed from adjacent decisions; cross-check with EPIC integration partner. *Owner:* Architect. *Outcome:* update once source page is filled.

## Notes

Sourced from Confluence page `456632059` (stub). Derives from [ADR-0001](0001-mychart-as-per-clinic-sso.md), [ADR-0004](0004-tokens-management.md), and [ADR-0017](0017-epic-smart-fhir-production-config.md). Operationalises [BR-005](../../modules/auth-authorization/business-rules.md) and [BR-007](../../modules/auth-authorization/business-rules.md).
