# Project H — draw.io Diagrams Index

The Confluence pages under *Initial Phase Deliverables* include 9 active draw.io diagrams that didn't render in the markdown export (they came through only as macro placeholders). This file lists each diagram with:

- Direct download URL (right-click → Save link as, while logged into wiki.andersenlab.com)
- Source XML URL (draw.io `.mxfile` — open in app.diagrams.net or VS Code draw.io extension)
- A description of what's on the diagram (captured from the rendered PNG)

> Note: the AI session can fetch the PNGs through the Atlassian MCP but cannot save them as files (sandbox network is allowlisted away from `wiki.andersenlab.com`, and MCP resources are rendered for the assistant inline rather than materialized to disk). The links below are the fastest path: open in browser (you're already logged into the wiki) and save.

---

## 1. Architect → User group associations

**Diagram name:** users (page 419464900)

- PNG: https://wiki.andersenlab.com/download/attachments/419464900/users.png?version=2&modificationDate=1755590785357&api=v2
- Source (mxfile): https://wiki.andersenlab.com/download/attachments/419464900/users?version=2&modificationDate=1755590785297&api=v2

**Content:** Multi-tenant data isolation model. A single `Person` (with `email1` + `email2`) maps onto separate user namespaces per clinic — *Clinic 1 namespace of apps* and *Clinic 2 namespace of apps* — each containing `Patient User`, `Clinician User`, `Practice User` stick figures. A separate *Admin User admin namespace* sits alongside. All clinics share one `Data` cylinder partitioned into `clinic 1 data`, `clinic 2 data`, and `common and admin data`; clinic data flows to per-clinic `EHR/MyChart clinic1` and `EHR/MyChart clinic2`. Reinforces D3 (per-clinic MyChart SSO) and the multi-tenant decision in the page text.

---

## 2. AVD 4.1 System Context View / Business Flow

**Diagram name:** context (page 420911679, C4 Level 1)

- PNG: https://wiki.andersenlab.com/download/attachments/420911679/context.png?version=5&modificationDate=1756722554007&api=v2
- Source: https://wiki.andersenlab.com/download/attachments/420911679/context?version=5&modificationDate=1756722554007&api=v2

**Content:** C4 system-context diagram (blue rounded persons, blue Software System node, grey External Software System nodes). Persons: *Patient* (Mobile App), *Clinic Admin* (Browser), *Project H Admin* (Browser), *Clinician*. Central node: **Project H [Software System]** "The entire system with all components". External systems: **MyChart application** [Patient Portal] (Web interface of EPIC for Patients) with `refresh/access tokens` + `redirect for authentication`; **Stripe** [Payment System] (Subscription management) with `embedding` + `payment webhook`; **Intercom** [Customer Service System] (`embedding into web and mobile apps`, "customer support"); **Clinic EHR** [EPIC EHR] (Desktop or web interface for Clinicians) connected via `EPIC FHIR API (read/write)` and `embedding as SMART FHIR app`. Patient → Stripe = `payment`; Clinic Admin → Stripe = `accounting`. Legend: Person / Software System / External Software System.

> Page 420911679 also has several legacy attachments (`ERA_AdBoard*`) — older drafts, can be ignored.

---

## 3. AVD 4.2 Container View

**Diagram name:** container diagram (page 420911687, C4 Level 2)

- PNG: https://wiki.andersenlab.com/download/attachments/420911687/container%20diagram.png?version=16&modificationDate=1765102950503&api=v2
- Source: https://wiki.andersenlab.com/download/attachments/420911687/container%20diagram?version=16&modificationDate=1765102950503&api=v2

**Content:** C4 container diagram. Persons (top): *Person name* (Mobile App), *Project H Admin* (Browser), *Clinic Admin* (Browser), *Clinician*. External systems (grey): **MyChart** [Software System] (login page WebView, credentials, email/sms), **Intercom** [Customer Support System], **Apple Push Notification Service (APNS)**, **FDB** [Medical Database] (Recommendations for medications), **EPIC EHR** [Software System] (Clinical EHR System), **Stripe** [Payment System] (Payment of subscriptions by clinics — WebHook, embedding). Project H implemented containers (purple): **Project H Games** [Library: React Native] (Embedded cognitive games — `includes as a package`), **Project H Recommendation** [Library: Python] (Rules engine), **Project H ML Environment** [SageMaker, set of cloud managed components]. Andersen-implemented containers (blue): **Patient Mobile App** [iOS, React Native, TypeScript], **Patient Mobile App Backend** [Container: Python, FastAPI], **Project H Admin Web App** [Container: Python, Django Admin], **Clinic Admin Web App** [Container: Python, Django Admin]. Cloud-managed services (green): **Authorization Service** [AWS Cognito] ("non-EPIC Patient authentication service" — Amplify Authenticator path), **Load Balancing** [AWS ALB], **Notification Service** [AWS SNS / SES / EventBridge — sends emails, SMS, push via APNS], **Logging/Monitoring Service** [AWS CloudWatch]. External library: **SurveyJS** ("Frontend components for assessments" — included as a package, WebView). Data layer (cylinders): **Relational Database** [AWS RDS PostgreSQL], **Caching Service** [AWS ElastiCache], **File Storage / Datalake** [AWS S3]. Comms: `https REST API` from mobile → ALB; `SMART FHIR` from Clinic Admin Web App → EPIC EHR; `FHIR API` from backend → EPIC EHR; `AWS SDK` for notifications. Legend: Person / Implemented by Project H / Implemented by Andersen / Cloud Managed Service / External.

---

## 4. AVD 4.3 Deployment View — final product (AdBoard)

**Diagram name:** AdBoard (page 420911696)

- PNG: https://wiki.andersenlab.com/download/attachments/420911696/AdBoard%20.png?version=14&modificationDate=1765103063983&api=v2
- Source: https://wiki.andersenlab.com/download/attachments/420911696/AdBoard%20?version=14&modificationDate=1765103063983&api=v2

**Content:** AWS deployment topology (final product, full HW).
- Top external layer: **User** → **Mobile Application** ← App Store / TestFlight ← GitHub (Python) `GitHub actions` → publish. Web Browser via Swagger → Internet.
- DNS layer: **AWS Route 53**.
- Load balancing layer (public subnet, us-east-2): **Application Load Balancer** + **NAT Gateway**.
- Computing layer (private subnet, autoscaling): **ECS Cluster** with three Docker `Node` instances spread across `us-east-2a / us-east-2b / us-east-2c`.
- DB layer: **Amazon RDS PostgreSQL Read Replica** in us-east-2b (single instance shown).
- AWS-managed services (right column): **AWS Amplify**, **AWS Cognito**, **AWS KMS**, **AWS CloudWatch**, **AWS Certificate Manager**, **AWS S3 File Storage**, **AWS Simple Email Service**, **AWS Secrets Manager**, **Event Bridge**.

---

## 5. AVD 4.3 Deployment View — MVP1 (MVP)

**Diagram name:** MVP (page 420911696)

- PNG: https://wiki.andersenlab.com/download/attachments/420911696/MVP.png?version=4&modificationDate=1765103034493&api=v2
- Source: https://wiki.andersenlab.com/download/attachments/420911696/MVP?version=4&modificationDate=1765103034493&api=v2

**Content:** AWS deployment for MVP1.
- Same external layer (User → Mobile App, App Store/TestFlight, GitHub).
- DNS: **AWS Route 53**.
- Load balancing: **Application Load Balancer** + **NAT Gateway** in Public subnet of VPC, AWS Account, Region `us-east-2`.
- Computing: **ECS Cluster** with 3 `Node` instances (Docker) across `us-east-2a/b/c`.
- DB (multi-AZ): **Amazon RDS PostgreSQL** primary in us-east-2a + **Read Replica** in us-east-2b via `replication`.
- Right-column managed services include the full set: **AWS Amplify**, **Cognito**, **CloudWatch**, **ElastiCache** (added vs final), **WAF**, **KMS**, **Shield**, **Certificate Manager**, **S3 File Storage**, **Sagemaker** (loads from S3), **Secrets Manager**, **VPC Endpoints**, **Event Bridge**, **Simple Email Service**, **Simple Notification Service**.

---

## 6. AVD 4.4 EPIC EHR Integration View — flow

**Diagram name:** flow (page 420906849)

- PNG: https://wiki.andersenlab.com/download/attachments/420906849/flow.png?version=4&modificationDate=1756386292253&api=v2
- Source: https://wiki.andersenlab.com/download/attachments/420906849/flow?version=4&modificationDate=1756386292253&api=v2

**Content:** Two swimlanes (Patient / Clinician).
- Patient lane: *Patient* "finished the survey" → **Project H** "sends FHIR Bundle resource" → **EPIC FHIR API** → "opens in MyChart" → **Patient Profile**.
- EPIC FHIR API "puts messages" → **EPIC Inbound queue**.
- Clinician lane: *Clinician* "views messages" → **EPIC Inbound queue**, which "approves" → **Patient Profile**. "clicks on the link" → **Clinic Web App Page**, which routes through **EPIC SMART FHIR auth** and back. "opens from the patient profile" → **Clinic Web App Page** which "downloads PDF file" back to *Clinician*.

Note: page 420906849 also has two child pages (4.4.1 Inbound and 4.4.2 Outbound) — both already captured in the main consolidated file as PlantUML class diagrams with full source code.

---

## 7. AVD 4.5 Patient Authentication Flow — main flow (login)

**Diagram name:** login (page 419470678)

- PNG: https://wiki.andersenlab.com/download/attachments/419470678/login.png?version=12&modificationDate=1759492814007&api=v2
- Source: https://wiki.andersenlab.com/download/attachments/419470678/login?version=12&modificationDate=1759492814007&api=v2

**Content:** Detailed end-to-end patient onboarding/login flow (numbered steps 4–22a).
- Entry: *Patient* clicks the link in chat/email/sms → step 4 *Special public page in Clinic App* → decision *Is Mobile App installed?* → if no, step 5 App Store/Google Play → downloads/installs with predefined `clinicid/patientid` → step 6 Mobile App Initial page; if yes, opens installed app directly to step 6.
- Step 6 validates response → decision *Is the first login?* yes → step 7 Welcome page → step 7a Consent Page → decision *Is Deep Link contains code?* yes → step 10 Backend Code validation Endpoint; no → step 9 Input backup code page → step 10.
- Step 10 returns login flow type (EPIC/non-EPIC) and OAuth URL (MyChart or Cognito) plus auth parameters; decision *Is EPIC flow?* yes → 10b Insert data in patient table (email or epic_code as unique id), 10c Mark code as USED, 10d Insert patient consents; no → 10a Create Cognito user using Admin API.
- Decision *Is it EPIC flow?* yes → step 11 MyChart Login Page of the specific clinic → step 12 MyChart MFA/consents if configured → inputs correctly closes the page; no → step 11 Amplify Cognito Login page → step 12 Cognito MFA if configured.
- Step 15 Post Login component → 15a Send refresh/access tokens to backend → decision *Is it EPIC flow?* yes → 15b Get Patient profile data from EPIC → 15d Create and prefill onboarding assessment / 15c Update patient record in DB with name, address...
- Decision *Is Biometric Access set?* yes → step 17 Default mobile dashboard; no → step 16 Set Up biometric page → decision *Skip setup?* yes → 17; no → 16a Biometric configuration functionality → 17.
- Branch from "Is the first login?" no → step 18 Refresh token validation component → decision *Is biometric access configured?* yes → step 20 Biometric authentication → decision *Is user authenticated?* yes → step 21 Read and validate token component → decision *Is refresh token valid?* yes → step 22 Get new access token/refresh by refresh token from MyChart or Cognito → 22a Send to backend and store in secure storage → step 17.

---

## 8. AVD 4.5 Patient Authentication Flow — other users

**Diagram name:** other users (page 419470678)

- PNG: https://wiki.andersenlab.com/download/attachments/419470678/other%20users.png?version=2&modificationDate=1759322520123&api=v2
- Source: https://wiki.andersenlab.com/download/attachments/419470678/other%20users?version=2&modificationDate=1759322520123&api=v2

**Content:** Setup/admin overview plus two auth paths.
- Top row: *Project H Admin* "registers in Epic Orchard App Store" → **Clinic Web App Link Generation Service**; *EHR Admin* "Create a new custom Action with the link to Clinic Web App Link Generation page" and "Configure permissions to use MyChart as SSO" → **Patient Mobile App**.
- Middle: EPIC User flow — *EPIC User* logins → 1. Epic EHR (Hyperspace or Hyperdrive) → 2. Patient profile page with the custom Action button/link → clicks on Action → 3. Modal window with the generated link and backup codes → copies and inserts into → 3. MyChart communication, Email, SMS. Above: "requests as embedded component" from the modal to 3a. Client Web App page → 3b. Client Web App backend endpoint to generate the link/codes.
- Bottom: non-EPIC User flow — *non-EPIC User* opens → 1. External system integrated with our backend → 2. Link parameters pages → submits → 3. ClinicAdmin non-epic endpoint to generate the link/codes.

---

## 9. AVD 4.6 Assessment / Form Implementation View — surveys

**Diagram name:** surveys (page 419475773)

- PNG: https://wiki.andersenlab.com/download/attachments/419475773/surveys.png?version=2&modificationDate=1756118832967&api=v2
- Source: https://wiki.andersenlab.com/download/attachments/419475773/surveys?version=2&modificationDate=1756118832967&api=v2

**Content:** Simple SurveyJS integration view.
- Left lane: *Patient* → **SurveyJS library (npm package), WebView for HTML/JS** embedded in **Project H Patient Mobile App (React Native)** → "save answers" → **Project H DB** (cylinder).
- Right lane: *Project H Admin* "creates" → **SurveyJS Creator embedded** in **Project H Admin App** → "manage assessment forms" → **Project H DB**.

---

## Bulk-download via curl (optional)

If you'd rather not click each link, here's a one-shot script. Run it locally (not in the sandbox — wiki.andersenlab.com is allowlisted away from there). Replace `WIKI_COOKIE` with the value of your `JSESSIONID` cookie (DevTools → Application → Cookies on the wiki), or use a personal access token via `Authorization: Bearer <token>` instead of `Cookie:`.

```bash
#!/usr/bin/env bash
set -euo pipefail
OUT="${HOME}/Documents/Claude/Projects/AI Doc/diagrams"
mkdir -p "$OUT"
COOKIE='JSESSIONID=PASTE_HERE'

declare -a FILES=(
  "419464900/users.png|users.png"
  "420911679/context.png|4.1_context.png"
  "420911687/container%20diagram.png|4.2_container.png"
  "420911696/AdBoard%20.png|4.3_deployment_final.png"
  "420911696/MVP.png|4.3_deployment_mvp.png"
  "420906849/flow.png|4.4_epic_flow.png"
  "419470678/login.png|4.5_login.png"
  "419470678/other%20users.png|4.5_other_users.png"
  "419475773/surveys.png|4.6_surveys.png"
)

for entry in "${FILES[@]}"; do
  url="${entry%%|*}"
  name="${entry##*|}"
  echo ">> $name"
  curl -fsSL -H "Cookie: $COOKIE" \
    -o "$OUT/$name" \
    "https://wiki.andersenlab.com/download/attachments/$url"
done
```

The `.mxfile` source XMLs follow the same pattern — just drop the `.png` suffix in the URL. Open them in app.diagrams.net or via VS Code's draw.io Integration extension to edit further.
