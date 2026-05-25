# ADR-0002 — Components initialization for the develop environment

## Status

**Accepted.** Bootstrap decision for the develop environment; source page `425568848`.

## Context

Project H consists of four delivery components — Patient Mobile App, Patient Mobile App Backend, Clinic Web App, and Infrastructure — each requiring its own GitHub repository and an initial cloud footprint that automatically builds and deploys from a stable branch. The bootstrap must produce a usable develop environment without manual provisioning between commits.

## Decision

Four GitHub repositories — `patient-app-mobile`, `patient-app-backend`, `client-admin-app`, `infrastructure` — each with three protected branches (`develop` → `stage` → `main`) and no direct commits. Develop-environment infrastructure is provisioned via Terraform: ECS tasks for `patient-app-backend` and `client-admin-app` (auto-deployed from `develop`), an RDS Postgres instance (`project-h-db-instance`) with `project_h_db` schema, two subdomains (`mob-dev.project-h.health` / `clinic-dev.project-h.health`) fronted by an ALB, NAT Gateway for outbound traffic, and a Bastion for DB access. The iOS app is built via Fastlane and deployed to TestFlight from the develop branch through GitHub Actions.

## Alternatives considered

- **Single monorepo.** Pros: shared CI config, atomic cross-component changes. Cons: noisier history, harder access controls, conflicts with Andersen's per-component delivery contract. *Rejected.*
- **Manual provisioning (console-clicked).** Pros: faster initial setup. Cons: drift between environments, no review trail, blocks repeatable stage/preprod/prod rollouts. *Rejected* — Terraform from day one.

## Consequences

### Positive

- Reproducible environments — adding stage / preprod / prod is the same Terraform plan with different variables.
- Branch protection from day one means no surprise main-branch commits.
- TestFlight pipeline gives the team a working iOS distribution channel before the app has substantive features.

### Negative

- Four repos means four CI configs to keep in sync. Mitigation: shared reusable GitHub Actions workflows.
- Bastion-based DB access is a tax on developer ergonomics; mitigated by documented instructions but worth revisiting if it becomes a friction point.

### Open

- **Apple Developer Account ownership and Code-Signing certificate rotation policy.** Not yet documented; needs an owner before the first prod release.

## Notes

Sourced from Confluence page `425568848`. Downstream: deployment view in [overview](../overview.md#deployment-view); merge-policy specifics in [ADR-0024](0024-merge-policies.md).
