# ADR-0005 — Biometric login

## Status

**Accepted.** Source page `429058981`.

## Context

After the first MyChart / Cognito sign-in, requiring a full OAuth round-trip on every cold start is poor UX and forces the patient online when only PHI display is needed. iOS and Android both expose native biometric APIs (Face ID, Touch ID, biometric prompt) and hardware-backed secure key storage. Building a custom PIN or in-app passcode duplicates capability the OS already provides at higher assurance.

## Decision

Use **only** the device's native biometric mechanism (Face ID / Touch ID / Android biometric) for in-app session unlock — no custom PIN. Biometric setup is offered once after the first successful external sign-in and can be skipped; in the MVP the only way to re-enable after a skip is reinstall. Refresh tokens are stored in iOS Keychain protected by Secure Enclave (StrongBox on Android); access to the stored token requires biometric authentication. On cold start (and on resume from background if the access token has expired) the app prompts biometric; success unlocks the session, failure / cancel / lockout deletes the stored refresh token and forces a full external re-sign-in. Offline mode is only available if biometric login is enabled.

## Alternatives considered

- **Custom PIN / passcode in addition to biometric.** Pros: works on devices without biometric hardware. Cons: another PHI-adjacent secret to store, manage, and recover; duplicates OS-level capability; users with no biometric hardware fall through to external sign-in anyway. *Rejected.*
- **No local unlock — always re-authenticate via MyChart.** Pros: simplest threat model. Cons: terrible UX (every cold start opens an embedded browser); blocks any offline-mode feature. *Rejected.*

## Consequences

### Positive

- Hardware-backed token storage meets HIPAA encryption-at-rest expectations for the refresh-token surface.
- External sign-in code path uses `ASWebAuthenticationSession` (iOS) / Custom Tabs (Android) — gets SSO cookies and password-manager integration for free.
- Offline mode becomes a deliberate, biometric-gated capability rather than a default.

### Negative

- Patients on devices with no biometric hardware or who decline setup see the OAuth flow on every cold start — a UX cliff. Mitigated by setting expectations at the setup screen.
- Reinstall-to-re-enable is heavy-handed; the user-profile toggle is deferred to a post-MVP release.

### Open

- **Permanent-skip behaviour via repeated sign-out / sign-in cycles.** Should the system enforce setup after N skips, or remain permissive? *Owner:* Product + UX. *Outcome:* policy decision before MVP launch.
- **Device-integrity checks** (Play Integrity, App Attest) before allowing offline-mode token storage. *Open* — post-MVP enhancement.

## Notes

Sourced from Confluence page `429058981`. Operationalises [BR-008](../../modules/auth-authorization/business-rules.md). Token storage convention derives from [ADR-0001](0001-mychart-as-per-clinic-sso.md) (D9). Mobile error logging for biometric failures must respect the no-PHI rule in [ADR-0015](0015-sentry-mobile-error-logging.md).
