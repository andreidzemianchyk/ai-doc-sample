# ADR-0014 — Deploy and configure Mirth Connect (NextGen Connect) on EC2 for dev

## Status

**Accepted (dev environment).** Source page `443841185`. Companion to [ADR-0013](0013-pdf-report-to-epic-hl7.md).

## Context

The HL7 ORU^R01 transport defined in [ADR-0013](0013-pdf-report-to-epic-hl7.md) needs an integration engine to assemble messages, manage channels, and exchange MLLP frames with EPIC. Mirth Connect (now NextGen Connect) is the industry-default engine for HL7 v2 work; for dev it is sufficient to run a single Mirth instance on EC2 with the embedded Derby database before scaling to a multi-instance, externally-backed setup in higher environments.

## Decision

Deploy Mirth Connect on a public-subnet `t3.micro` EC2 instance (Amazon Linux 2 or Ubuntu 22.04 LTS) with an Elastic IP for predictable inbound connectivity. The instance runs Java 17, installs Mirth at `/opt/mirth-connect`, persists Derby data at `/opt/mirth-connect/appdata/mirthdb`, and exposes:

- `8443/tcp` for the Mirth Administrator UI over HTTPS (restricted to VPN office IPs in dev; `0.0.0.0/0` only during early testing).
- `2575/tcp` for the MLLP listener with auto-ACK enabled.

A `mirth` systemd service auto-starts on reboot. Log rotation is configured for `/opt/mirth-connect/logs/*`; CloudWatch shipping is optional for dev. Default credentials (`admin` / `admin`) are rotated before the first non-team user connects.

## Alternatives considered

- **External database (Postgres / MySQL) instead of embedded Derby.** Pros: production-grade durability, horizontal scale. Cons: unnecessary for dev — embedded Derby simplifies bootstrap and the data is non-PHI test traffic. *Rejected for dev*; will be revisited for STAGE and PROD.
- **Fargate / ECS-hosted Mirth.** Pros: matches the rest of Project H's container deployment model. Cons: Mirth's persistent-state model doesn't fit the ephemeral-container shape cleanly; the team's prior Mirth experience is EC2-based. *Rejected for dev*; reconsider for higher environments.

## Consequences

### Positive

- Stand-up is fast: a single Terraform target, a single systemd service, a single port to test (`telnet <ip> 2575`).
- Embedded Derby has zero ops overhead in dev; no separate DB to provision or back up.
- Logs land on disk, easy to tail during the early HL7 message-shape iteration.

### Negative

- Public-subnet exposure of port 8443 (even VPN-scoped) is wider than ideal; PROD will move Mirth into a private subnet behind a bastion or load balancer.
- Embedded Derby is a single point of failure — no HA, no replication, no point-in-time recovery. Acceptable for dev only.

### Open

- **STAGE / PREPROD / PROD Mirth topology.** Will it be a single beefier EC2, an Auto-Scaling Group, or Fargate-hosted with externalised storage? *Owner:* Architect + DevOps. *Outcome:* design spike before STAGE rollout.
- **HA story for ACK timeouts.** What happens to in-flight ORU^R01 messages if Mirth restarts mid-handshake? *Owner:* Tech Lead. *Outcome:* test in STAGE.

## Notes

Sourced from Confluence page `443841185`. The HL7 message shape Mirth assembles is documented in [ADR-0013](0013-pdf-report-to-epic-hl7.md). Bootstrap of the EC2 + ALB scaffolding follows the patterns set in [ADR-0002](0002-components-initialization-dev-environment.md).
