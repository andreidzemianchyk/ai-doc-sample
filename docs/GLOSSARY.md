# Glossary

Domain vocabulary used across this doc-set. Per TA §2 (DDD ubiquitous-language discipline), every term is defined once, and **every definition cites where the term first appears in the source corpus** — Confluence page ID, AVD section, or user-story ID. Agents and humans resolving a term land here and can hop to the source.

## Acronyms (sourced from AVD §1.3)

The following acronyms are transposed verbatim from AVD §1.3 of the source Confluence space (page ID `420911659`).

| Term | Meaning | Source |
| --- | --- | --- |
| ADHD | Attention Deficit Hyperactivity Disorder | AVD §1.3 (420911659) |
| AWS | Amazon Web Services | AVD §1.3 |
| CDSS | Clinical Decision Support System | AVD §1.3 |
| CIDI | Composite International Diagnostic Interview | AVD §1.3 |
| CPT Codes | Current Procedural Terminology Codes (used for clinic reimbursement) | AVD §1.3 |
| D.O.B. | Date of Birth | AVD §1.3 |
| DSM | Diagnostic and Statistical Manual | AVD §1.3 |
| EHR | Electronic Health Record | AVD §1.3 |
| EPIC | Healthcare integration software (Epic Systems Corp.) | AVD §1.3 |
| ERT | Emotion Recognition Task (cognitive game) | AVD §1.3 |
| FDA | Food & Drug Administration (US regulator) | AVD §1.3 |
| FDB | First DataBank — provider of drug databases and screening APIs | AVD §1.3 |
| FHIR | Fast Healthcare Interoperability Resources | AVD §1.3 |
| GAD | Generalized Anxiety Disorder | AVD §1.3 |
| HIPAA | Health Insurance Portability and Accountability Act | AVD §1.3 |
| JSPsych | JavaScript-based framework for browser-based experiments / games | AVD §1.3 |
| MAUs | Monthly Active Users | AVD §1.3 |
| MCI | Mild Cognitive Impairment | AVD §1.3 |
| MDD | Major Depressive Disorder | AVD §1.3 |
| ML | Machine Learning | AVD §1.3 |
| MVP | Minimum Viable Product | AVD §1.3 |
| OCD | Obsessive Compulsive Disorder | AVD §1.3 |
| PHI | Protected Health Information | AVD §1.3 |
| PTSD | Post-Traumatic Stress Disorder | AVD §1.3 |
| SLA | Service Level Agreement | AVD §1.3 |
| TBI | Traumatic Brain Injury | AVD §1.3 |
| WCST | Wisconsin Card Sorting Task (cognitive game) | AVD §1.3 |

## Project H specific terms

Terms inferred from the corpus but not in the AVD glossary. Each cites its primary appearance.

**App Orchard** — EPIC's marketplace for third-party SMART on FHIR apps. Registration is the gating requirement for Project H's invite-link plugin (see [ADR-0001](architecture/decisions/0001-mychart-as-per-clinic-sso.md) dependency). *Source:* Epic-1 WebApp F2 (Confluence page `424478678`), AVD 4.4 Integration concerns (page `420906849`).

**Backup code** — 6-character (length TBD per US-1.4) fallback for invite-link failure. Single-use, expires, retry-limited. *Source:* Epic-1 WebApp F1 US-1.1 (page `424478103`); Epic-1 Mobile US-1.4 (page `425558359`).

**Custom Action** — EPIC concept: a button or link in clinician workflow that launches a third-party app with patient context. The mechanism for invite-link generation in Project H. *Source:* Epic-1 WebApp F1 US-1.3 (page `424478670`).

**Hyperspace / Hyperdrive** — EPIC's desktop and web client environments respectively. The Project H plugin must function in both. *Source:* AVD 4.4 EPIC EHR Integration View (page `420906849`); Epic-1 WebApp F2 (page `424478678`).

**Inbound queue / In Basket** — EPIC's clinician-facing notification mechanism that the report-to-clinician flow targets. Marking a FHIR resource as PGHD triggers the inbound-queue placement. *Source:* AVD 4.4.1 Inbound messages (page `420906626`); AVD 4.4 EPIC EHR Integration View (page `420906849`).

**MyChart** — EPIC's patient portal. In Project H, each clinic has its own MyChart instance; MyChart is used as the SSO provider for patient authentication via SMART on FHIR OAuth2 + PKCE. *Source:* [ADR-0001](architecture/decisions/0001-mychart-as-per-clinic-sso.md); AVD §2.2 D3 Key Decision (page `420911663`); Epic-1 Mobile US-1.5 (page `425558367`).

**PGHD** — Patient-Generated Health Data. Flagging an EPIC FHIR resource (Observation, Condition, DocumentReference) as PGHD triggers the clinician In Basket notification — without this flag, the clinician is not notified that the report has been delivered. *Source:* AVD 4.4 EPIC EHR Integration View (page `420906849`).

> [!warning]
> The PGHD trigger has a hard dependency on Observation being part of the Bundle — sending Condition + DocumentReference alone does not notify. This is captured as BR-005 in the auth-authorization module but is technically a *report-generation* invariant, not an auth one. A future engagement would lift it into a dedicated `modules/clinical-report/business-rules.md`.

**SMART on FHIR** — the OAuth2-based framework Project H uses to embed in EPIC (Patient Mobile App, Clinic Web App invite plugin) and authenticate via MyChart with PKCE. *Source:* AVD 4.4 EPIC EHR Integration View (page `420906849`); Epic-1 Mobile US-1.5 Scope (page `425558367`).

**Universal Link** — iOS deep-link mechanism. Used for invite-link delivery to a patient — the link, when tapped on a device with the Project H app installed, opens the app directly with the token in the URL; if the app is not installed, the link redirects to the App Store. *Source:* AVD §2.2 D3 Key Decision (page `420911663`); Epic-1 Mobile US-1.3 (page `425558356`).

## Substrate-adaptation note

Per [CONVENTIONS.md](CONVENTIONS.md), the substrate is pre-implementation. Where a real engagement glossary would cite a code occurrence (e.g., "`StripeWebhookHandler` in `src/billing/stripe.py:42`"), this glossary cites the source Confluence page. Both addresses are equally valid for re-validation.

## Open questions

- The PGHD trigger lives in clinical-report territory but currently only surfaces in auth-module business rules. *Outcome:* author a dedicated `clinical-report` module in the next engagement increment; lift BR-005 over.
- Whether "Universal Link" should also cover the Android App Link analog when Android support ships (post-MVP). *Owner:* mobile lead. *Outcome:* update term definition in the second-release iteration.
- Whether App Orchard certification status is binary (approved/not) or has staged states worth documenting. *Owner:* Architect / Compliance Engineer. *Outcome:* check EPIC Orchard portal documentation in week 1 of any real engagement.
