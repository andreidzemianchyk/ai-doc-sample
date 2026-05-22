# Project H — Initial Phase Deliverables (Confluence snapshot)

Source: https://wiki.andersenlab.com/spaces/KIV/pages/416446964/Initial+Phase+Deliverables
Space: KIV (Project H)
Snapshot date: 2026-05-22

This document consolidates the parent page and the entire subtree of descendant pages (5 levels deep) for offline context.

---

## Page tree (titles + IDs)

- 416446964 — Initial Phase Deliverables
  - 416446965 — Architect
    - 419464900 — User group associations
    - 419469068 — User invitation links
    - 420911655 — Architecture Vision Document (AVD)
      - 420911656 — 1) Introduction
        - 420911657 — 1.1 AVD Purpose
        - 420911658 — 1.2 Business Context
        - 420911659 — 1.3 Glossary
        - 420911660 — 1.4 References
      - 420911661 — 2) Executive Summary
        - 420911662 — 2.1 High-Level Description
        - 420911663 — 2.2 Key Decisions
        - 420911665 — 2.3 Key Risks
      - 420911666 — 3) Architecture Drivers
        - 420911667 — 3.1 Major Features
        - 420911668 — 3.2 Design Constraints
        - 420911670 — 3.4 Quality Attributes
      - 420911673 — 4) Solution Architecture
        - 420911679 — 4.1 System Context View / Business Flow
        - 420911687 — 4.2 Container View
        - 420911696 — 4.3 Deployment view
        - 420906849 — 4.4 EPIC EHR Integration View
          - 420906626 — 4.4.1 Inbound messages
          - 420906856 — 4.4.2 Outbound messages
        - 419470678 — 4.5 Patient Authentication Flow Diagram
        - 419475773 — 4.6 Assessment/Form Implementation View
      - 420911711 — 5) Operation Plan
        - 420911712 — 5.1 Infrastructure
        - 420911742 — 5.2 Continuous integration and continuous delivery
        - 420911745 — 5.3 Logging & Monitoring
        - 420911746 — 5.5 Backup and restore
      - 420911749 — 6) Implementation View
        - 420918196 — 6.1 Responsibilities for components
        - 420911750 — 6.2 Technical Stack
        - 420911751 — 6.3 Implementation Engineer Skillset
        - 420911752 — 6.4 Draft team structure
    - 425568846 — ADR
  - 416446966 — BA
    - 425569138 — User Story Maps_Mobile App, Web App
    - 425561214 — Project H Miro board
    - 420918208 — Project H_WBS
    - 424477923 — Scope for the 1st sprint
      - 424477927 — Epic 1 (WebApp): Invite Link & Backup Code Generation (EPIC Plugin)
        - 424477946 — Feature 1. EPIC Invite Link & Backup Code Generation
          - 424478103 — US-1.1 Add a link generation component to Clinic WebApp
          - 424478373 — US-1.2 Enable adding plugin to EPIC with separate action
          - 424478670 — US-1.3 Implement Custom Action Button in EPIC
        - 424478678 — Feature 2. Register EPIC Link generation plugin in EPIC Orchard
          - 424479095 — US-2.1 Register Plugin in EPIC App Orchard
      - 425558311 — Epic 1 (MobileApp). Authentication/Authorization (Mobile)
        - 425558319 — Feature 1. Patient's sign up & sign in
          - 425558328 — US-1.1 [UI] Project H welcome page
          - 425558346 — US-1.2 Collect consents from the patient
          - 425558356 — US-1.3 Validate the invite link/code
          - 425558359 — US-1.4 [UI] Enter Backup code screen
          - 425558367 — US-1.5 Patient authorization using MyChart
          - 425558414 — US-1.6 Setup code or Face ID
          - 425558417 — US-1.7 Display "Congratulations" screen
      - 425558444 — Epic 2 (Mobile App). Intake Questionnaire & Screener
        - 425558448 — Feature 1. EPIC integration to obtain patient's data
          - 425558452 — US-1.1 Component to get Patient demographic/medical records from EPIC
      - 420923774 — Vision&Scope
        - 420923777 — Business requirements
          - 420923781 — Background
          - 420923824 — Business opportunity
          - 420923834 — Business Objectives and Success Criteria
          - 420923859 — Customer or market needs
          - 420923933 — Potential risks
        - 420924070 — Vision of the solution
          - 420924072 — Vision statement
          - 420925493 — High-level user flow
          - 420924465 — Major features
          - 425563608 — Key decisions
          - 420924719 — Assumptions & Dependencies
          - 420926444 — Key non-functional requirements
        - 420924754 — Scope and limitations
          - 420925534 — Scope of initial and subsequent releases
          - 420925545 — Limitations and exclusions
        - 420924764 — Business context
          - 420925550 — Stakeholder profiles
          - 420925553 — Project priorities
          - 420925556 — Operating environment
  - 416446969 — UI/UX Design

---

## 1. Parent — Initial Phase Deliverables (416446964)

*(Empty — index page only; structure shown above)*

---

## 2. Architect (416446965)

### Main deliverables
| Name | File/link | Review/Approval Status | Comment |
| --- | --- | --- | --- |
| AVD (Architectural Vision Document) | | | |
| Other | | | |

