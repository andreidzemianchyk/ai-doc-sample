# AI-readability acceptance test

Mandatory deliverable per [`context/project-h/project-h-doc-generation-brief.md`](../../context/project-h/project-h-doc-generation-brief.md) §9 (TA §6 "Testing the AI entry points" + TA §7 + TA §9). The test grades whether the documentation's AI entry points ([CLAUDE.md](../CLAUDE.md), [AGENTS.md](../AGENTS.md), [module CLAUDE.md](../modules/auth-authorization/CLAUDE.md)) route an agent to the correct files and let the agent produce **Project H-specific output** when given a task — not generic suggestions.

## Methodology

A scripted agent session is run against a predefined task battery. The agent operates with **only this repository's content as context** — no out-of-band briefing, no manual hints. For each task, the agent's output is scored:

- **Routing.** Does the agent open the correct files first? (CLAUDE.md → relevant module / schema / decision doc.)
- **Citation.** Does the agent quote the right Confluence page IDs, user-story IDs, BR-IDs, or D-codes when justifying its answer?
- **Specificity.** Is the answer Project H-specific (refers to MyChart, EPIC, FDB, the actual schema columns) or generic ("you'd want to think about authentication and authorization")?
- **Discipline.** Does the agent surface unanswered questions to the user instead of guessing?

A task passes if **all four** are met. Partial passes are recorded but do not count toward the gate.

## Task battery (10 tasks)

The battery is committed in this file so it is repeatable. Re-run against any agent at any time.

### T1 — Add a new column to `patient_profile`

> **Prompt to agent:** "I want to add a column `pregnancy_status` as an enum (`pregnant` / `not_pregnant` / `unknown` / `not_applicable`) to `patient_profile`. Where would you add it, and what else do I need to consider?"

**Expected routing.** [`schema/tables/patient-profile.md`](../schema/tables/patient-profile.md) → [`schema/naming-inconsistencies.md`](../schema/naming-inconsistencies.md) → [`schema/relationships.md`](../schema/relationships.md).

**Expected citations.** US-3.5 (page `425558452`); the existing `pregnancy_status` row marked `VALIDATE:` in `patient-profile.md`; the FDB DDC / DPT screening references.

**Expected specificity.** The agent should notice that `pregnancy_status` is **already documented** in the table, with a `VALIDATE:` flag noting the value enum is not pinned, and surface that to the user rather than blindly proposing an enum.

### T2 — Explain why MyChart auth ships before non-EPIC Cognito

> **Prompt to agent:** "Why is the EPIC / MyChart authentication path treated as the primary one, and the Cognito path as a fallback? Where is this decision documented?"

**Expected routing.** [`modules/auth-authorization/variations.md`](../modules/auth-authorization/variations.md) → [`architecture/decisions/0001-mychart-as-per-clinic-sso.md`](../architecture/decisions/0001-mychart-as-per-clinic-sso.md).

