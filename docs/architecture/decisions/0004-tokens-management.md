# ADR-0004 — Tokens management

## Status

**Accepted.** Source page `429054358`.

## Context

The mobile app needs a uniform way to call backend APIs regardless of which OAuth provider authenticated the patient. MyChart access tokens (EPIC flow) and Cognito access tokens (non-EPIC flow) have different shapes, expiry semantics, and refresh mechanics. Coupling backend authorization to either external token would force every endpoint to special-case the flow type.

## Decision

Introduce an **internal JWT access token** issued by the Project H backend, signed with an RS256 key pair stored as an environment variable per environment. After every external sign-in (cold start or refresh), the mobile app posts the external `access_token` + `refresh_token` + `clinic_code` to a token-exchange endpoint, which validates the external token (Cognito JWKS for non-EPIC; MyChart `/oauth2/userinfo` call for EPIC), persists the external refresh token in a `patient_token` table, and returns a short-lived internal access token carrying `user_id` + `clinic_code` claims. All authenticated backend endpoints validate this internal token via middleware using the public RS256 key. On internal-token expiry the app refreshes the external token first, then re-runs the exchange.

## Alternatives considered

- **Pass external tokens directly to every endpoint.** Pros: no exchange step; less crypto material to manage. Cons: every endpoint must know how to validate two token shapes; rotating Cognito JWKS or MyChart endpoints touches every service. *Rejected* — single-format internal token simplifies middleware.
- **Session cookies.** Pros: idiomatic for web. Cons: mobile-first app + per-clinic OAuth servers + iOS keychain ergonomics make stateless JWT the better fit. *Rejected.*

## Consequences

### Positive

- Backend middleware validates one token format. Adding a third future OAuth provider only requires the exchange logic to learn the new external token shape.
- `clinic_code` lives in the token claim, so per-clinic data-partitioning checks can run inline in the middleware.
- External refresh tokens never leave server-side storage encrypted at rest (D9).

### Negative

- Two crypto materials to manage: RS256 keypair (internal) + per-clinic OAuth registration (external). DevOps owns rotation procedure.
- Token-exchange endpoint is a hot path; must be resilient to MyChart latency.

### Open

- **Internal-token TTL.** Short enough to bound blast radius if leaked, long enough to avoid hammering the exchange endpoint. *Owner:* Security Lead + Tech Lead. *Outcome:* policy decision before MVP launch.

## Notes

Sourced from Confluence page `429054358`. Operationalises [BR-005](../../modules/auth-authorization/business-rules.md) and [BR-006](../../modules/auth-authorization/business-rules.md). RS256 keypair generation is a Week-1 DevOps task per the bootstrap in [ADR-0002](0002-components-initialization-dev-environment.md). See also [ADR-0019](0019-internal-token-epic-flow.md) for EPIC-specific token nuances.