### Secondary Deliverables
| Name | File/link | Review/Approval Status | Comment |
| --- | --- | --- | --- |
| Diagrams | | | |
| 3D vs other customization solutions (short comparison table, e.g. pros/cons, implementation difficulties, final look examples) | | | |
| Infrastructure cost calculation | | | |
| Other | | | |

### To review during discovery
| Item | Status |
| --- | --- |
| Diagrams | DONE |
| Chat service comparison (CometChat/Intercom/Custom) | DONE |
| Compare Twilio vs Sendgrid or other email services | DONE |
| Compare microservices vs monolith | DONE |
| Compare 3D vs other customization solutions | DONE |

Statuses: TO DO · IN PROGRESS · DONE · PENDING · APPROVED.

### 2.1 User group associations (419464900)
**Clinic Associations:**
- Each patient/clinician/practice user is associated with one clinic at a time.
- Options: a) separate datasets per clinic; b) migration process between clinics.

**Admin Access:**
- Admins can access: common dictionaries/reference data, aggregated/non-sensitive reports.
- Admins cannot access: clinic-specific sensitive data, individual patient/clinician records.

**System Architecture:**
- Single application/URL for all clinics.
- Clinic identification is post-login via user-clinic association.

### 2.2 User invitation links (419469068)
Comparison of approaches; **approved approach: #1 — Unique-per-patient link generation in EPIC EHR.**

| Approach | Implementation | UX | Access restriction | Effort/complexity |
| --- | --- | --- | --- | --- |
| 1. Unique link in EPIC EHR | Module/component in Clinic web app or separate web app as SMART FHIR app with OAuth2+PKCE; registered in EPIC App Orchard as EPIC Plugin; separate Action (scope patient) generates per-patient token, stored in DB | Excellent | High | High |
| 2. Unique link in Clinic Web App (public page / Clinic Admin) | Component in Clinic Web App; clinicians open public pages and input patient details (EPIC ID), or request link from Clinic Admin | Bad | Medium | Medium |
| 3. Unique link in Clinician Web App | Component in Clinician Web App | Medium | High | High (Clinician Web App required) |
| 4. Common link per clinic | Component in Clinic Web App to show unique links; Clinic Admin shares with clinicians | Medium | Poor/Medium | Medium |
| 5. Common link | Project H admin shares during onboarding, or Client Admin sees static link | Medium | Poor | Easy |

### 2.3 ADR (425568846)
*(Empty page — placeholder)*

---

## 3. AVD — Architecture Vision Document (420911655)

| Doc Author | | Last changes | | Version | 1.2 | Creation Date | |

### 3.1 Introduction (420911656)

#### 1.1 AVD Purpose (420911657)
The AVD defines the architectural foundation and consolidates technical, functional, operational inputs. Used for: stakeholder alignment, reference during delivery, planning (infra, security, DevOps, third-party integration), change impact assessment, handover/maintenance.

#### 1.2 Business Context (420911658)
**Project Overview** — Project H is a precision psychiatry platform addressing the US mental-health misdiagnosis crisis (50–80% misdiagnosis rate). Equips PCPs with clinically validated digital tools embedded into EHRs (EPIC via FHIR/HL7). HIPAA, SOC 2 Type II, OWASP ASVS aligned. Positioned as Class I CDSS (FDA premarket exempt).

Target users: Patients (mobile assessments/games), Clinicians (structured reports in EHR), Clinic Administrators (subscriptions, onboarding), Project H Admin/Sales.

Goal: < $3/year per patient without ML / < $5/year with ML; 50k MAU in first 4 months.

**Main capabilities:**
1. **Patient App** (iOS for MVP, Android later) — validated questionnaires with adaptive branching, cognitive/reaction games (WCST, ERT, attention), risk assessment (suicidality, substance misuse), reminders, offline mode with secure sync.
2. **Clinician Report** (EHR-integrated) — PDF report, evidence-based recommendations via FDB, longitudinal tracking with CPT codes, EPIC FHIR/MyChart integration.
3. **Clinic/Practice Admin App** — subscription management via Stripe, patient onboarding via EHR-linked invitations and deep-linking, Intercom support, clinician/patient oversight.
4. **Project H Admin App** — centralized dashboard, billing analytics, monitoring/compliance auditing.
5. **Security & Compliance Layer** — HIPAA, SOC 2 Type II, OWASP ASVS, audit trails, breach notification, RBAC.
6. **Integration & Scalability** — AWS backend, EPIC FHIR/HL7, future ML on SageMaker.

#### 1.3 Glossary (420911659)
ADHD, AWS, CDSS, CIDI, CPT Codes, D.O.B., DSM, EHR, EPIC, ERT, FDA, FDB, FHIR, GAD, HIPAA, JSPsych, MAUs, MCI, MDD, ML, MVP, OCD, PHI, PTSD, SLA, TBI, WCST.

#### 1.4 References (420911660)
[1] Project Vision & Scope Document.

### 3.2 Executive Summary (420911661)
Project H is a digital precision psychiatry platform enhancing accuracy, efficiency, and accessibility of mental-health diagnosis/treatment in primary care. Combines validated questionnaires, cognitive/reaction tasks, and evidence-based decision support. Patients engage via mobile; clinicians receive PDF reports directly in EPIC via FHIR/HL7. Streamlines workflows, supports CPT-code reimbursement, complies with HIPAA / SOC 2 Type II / OWASP ASVS.