**Expected citations.** ADR-0001 Alternatives considered (#1 chosen of 5); AVD §2.2 D3; Living Risk R3.

**Expected specificity.** The agent should also surface the `> [!warning]` in `variations.md` that calls out this is an architect's *reading* of the source, not an explicit statement — and that it is an open question / workshop topic.

### T3 — Find the rule that limits self-started follow-ups

> **Prompt to agent:** "What rule limits how often a patient can start their own follow-up questionnaire?"

**Expected routing.** [`architecture/release-coexistence.md`](../architecture/release-coexistence.md) (3rd release scope) → [`schema/tables/patient-profile.md`](../schema/tables/patient-profile.md) (`follow_up_self_started_count` column).

**Expected citations.** Epic-5 F4 (3rd release feature); the `> [!deprecated]` candidate flag on the corresponding column.

**Expected specificity.** Agent should note this is **3rd-release scope**, not MVP — so the rate-limit rule does not appear in `business-rules.md` (which covers MVP).

### T4 — Add a new ADR for SurveyJS choice

> **Prompt to agent:** "I want to author a new ADR for the SurveyJS choice (D7 in the source). Show me the file path, the MADR template, and which existing sections / docs would cross-reference it."

**Expected routing.** [`CONVENTIONS.md`](../CONVENTIONS.md) (MADR section) → [`architecture/decisions/0001-mychart-as-per-clinic-sso.md`](../architecture/decisions/0001-mychart-as-per-clinic-sso.md) (template example) → [`architecture/overview.md`](../architecture/overview.md) (Key design decisions table, where D7 is listed).

**Expected citations.** CONVENTIONS §4 MADR convention; AVD 4.6 Assessment / Form Implementation View (the source page that shows the SurveyJS vs Form.io vs LimeSurvey comparison).

**Expected specificity.** File path should be `architecture/decisions/0003-surveyjs-questionnaire-engine.md` (next in numbering).

### T5 — Fix a typo in a Mermaid diagram

> **Prompt to agent:** "There's a typo in the C4 L2 Container view — `Patient Mobile App Backend` is labelled `Patient Mobile App Backend` (intentional typo introduced for the test). Find it and fix it."

**Expected routing.** [`architecture/overview.md`](../architecture/overview.md) Container view (C4 L2) Mermaid block.

**Expected specificity.** Agent should be able to modify a Mermaid block directly in markdown — this is the test of ADR-0002 (Mermaid as default editable-by-agents). If the agent proposes opening an external tool, it has misread the convention.

### T6 — Audit "Innowise" references

> **Prompt to agent:** "Per the brand rule, this repository must never reference Innowise. Audit the repository and report any occurrences."

**Expected routing.** Repository-wide grep.

**Expected citations.** [`CONVENTIONS.md`](../CONVENTIONS.md) Andersen branding rule; quality-bar criterion "No Innowise — grep returns nothing".

**Expected outcome.** Zero occurrences.

### T7 — Explain the PGHD trigger

> **Prompt to agent:** "When Project H sends a report to EPIC, what exactly triggers the clinician to be notified?"

**Expected routing.** [`architecture/data-flows/report-to-clinician.md`](../architecture/data-flows/report-to-clinician.md) → [`GLOSSARY.md`](../GLOSSARY.md) PGHD entry → [`architecture/integration-points.md`](../architecture/integration-points.md) EPIC EHR section.

**Expected citations.** AVD 4.4 EPIC EHR Integration View (page `420906849`); the "Observation is mandatory" invariant.

**Expected specificity.** Agent should call out that **the Observation resource is mandatory** — Condition + DocumentReference alone do not trigger the In Basket notification. Generic answer ("EPIC sends a notification") fails this task.

### T8 — Find an architect-level concern

> **Prompt to agent:** "What architectural weak spot did the author flag while writing the architecture overview? Is it tracked anywhere as an open question?"

**Expected routing.** [`architecture/overview.md`](../architecture/overview.md) Architectural assessments section → `Open questions` of the same file.

**Expected citations.** The "Per-clinic EPIC integration cost" callout; Living Risk R3 (cross-reference).

**Expected specificity.** Agent should describe the concrete refactor surface proposed (the per-clinic config-store extraction), not just "scalability concerns".

### T9 — Add a new business rule

> **Prompt to agent:** "I want to add a business rule about session timeout — sessions auto-lock after 15 minutes of inactivity. Where would this rule go, and how should it interact with existing rules?"

**Expected routing.** [`modules/auth-authorization/business-rules.md`](../modules/auth-authorization/business-rules.md) → BR-010 (existing auto-logout rule, threshold marked TBD).

**Expected specificity.** Agent should realise this is **not a new rule** — it is the resolution of BR-010's TBD threshold. The right action is to update BR-010, not add BR-011, and to close the corresponding open question.

### T10 — Cross-tool path (AGENTS.md @-import)

> **Prompt to agent (running as Cursor / Copilot / Codex CLI):** "Where would you look to understand the patient onboarding flow?"

**Expected routing.** [`AGENTS.md`](../AGENTS.md) → task routing → [`modules/auth-authorization/overview.md`](../modules/auth-authorization/overview.md) → [`architecture/data-flows/patient-onboarding.md`](../architecture/data-flows/patient-onboarding.md).

**Expected specificity.** Non-Claude agents should route through AGENTS.md without ever needing to know CLAUDE.md exists. If the agent fails to find AGENTS.md, the @-import direction (canonical AGENTS.md, CLAUDE.md @-imports) needs to be reconsidered — see [ADR-0002](../architecture/decisions/0002-mermaid-for-inline-diagrams.md) and [AGENTS.md §Rationale](../AGENTS.md#rationale-for-canonical-in-agentsmd).

## Pass status

> [!warning]
> **Status: pending execution.** This file is the placeholder for the AI-readability test log that will be authored when the sample is delivered to the client. The task battery above is committed and re-runnable; the execution is the next step.
>
> In a real engagement, the test is part of the self-review pass (TA §8 week-2 acceptance criterion). The Informediate Tech Lead (or any reader picking up the sample) can re-run it any time to verify the docs haven't drifted.

## Transcripts (when executed)

Each task gets a subsection with:

- The exact prompt issued to the agent.
- The agent's full response (verbatim).
- A pass/fail line on each of the four scoring criteria (Routing / Citation / Specificity / Discipline).
- A one-sentence justification.

For brevity in this sample, transcripts are stored separately under `_review/transcripts/Tnn-<task-slug>.md` once the run completes — links added here.

## Open questions

- **Reviewer agent set.** Should the battery be run against Claude Code + Cursor + Copilot in parallel, or sequentially? *Owner:* delivery lead. *Outcome:* operational decision.
- **Re-run cadence.** A real engagement might re-run the battery after every major doc update; for a static sample, once-before-delivery is enough. *Owner:* methodology lead. *Outcome:* document the cadence in any iteration brief.
- **Adding a typo to test T5.** The typo is described in the brief as "intentional, to be inserted for the test". For the live run, decide whether to inject the typo (and clean up afterward) or change T5 to a non-destructive variant. *Owner:* methodology lead.
