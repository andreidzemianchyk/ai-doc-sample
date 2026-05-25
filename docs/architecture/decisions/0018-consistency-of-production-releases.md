# ADR-0018 — Consistency of production releases (mobile + backend)

## Status

**Accepted.** Source page `451862964`.

## Context

The Patient Mobile App and Patient Mobile App Backend evolve together but ship through different channels with different latencies. The App Store review path can take days; the backend can ship in hours. Without an explicit compatibility policy, a backend change can break the deployed mobile app, or a mobile release can sit waiting for a backend feature.

## Decision

Three policies make the contract explicit:

1. **Force-update check on the mobile side.** The Patient Mobile App polls a backend endpoint on launch for the minimum-supported app version and, if its own version is below it, presents a modal redirecting to the App Store. Out-of-date apps run **only in offline mode**. Default policy is "force update on every new published version"; finer-grained policy lifted later.
2. **Backend supports the previous mobile app version** even when force-update is active. The release sequence is: (1) deploy new backend; the old app must still function. (2) submit the new mobile app to the App Store. (3) publish the new mobile app. QA performs smoke / regression of the *current* deployed mobile app against the *new* backend before submission to catch silent breaks.
3. **Database schema changes are two-phase when they affect the mobile-backend contract.** Adding a new mandatory field is split into two production releases: the first creates the column as optional with a default, the second makes it mandatory and backfills — and the second only happens after the new mobile app version is live in the App Store.

Over-The-Air (OTA) updates for mobile to reduce release frequency are flagged as a future investigation.

## Alternatives considered

- **Lockstep mobile + backend releases.** Pros: simpler reasoning. Cons: requires holding backend changes for days waiting on App Store approval; blocks fast bug-fix iteration. *Rejected.*
- **Backend-only feature flags (no version gate on mobile).** Pros: avoids force-update modal UX. Cons: doesn't help when the mobile app's own code can't render the new feature, regardless of flag. *Rejected* — version gate is needed; feature flags layer on top.

## Consequences

### Positive

- The release sequence is documented end-to-end; QA, mobile, and backend have one shared playbook.
- Two-phase schema changes are explicitly defined, preventing the most common silent-break pattern in production.
- Old-app offline-only mode means users with stale binaries don't lose all access — they keep what's already cached.

### Negative

- Backend must maintain two API contract surfaces during the App Store gap — additional test matrix overhead.
- Force-update modal is a heavy UX hammer; the friction is worth it for compliance / data-shape changes but feels excessive for cosmetic releases. Finer-grained policy is flagged but deferred.

### Open

- **OTA updates feasibility** (CodePush / Expo updates). *Owner:* Mobile Lead. *Outcome:* design spike in the next release cycle.
- **Finer-grained update policy** — when is "force-update" justified vs "recommend-update"? *Owner:* Product. *Outcome:* policy after first 2–3 mobile releases.

## Notes

Sourced from Confluence page `451862964`. Merge / branch policy supporting this release flow is in [ADR-0024](0024-merge-policies.md).