#### 2.2 Key Decisions (420911663) — D1–D40 (highlights)
- **D1** Clinic Web App = monolithic full-stack on Python + Django Admin. Patient mobile = React Native, MVP iOS only.
- **D2** Mobile app linked to Clinic Web Admin domain (install via App Store web link).
- **D3** MyChart of each clinic = SSO; Universal Links generated by doctor, backup codes for auth.
- **D4** Architect involvement during dev for NFRs, certification, technical guidance.
- **D5** Live env supports 50k patients, 100–300 clinicians, autoscaling.
- **D6** Dev/stage environments minimal but sufficient.
- **D7** Assessments via SurveyJS library; backend logic built on Project H JSON migrated to SurveyJS format.
- **D8** PDF generated from HTML template provided by Project H.
- **D9** Mobile biometric login if refresh token active; encrypted access/refresh token storage.
- **D10** CI/CD via GitHub Actions + TestFlight.
- **D11** ElastiCache for Redis for reference data caching.
- **D12** Backend = Docker containers via ECS/ECR with autoscaling; Reserved EC2 for prod, Spot for dev/stage; ≥1 prod server always running.
- **D13** HIPAA/SOC 2/OWASP best practices: encrypted storage, secrets management, IAM RBAC, audit logging.
- **D14** Audit logs for user/system actions in mobile backend and clinic admin web app; stored in DB, viewable in CloudWatch; per-request unique IDs.
- **D15** AWS HIPAA-compliant managed services.
- **D16** PostgreSQL on RDS as relational DB.
- **D17** Files in S3, optional S3 Archive tier.
- **D18** ML training on SageMaker, ETL scripts to DB/S3; no extra solutions for MVP.
- **D19** Mobile offline mode with biometric auth if refresh token active; SQLite local; asynchronous sync.
- **D20** Load balancing via AWS ALB with optional WAF.
- **D21** Logging/monitoring via CloudWatch.
- **D22** Notifications via SNS + APNS (push) and SES (email).
- **D23** Send only Observation, Condition, DocumentReference FHIR Resources to EPIC; recommendations within PDF.
- **D24** Intercom = frontend-only on mobile and web.
- **D25** Cognitive games + SurveyJS as React Native packages.
- **D26** Mock servers for integration start / load testing.
- **D27** Dedicated EPIC/MyChart sandbox per clinic for dev/stage.
- **D28** Sandboxes for FDB, Stripe, Intercom, EPIC/MyChart for testing.
- **D29** REST/FHIR with retry, error handling, request/response logging for external integrations.
- **D30** Recommendation = Python library (black box) from Project H; inputs: game results, assessment, EPIC profile, FDB; outputs: refined meds list, treatment plan.
- **D31** MVP sends only PDF link (not PDF itself).
- **D32** Each clinic has own EPIC/MyChart instance; integration subprojects per clinic.
- **D33** FDB integration: weekly med-list update by conditions + real-time queries for detailed drug info.
- **D34** Andersen: Patient Mobile App, Clinic Web App, FDB and EPIC/MyChart integration. Project H: cognitive games, recommendation module, Project H Admin Web App.
- **D35** Stripe integration limited to subscription support; iframe/SDK frontend + webhook backend.
- **D36** EPIC integration: FHIR API for patient profile + result push; registration in Epic Showroom.
- **D37** Release & version management; versioning, rollback, mobile compatibility with earlier API versions.
- **D38** DB migrations; backups stored & deployable; restorable in alternate environments.
- **D39** CI/CD pipelines, IaC for infra provisioning and recovery using DB backups.
- **D40** No data migration needed.

#### 2.3 Key Risks (420911665)
R1–R16 across spheres: Compliance, Performance, Security, Availability, Maintainability, Integration, Usability, Testability. Priorities: R5/R6/R2/R3 High; R1/R4/R11/R14/R15(usability) Medium; rest Low. Mitigations link to D-codes above.

### 3.3 Architecture Drivers (420911666)

#### 3.2 Design Constraints (420911668)
- **CT-1** Custom + open-source only; explicit decision for any third-party dep.
- **CT-2** Cross-platform mobile, MVP iOS-only.
- **CT-3** React Native (cognitive games are React Native).
- **CT-4** Python backend (matches Project H Admin Web App stack).
- **CT-5** US healthcare standards compliance; full list with Compliance Engineer.
- **CT-6** Up to 50k registered patients with cost-efficient implementation.
- **CT-7** Customer components incorporated as black boxes with documented integrations.
- **CT-8** Medical data stored in secure, certified US repository; EPIC EHR / MyChart-compatible.

### 3.4 Solution Architecture (420911673)

#### 4.1 System Context View / Business Flow (420911679)
Actors: Patient, Clinic Admin, Project H Admin, Clinician. Software systems: Project H, MyChart, Stripe, Intercom, Clinic EHR (EPIC).

