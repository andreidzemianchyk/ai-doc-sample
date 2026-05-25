# Integration points

External systems Project H integrates with, plus the AWS managed services that participate in cross-cutting flows. Each system follows a consistent contract shape — role, authentication, direction, cardinality, failure mode, and where it is referenced in the rest of the docs.

## Purpose

This is the single-source page for "what is the contract with system X?". When a developer or an agent is about to touch the EPIC integration, the FDB query path, or the Stripe webhook handler, they read this first.

## EPIC EHR / MyChart

- **Role.** Source of truth for patient demographic and clinical data; sink for the clinician report. Patient authentication identity provider.
- **Per-clinic cardinality.** Each clinic has its own EPIC instance + MyChart portal. See [ADR-0001](decisions/0001-mychart-as-per-clinic-sso.md) for the SSO topology and the [Per-clinic config resolver](overview.md#authorization-service-l3) component view.
- **Auth.** SMART on FHIR OAuth2 with PKCE. Patient auth flow: Project H Patient Mobile App opens an embedded MyChart login page; tokens stored encrypted on device and on Project H backend (D9). Clinician auth: SMART FHIR app launched from EPIC Hyperspace / Hyperdrive via Custom Action.
- **Inbound (Project H ← EPIC).** Patient, Encounter, Practitioner, PractitionerRole, CareTeam, Condition, Observation, DiagnosticReport, DocumentReference, MedicationRequest, AllergyIntolerance, CarePlan, Goal, Procedure, QuestionnaireResponse — 15 FHIR resources catalogued in AVD 4.4.1 Inbound messages (page `420906626`).
- **Outbound (Project H → EPIC).** Bundle (type `searchset`) containing Observation, Condition, DocumentReference. Mandatory PGHD flag on each resource — without it, the clinician In Basket / Inbound Queue notification does not fire and the clinician will not see the report. See [report-to-clinician data flow](data-flows/report-to-clinician.md).
- **App Orchard prerequisite.** Project H invite-link plugin must be registered in EPIC App Orchard before any clinic can use it. Gating dependency. See Living Risk R2 in [overview](overview.md#living-risks-identified-in-discovery).
- **Failure mode.** Token refresh fails → patient re-authenticates with MyChart (full PKCE flow); EPIC API unavailable → request queued, retried with backoff, audit log records.

## FDB (First DataBank)

- **Role.** Medication and clinical-knowledge graph. Drug-by-disorder lookups; safety screening (interactions, allergies, contraindications, duplicate therapy, side effects); patient education monographs; label warnings.
- **Cardinality.** Single global subscription per Project H environment.
- **Auth.** Vendor API key, rotated quarterly via AWS Secrets Manager.
- **Endpoint pattern.** Two query modes:
    - **Cached weekly.** Drug-by-disorder list refreshed once a week; stored locally to avoid per-call queries (D33).
    - **Real-time.** DDI (drug-drug), DFI (drug-food), DA (drug-allergy), DDC (drug-disease-contraindications), DPT (duplicate-therapy), SIDE (side effects). Real-time at report-assembly time only.
- **NDA gating.** Sandbox + production access requires a signed NDA — Living Risk R1. Resolved in implementation week 1.
- **Failure mode.** Endpoint unreachable → fall back to weekly cache where applicable; surface "external knowledge unavailable" in the clinician report rather than silently proceeding.

## Stripe

- **Role.** Per-seat subscription billing for clinics. Not patient-facing.
- **Cardinality.** Global; one Project H Stripe account; one Stripe `customer` per clinic, one `subscription` per clinic with N `subscription_items` (one per seat).
- **Auth.** Stripe secret key (server-side); publishable key in Clinic Web App; webhook signing secret for inbound webhook verification.
- **Flows.**
    - **Outbound:** Stripe Billing + Checkout (subscription start, plan changes, seat-count changes, cancellation via Customer Portal).
    - **Inbound:** Webhooks (`invoice.paid`, `subscription.updated`, `customer.subscription.deleted`, etc.).
    - **Stripe Tax** for tax-ID handling.
- **Idempotency.** Every POST carries an idempotency key derived from `(clinic_id, action, timestamp)`. Webhook handlers verify signatures.
- **Failure mode.** Webhook delivery failure → Stripe retries with exponential backoff up to 3 days; Project H Clinic Web App reconciles state on startup against Stripe API.

## Intercom

- **Role.** Frontend chat / support widget; AI ticketing.
- **Cardinality.** Single global integration.
- **Embedding.** Frontend-only in MVP (mobile shipping in 3rd release per [release-coexistence](release-coexistence.md); clinic web app in 2nd release). No backend-to-backend integration in MVP — patient/clinic identity is passed via the Intercom Identity Verification HMAC.
- **Failure mode.** Intercom widget fails to load → degrade silently; patient still has access to crisis hotlines (Epic-6 F1 US-1.1 "Need help" section).

## AWS managed services

The Project H system embeds several AWS managed services as architectural participants, not just infrastructure.

- **AWS ALB** — Application Load Balancer in front of every ECS service.
- **RDS PostgreSQL (Multi-AZ)** — primary in us-east-2a, read replica in us-east-2b. Continuous transaction-log backup for RPO 5–10 min.
- **S3** — File storage (PDF reports, ML artefacts). Reports are stored on the Project H side and linked from FHIR `DocumentReference`.
- **ElastiCache** — Redis cache for hot lookups (FDB weekly cache, session metadata).
- **CloudWatch** — metrics, logs, alerts. Per-request correlation IDs.
- **Cognito** — Identity provider for the non-EPIC auth path (see [variations](../modules/auth-authorization/variations.md)).
- **SNS + SES + EventBridge** — outbound notification fabric. SNS for push (via APNS); SES for email; EventBridge for inter-service event routing.
- **APNS** — Apple Push Notification Service. iOS-only at MVP; Android adds GCM/FCM post-MVP.
- **KMS** — Encryption keys for at-rest data (RDS, S3) and secrets.
- **Secrets Manager** — vendor API keys (Stripe, FDB), database credentials, JWT signing keys.
- **WAF + Shield** — DDoS and OWASP top-10 protection at the edge.
- **AWS Amplify** — CI/CD glue for mobile builds + GitHub Actions integration.

## SurveyJS

- **Role.** Questionnaire authoring and rendering. Embedded in two places: as an npm package + WebView in the Patient Mobile App for rendering intake / screener / follow-up; as **SurveyJS Creator** in the Project H Admin App for authoring (out of Andersen scope).
- **Licence.** MIT for the runtime (free for use in proprietary apps). Survey Creator: commercial licence required for closed-source authoring tools.

> [!warning]
> Survey Creator's commercial licence applies to the Project H Admin App — that is Project H's product-owner decision, outside Andersen's delivery. If Andersen scope ever extends to the admin authoring side, the licence must be re-procured.

## App stores

- **App Store (Apple)** — MVP distribution target. TestFlight for beta and ad-hoc distribution. Universal Links for the invite-link mechanism.
- **Google Play** — deferred post-MVP. RN codebase is cross-platform; the build pipeline is iOS-first.
- **CI/CD.** GitHub Actions builds; TestFlight upload via Fastlane (final tooling TBD in week 1).

## Per-system contract shape

Every system above follows this micro-template:

```
- Role:           one sentence
- Auth:           credential type + rotation
- Direction:      inbound / outbound / bidirectional
- Cardinality:    global / per-clinic / per-patient
- Failure mode:   what happens when the dependency is unavailable
- Cross-refs:     where else in the docs this contract is invoked
```

Each system will get its own file under `architecture/integrations/<system>.md` once the contract grows beyond a half-page. For the MVP slice, consolidating here is appropriate.

## Open questions

- **NDA resolution timeline for FDB.** Owner: Project Manager. *Outcome:* week-1 status check.
- **Cognito vs MyChart routing in the non-EPIC path** — at what level is the decision made (clinic onboarding form? invite-link metadata? login-page detection?). Owner: Tech Lead. *Outcome:* spike in week 1.
- **Intercom backend integration** — flagged as MVP-out-of-scope, but if the support team requests ticket-status webhooks into Project H, the integration shape needs a design pass. Owner: Project H product. *Outcome:* monitor for the request in months 2–3.
- **APNS + Android push parity** — Android post-MVP means a parallel SNS-to-GCM/FCM channel. Owner: mobile lead. *Outcome:* design pass in the 2nd-release planning iteration.
