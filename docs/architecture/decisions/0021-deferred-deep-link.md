# ADR-0021 — Deferred Deep Link

## Status

**Proposed (diagram-only in source).** Source page `466859648`.

## Context

The patient onboarding entry path uses an iOS Universal Link ([ADR-0001](0001-mychart-as-per-clinic-sso.md)): the clinician generates a per-patient invite link in EPIC, the patient taps it, and the link either opens the installed Project H app directly with the invite token, or redirects to the App Store. The App-Store path breaks the chain — after install, the user lands in a freshly-launched app with no invite-token context, forcing them to re-tap the original link or enter the backup code manually.

> [!warning]
> The source Confluence page for this ADR is diagram-only. The decision below is reconstructed from adjacent context; the actual mechanism may differ.

## Decision

Implement a **deferred deep link** so the invite token survives the App-Store round-trip. On link tap with the app not installed, the link first hits a Project H backend endpoint (or a third-party deferred-deep-link service such as Branch / Adjust / Firebase Dynamic Links) that fingerprints the device (IP, user agent, timestamp) and stores the invite token associated with that fingerprint. The user is redirected to the App Store. On first launch after install, the app calls back to the same service with its own fingerprint and retrieves the invite token; the onboarding flow then proceeds as if the link had been tapped on an already-installed app.

## Alternatives considered

- **Show backup-code entry as the post-install fallback.** Pros: no third-party dependency, no fingerprinting privacy story. Cons: the patient has to retrieve the backup code separately — a friction cliff during onboarding. *Acceptable as fallback*, not the primary path.
- **Pasteboard-based hand-off (iOS-only).** Pros: native, no service dependency. Cons: privacy-flagged by iOS 14+ paste notifications; not reliable. *Rejected.*

## Consequences

### Positive

- Onboarding success rate stays high even when the app isn't pre-installed — the path from EPIC link → onboarding completion remains a single tap.
- If a third-party service is chosen, the team gets attribution / install-source analytics as a side benefit.

### Negative

- Fingerprinting accuracy is imperfect — corner cases (shared Wi-Fi, VPN) can route the wrong invite token to the wrong device.
- Third-party deferred-deep-link service adds a vendor dependency outside the AWS HIPAA-eligible boundary. If used, must be PHI-free (token only, no patient data).

### Open

- **Self-host vs vendor.** Branch / Adjust / Firebase Dynamic Links vs a Project H-built fingerprinting service. *Owner:* Architect + Mobile Lead. *Outcome:* design spike before MVP launch.
- **Privacy disclosure language** for the fingerprinting step. *Owner:* Compliance Engineer.

## Notes

Sourced from Confluence page `466859648` (diagram only). Universal Link mechanics are in [ADR-0001](0001-mychart-as-per-clinic-sso.md); backup-code fallback is in [ADR-0003](0003-backup-code-validation-endpoint.md).