#### 4.2 Container View (420911687)
Persons: Patient, Project H Admin, Clinic Admin, Clinician.
External systems: MyChart, EPIC EHR, Stripe, FDB, Intercom, APNS.
Containers: Patient Mobile App (React Native, TS), Patient Mobile App Backend (Python, Django/FastAPI), Project H Admin Web App (Python, Django Admin), Clinic Admin Web App (Python, Django Admin), Project H Games (RN library), Project H Recommendation (Python lib), Project H ML Environment (SageMaker).
Cloud-managed: ALB, SNS/SES + APNS, CloudWatch, RDS (Postgres), ElastiCache, S3.
External libs: SurveyJS.

#### 4.3 Deployment View (420911696)
- User & Mobile App via App Store + TestFlight (CI/CD: GitHub Actions).
- DNS via Route 53.
- ALB + NAT Gateway in public subnet; ECS Cluster in private subnet (autoscaling).
- VPC with public + private subnets.
- RDS Postgres primary in us-east-2a, read replica in us-east-2b; Multi-AZ.
- S3 + SageMaker for ML.
- CloudWatch, IAM, KMS, WAF, Shield, Secrets Manager, Config, CloudTrail.
- Environments: Dev (latest), Stage (next release), Prod (only fully provisioned).

#### 4.4 EPIC EHR Integration View (420906849)
- Register in Epic App Orchard as patient-facing app with read scope + write Observation, Condition, DocumentReference.
- Refresh token stored in mobile backend; used for retrieving and writing data.
- Observation/Condition/DocumentReference flagged as PGHD → triggers PGHD workflow → resources placed in clinician In Basket queue.
- Detailed info (CPT codes etc.) included in PDF.
- PDF stored on Project H side; DocumentReference contains link to Web App (SMART FHIR clinician app); only authorized clinicians can download.
- Patient data retrieved during authorization flow; outbound data on trigger events (e.g., report generation).

**4.4.1 Inbound messages (420906626)** — FHIR resources used: Patient, Encounter, Practitioner, PractitionerRole, CareTeam, Condition, Observation, DiagnosticReport, DocumentReference, MedicationRequest, AllergyIntolerance, CarePlan, Goal, Procedure, QuestionnaireResponse. PlantUML class diagram included.

**4.4.2 Outbound messages (420906856)** — FHIR resources used: Bundle (`searchset`), Patient, Observation (LOINC), Condition (ICD-10/SNOMED), DocumentReference. PlantUML class diagram included.

#### 4.5 Patient Authentication Flow Diagram (419470678)
Two diagrams (other users / login flow) — embedded macros.

#### 4.6 Assessment/Form Implementation View (419475773)
Comparison tables for SurveyJS (MIT), Form.io Community (MIT), LimeSurvey (GPL). SurveyJS chosen for frontend flexibility + AWS Lambda compatibility + offline embedding.

Offline survey flow diagram with bundled SurveyJS in app; SQLite storage; background sync.

Risks of offline survey: version mismatch, assignment conflicts, duplicate submissions, incomplete data, outdated business logic, identifier conflicts, security risks. Each with mitigation (versioning, UUIDs, server-side validation, deduplication, encryption with SQLCipher).

Tech tasks list (BE/FE) for offline survey implementation.

### 3.5 Operation Plan (420911711)
NOTE 1: AVD shouldn't be more detailed than DevOps artefacts; should provide traceability, QA linkage, and accommodate solution-specific NFRs.
NOTE 2: Operation Plan caters to operations (SLAs, observability, patching, rollback).

#### 5.1 Infrastructure (420911712)
- Cloud approach: public cloud (AWS).
- AWS pricing calculators (dev/stage and prod estimate URLs).
- Services: CloudWatch, Secrets Manager, S3, WAF, EC2 (Prod t3.large, Dev/Stage t3.medium), ECS/EKS, ALB, SES, SNS, RDS (primary + backup).

#### 5.2 CI/CD (420911742)
- GitHub + GitHub Actions; GitHub Team $3.67/user/mo (then $4) or Enterprise $19.25/user/mo.

#### 5.3 Logging & Monitoring (420911745)
- AWS CloudWatch: monitoring (start/stop, CPU/Mem/Disk, health check, backend exceptions); logging.

#### 5.5 Backup and restore (420911746)
- RDS automated backups (daily snapshots + transaction logs, 1–35 days), stored in S3.
- RPO ~5–10 min (point-in-time recovery); RTO ~15–30 min.
- ALB + auto-scaling; real-time replication across AZ; disaster recovery testing; CloudWatch monitoring/alerts; communication plan.

### 3.6 Implementation View (420911749)

#### 6.1 Responsibilities for components (420918196)
Split Project H vs Andersen responsibilities for: Assessment questions, Diagnostic recommendation, FDB med list, Treatment recommendation, Cognitive games, PDF generation, Clinic data structure, CPT codes. Each row lists minimum requirements before implementation.

#### 6.2 Technical Stack (420911750)
- **Backend/Fullstack Web:** Python, FastAPI + Django Admin, AWS RDS Postgres, MyChart SSO (mobile) + Django Auth, JWT, OAuth2.0 + RBAC, CloudWatch, REST/SMART FHIR/OpenAPI, ElastiCache Redis, ALB/S3/RDS/EC2/ECS/ECR, Docker/ECS.
- **Mobile:** iOS/Android, React Native, Clean Architecture + MVVM.
- **CI/CD:** Git, GitHub Actions or GitLab CI, Terraform/Pulumi, Docker/ECS/ECR, Ansible, AWS, CloudWatch, ECS orchestration.

