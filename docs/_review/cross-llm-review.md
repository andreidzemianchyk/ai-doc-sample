# Cross-LLM peer review log

Mandatory deliverable per Prompt §10 and quality bar in [`context/project-h/project-h-doc-generation-brief.md`](../../context/project-h/project-h-doc-generation-brief.md) §9. Records the cross-LLM review pass on the three high-stakes documents (TA §2 scope): [architecture/overview.md](../architecture/overview.md), [schema/tables/patient-profile.md](../schema/tables/patient-profile.md), and [modules/auth-authorization/business-rules.md](../modules/auth-authorization/business-rules.md).

The log captures, per finding: original flag · was it accepted (doc updated) / rejected (with rationale) / converted to an open question.

## Methodology

Per TA §4 Stage 4a:

- **Author model:** Claude Opus (this sample).
- **Reviewer model:** to be a different model with comparable capability — GPT-5 or Gemini Pro 2.5 — invoked with a structured review prompt (below) that does **not** see the author's context, only the draft document and the checklist.

### Reviewer prompt template

```
You are reviewing a technical documentation artifact authored by another LLM.
Your job is independent critique. You have not seen the source material; you
only see the draft below.

Check the document against this checklist:

1. Fabrications — claims that look authoritative but aren't substantiated
   inside the document or in cited sources.
2. Unsupported claims — assertions that need a citation but don't have one.
3. Internal inconsistencies — places where two sections of the same document
   say incompatible things.
4. Assumptions that should have been flagged as open questions — places where
   the author wrote confidently about something that the document itself
   hints is uncertain.
5. Logical gaps in cross-references — links that point to sections that don't
   address the claim made.

For each finding, output:
- Document: <filename>
- Section: <section anchor>
- Finding: one-line summary
- Severity: blocker / major / minor
- Suggested action: accept (doc update) / reject (rationale) / open question

Do not propose stylistic changes or general rewrites. Stick to the five
checklist items.
```

## Scope

Three documents under review:

1. [`architecture/overview.md`](../architecture/overview.md) — 13 sections; two embedded `> [!note] Architectural assessment` callouts.
2. [`schema/tables/patient-profile.md`](../schema/tables/patient-profile.md) — ~40 columns documented; 8 explicit `VALIDATE:` rows; multiple `> [!warning]` callouts.
3. [`modules/auth-authorization/business-rules.md`](../modules/auth-authorization/business-rules.md) — 10 stable-ID rules; 3 `> [!warning]` callouts.

## Pass status

> [!warning]
> **Status: pending execution.** This file is the placeholder for the cross-LLM review log that will be authored when the sample is delivered to the client. In the demonstration sample, the review pass is the **next step** — the author (this sample's writer) has not yet routed the three documents through a second model.
>
> In a real engagement, this file is populated during the self-review phase before delivery. For the SourceWare sample, where the substrate is open-source ERPNext, the review can be re-run by any reader against the current docs.
>
> For Project H's anonymised substrate, the review can be re-run by Andersen against a different LLM (GPT-5 or Gemini Pro 2.5) by feeding the three documents into the reviewer prompt above.

## Findings (when executed)

The log shape, once the pass is run:

### Finding template

```
### Finding NNN — <one-line summary>

- **Document:** <path>
- **Section:** <anchor>
- **Reviewer model:** GPT-5 / Gemini Pro 2.5 / etc.
- **Original flag:** verbatim reviewer output.
- **Severity:** blocker / major / minor.
- **Author response:** accepted / rejected / converted to open question.
- **Resolution:**
  - If accepted: link to the commit / diff that addressed the finding.
  - If rejected: rationale (max 3 sentences).
  - If converted to open question: link to the `## Open questions` entry in the affected doc.
```

## Sample log entry (illustrative)

To make this file useful as a methodology demonstration even before the live pass, here is one **illustrative** entry showing what the format will look like. It is **not** a real finding from a real reviewer; it is what a typical finding looks like.

### Finding 001 — `> [!note] CDSS Class I boundary` lacks a concrete failure example

- **Document:** `architecture/overview.md`
- **Section:** `#architectural-assessments`
- **Reviewer model:** *(illustrative — would be GPT-5)*
- **Original flag:** *(illustrative)* "The architectural-assessment callout on the CDSS Class I boundary asserts that pushing structured treatment data via `MedicationRequest` or `CarePlan` resources would cross the Class II line. The assertion is plausible but not substantiated by a citation. Reader cannot verify the boundary without consulting the FDA classification rules independently. Suggested action: cite the relevant FDA CDSS guidance section, or convert the assertion into an open question."
- **Severity:** minor.
- **Author response:** convert to open question.
- **Resolution:** added to [`overview.md` Open questions](../architecture/overview.md#open-questions) as "Class I CDSS guardrail: what specific FHIR resource types are the failure modes? Owner: Compliance Engineer."

## Open questions

- **When is the live pass scheduled?** *Owner:* sample author / delivery lead. *Outcome:* schedule before client delivery.
- **Which reviewer model to use?** GPT-5 vs Gemini Pro 2.5 vs another Claude variant — each has different blind-spot profiles. *Owner:* delivery lead. *Outcome:* pick one with explicit rationale.
- **Should the pass be repeated periodically?** A real engagement might re-run cross-LLM review after each major doc update; for a static sample, once-before-delivery is enough. *Owner:* methodology lead. *Outcome:* document the cadence in any iteration brief.
