# Project H — Doc-Generation Context Brief

**Purpose.** Drive a downstream session to produce the `sample-work/` documentation set described in `Prompt_Build_SampleWork.md`, using **Project H** (Andersen's precision-psychiatry presale, KIV space on `wiki.andersenlab.com`) as the substrate instead of ERPNext. The brief is self-contained — it should remove the need to re-fetch Confluence pages or re-read the Technical Approach, except for verification.

> **Substrate adaptation flag.** The spec was written for a legacy commercial-system substrate (SourceWare / ERPNext) where the methodology demonstrates archaeological work — wide tables, customer forks, retrospective ADRs. Project H is a **presale / discovery-phase** substrate. The methodology adapts cleanly, but several spec elements get a forward-design interpretation. Each adaptation is called out in §5.

---

## 0. Naming policy / Anonymization rule

The source project is **Kivira** (Confluence space key `KIV` on `wiki.andersenlab.com`, display name *Kivira Health*). In every sample-facing artifact (the `sample-work/` deliverable) **and** in this context bundle (`context/project-h/`), the client name is anonymized to **Project H**. This policy was set explicitly so the sample can be circulated without exposing the underlying client engagement.

> [!important] This is the only place in the context bundle where the original name is written. Everywhere else — file names, prose, diagram labels, commit messages, PR titles — uses **Project H**.

### Mandatory substitutions

| Source token | Replacement | Notes |
| --- | --- | --- |
| `Kivira` (any case in prose) | `Project H` | Default. |
| `Kivira Health` | `Project H` | Confluence space display name. |
| `Kivira's` | `Project H's` | Possessive (handled by the general rule). |
| `kivira-` (filename prefix) | `project-h-` | Lower-case, hyphen-separated filenames. |
| `Kivira-<word>` (hyphenated compound, e.g., `Kivira-managed`, `Kivira-internal`, `Kivira-side`) | `Project H <word>` | Drop the hyphen, insert space. |
| `Kivira_WBS`, `Kivira Miro board`, etc. | `Project H WBS`, `Project H Miro board` | Page titles in the source. |
| Folder `context/kivira/` | `context/project-h/` | Repo folder. |
| Branch `kivira-context` | (keep as historical reference if already pushed; future branches use `project-h-context`) | Note in the PR description. |

### Kept verbatim (not anonymized)

- **Confluence URLs**: `https://wiki.andersenlab.com/...` — real anchors needed for traceability and re-ingest. The URL paths use `/KIV/` (space key), not the client name.
- **Confluence page IDs** (416446964, 420911679, etc.) — real, used to dereference source pages.
- **Space key `KIV`** when it appears inside a Confluence URL path — keep as the real string.
- **Vendor name `Andersen` / `AndersenLab`** — the firm, not the client. Stays as-is per `Prompt_Build_SampleWork.md` §6 (AndersenLab branding throughout).
- **Domain `wiki.andersenlab.com`** — the host, not the client.

### Items still requiring separate redaction (not covered by the rename)

These are real secrets / PII that survive the rename rule untouched and **must be handled separately before publishing the sample**:

- **Miro board password** in section 4.2 of `project-h-initial-phase-deliverables.md`. Original value redacted in this bundle as `[REDACTED — anonymized context]`. If re-ingest brings back a fresh password, redact it the same way; do not let it land in `sample-work/` even after the rename rule has run.
- **PII in scenarios / test data** — none present in current sources; flag if introduced in a future ingest.

### Future-ingest rule (the automation contract)

Any future ingestion of pages, diagrams, attachments, or specs from the original project **must apply the substitution table above before the material becomes part of this context bundle or any sample-facing artifact**. The rename happens at ingest time, not after-the-fact:

1. Pull the source content (Confluence page export, `.mxfile`, Mermaid block, etc.).
2. Apply the substitutions in order: `Kivira Health` → `kivira-` (filename prefix) → `Kivira-<word>` (compound) → `Kivira` (general) → `kivira` (lower-case catchall).
3. Redact any new secrets / PII (see previous subsection) separately.
4. If the new source introduces a new compound that wasn't in the table (e.g., a future component name like `Kivira X Service`), add the mapping to the table in this section **before** merging the content.
5. Spot-check: `grep -i kivira <new_file>` must return zero in the anonymized output.

The bash one-liner used for the initial pass is:

```bash
sed -E \
  -e 's/Kivira Health/Project H/g' \
  -e 's/kivira-/project-h-/g' \
  -e 's/Kivira-([A-Za-z])/Project H \1/g' \
  -e 's/Kivira/Project H/g' \
  -e 's/kivira/project-h/g' \
  <input> > <output>
```

Commit, PR, and any external communication should reference **Project H** only — the source name belongs only in this Naming policy section.

---

## 1. Local source artifacts (all in `/Users/a.dzemianchyk/Documents/Claude/Projects/AI Doc/`)

| Artifact | What it gives the doc-gen session |
| --- | --- |
| `project-h-initial-phase-deliverables.md` | Full text snapshot of all 54 Confluence pages under *Initial Phase Deliverables* (parent 416446964) — AVD sections, Vision&Scope, Sprint-1 epics with US scenarios and ACs. The substrate of record. |
| `project-h-diagrams-index.md` | Direct download URLs for the 9 active draw.io PNGs + `.mxfile` sources + textual descriptions. Use when the doc-gen session needs the original visual reference. |
| `project-h-diagrams-mermaid.md` | All 9 diagrams reconstructed in Mermaid (1 sequence, 8 flowcharts). Paste into target docs as-is. |
| `Prompt_Build_SampleWork.md` | The spec for the deliverable. The file-shape, quality bar, style rules. |
| `SourceWare_Technical_Approach.md` | The methodology source-of-truth (architecture template structure, working method, AI entry-point shapes, MADR usage, diagram-tool decision rule). |
| `Architecture Vision Document. Template..pdf` | Corporate AVD template — the legacy-system variant. Use for §-structure verification only; the technical-approach already extracts the section list. |
| `ai-doc-sample/` | Existing MkDocs Material site (currently placeholder pages). Likely target deployment surface, or sibling repo. Has `mkdocs.yml` + 4 placeholder pages (index, architecture, technical-approach, methodology). |

The doc-gen session should treat `project-h-initial-phase-deliverables.md` as the authoritative content source. No Confluence re-fetch is required.

---

## 2. Project H substrate one-pager

**What it is.** Project H is a precision-psychiatry SaaS platform targeting US primary-care providers, built to address an estimated 50–80 % mental-health misdiagnosis rate. It embeds validated diagnostic questionnaires, gamified cognitive assessments (WCST, ERT, Trail Making), and an automated decision-support report directly into clinician workflow via EPIC EHR integration. Designed as a Class I CDSS (FDA premarket-exempt). Target: 50 k MAU within 4 months, < $3/patient/year without ML / < $5 with ML. Compliance envelope: HIPAA, SOC 2 Type II, OWASP ASVS, WCAG 2.1 AA.

**Players.**

- **Andersen** — delivery org for Patient Mobile App (React Native, iOS-only MVP), Clinic Web App (Python · Django Admin), backend (Python · FastAPI), AWS infra, EPIC/FDB/Stripe integrations.
- **Project H** — product owner, supplying cognitive games (RN library), recommendation Python rules engine, Project H Admin Web App (out of Andersen scope), and clinical questionnaire JSON.
- **External systems** — EPIC EHR + MyChart (one instance per clinic), FDB (First DataBank — medications, screenings, monographs), Stripe (per-seat clinic subscriptions), Intercom (frontend support), AWS managed services.

**Three apps in scope, one out.**

- **Patient Mobile App** — RN/TS, iOS-only MVP. SurveyJS questionnaires (intake + screener), cognitive games, offline mode with SQLite/SQLCipher + background sync, MyChart SMART on FHIR (OAuth2 + PKCE) auth, Face ID/passcode, push notifications.
- **Clinic Web App** — Python/Django Admin. EPIC plugin (Custom Action on patient profile, registered in App Orchard) to generate per-patient deep link + 6-char backup code with expiration; clinician PDF download module (SMART App component); clinic admin signup/profile/seat management; Stripe subscription (per-seat monthly + annual + bulk discounts + Stripe Tax).
- **Clinician Report** — generated server-side from intake + screener + games. Three FHIR resources sent to EPIC: Observation (mandatory, triggers PGHD inbound queue notification), Condition, DocumentReference (points to PDF held on Project H side; SMART FHIR auth-gated download by clinician).
- **Project H Admin App** — explicitly out of Andersen delivery scope (future Project H work).

**Architecture in one diagram (C4 L2).** Patient Mobile App + Backend + Project H Admin Web App + Clinic Admin Web App, all behind AWS ALB; data layer in RDS Postgres (Multi-AZ) + ElastiCache + S3; managed services CloudWatch + SNS/SES/EventBridge + Cognito for non-EPIC auth. Project H implemented libraries (Games, Recommendation, ML Environment on SageMaker) embed into the apps. SurveyJS as external library. See `project-h-diagrams-mermaid.md` §3.

**Phasing.**

- **MVP** — onboarding (Welcome → Consents → invite/code → MyChart auth → biometric → Dashboard), intake & screener, FDB-coded patient profile, report-to-EPIC, clinician PDF download, clinic admin sign-up + Stripe subscription start.
- **2nd release** — cognitive games, follow-up questionnaires, history view, reminders, Intercom (clinic), subscription management endpoints.
- **3rd release** — red flags + clinic email, Intercom (mobile), patient data deletion, self-started follow-up rate limiting, full clinic-profile delete.

**Key forks worth noting.**

- **EPIC vs non-EPIC auth path** — explicit dual branch in the login flow (US-1.5 + AVD 4.5 login diagram). EPIC path uses MyChart OAuth2 + PKCE; non-EPIC path uses Cognito + Amplify Authenticator. Both reach the same Post Login component at step 15.
- **Per-clinic EPIC instance** — each clinic has its own EPIC/MyChart sandbox/prod pair; per-clinic integration subprojects in dev/stage. MVP supports a single sandbox; per-clinic onboarding is operational, not architectural.
- **Online vs offline** — intake/screener and follow-ups can run offline; data queued locally (UUID + survey version) and reconciled server-side.

---

## 3. Methodology recap (from `SourceWare_Technical_Approach.md` §§ 2, 4, 5.1, 5.4, 6)

The doc-gen session must demonstrate the following methodology beats. Adaptations for Project H's presale substrate are noted in italic.

1. **Architecture-document template — legacy-system variant** (TA §2, sections list).
   *Adapt:* re-label *Key historical decisions* → *Key design decisions* and *Living risks* → *Living risks (identified in discovery)*. Keep Architectural drivers / Quality attribute scenarios / C4 views / Deployment view / Decision view / Operations.
2. **Wide-table schema doc via iterative column-classification** (TA §5.1).
   *Adapt:* Project H has no committed code yet. Apply the column-classification methodology to the **Patient Profile composite** (demographics + clinical fields + FDB-coded fields specified in Epic 2 Feature 1 + Feature 3 + Feature 4 of the Mobile App). Treat the spec/Confluence pages as the source of truth in place of code. `VALIDATE:` flags work the same way — they call out where the source pages disagree, where a field is mentioned but not specified, or where downstream consumption is unclear.
3. **Per-module documentation** (TA §3 structure; §5.5 for business-rule catalog).
   *Adapt:* Best Project H "module" candidate for the sample is **Mobile App · Authentication / Authorization** (Epic-1 Mobile, 2 features, 9 user stories with scenarios and acceptance criteria). Rich enough for business-rule catalog with stable IDs. Alternative: Epic-2 Intake & Screener (heavier on FHIR/FDB integration).
4. **AI-native entry points + repo-root conventions** (TA §6 for AI entries; TA §3 for root files).
   Root `CLAUDE.md` + root `AGENTS.md` (cross-tool overlay; CLAUDE.md @-imports it per TA §6 — single source of truth). Module-level `CLAUDE.md` per module. Root `CONVENTIONS.md` (annotation legend + validate-flag syntax + doc structure rules — required by TA §3 / §8 week-1 deliverable). Root `GLOSSARY.md` (domain terminology — Project H already has 24+ acronyms enumerated in AVD §1.3, directly transposable). `llms.txt` is optional in TA §6 ("preferred default where toolchain supports it cleanly") — mention in CLAUDE.md and defer authoring to a follow-up.
5. **MADR Architecture Decision Records** (TA §2).
   *Adapt:* ADRs are *retrospective* for SourceWare. For Project H presale they are *retrospective on discovery-phase decisions* — pick a decision visible in the AVD (D-codes) and recover the rationale from the Confluence content. Best candidates listed in §5.4 below.
6. **Explicit uncertainty handling** (TA §4 Stage 3).
   `> [!validate]` callouts inline, `<!-- VALIDATE: ... -->` comments, `## Open questions` section per doc. Plenty of natural candidates in Project H docs — many "TBD" strings explicit in user stories.
7. **Architect-level analysis embedded in docs** (Prompt §3 item 7).
   ≥ 2 architectural-assessment notes in `architecture/overview.md` calling out weak spots / proposed solutions surfaced during authoring. Candidates listed in §5.2 below.

---

## 4. Target file inventory

The sample mirrors the **full engagement layout from `SourceWare_Technical_Approach.md` §3** so that a client reviewing it recognises the shape they would receive in a real engagement. We expand beyond `Prompt_Build_SampleWork.md` §5's minimum 8-file demo because the user's stated intent is "сделать сампл такой же как будет новая документация в запросе заказчика" — the sample should foreshadow the real deliverable, not just hit the demo floor.

What stays: each file is kept lean (½ – 3 pages). Total volume targets ~22 pages across 17 files. Folders that TA §3 lists but that don't apply to a presale/discovery substrate (`business-logic/`, `process/`) are noted in §10 with a clear rationale rather than stubbed out.

```
sample-work/
  README.md                                            Sample overview + methodology map (1 pg)
  docs/
    CLAUDE.md                                          Root AI entry point (1 pg) — TA §6
    AGENTS.md                                          Cross-tool overlay (½ pg) — TA §6
    CONVENTIONS.md                                     Annotation legend + validate-flag syntax (1 pg) — TA §3 / §8 wk-1
    GLOSSARY.md                                        Domain terminology, sourced from AVD §1.3 (1 pg) — TA §3
    architecture/
      overview.md                                      Full arch doc, C4 L1+L2 in Mermaid (3 pg) — TA §2 template
      integration-points.md                            External-systems catalog (1.5 pg) — TA §3
      release-coexistence.md                           MVP / 2nd / 3rd release feature coexistence (1 pg) — analog of TA §3 legacy-2.0-coexistence.md
      data-flows/                                      One file per high-stakes flow — TA §3
        patient-onboarding.md                          Onboarding flow incl. invite, consent, MyChart, first-time fetch (1 pg)
        report-to-clinician.md                         Intake → FDB → report → EPIC Inbound queue → clinician PDF download (1 pg)
      decisions/
        0001-mychart-as-per-clinic-sso.md              Retrospective MADR — D3 (1 pg) — TA §2 / Prompt §5
    schema/
      overview.md                                      Schema-layer "how to read" + naming conventions (1 pg) — TA §3
      relationships.md                                 Implicit FK / cross-resource relationships catalog (1 pg) — TA §3 / §5.2
      tables/
        patient-profile.md                             Wide-"table" doc with column classification (3 pg) — TA §5.1
    modules/auth-authorization/
      CLAUDE.md                                        Module-level AI entry (½ pg) — TA §6
      overview.md                                      Module overview + primary workflows (2 pg) — TA §3
      business-rules.md                                Named rules BR-001..BR-010+ (2 pg) — TA §5.5
      variations.md                                    EPIC vs non-EPIC fork (1 pg) — stand-in for TA §3 legacy-vs-2.0.md
```

**Counting.** 17 files. The `legacy-vs-2.0.md` slot is filled at the module level by `variations.md` (per Prompt §5 fallback wording — Project H has no legacy implementation). Per-doc `## Open questions` sections in each major artifact replace the per-folder `open-questions.md` files from TA §3 — same content, half the file count, no demo value lost. README §"Future expansion" lists the TA §3 folders intentionally omitted from this slice (`business-logic/`, `process/`, full `data-flows/` coverage, rolled-up `open-questions.md` files).

---

## 5. File-by-file generation plan

### 5.1 `sample-work/README.md` (≤ 1 page)

**Content sources.** §2 of this brief.

**Outline.**

- One-paragraph framing: demonstration work on Project H (Andersen presale, healthcare/precision-psychiatry), not redacted client work.
- One-paragraph scope note: applies the same methodology to a presale/discovery-phase substrate to show it isn't only legacy-archaeology — the column-classification and validation discipline produce useful output even before code exists.
- One-paragraph shape note: **the sample mirrors the full engagement layout from `SourceWare_Technical_Approach.md` §3** — root conventions (CLAUDE / AGENTS / CONVENTIONS / GLOSSARY), `architecture/` (overview + integration-points + data-flows + release-coexistence + decisions), `schema/` (overview + relationships + tables), and `modules/<module>/`. A reader sees the same layout they would receive in a real engagement.
- Methodology map table:

| Artifact | Methodology element it demonstrates | Reference in `SourceWare_Technical_Approach.md` |
| --- | --- | --- |
| `architecture/overview.md` | Standing legacy-system architecture template + C4 L1/L2 in Mermaid + embedded architect-grade analysis | §2 |
| `architecture/integration-points.md` | External-systems catalog with consistent per-system contract shape | §3 |
| `architecture/data-flows/*.md` | High-stakes flows surfaced as standalone artifacts | §3 |
| `architecture/release-coexistence.md` | Cross-cutting coexistence view (analog of legacy-2.0-coexistence) | §3, §5.3 |
| `architecture/decisions/0001-…md` | MADR retrospective ADR | §2 |
| `schema/overview.md` + `schema/relationships.md` | Schema-layer framing + implicit FK catalog | §3, §5.2 |
| `schema/tables/patient-profile.md` | Wide-table iterative column-classification process — the highest-leverage artifact | §5.1 |
| `modules/auth-authorization/overview.md` | Per-module documentation template | §3, §5.5 |
| `modules/auth-authorization/business-rules.md` | Catalog-first business-rule documentation with stable IDs | §5.5 |
| `modules/auth-authorization/variations.md` | Multi-implementation documentation (analog of legacy-vs-2.0) | §5.3 |
| `docs/CLAUDE.md` + `docs/AGENTS.md` + `modules/.../CLAUDE.md` | AI-native entry points with task routing | §6 |
| `docs/CONVENTIONS.md` | Annotation legend, validate-flag syntax, doc structure rules | §3, §8 wk-1 |
| `docs/GLOSSARY.md` | Domain ubiquitous language | §3 (DDD ubiquitous language) |

- **Future expansion** paragraph naming the TA §3 folders intentionally omitted from this slice (`business-logic/` analog, `process/`, extended `data-flows/`, per-folder `open-questions.md` rollups, `llms.txt`, additional ADRs).
- Closing paragraph: "this is the methodology and quality bar we would apply to a real engagement". AndersenLab branding (no Innowise).

### 5.2 `sample-work/docs/CLAUDE.md` (≤ 1 page)

**Spec template.** TA §6 (verbatim shape).

**Concrete content.**

- *What this system is*: 2 paragraphs. Mobile + Clinic Web App + clinician report; React Native iOS-only MVP; Python/Django Admin clinic app; AWS-hosted; EPIC FHIR integration; HIPAA/SOC 2/OWASP/WCAG envelope. Pre-implementation (discovery-phase substrate).
- *Read these before doing anything substantive*: `docs/architecture/overview.md`, `docs/schema/tables/patient-profile.md`, `CONVENTIONS.md` (if added), `GLOSSARY.md` (if added — Project H has a glossary in AVD §1.3).
- *Task routing*:
  - Architecture or system shape → `docs/architecture/overview.md`
  - Auth, onboarding, MyChart, biometric, invite/code → `docs/modules/auth-authorization/`
  - Schema / patient data model / FHIR resource mapping → `docs/schema/tables/`
  - Design decisions and their rationale → `docs/architecture/decisions/`
- *Known gotchas*:
  - Per-clinic EPIC/MyChart instance — never assume a single EPIC backend.
  - Consents are collected **before** MyChart OAuth2 to remain HIPAA-aligned.
  - Reports are clinician-facing by default; patients get them only via HIPAA request, never automatically in MyChart.
  - FHIR resources sent to EPIC must include Observation (mandatory) to trigger PGHD Inbound Queue notification — Condition and DocumentReference alone won't notify the clinician.
- *Conventions you must follow*: `> [!validate]` callouts, `## Open questions` at the bottom of every doc, MADR for any new decision, never silently fill a guessed value.

### 5.2a `sample-work/docs/AGENTS.md` (½ page)

**Why it exists.** TA §6 mandates AGENTS.md as the cross-tool overlay for non-Claude agents (Cursor, Copilot, Codex CLI). TA §6 says "CLAUDE.md can reference AGENTS.md via `@import` to avoid duplication". Approach for the sample: AGENTS.md is the canonical file; root CLAUDE.md @-imports it. This keeps the convention testable and demonstrates the "canonical content lives in one place" decision from TA §6.

**Outline.**

- 2-paragraph note: this is the canonical AI-agent contract; the same content is referenced from `CLAUDE.md` for Claude-specific tooling. Lists which agents the team uses (or anticipates) — Claude Code primary, Cursor and Copilot supported.
- *Read these before doing anything substantive* — same list as CLAUDE.md.
- *Task routing* — same as CLAUDE.md.
- *Known gotchas* — pointer to CLAUDE.md (don't duplicate).
- Closing note: drift between AGENTS.md and CLAUDE.md is a defect; the acceptance test (TA §6, "Testing the AI entry points") catches it.

### 5.2b `sample-work/docs/CONVENTIONS.md` (1 page)

**Why it exists.** TA §3 lists CONVENTIONS.md as a root-level file ("Doc conventions, annotation legend, validation flags"). TA §8 week-1 deliverable explicitly: "`CONVENTIONS.md` v1 (annotation translation table, validation flag syntax, doc structure rules)". The sample carries it because a methodology-demo without the conventions file is the methodology with its working agreement removed.

**Section list.**

1. **Document structure rules** — every major doc has Scope, body sections, ≥ 1 `> [!validate]` (where applicable), `## Open questions` at the bottom. Cross-references use relative markdown links.
2. **Annotation callouts.** Four kinds, with rendered example for each:
   - `> [!validate] …` — paragraph-level uncertainty visible in GitHub render.
   - `<!-- VALIDATE: … -->` — inline comment, invisible to humans, visible to agents.
   - `> [!note] Architectural assessment …` — embedded architect-grade observation.
   - `> [!deprecated] …` — content kept for traceability but no longer authoritative.
3. **Open-questions sections.** Mandatory at the bottom of every major doc unless the doc is trivially short. Each entry must be specific and named; no generic "needs review" filler. 3–5 entries is typical for the sample's doc sizes.
4. **MADR ADR convention.** Stored under `architecture/decisions/`. File pattern `NNNN-short-slug.md`. Status / Context / Decision / Alternatives considered / Consequences / Notes.
5. **Diagram-tool decision rule** — replicate the table from TA §7 (Mermaid as default for C4 L1/L2/L3 + most UML; PlantUML for complex sequences; drawio reserved for visual-match-to-existing-artifact cases).
6. **Validation flag triage** — `VALIDATE:` flags expire when a workshop or code reference resolves them. Unresolved flags graduate to a `## Open questions` entry. Resolved ones are silently removed.

### 5.2c `sample-work/docs/GLOSSARY.md` (1 page)

**Why it exists.** TA §3 root-level file. Project H's AVD §1.3 already enumerates 24+ acronyms — directly transposable, no invention.

**Outline.**

- One-paragraph framing: domain vocabulary used across the docs; agents and humans should resolve here before re-defining inline.
- Term table (alphabetised). Direct copy from AVD §1.3 (`project-h-initial-phase-deliverables.md` §3.1.3 in the consolidated file) of: ADHD, AWS, CDSS, CIDI, CPT Codes, D.O.B., DSM, EHR, EPIC, ERT, FDA, FDB, FHIR, GAD, HIPAA, JSPsych, MAUs, MCI, MDD, ML, MVP, OCD, PHI, PTSD, SLA, TBI, WCST.
- Plus 5–8 Project H specific terms inferred from the docs but not in the AVD glossary (with `> [!validate]` if the spec is silent on the precise meaning):
  - **App Orchard** — EPIC's marketplace for third-party SMART on FHIR apps; registration is the gating requirement for Project H's invite-link plugin (ADR-0001 dependency).
  - **PGHD** — Patient-Generated Health Data; flagging Observation/Condition/DocumentReference as PGHD triggers the EPIC clinician In Basket notification.
  - **SMART on FHIR** — the OAuth2-based framework Project H uses to embed in EPIC and authenticate via MyChart.
  - **Custom Action** — EPIC concept for a button/link in clinician workflow that launches a third-party app with patient context. The mechanism for invite-link generation.
  - **Backup code** — 6-character (TBD per US-1.4) fallback for invite-link failure. Single-use, expiring, retry-limited.
  - **Inbound queue / In Basket** — EPIC's clinician-facing notification mechanism that the report flow targets.
  - **Hyperspace / Hyperdrive** — EPIC's desktop and web client environments; the Project H plugin must function in both.

### 5.3 `sample-work/docs/architecture/overview.md` (2–3 pages)

**Spec template.** TA §2 legacy-system variant.

**Section list (in order).**

1. **Scope** — what the docs cover (Mobile App, Clinic Web App, Clinician Report, AWS infrastructure, EPIC/FDB/Stripe/Intercom integrations) and what they don't (Project H Admin App, ML training in MVP, Android, non-EPIC EHRs, FDA Class II+ functionality).
2. **Business context** — single paragraph from §2 of this brief: 50–80 % misdiagnosis, primary-care entry, CPT reimbursement, regulatory envelope.
3. **High-level description** — 4-line elevator: Patient Mobile App + Clinic Web App + Clinician Report. EPIC plugin for onboarding. FHIR exchange for report. Stripe per-seat billing. AWS-hosted with HIPAA-eligible services.
4. **Key design decisions** — summarise 8–10 from D1–D40. Suggested set with one-line rationale each: D1 (Clinic Web App = Python/Django Admin monolith), D3 (per-clinic MyChart SSO with Universal Links + backup codes), D7 (SurveyJS as questionnaire engine), D9 (encrypted token storage + biometric gate on offline mode), D15 (AWS HIPAA-eligible managed services), D19 (offline SQLite + asynchronous sync), D23 (only Observation/Condition/DocumentReference FHIR resources outbound), D30 (recommendation engine = black-box Python library from Project H), D32 (per-clinic EPIC integration subprojects), D33 (FDB weekly cached + real-time queries). Each linked to its full record in `architecture/decisions/` (only `0001` exists in the sample; others linked as "to be authored").
5. **Living risks (identified in discovery)** — summarise 6–8 from R1–R16. High-priority pull: R2 (EPIC certification), R3 (per-clinic EPIC integration cost), R5 (compliance), R6 (Healthcare-standards adherence). Medium: R1 (FDB integration), R4 (external-system failure), R11 (payment errors). Low: R8 (data loss), R10 (availability). Each with `Owner: TBD`, mitigation summary, cross-link to relevant D-codes.
6. **Architectural drivers** — business goals (50 k MAU, CPT reimbursement, < $3/patient/year), major features (3-app split + clinician report), design constraints CT-1 through CT-8 (open-source + custom only; RN cross-platform but iOS-only MVP; Python backend; US healthcare standards; up to 50 k registered patients; black-box customer components; certified US data store).
7. **Quality attribute scenarios** — pull from Vision&Scope `Key non-functional requirements` page: Security (RBAC + OAuth2/PKCE + audit logs), Availability (Multi-AZ + offline fallback; RPO 5–10 min, RTO 15–30 min from AVD §5.5), Performance (response-time TBD; autoscaling), Compliance (HIPAA 10+ year retention, SOC 2 Type II, OWASP ASVS, WCAG 2.1 AA), Interoperability (FHIR/HL7 bidirectional).
8. **System Context view (C4 L1)** — paste Mermaid block from `project-h-diagrams-mermaid.md` §2.
9. **Container view (C4 L2)** — paste Mermaid block from `project-h-diagrams-mermaid.md` §3.
10. **Deployment view** — paste Mermaid block from `project-h-diagrams-mermaid.md` §5 (MVP deployment). The "final product" version (§4) can be referenced as "post-MVP".
11. **Decision view** — short prose summary referencing the ADR in `decisions/0001-*.md`; note that 7+ additional ADRs are "to be authored from D-list".
12. **Operations** — backup (RDS automated daily snapshots, 1–35 day retention, transaction-log replay), DR (Multi-AZ + ALB + autoscaling + drill cadence), CI/CD (GitHub Actions + TestFlight, Terraform/Pulumi IaC), monitoring (CloudWatch metrics + logs; per-request unique IDs; tamper-resistant audit log).

**Architectural assessment notes (≥ 2 required).** Embed inline as `> [!note] Architectural assessment` callouts:

1. **Per-clinic EPIC integration cost.** The decision in D32/R3 to maintain a per-clinic EPIC/MyChart sandbox-and-prod pair means MVP launch with N clinics is not a constant-cost activity — onboarding cost scales linearly. The Vision&Scope page acknowledges this as a Living Risk (R3, *High*). Architectural observation: the integration layer is not abstracted enough in the current design to absorb this; each new clinic implies a new EPIC App Orchard configuration, OAuth2 redirect URI registration, sandbox setup, and integration test pass. *Proposed solution surface:* extract a per-clinic configuration object (clinic-id, App Orchard client id, FHIR endpoint base, redirect URI, sandbox-vs-prod flag) into a single configuration store that the Authorization Service and Patient Mobile App Backend both read from. This is a refactor, not a redesign — but the doc should call it out before code is written, not after.

2. **CDSS Class I boundary preserved by report shape.** The decision in D23 to send only Observation, Condition, and DocumentReference to EPIC (and not embed recommendation logic in those resources) is architecturally significant beyond its compliance framing. By keeping the diagnostic and treatment recommendations inside the PDF (via DocumentReference link), the system stays clearly within Class I CDSS territory — the clinician downloads and reviews; the system does not "speak" recommendations through structured FHIR. If a future feature were to push structured treatment data via MedicationRequest or CarePlan resources, it would cross the CDSS Class II line. *Proposed surface:* add a `> [!validate]` flag against any future user story that proposes structured recommendation output to EPIC — the FDA-classification question must precede the engineering question.

**`> [!validate]` candidates** (1–2 are sufficient):

- Backup-code length / segmented-input width is described as "usually 6 characters" in US-1.4 but explicitly TBD; no other doc fixes this.
- Retry limit on backup code is "default 5 attempts" but flagged TBD; what happens after limit (clinic contact only?) is also TBD.

**`## Open questions`** (3–5 named items):

- App Orchard approval timeline — does it block MVP launch or run in parallel?
- HIPAA consent versioning — single fixed version in MVP per current docs; how do version bumps in production get rolled out (re-prompt on next login?).
- Whether biometric setup is permanently skippable or only deferrable-once (US-1.6 says deferrable once, but no Living Risk discusses what happens if a patient repeatedly skips).
- Whether the Andersen team's Project H Admin App handoff is documentation-only or includes a runbook.

### 5.3a `sample-work/docs/architecture/integration-points.md` (1.5 pages)

**Why it exists.** TA §3 lists `architecture/integration-points.md` ("External systems, APIs, file-based exchanges"). Project H's integration surface is broad enough that consolidating it in one place — instead of scattering across `overview.md` and the data-flow pages — pays dividends for both human and agent readers.

**Section list.**

- **Purpose** — single-paragraph anchor: where in this doc set to look up the contract with any external system.
- **EPIC EHR / MyChart** — per-clinic instances. Auth: SMART on FHIR OAuth2 + PKCE. Inbound resources (15 FHIR resources, see AVD 4.4.1). Outbound resources (Observation + Condition + DocumentReference, see AVD 4.4.2). PGHD flag triggers In Basket. App Orchard registration prerequisite. Cross-link to ADR-0001 and `data-flows/patient-onboarding.md`.
- **FDB** — medication and clinical-knowledge endpoints. Cached weekly drug-by-disorder; real-time DDI/DFI/DA/DDC/DPT/SIDE screens; education monographs. NDA gate noted (Living Risk R1). Sandbox + production endpoints differ.
- **Stripe** — subscription per clinic, per-seat. Stripe Billing + Checkout. Webhooks for lifecycle events. Tax / Tax IDs via Stripe Tax. Customer Portal for cancellation + payment-method updates.
- **Intercom** — frontend-only embedding in mobile (3rd release) and clinic web app (2nd release). No backend-to-backend integration in MVP.
- **AWS managed services** — ALB, RDS Postgres (Multi-AZ), S3, ElastiCache, CloudWatch, Cognito (non-EPIC path), SNS + APNS (push), SES (email), KMS, Secrets Manager, WAF, Shield, EventBridge. One-line role per service; cross-link to deployment view in `overview.md`.
- **SurveyJS** — external library bundled into the patient mobile app (npm package + WebView for HTML/JS) and the Project H Admin App (SurveyJS Creator embedded). License: MIT for runtime; Creator commercial for closed-source authoring — flag with `> [!validate]` if the licensing path is unclear.
- **App stores** — App Store (MVP) and Google Play (post-MVP, Android deferred). TestFlight for beta distribution. CI/CD via GitHub Actions.

**Per-system contract shape.** Each entry follows a consistent micro-template: Role · Auth/credentials · Direction (inbound / outbound / bidi) · Cardinality (per clinic / global / per-patient) · Failure mode policy · Reference docs in the engagement.

**`## Open questions`** (3–5). Suggested: NDA-resolution timeline for FDB; whether the Cognito path is launch-day or deferred; whether Intercom backend integration is on a future roadmap.

### 5.3b `sample-work/docs/architecture/data-flows/patient-onboarding.md` (1 page)

**Why it exists.** TA §3 prescribes `architecture/data-flows/` as "one file per high-stakes flow". For Project H the two highest-stakes flows are patient onboarding and report-to-clinician (this file + 5.3c).

**Content.**

- **Trigger.** Clinician generates invite via EPIC Custom Action (or non-EPIC admin page). Patient receives link + backup code.
- **Mermaid block.** Embed `project-h-diagrams-mermaid.md` §7 (the full `login` flowchart).
- **Step-by-step prose** — concise narration of the 22 numbered steps from the diagram, cross-linked back to user stories (US-1.1 through US-1.7) and ADR-0001. ½ paragraph per major branch (first-time vs returning; EPIC vs non-EPIC; biometric on vs off).
- **Critical invariants.**
  - Consents are stored before MyChart auth is invoked (BR-002).
  - Tokens are encrypted on device and on backend (D9).
  - On any auth failure, no PHI is exposed; the app falls back to a clean login screen.
- **Cross-references.** `modules/auth-authorization/overview.md` for the module surface; `decisions/0001-…` for the ADR; `integration-points.md` for the MyChart contract.
- **`## Open questions`** (2–3). Suggested: how is the per-clinic MyChart URL refreshed if local storage is cleared but the refresh token is still valid; how is invite-link expiration policy surfaced to the clinician at generation time.

### 5.3c `sample-work/docs/architecture/data-flows/report-to-clinician.md` (1 page)

**Content.**

- **Trigger.** Patient completes Intake + Screener (or follow-up).
- **Mermaid block.** Embed `project-h-diagrams-mermaid.md` §6 (the EPIC integration sequence).
- **Step-by-step prose.**
  1. Backend assembles patient profile (from EPIC pull on auth + intake answers + FDB-coded fields) — cross-link to `schema/tables/patient-profile.md`.
  2. Recommendation library invoked (Project H's black-box rules engine, D30); generates ranked diagnoses + treatment options + CPT codes.
  3. PDF generated from HTML template (D8). Stored on Project H side. URL produced.
  4. FHIR Bundle assembled — Observation (mandatory; triggers PGHD), Condition, DocumentReference (link to PDF).
  5. Bundle sent to EPIC FHIR API. EPIC routes to clinician In Basket.
  6. Clinician reviews in In Basket → opens patient profile → clicks PDF link → SMART FHIR auth gate → PDF download.
  7. Clinician finalises diagnosis in EPIC. On next patient login, Project H refreshes patient profile and pulls the final diagnosis back.
- **Critical invariants.**
  - Recommendations live only inside the PDF (D23) — keeps CDSS Class I boundary.
  - Patient cannot directly download the PDF; SMART FHIR auth gates clinician-only access.
  - Observation must be present; without it the clinician is not notified.
- **Cross-references.** `decisions/` (a future ADR on the Class I CDSS guardrail; flag as "to be authored"); `integration-points.md` for EPIC and FDB; `tables/patient-profile.md` for the assembly inputs.
- **`## Open questions`** (2–3). Suggested: how the PDF link is rotated / expired; whether DocumentReference type coding follows a Project H convention or EPIC default; whether the clinician-finalised diagnosis pulled back is stored as a separate Condition or merged into the existing patient_profile.

### 5.3d `sample-work/docs/architecture/release-coexistence.md` (1 page)

**Why it exists.** Stand-in for TA §3 `architecture/legacy-2.0-coexistence.md`. Project H has no legacy stack, so the cross-cutting coexistence story is between **MVP, 2nd release, and 3rd release** — features that ship in parallel during MVP+1 and MVP+2 while older patient cohorts stay on earlier feature sets.

**Section structure (mirrors the 4-question pattern from TA §5.3).**

1. **What is the current planned state?** MVP scope (core onboarding → intake → report → clinic Stripe subscription). 2nd release adds cognitive games, follow-up questionnaires, history view, reminders, Intercom for clinic, subscription management endpoints. 3rd release adds red-flag detection + clinic email, Intercom for mobile, patient data deletion, self-started follow-up rate limiting.
2. **Where does coexistence happen?**
   - The `patient_profile` schema must support fields added in later releases (e.g., `follow_up_self_started_count` for 3rd-release rate limiting) as nullable from MVP onward, to avoid migrations during release cuts.
   - Push notifications (Epic-7 Mobile) ship in 2nd release for assessment reminders; the architecture supports them from MVP (AWS SNS + APNS in the deployment view) but no triggers are wired.
   - Intercom integration ships in 2nd release (clinic) and 3rd release (mobile); the SDK is included from MVP but feature-flagged off.
3. **What are the known divergences?**
   - MVP patients onboarded before the games feature ships will have no game-result data — the recommendation library must accept absence gracefully.
   - 3rd-release self-started follow-up rate limit retroactively applies to MVP patients — `> [!validate]` whether this is explicit policy or an implicit reset on rollout.
4. **What is the rollout trajectory?** Linear (MVP → 2nd → 3rd). No A/B; no per-clinic feature flags planned in MVP. `> [!validate]` whether per-clinic feature-flag scaffolding is needed for staged rollout.

**`## Open questions`** (2–3). Suggested: schema-versioning policy (forward-compatible columns vs migrations); feature-flag service / library choice if needed.

### 5.4 `sample-work/docs/architecture/decisions/0001-*.md` (1 page, MADR format)

**Recommended pick: D3 — *Per-clinic MyChart as SSO via Universal Links + backup codes*.** Visible across multiple Confluence pages (User invitation links comparison table, AVD 4.4 EPIC EHR Integration View, multiple Epic-1 Mobile US's), has 5 alternatives explicitly evaluated, and the rationale is recoverable.

**File name.** `0001-mychart-as-per-clinic-sso.md`

**MADR section content.**

- **Status.** Accepted (retrospective — surfaced from discovery).
- **Context.** Each US primary-care clinic that licenses Project H runs its own EPIC EHR + MyChart instance. The patient onboarding flow must authenticate the patient against the *correct* MyChart, link the resulting tokens to the patient's record in Project H, and do so without a custom Project H account/password layer (to keep the auth surface minimal and HIPAA-friendly).
- **Decision.** Use MyChart as the SSO provider, per-clinic. The Project H Patient Mobile App opens an embedded MyChart login page whose URL is generated by the Project H backend after invite-link / backup-code validation determines the patient's clinic. Authentication uses SMART on FHIR OAuth2 with PKCE. Access + refresh tokens are stored encrypted on the device (D9) and on the backend; subsequent logins re-validate or refresh via the backend.
- **Alternatives considered.** Cite the User invitation links comparison table (5 approaches). Approach #1 (per-patient unique link generation in EPIC EHR via SMART FHIR plugin) chosen. Approaches 2–5 (link generation in Clinic Web App / Clinician Web App / common-per-clinic / common-static) all rejected — see comparison-table rationale (UX quality, ability to restrict access, dev effort).
- **Consequences.**
  - *Positive:* No Project H managed credentials for patients → reduced PHI exposure surface; clinician workflow stays inside EPIC; alignment with App Orchard certification path.
  - *Negative:* Per-clinic operational cost (see architectural assessment in `overview.md` §Architectural drivers — same surface as R3); offline mode requires careful token lifetime / refresh management; patient onboarding has a hard dependency on Clinic Admin generating the invite via the Custom Action in EPIC.
  - *Open:* If a clinic transitions to a non-Epic EHR, the architecture has a parallel Cognito-based path (D-implicit; see `modules/auth-authorization/variations.md`), but the operational handover model is undocumented.
- **Notes.** Discovered in the User invitation links page (419469068) which explicitly captured a 5-option comparison; the decision is approved per the page footer. The MyChart token-storage rule (D9) cross-references this ADR.

### 5.4a `sample-work/docs/schema/overview.md` (1 page)

**Why it exists.** TA §3 prescribes a schema-layer overview that explains "how to read" the per-table docs. For the sample it carries extra weight because the wide-table methodology is the highest-stakes artifact (Prompt §5.3 — "the most important artifact in the sample").

**Section list.**

- **Scope.** What's in the schema layer (Project H internal tables: patient_profile, consents, intake_responses, game_results, reports, follow_up_attempts, subscriptions, invites, etc. — only `patient-profile.md` is authored in this slice; the rest are listed as "to be authored").
- **How to read a table doc.** Walk-through of the column-classification convention used in `tables/patient-profile.md` — Resolved / `VALIDATE:` / `> [!deprecated]` states; how cross-references are formatted; how implicit FKs are surfaced.
- **Naming conventions.** snake_case columns; FHIR-aligned suffixes where the field originates from EPIC (`epic_patient_id`, `mychart_token_ref`); FDB-coded fields suffixed `_fdb` or qualified by their FDB source (`medical_condition_fdb_id`).
- **Source of truth.** All current schema documentation is derived from Confluence specs in the absence of committed DDL — explicit substrate caveat repeated from CONVENTIONS.md.
- **Cross-references.** Pointer to `relationships.md` for implicit FK; pointer to `tables/patient-profile.md` as the worked example.
- **`## Open questions`** (2–3). Suggested: which Postgres extensions are required (uuid-ossp? pgcrypto?); whether row-level security is configured per-clinic or enforced in application code; whether intake answers are stored relationally or as JSON columns.

### 5.4b `sample-work/docs/schema/relationships.md` (1 page)

**Why it exists.** TA §3 / TA §5.2 — implicit FK catalog. Even pre-code, Project H's spec has several cross-resource relationships that aren't (yet) declared as FK constraints but are load-bearing.

**Content.**

- One-paragraph framing: catalog of relationships that *aren't* declared FK at the database level — either because they cross the system boundary (Project H ↔ EPIC), or because the implementation is pending.
- Table of entries. Each row: source table.column · target table.column (or external system) · cardinality · evidence (spec page / US ID) · status (Resolved / `VALIDATE:` / pending).

Suggested initial entries:

| Source | Target | Card. | Evidence | Status |
| --- | --- | --- | --- | --- |
| `patient_profile.epic_patient_id` | EPIC FHIR Patient.id | 1:1 (per clinic) | AVD 4.4 + Epic-2 F1 US-1.1 | Resolved (cross-system). |
| `patient_profile.mychart_token_ref` | `mychart_tokens.id` (table TBD) | 1:1 | US-1.5 token-storage flow | `VALIDATE:` table name not committed. |
| `patient_profile.consent_version` | `consents_catalog.version` (table TBD) | N:1 | US-1.2 stores `patient ID + timestamp + consent_version` | `VALIDATE:` consents_catalog schema not specified. |
| `intake_responses.patient_id` | `patient_profile.patient_id` | N:1 | Epic-2 F2 store interim+final results | Resolved (Project H internal). |
| `reports.patient_id` | `patient_profile.patient_id` | N:1 | Epic-3 F1 report assembly | Resolved. |
| `reports.documentreference_url` | external (Project H hosted file storage) | 1:1 | D31 + AVD 4.4 | Resolved (cross-system). |
| `follow_up_attempts.patient_id` | `patient_profile.patient_id` | N:1 | Epic-5 F4 rate limiting (3rd release) | `> [!deprecated]` candidate? MVP scope-out. |
| `subscriptions.clinic_id` | `clinics.id` (clinic schema) | 1:1 | Epic-6 Clinic Web App | Resolved (Stripe side via webhook). |
| `invites.patient_id` | nullable until claimed | 1:1 (when claimed) | Epic-1 WebApp F1 invite-link generation | Resolved. |

- **Cross-system relationships callout.** EPIC FHIR resource references are not FK constraints inside Project H's DB but must be treated as load-bearing — patient_profile changes that drop `epic_patient_id` would break the report-to-clinician flow.
- **`> [!validate]`** for any row whose target table isn't yet named in the specs.
- **`## Open questions`** (2–3). Suggested: are consents stored per-version (immutable) or per-patient-current (mutable); how does the `mychart_tokens` table reconcile with the AWS Cognito non-EPIC path; whether `invites` is a separate table or a state machine inside `patient_profile`.

### 5.5 `sample-work/docs/schema/tables/patient-profile.md` (2–3 pages)

**Substrate adaptation.** No committed code or DDL exists. Apply the column-classification methodology to the **Patient Profile composite specified across Epic-2 Mobile**: Feature 1 US-1.1 (data retrieved from EPIC FHIR), Feature 3 US-3.1–3.5 (FDB-coded fields), Feature 4 (FDB endpoint integration). Source-of-record is the Vision&Scope `Major features` page + the EPIC integration View. This is the most-important artifact in the sample — execute the methodology *literally*.

**Section list.**

- **Business purpose.** One paragraph: structured composite of patient demographic + clinical data, FDB-code-mapped where applicable, used by (a) intake-questionnaire prefilling, (b) FDB drug-by-disorder + screening pipeline, (c) report generation, (d) sync-back on each EPIC re-authentication. Lives logically in `patient_profile` (table name not yet committed — see VALIDATE).
- **Logical groupings** (8–12 clusters; pull from the specs):
  1. *Identity / linkage* — patient_id (Project H internal UUID), epic_patient_id, mychart_token_ref.
  2. *Demographics from EPIC* — DOB / age, gender, race, ethnicity, preferred language, marital status, number of children, years of education, height.
  3. *Clinical history from EPIC* — allergies (drug + non-drug), current medications, comorbidities.
  4. *Comorbidity flags (FDB-coded)* — diabetes, hypertension, hypertriglyceridemia, cardiovascular history (stroke, heart attack), mental-health conditions, substance use, autism spectrum disorder.
  5. *Labs* — blood panels, hormones, other relevant.
  6. *FDB-coded medication list* — derived from current_medications mapped to FDB Dispensable Drug IDs.
  7. *FDB-coded medical conditions* — derived from comorbidities mapped to FDB Medical Condition IDs.
  8. *FDB allergens* — derived from allergies mapped to FDB AllergenPicklist.
  9. *Pregnancy status* — explicitly listed in US-3.5 inputs to the patient profile.
  10. *Consent / authorization* — patient_consent (HIPAA + EHR access + R&D de-identified data + emergency notifications), consent_version, consented_at.
  11. *Token / auth metadata* — refresh_token_ref, access_token_ref, last_login_at, last_token_refresh_at.
  12. *Audit* — created_at, updated_at, source_of_last_update (EPIC re-auth vs intake completion vs report sync-back).

- **Column reference table.** Mandatory ≥ 3 `VALIDATE:` rows. Suggested format:

| Column | Type (proposed) | Nullable | Business meaning | Observed usage | VALIDATE / status |
| --- | --- | --- | --- | --- | --- |
| patient_id | uuid | no | Project H internal stable patient identifier. | Referenced from every other Project H table (intake_responses, game_results, reports). | Resolved. |
| epic_patient_id | varchar | no | EPIC's Patient.id (FHIR). Used for token-linkage and FHIR resource exchange. | EPIC integration view 4.4; Epic-2 F1 US-1.1. | Resolved. |
| race | enum/varchar | yes | Patient self-reported race; sourced from EPIC. | Intake prefill; report generation. | `VALIDATE:` AVD does not specify race coding (US Census categories vs OMB-1997 vs free-text). Workshop topic with compliance engineer. |
| pregnancy_status | enum | yes | Used by FDB DDC screening (Drug-Disease Contraindications) and DPT. | US-3.5 lists as one of the patient-profile inputs. | `VALIDATE:` Values not enumerated in the spec (pregnant / not-pregnant / unknown / not-applicable). Affects FDB query input shape — workshop topic with Project H clinical team. |
| consent_version | varchar | no | Tracks which consent version the patient accepted. | US-1.2 says "consent acceptance stored with patient ID, timestamp, and version". | `VALIDATE:` Versioning policy is "fixed content in MVP" per US-1.2 out-of-scope; no rule for re-prompting on bump. |
| col_legacy_height_inches | int | yes | Patient height. | EPIC demographics retrieval. | `VALIDATE:` AVD lists height under demographics but does not specify unit, conversion approach, or whether to store both metric and imperial. Workshop topic. |
| follow_up_self_started_count | int | yes | Counter against the rate-limit defined in Epic-5 Feature 4. | Epic-5 F4. | `> [!deprecated]` candidate? Self-started rate-limiting is a 3rd-release feature — column may not appear in MVP schema. Confirm scope. |

(Above is illustrative of the *shape*. The doc-gen session should produce ~20–30 rows total covering all 12 clusters.)

- **Implicit relationships.** Section listing implicit FKs that are not declared (yet): patient_profile.consent_version → consents_catalog.version (table not yet specified); patient_profile.epic_patient_id → external EPIC FHIR Patient.id (cross-system "FK" — convention only); follow_up_self_started_count → join with `follow_up_attempts` per US-4.4 (table to be named).
- **Known issues and historical artifacts.** None historical (greenfield), but call out artifacts of the *specification process*: e.g., the spec lists "height" but does not specify unit; "race / ethnicity" is collapsed in some places, separate in others.

**`> [!validate]` narrative callout (≥ 1).** Suggested wording around the pregnancy_status field — it appears explicitly only in US-3.5 of Epic-2 Feature 3, but FDB DDC and DPT screening shapes are not pinned, and EPIC Observation/Condition return shape for pregnancy is non-trivial (multiple FHIR Observation codes possible).

**`## Open questions` (3–5).**

- What is the canonical FDB version used by Project H at MVP launch? Affects code mapping stability.
- Are demographic fields refreshed *every* MyChart re-auth, or only on first login? Page text is ambiguous.
- Is `patient_profile` snapshot-immutable per EPIC re-auth, or mutable in place? Implications for audit logs and HIPAA right-to-access.
- Is the Project H internal patient_id derived from `epic_patient_id` (deterministic) or independent (UUID v4)? Affects edge cases when a patient changes clinics.
- Confirmed minimum FHIR resource set for inbound on first login — page 420906626 lists 15 resources; is each one required at first login or only on-demand?

### 5.6 `sample-work/docs/modules/auth-authorization/CLAUDE.md` (½ page)

**Spec template.** TA §6 (module-level shape).

**Content.**

- *Purpose.* Patient sign up + sign in module. Spans MyChart SMART OAuth2 (EPIC clinics) and Cognito-Amplify (non-EPIC clinics). Includes invite-link / backup-code validation, consent collection, biometric/passcode setup, and dashboard handoff.
- *Before editing.* Read `overview.md` (this module), then `business-rules.md`, then `variations.md`. For any change touching token storage or refresh logic: also re-read ADR `0001-mychart-as-per-clinic-sso.md` and the OWASP ASVS token-handling requirements (external).
- *Known gotchas.*
  - Consents are collected *before* MyChart OAuth completes. Reordering breaks HIPAA-alignment claim.
  - The "Set Up Later" path on biometric setup is allowed *once*. Subsequent skips must re-trigger the setup screen — the current spec is explicit on this.
  - On token refresh failure (both access + refresh invalid), the user is redirected to the MyChart login screen regardless of which clinic they belong to — the URL is resolved from local storage (saved on first login) or from a backend lookup if local store is missing.
  - The login flow has 8 decision points in the AVD 4.5 diagram. Edits touching any decision must be checked against the diagram before merging (see `variations.md`).

### 5.7 `sample-work/docs/modules/auth-authorization/overview.md` (1–2 pages)

**Outline.**

- *Purpose & scope.* From Epic-1 Mobile description.
- *Key entities.* `Patient`, `MyChartCredentials`, `InviteToken`, `BackupCode`, `Consent`, `BiometricRegistration`, `SessionToken`, `RefreshToken`. (Names to be locked in `schema/tables/`; here we name them as concepts.)
- *Primary workflows.* List from Epic-1 Mobile features:
  1. First-time onboarding (Welcome → Consent → Invite/code validation → MyChart auth → Token storage → Biometric setup → Congratulations → Dashboard).
  2. Returning login (refresh-token validation → biometric check → token refresh → Dashboard).
  3. Logout & auto-logout (Epic-1 Feature 2, US-2.1, US-2.2).
- *Integration points.* MyChart (per-clinic OAuth2 + PKCE), Cognito (non-EPIC fallback), Project H backend (token storage + invite validation + consent capture), Project H Patient Profile (first-login data fetch from EPIC).
- *Cross-references.* Link to `architecture/overview.md` §4.5 (Patient Auth Flow diagram), `schema/tables/patient-profile.md` (consents, token refs, last_login_at fields), `architecture/decisions/0001-…`.
- Embedded **flowchart Mermaid** — paste the login flow from `project-h-diagrams-mermaid.md` §7. This *is* the architectural anchor for the module.

### 5.8 `sample-work/docs/modules/auth-authorization/business-rules.md` (1–2 pages)

**Catalog format per TA §5.5.** Stable ID + statement + source citation + variations + edge cases. Suggested rule inventory (pull all 10–14 from US scenarios + ACs):

| ID | Statement | Source citation | Variations | Edge cases |
| --- | --- | --- | --- | --- |
| BR-001 | The welcome carousel is shown only on first login. On subsequent launches the app skips it. | US-1.1 Scenario 3, AC1 / AC2. | None. | If the welcome page fails to render, the app must silently advance to the Consent screen (US-1.1 Scenario 4) — no error message shown. |
| BR-002 | Consents must be accepted before MyChart authentication can be initiated. If consents have already been collected for the patient, the screen is skipped. | US-1.2 Scenario 1 / 3. | None — applies to EPIC and non-EPIC equally. | Failure to render Consent screen blocks progression; user sees a branded error message and cannot continue without confirmed consent acceptance (US-1.2 Scenario 4). |
| BR-003 | A backup invite code is 6 characters. The Continue button is enabled only when 6 characters have been entered. | US-1.4 design reference + Tasks. | `> [!validate]` Length is marked TBD in the spec. | After 5 failed attempts (default, TBD) the code is invalidated and the patient must contact the clinic for a new one. |
| BR-004 | The invite link or backup code resolves the patient's clinic, which determines the MyChart login URL. | US-1.3 technical flow + US-1.5 technical flow step 1. | None. | If link is invalid, fall back to backup code input. If backup code is also invalid, block onboarding and present the "Contact clinic" message. |
| BR-005 | MyChart authentication uses SMART on FHIR OAuth2 with PKCE. Tokens (access + refresh) are stored encrypted on the device and on the backend. | US-1.5 Scope items 1–4, ADR-0001. | EPIC path uses MyChart; non-EPIC path uses Cognito + Amplify Authenticator (see `variations.md`). | If MyChart service is unavailable, the app displays "Unable to connect to MyChart, please try again later" and logs the event locally for sync (US-1.5 Scenario 5). |
| BR-006 | On token expiry, the app obtains a new access token via the refresh token. If the refresh token is also invalid, the patient is prompted to re-authenticate with MyChart. | US-1.5 Scenarios 2 and 3. | Same shape for Cognito path. | When both tokens are invalid in offline mode, the app must not expose any PHI until reconnection + re-auth. |
| BR-007 | Patient demographic and medical-record fetch from EPIC runs on first MyChart sign-in and on every successful re-authentication (new token). | Epic-2 F1 US-1.1 trigger points. | Non-EPIC clinics: no EPIC fetch; Cognito user profile + Project H side patient profile only. | Missing or partial EPIC data does not block onboarding — empty fields are allowed (US-1.1 AC4). |
| BR-008 | Biometric / passcode setup is presented after MyChart success and before the Dashboard. The patient may defer setup once via "Set Up Later"; the screen reappears on next login and setup is enforced. | US-1.6 Scope + Scenario 4. | None. | If biometric API fails, the app falls back to passcode entry (Scenario 3). |
| BR-009 | The Congratulations screen displays the patient's first name (sourced from EPIC demographics fetch). Tapping "Start Questionnaire" routes to the Intake flow. | US-1.7 Scenarios. | Greeting may be empty in the edge case where EPIC returned no name — `> [!validate]` what to display in that case is not specified. | n/a. |
| BR-010 | Logout revokes MyChart tokens and clears local PHI; the next launch must complete a full MyChart OAuth. Auto-logout triggers after configured inactivity. | Epic-1 F2 US-2.1 / US-2.2. | "Lock app" (fast re-entry) keeps tokens valid and only requires Face ID/passcode; "Sign out" revokes. | Inactivity threshold value is TBD. |

**`> [!validate]` callouts.** BR-003 (backup-code length), BR-009 (empty greeting fallback), BR-010 (inactivity threshold).

**`## Open questions`.**

- Is the 5-attempt limit on backup codes per-code or per-patient?
- On token-refresh failure when patient is at home (no clinic context), how is the MyChart login URL re-resolved if local storage was cleared?
- Are auto-logout inactivity windows configurable per clinic or fixed globally?

### 5.9 `sample-work/docs/modules/auth-authorization/variations.md` (1 page)

**Adaptation note.** Stand-in for `legacy-vs-2.0.md`. The genuine fork in this module is **EPIC clinic vs non-EPIC clinic** authentication.

**Section structure (4 questions, per TA §5.3 pattern).**

1. *Current state.* EPIC path uses MyChart SMART OAuth2 + PKCE. Non-EPIC path uses AWS Cognito + Amplify Authenticator. The two paths converge at step 15 of the AVD 4.5 login flow.
2. *Where does coexistence happen?* The Backend Code Validation Endpoint (step 10) is the single entry that returns `login_flow_type` along with the OAuth URL — every downstream component branches on this value. The patient_profile schema's `epic_patient_id` is nullable for non-EPIC patients.
3. *Known divergences.*
   - EPIC path triggers a patient-data prefill from EPIC FHIR (step 15b). Non-EPIC path skips this step — the Project H side knows only what was captured at signup.
   - Offline-mode token refresh on EPIC path requires re-resolving the per-clinic MyChart URL; on non-EPIC path the Cognito endpoint is a single global one.
   - Report exchange (Observation / Condition / DocumentReference outbound) applies only to EPIC clinics — non-EPIC report delivery model is out of scope for MVP.
4. *Migration trajectory.* Non-EPIC support is positioned as "fallback / parallel path" in the AVD; the architectural intent is that MVP launches with one or more EPIC clinics first, with non-EPIC support exercised but not the primary path. `> [!validate]` This is the architectural read — the docs do not explicitly say "EPIC path is canonical, non-EPIC is fallback". Workshop topic with Project H leadership.

---

## 6. Diagram inventory for the sample

The Mermaid blocks already produced in `project-h-diagrams-mermaid.md` map onto the sample as follows:

| Mermaid block (file §) | Used in sample file | Section |
| --- | --- | --- |
| §2 System Context | `architecture/overview.md` | System Context view (C4 L1) |
| §3 Container View | `architecture/overview.md` | Container view (C4 L2) |
| §5 MVP Deployment | `architecture/overview.md` | Deployment view |
| §6 EPIC Integration flow | `architecture/data-flows/report-to-clinician.md` | Step-by-step prose / diagram |
| §7 Patient Auth login flow | `architecture/data-flows/patient-onboarding.md` **and** `modules/auth-authorization/overview.md` | Primary workflows (cross-referenced from both — single source of truth in the data-flow doc; module doc embeds for navigability) |
| §8 Other users (setup + EPIC/non-EPIC) | `modules/auth-authorization/variations.md` | Known divergences section |
| §1 User group associations | `schema/tables/patient-profile.md` (recommended) — motivates the multi-tenant identity columns |
| §4 Final-product deployment | `architecture/release-coexistence.md` — referenced as "post-MVP infrastructure" |
| §9 SurveyJS surveys | `architecture/integration-points.md` — embedded in the SurveyJS entry |

Every Mermaid block has been built faithfully from the rendered draw.io PNG (not from the `.mxfile` source). For ADR-grade accuracy the doc-gen session should cross-verify the auth-flow Mermaid against `project-h-diagrams-index.md` §7 description before publishing.

---

## 7. VALIDATE / Open-questions material — master list

Pulled across all Confluence pages. The doc-gen session can pick from this list to satisfy the spec's "≥ 1 callout, 3–5 open questions per doc" requirements without inventing new ambiguities.

**Explicit TBDs from the source pages** (each is a credible `> [!validate]`):

- Backup code length and segmented-input width (US-1.4 helper text says 6 chars; tasks mark it `TBD`).
- Backup-code retry limit ("default 5 attempts. TBD"; failure copy "Too many failed attempts… please contact your clinic" — all `text TBD`).
- Consent copy is "TBD by Legal/Compliance" (US-1.2 Tasks).
- Welcome-page body text is placeholder ("copy to be finalized by UX/content", US-1.1 Tasks).
- "Continue button enabled only after user has scrolled through all sections (MVP enforcement). (Final decision will be provided)" — US-1.2 Tasks.
- US-1.3 MyChart-service-unavailable copy `text TBD`.
- US-1.4 server-error / no-internet copies `text TBD`.
- US-1.5 invalid-credential behavior "should be clarified".
- US-1.5 MyChart auth-code failure error responses "Should be clarified possible errors".
- BR-010 auto-logout inactivity threshold TBD.
- AVD 3.4 Quality Attributes section is empty.
- AVD 5.1.2 AWS pricing left as calculator URLs only.
- AVD 2.3 R16 priority left as "Low" with no specifier.
- ADR page (425568846) under Architect is empty.

**Architectural ambiguities surfaceable as open questions** (each suitable for a `## Open questions` slot):

- Will App Orchard approval be on the MVP critical path?
- Per-clinic EPIC integration cost — is there a config-store abstraction planned? (Mirror of architectural-assessment note in `overview.md`.)
- HIPAA consent versioning — what's the policy when consent text changes post-MVP?
- Class I CDSS guardrail — what mechanism prevents a future feature from inadvertently crossing the boundary?
- Whether the patient_profile is mutable-in-place or snapshot-immutable per EPIC re-auth (audit implications).
- Whether Andersen's handoff to Project H on the Admin App includes a runbook.

**Spec-level oddities worth a callout:**

- The AVD §3 Architecture Drivers has sections 3.1, 3.2, 3.4 — no 3.3 is published.
- AVD §5 Operation Plan has 5.1, 5.2, 5.3, 5.5 — no 5.4.
- AVD §4 Solution Architecture has 4.1–4.6 numbering but several pages are empty section anchors.

---

## 8. Style / voice / branding

Enforce these throughout (Prompt §6, §9):

- **AndersenLab branding.** Never "Innowise". Grep before delivery.
- **Match the response document's voice** (`SourceWare_Presale_Response.docx`). Read it before writing.
- **US English.** Be consistent.
- **No marketing language.** No "world-class", "best-in-class", "leveraging synergies".
- **No invented metrics.** Don't claim "improved onboarding by X%". Show artifacts, not testimonials.
- **Confident, technically deep, honest about limits.**

**Cross-referencing convention.** Use relative markdown links (`../decisions/0001-mychart-as-per-clinic-sso.md`) — not absolute. Each cross-reference cited in a doc must resolve to a real heading in the sample.

**Code/file citation note.** The substrate has no committed code yet. Where SourceWare's sample would cite `file_path:line` or `stored_proc_name`, Project H's sample should cite the Confluence page or user story ID (e.g., "Epic-1 Mobile US-1.5 Scenario 2"). This is a substrate adaptation — disclose it in the README so the methodology framing stays honest.

---

## 9. Quality bar — pass criteria mapping

Mapped from Prompt §7:

| Criterion | How it's satisfied for Project H sample |
| --- | --- |
| Mermaid diagrams render | Use blocks from `project-h-diagrams-mermaid.md` verbatim; render-test in MkDocs Material before delivery. |
| File paths / function names cited exist | Substrate is pre-code → cite Confluence page IDs and US numbers instead; spot-check ≥ 5 citations against `project-h-initial-phase-deliverables.md`. |
| Cross-references resolve | Every `../decisions/`, `../tables/`, `../modules/` link must point to a real file/heading in the sample. |
| `> [!validate]` callouts are credible | Pull from §7 of this brief — each is a real TBD in the source. No invented ambiguities. |
| Open-questions sections non-empty / non-fluff | Pull from §7 of this brief. Cap at 3–5 per doc. |
| Cross-LLM peer review pass | Run on `architecture/overview.md` and `schema/tables/patient-profile.md` before delivery. Findings → resolved or moved to open questions. |
| No Innowise | `grep -ri innowise sample-work/` returns nothing. |
| Volume ≈ 15–20 pages of markdown | Expanded to ~22 pages across **17 files** to faithfully mirror TA §3 (root conventions + integration-points + data-flows + schema overview + relationships). Each new file is kept lean (½–1.5 pg). Breakdown: README 1 + CLAUDE.md 1 + AGENTS.md ½ + CONVENTIONS.md 1 + GLOSSARY.md 1 + arch overview 3 + integration-points 1.5 + data-flows ×2 = 2 + release-coexistence 1 + ADR 1 + schema overview 1 + relationships 1 + patient-profile 3 + module CLAUDE.md ½ + module overview 2 + business-rules 2 + variations 1 ≈ **22.5 pages**. Above the Prompt §5 floor; justified by the user's explicit instruction to mirror the engagement shape, not just hit the demo minimum. |

---

## 10. Deferred / out-of-scope for this sample

These appear in the source but should not be expanded into sample artifacts (would inflate scope without raising credibility):

- The full Mobile / Clinic Web App user-story catalog (Epics 2–10 Mobile, Epics 2–6 Clinic Web App). The sample touches only Epic-1 Mobile in depth.
- Stripe billing implementation detail (Epic-6 Clinic Web App).
- Cognitive games integration (Epic-4 Mobile, 2nd release).
- Red-flag detection workflow (Epic-5 F5, 3rd release).
- The Project H Admin App (explicitly out of Andersen scope per the source).
- AVD §6.3 / §6.4 team-structure and skillset content (presale staffing — not relevant to a methodology demonstration).

**TA §3 folders intentionally omitted from this slice** (acknowledge in `README.md` under "Future expansion"; do not stub):

- `business-logic/` (pricing.md, commission.md, customer-forks.md, edge-cases.md) — SourceWare-specific. Project H's business rules are captured per-module in `modules/auth-authorization/business-rules.md`, which is the appropriate granularity for the auth domain. A real Project H engagement would add an analog under a different label (e.g., `clinical-logic/recommendation-rules.md`, `clinical-logic/screening-criteria.md`) — flag in the README.
- `process/integration-plan.md`, `process/sync-with-code.md`, `process/migrating-word-docs.md` — engagement-process documentation. Not in scope for a demo sample.
- `architecture/data-flows/` extended set — only `patient-onboarding.md` and `report-to-clinician.md` are in the sample. A full engagement would add `subscription-lifecycle.md`, `follow-up-cycle.md`, `red-flag-alert.md`, `data-deletion-request.md`, etc.
- Per-folder rolled-up `open-questions.md` files at `schema/` and `modules/.../` levels. Sample uses per-doc `## Open questions` sections only — same content, lower file count, demo-value parity. A real engagement would aggregate these for batched Tech Lead review per TA §4 Stage 4c.
- `llms.txt` — TA §6 marks it optional pending toolchain support; defer to integration phase.
- Additional ADRs beyond `0001`. Each D-code in the AVD (D1–D40) is a candidate; the sample authors one as the canonical example and lists the rest as "to be authored" in `architecture/overview.md` §Key design decisions.

---

## 11. Hand-off checklist for the doc-gen session

1. Confirm the substrate target — `sample-work/` standalone folder vs populating `ai-doc-sample/` placeholders. Likely the former.
2. Open `project-h-initial-phase-deliverables.md` for content lookups.
3. Open `project-h-diagrams-mermaid.md` for diagram blocks.
4. Open `SourceWare_Technical_Approach.md` §§ 2, 3, 5.1, 5.5, 6 for template-section verification.
5. Generate the 17 files in this order (anchors first, leaves last):
   1. `architecture/overview.md` — anchors everything else.
   2. `schema/tables/patient-profile.md` — highest-leverage artifact; demonstrates wide-table methodology.
   3. `schema/overview.md` + `schema/relationships.md` — frame the patient-profile doc.
   4. `architecture/integration-points.md` + `architecture/data-flows/*` — external surface and high-stakes flows.
   5. `architecture/release-coexistence.md` — cross-cutting view.
   6. `modules/auth-authorization/{overview, business-rules, variations}.md` — module deep-dive.
   7. AI entry points (`docs/CLAUDE.md`, `docs/AGENTS.md`, module-level `CLAUDE.md`) — verify task-routing paths actually exist in the sample.
   8. `CONVENTIONS.md` + `GLOSSARY.md` — capture the working agreement and vocabulary.
   9. `architecture/decisions/0001-mychart-as-per-clinic-sso.md` — anchor the most cross-referenced decision.
   10. `README.md` — written last, now that you know what the sample actually contains.
6. Self-review pass: render-test all Mermaid blocks, verify cross-references resolve, spot-check ≥ 5 Confluence-page / US-ID citations against `project-h-initial-phase-deliverables.md`.
7. Cross-LLM peer review on `architecture/overview.md` and `schema/tables/patient-profile.md` (minimum). Findings → resolved or surfaced as open questions.
8. Grep for "Innowise" — must return zero (Andersen branding throughout).
9. Render in MkDocs Material or push to a preview branch; verify the layout reads cleanly.
10. Deliver the `sample-work/` folder + cover note + cross-LLM review log + a Compromises section flagging anything that needed to be deferred.

Everything above is sufficient input — no further Confluence fetch should be necessary.