#### 6.3 Implementation Engineer Skillset (420911751)
Backend/Fullstack: Python, FastAPI, Django Admin, REST/FHIR. Mobile FE: React Native. Manual QA: TestRail, Postman, bug tracker. BA: Confluence, Jira, Healthcare (HIPAA, EPIC, FHIR). DevOps: AWS, Terraform/Pulumi. Architect: AWS, Java, Confluence, Jira, Healthcare (HIPAA, EPIC, FHIR).

#### 6.4 Draft team structure (420911752)
PM 0.5–1, BA 1, Python eng 2, RN eng 1–2, Manual QA 2, DevOps 1, Solution Architect 1, Compliance Engineer 1.

---

## 4. BA (416446966)

Same draft but with BA deliverables. [Project H estimation](https://andersenlab-my.sharepoint.com/:x:/p/i_turska/EXAnAfRNUuFGmQoXnGCLRikB0yLjp1UoaZPOY93BF6cd2w?e=pxs9Rr) (WBS).

### 4.1 User Story Maps — Mobile App, Web App (425569138)
Attached images: `USM_Web App.jpg`, `USM_Mobile App.jpg`.

### 4.2 Project H Miro board (425561214)
[Miro board](https://miro.com/app/board/uXjVJSk13zg=/?share_link_id=135931035849) — User Story Maps + User flows. Password: `[REDACTED — anonymized context; refer to source-of-truth wiki page if access is required].`

### 4.3 Project H_WBS (420918208)
[Project H WBS spreadsheet](https://andersenlab-my.sharepoint.com/:x:/p/i_turska/EfzVdbb7osxAu80PY1tkZ-8BCvfdjnitpuMSAWQcMHBtlQ?e=CKhONk).

### 4.4 Scope for the 1st sprint (424477923)
Phased releases keyed on value delivered. Mobile App + Clinic Web App covered; Clinician Report (Epic-integrated PDF + FHIR resources) part of mobile app's reporting epic. Project H Admin App = out of scope.

#### Epic 1 (WebApp): Invite Link & Backup Code Generation — EPIC Plugin (424477927)

EPIC users generate a patient-specific deep link + backup code via custom Action on Patient chart. SMART on FHIR PKCE app embedded as EPIC plugin (Hyperspace/Hyperdrive).

Personas: EPIC User (Clinician/Staff), Patient, IT Admin.

**Scope:** SMART on FHIR PKCE app, patient-scoped Action, deep link + code with configurable expiration, copy-to-clipboard, error handling, audit, App Orchard registration.

**Out of scope:** bulk invitations, sending the link/code itself, custom content templates.

##### Feature 1. EPIC Invite Link & Backup Code Generation (424477946)
- EPIC users invite patients without leaving EPIC.
- Patients receive secure link/code via SMS/email/MyChart chat.
- Key requirements: deep link with secure token exchange; backup code single-use, expires; configurable expiration; one active invite per patient (regen invalidates previous); HIPAA/PHI-safe with audit.
- Out of scope: bulk/batch invites, sending channels directly, analytics dashboards, multi-invite per patient.

**US-1.1 Add a link generation component to Clinic WebApp (424478103)**
Build Invite component in Clinic WebApp (SMART on FHIR); generate deep link + backup code with expiration timestamp; embedded in EPIC; regeneration invalidates prior. Tasks: SMART PKCE module, backend endpoint, Invite data model, frontend Invite component (modal with Copy Link/Copy Code/Regenerate), error handling. 6 scenarios with ACs (success, copy, regenerate, auth failure, backend failure, accessibility).

**US-1.2 Enable adding plugin to EPIC with separate action (424478373)**
Add Invite component to EPIC (Patient's profile); create Patient-scoped Action; copy functions; validate in Hyperspace + Hyperdrive. Out of scope: sending SMS/email/MyChart from plugin, custom EPIC UI mods. 3 scenarios with ACs.

**US-1.3 Implement Custom Action Button in EPIC (424478670)**
Custom Action button on Patient profile; on press generates link + code; copy actions for both. Out of scope: bulk/multi-patient, role-based display logic, label translations. 3 scenarios with ACs.

##### Feature 2. Register EPIC Link generation plugin in EPIC Orchard (424478678)
Register the Project H Invite plugin in App Orchard (SMART on FHIR with OAuth2 + PKCE). Without it, clinicians can't access invite functionality from EPIC regardless of WebApp build status.

Scope: Orchard registration package (metadata, endpoints, redirect URIs); OAuth2/PKCE handshake validation; deploy from EPIC sandbox.

**US-2.1 Register Plugin in EPIC App Orchard (424479095)** — Configure SMART app with client ID, PKCE, redirect URIs; validate OAuth2 handshake in sandbox. 3 scenarios.

#### Epic 1 (MobileApp). Authentication/Authorization in the Project H app — Mobile (425558311)
Patient sign up/sign in using existing MyChart credentials via SMART on FHIR OAuth2 + PKCE.

In scope: patient sign-up/sign-in via MyChart IdP, SMART PKCE, access/refresh token storage, session management/validation, re-auth on expiry.
Out of scope: invite link & backup code generation (Clinic WebApp epic), EPIC Orchard App registration (Clinic WebApp epic).

##### Feature 1. Patient's sign up & sign in (425558319)
Onboarding flow: Welcome → Consents → Invite Validation → MyChart Auth → Local Security → Dashboard.

**US-1.1 [UI] Project H welcome page (425558328)** — 3-screen onboarding carousel (Privacy by design, Clinical AI precision, Human-centered care). Logo + "Welcome to Project H" header. Progress dots. "Get Started" button on each. WCAG 2.1 AA. 5 scenarios (display, tap Get Started, skip on subsequent login, fallback if welcome fails, accessibility).

**US-1.2 Collect consents from the patient (425558346)** — Consents screen with accordion sections (General Use, Privacy & HIPAA, EHR Access, Sharing with Clinician, R&D de-identified data, Emergency Notifications). "I Agree to the Consent" primary CTA. Skip on next login if already collected. Backend stores patient_id + timestamp + version. 4 scenarios.

**US-1.3 Validate the invite link/code (425558356)** — Patient mobile app endpoint to validate link/code; "Contact clinic" screen if invalid; deep link opens app or redirects to App Store. Technical flow described. 4 scenarios (valid, invalid, app not installed, service unavailable).

**US-1.4 [UI] Enter Backup code screen (425558359)** — Segmented 6-char input; helper text; Continue button enabled when 6 chars entered; "Can't find the code?" → modal with inbox/spam tips + Contact Support. 6 scenarios including retry limit (default 5 attempts, then contact clinic).

**US-1.5 Patient authorization using MyChart (425558367)** — Embedded MyChart login screen; backend endpoint to fetch login URL; OAuth2 + PKCE token exchange; secure token storage; token validation/refresh. 5 scenarios (success, token expired, both invalid, invalid credentials, service unavailable).

**US-1.6 Setup code or Face ID (425558414)** — Setup screen with Face ID and Passcode (4–6 digits) options; "Set Up Later" allowed once, enforced next login. 4 scenarios.

**US-1.7 Display "Congratulations" screen (425558417)** — Personalized greeting (uses patient first name from EPIC); summary box (Access records, Get reminders, Track progress); "Start Questionnaire" CTA → opens Intake flow. 2 scenarios.

#### Epic 2 (Mobile App). Intake Questionnaire & Screener (425558444)
Business context: intake/screener provides info for diagnosis; data exchanged with EPIC via FHIR; enhanced with FDB.
In scope: EPIC integration to fetch patient data on each login/new token, intake/screener questionnaire logic, FDB endpoint integration.
Out of scope: new custom questionnaires, offline completion, advanced analytics/dashboards.

##### Feature 1. EPIC integration to obtain patient's data (425558448)
Data exchange with EPIC for prefilling Intake and sending reports back.

**US-1.1 Component to get Patient demographic/medical records from EPIC (425558452)** — Trigger on first MyChart sign-in or re-auth. Data set: demographics (DOB/age, gender, race/ethnicity, language, marital status, education, children, height), vitals (allergies, medications), comorbidities (diabetes, hypertension, hypertriglyceridemia, CV history, mental health, substance use, autism), labs. Prefill intake + Congratulations name. Token refresh handling. Missing data doesn't block onboarding. 2 scenarios.

#### Vision & Scope (420923774)

##### Business requirements (420923777)

**Background (420923781)** — AI-powered mental-health diagnostics for PCPs. Misdiagnosis 50–80%. Fewer than 35% of clinicians rely on objective scores like PHQ-9/GAD-7. Project H embeds validated questionnaires, gamified cognitive assessments, and automated reports into Epic EHR; AWS-based; future ML-ready.

**Business opportunity (420923824)** — Differentiation: validated assessments, seamless Epic FHIR, HIPAA/SOC2/OWASP compliance, scalable monitoring with follow-ups and cognitive games, CPT-integrated reports.

**Business Objectives and Success Criteria (420923834)** — Reduce diagnostic errors from 50–80% to <20%; 50k MAU in 4 months; cut clinician review time by ≥50%; $100/clinician/week revenue uplift; HIPAA + SOC 2 + OWASP ASVS before enterprise scaling.

**Customer or market needs (420923859)** — Clinicians: validated tools, EHR integration, CPT reimbursement, concise actionable reports. Clinics/Admins: subscription pricing, low-friction onboarding, HIPAA, Intercom support. Patients: intuitive mobile app, gamified cognitive tasks, privacy/security, empathetic UX. Plus payers, hospitals.

**Potential risks (420923933)** — Technical (Epic Plugin complexity, FHIR variability, offline sync, FDB scope/NDA), Product/Adoption (clinician resistance, accessibility, Android exclusion), Compliance/Security (HIPAA, SOC 2, FDA CDSS, breach notification, data lifecycle), Business (clinic ROI/CPT, EHR vendor lock-in, regulatory delays). Each with mitigation.

##### Vision of the solution (420924070)

**Vision statement (420924072)** — Trusted digital bridge between patients, clinicians, and health systems. Standardized, data-driven screening + follow-up without provider burden, with HIPAA, SOC 2, OWASP, WCAG, FDA CDSS compliance. Value across Patients (early detection, follow-ups, accessibility, empowerment, safety), Clinicians (decision support, time savings, evidence-based care, reimbursement, reduced liability), Clinic Admins (efficiency, revenue, transparency, support, oversight), Health Systems (scalability, standardization, compliance, integration, strategic differentiation).

**High-level user flow (420925493)** —
1. Clinic Admin generates deep link + backup code via Epic plugin → patient receives.
2. Patient onboards in iOS app: link/code → consents → MyChart SMART OAuth2 → Face ID/PIN → Dashboard.
3. Assessments: Intake & Screener via SurveyJS + cognitive games (WCST, ERT, Trail Making); offline-capable.
4. Backend processing: FDB mapping, rules engine + FDB recommendations, report PDF + FHIR (Observation, Condition, DocumentReference), pushed to Epic.
5. Clinician review in Epic: notification → embedded SMART App report view → approve → final diagnosis flows back to Project H.
6. Follow-ups: push reminders; red flags trigger accelerated follow-ups + clinic alerts.
7. Clinic Admin & Health Systems oversight via Web Admin App.

**Major features (420924465)** —
Mobile App epics & features (full breakdown of user stories):
- Epic-1 Authentication/Authorization: F1 sign up & sign in (US 1.1–1.9), F2 logout & auto logout (US 2.1–2.2).
- Epic-2 Intake & Screener: F1 Epic integration (US 1.1–1.2), F2 logic & UI (US 2.1–2.7), F3 FDB search methods (US 3.1–3.5), F4 FDB endpoints integration (US 4.1–4.6 incl. DDI/DFI/DA/DDC/DPT/SIDE screening, education monographs), F5 assessment processing library, F6 offline mode (US 6.1–6.4).
- Epic-3 Report: F1 report generation (US 1.1–1.7 incl. CPT codes, ranked treatment, monitoring & safety, references), F2 notify clinician (US 2.1), F3 pull back diagnosis (US 3.1).
- Epic-4 Cognitive games: F1 integrate WCST, ERT, Trail Making (US 1.1–1.4); F2 game processing (US 2.1–2.6).
- Epic-5 Follow-ups: F1 logic (US 1.1–1.4), F2 UI (US 2.1–2.3), F3 integrate into report (US 3.1–3.3), F4 self-started rate limiting (US 4.1–4.4), F5 red flags (US 5.1–5.4).
- Epic-6 Settings: F1 General (Need help/Crisis lines, language scaffolding, settings screen — US 1.1–1.3), F2 Intercom (US 2.1).
- Epic-7 Notifications: F1 reminders (US 1.1–1.2).
- Epic-8 Data retention: F1 delete user data.
- Epic-9 Audit logging.
- Epic-10 Accessibility (WCAG 2.1 AA).

Clinic Web App epics & features:
- Epic-1 Invite link & backup code (Epic plugin): F1 generation (US 1.1–1.3), F2 register in App Orchard.
- Epic-2 WebClinic PDF Download Module (SMART App): F1 generate link + deny patient access.
- Epic-3 Sign in/up: F1 sign up (US 1.1–1.3), F2 sign in (US 2.1–2.2).
- Epic-4 Clinic admin profile: F1 change password/details, F2 clinic info + Stripe customer + delete account (US 1.1–1.5).
- Epic-5 Help section: F1 display + F2 Intercom.
- Epic-6 Subscribe to Project H: F1 Stripe setup/pricing (US 1.1–1.7), F2 payments/checkout (US 2.1–2.2), F3 data/APIs (US 3.1–3.3), F4 subscription management (US 4.1–4.3), F5 seat management (US 5.1–5.3), F6 subscription history.

**Key decisions (425563608)** —
1. Mobile cross-platform RN; MVP iOS only; Android later.
2. iOS supported devices: iPhone 16 Pro Max → iPhone 13 Pro (10 latest models).
3. Epic provides stable SMART on FHIR OAuth2 + PKCE; supports Patient, Observation, Condition, DocumentReference.
4. SurveyJS for questionnaires (JSON, offline, background sync).
5. Games integrated as RN modules from Project H; results linked to patient ID.
6. FDB med data via API; some stored locally to avoid per-call queries.
7. Offline sync queue reliably stores + resyncs.
8. Epic plugin (invite link + backup code) registered in App Orchard, hosted in Hyperspace/Hyperdrive.
9. HIPAA + SOC 2 + OWASP ASVS within Project H + Andersen scope.
10. Consents collected before MyChart login.
11. Reports shared with clinicians by default; patients may request under HIPAA.
12. Clinic admin app on Python/Django Admin.

**Assumptions & Dependencies (420924719)** —
*Assumptions* operational (multi-step onboarding accepted, clinic admins generate codes/links, Stripe acceptable, clinic notified by general email about red flags), compliance/security (FDA CDSS exemption, no ONC cert), design (predefined questionnaire types, style-only customization for Clinic Web App, no dark mode for MVP, RN platform-neutral), architectural (Epic compliance, sandbox access in 1st sprint, Project H components don't block Andersen, single FHIR format for MVP), mobile dev (RN 0.79.5 + Expo SDK 53+, iOS 17+ MVP, Android 14+ later, no tablets, no dark theme, backend handles Epic FHIR/algorithm/FDB/AWS SNS), compliance (WCAG 2.1 AA, offline sync + conflict resolution + audit logging), DevOps (C4 diagrams, AWS account with AdministratorAccess + billing, client GitHub access with runners).

*Dependencies*: Andersen ↔ Project H (questionnaires JSON, diagnostic/treatment rulesets, FDB NDA, report templates/CPT mapping, game repo, Epic plugin workflow, consent texts, billing pricing/discount logic). External: Epic (App Orchard, FHIR endpoints, plugins, Inbound Queue), FDB, Stripe, Clinics. Inter-team: bidirectional blockers between Andersen and Project H deliverables.

**Key non-functional requirements (420926444)** —
F1 Security: RBAC, OAuth2+PKCE via Epic, biometric optional, minimum-necessary rule, tamper-resistant audit logs.
F2 Availability & Reliability: Multi-AZ uptime, encrypted backups + restore testing, DR with RTO/RPO defined in AVD, emergency read-only access.
F3 Performance & Scalability: response time per AVD, AWS autoscaling, automatic logoff.
F4 Compliance & Auditability: HIPAA, ≥10y retention, searchable audit trail, BAAs (AWS, FDB, Andersen).
F5 Maintainability: patch management via SLA, configuration mgmt versioned, documentation.
F6 Interoperability & Data Management: data portability, minimization, retention/disposal, FHIR/HL7 bidirectional.
F7 Physical Security: AWS (with BAA), no local PHI, encrypted offline storage.
F8 Legal & Ethical: patient rights (access/amend/export/delete), transparency.
Extra: offline mode (intake/screener), accessibility (WCAG 2.1 AA).

##### Scope and limitations (420924754)

**Scope of initial and subsequent releases (420925534)** —
- **MVP — Core Flow:** Onboarding via Epic invite + MyChart login, consent collection, intake & screener (SurveyJS + adaptive branching), FDB-coded patient profiles, automated report (PDF + FHIR with CPT codes), clinician notification, storage/logging. Clinic Web App: Epic plugin invite, report download module, sign-up/sign-in, admin profile basics, subscription setup with Stripe.
- **2nd Release — Follow-ups, cognitive games (mobile) + subscription management (clinic):** History view, cognitive games, follow-up questionnaires, reminders. Clinic: profile updates, password change, Intercom, subscription mgmt.
- **3rd Release — Advanced:** Red flags, Intercom chat, data deletion, self-started follow-up frequency limits. Clinic: full profile incl. delete account, advanced subscription features, Intercom support, Project H app endpoints.
- **Out of Scope:** Project H Admin App (future).

Detailed table mapping each Epic/Feature/US to MVP vs 2nd vs 3rd release.

**Limitations and exclusions (420925545)** —
Mobile: no Android in MVP, no advanced ML recommendations, no patient-facing report in MyChart (only by HIPAA request), password changes via MyChart, no full multi-language translations in MVP, only Epic (not Cerner/Oracle) for MVP.
Clinic Web App: no subscription history in app (use Stripe portal), no advanced billing.
Clinician portal: none — all workflows in Epic.
Project H Admin App: out of Andersen scope.
Reports: no auto-inclusion in Epic without clinician approval; no embedded patient view in MyChart without approval.
Infrastructure/Compliance: no FDA CDSS Class II+; no GDPR/MDR; no ML infra (SageMaker) in MVP.

##### Business context (420924764)

**Stakeholder profiles (420925550)** — Patients, Clinicians, Clinic Admins, Clinics, Regulatory/Compliance Bodies. Each row: value/benefits, attitudes, interests, constraints.

**Project priorities (420925553)** — Driver/Constraint/Degree of Freedom across Schedule, Features, Quality, Budget/Staff, Compliance.

**Operating environment (420925556)** —
- OE-1 Patient Mobile App (iOS MVP, cross-platform RN, offline w/ encrypted local storage).
- OE-2 Patient Mobile App Android future.
- OE-3 Clinic Web App: Django/Python backend + React frontend.
- OE-4 EHR Integration (Epic): Hyperspace/Hyperdrive plugin, FHIR API/MyChart, App Orchard registration.
- OE-5 Infrastructure: AWS, HIPAA-eligible services.
- OE-6 Availability & Reliability: maintenance windows outside peak hours, offline fallback.
- OE-7 Integrity & Security: HIPAA-compliant access control, audit logging, breach notification, RBAC, patient data deletion/export rights.

---

## 5. UI/UX Design (416446969)

*(Empty — only a placeholder page; no children)*

---

## Snapshot stats
- Total pages captured: 54 (1 parent + 3 children + 11 grandchildren + 26 great-grandchildren + 14 great-great-grandchildren)
- Empty/placeholder pages: 416446964, 416446969, 425568846, 420911656, 420911661, 420911666, 420911673, 420911749, 420911667, 420924754, 420924764, 420924070, 420923777, 425558444 (mostly section landing pages)
- All content retrieved via wiki.andersenlab.com on 2026-05-22.
