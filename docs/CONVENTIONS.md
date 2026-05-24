# Conventions

The doc-set's working agreement. Every author (human or agent) follows these conventions; every reviewer enforces them. Required by *SourceWare Technical Approach* §3 / §8 week-1 deliverable.

## 1. Document structure rules

Every major doc has, in this order:

1. **Title** — H1, the file name without the extension.
2. **One-paragraph framing** under the title — what the doc is about.
3. **Body sections** — H2 anchors, each addressed in the doc's own outline.
4. **At least one `> [!warning]` callout** where uncertainty is non-trivial (architecture overview, wide-table doc, business-rule catalog, data flows). Short reference docs may omit.
5. **`## Open questions`** at the bottom — never silently elide what is not yet pinned.

Cross-references use **relative markdown links** (`../decisions/0001-mychart-as-per-clinic-sso.md`). Every cited target must resolve to a real heading.

## 2. Annotation callouts

Four kinds. Each one has a specific lifecycle.

`> [!warning] …` — paragraph-level uncertainty visible in the rendered docs site. Use for "this is what we currently believe; here is the specific aspect that needs validation". Renders prominently in MkDocs Material.

```markdown
> [!warning]
> The retry limit on backup-code entry is "default 5 attempts" per US-1.4 Tasks, but
> the spec marks the value TBD. Workshop topic before the backup-code endpoint ships.
```

`<!-- VALIDATE: … -->` — line-level inline comment, invisible to humans, visible to agents and to anyone reading the source. Use for surgical "this exact word/number needs confirmation".

```markdown
The session locks after <!-- VALIDATE: threshold TBD per BR-010 --> minutes of inactivity.
```

`> [!note] Architectural assessment` — embedded architect-grade observation. Use for "while authoring this, we noticed a weak spot / design surface worth a refactor". Two such callouts are mandatory in the architecture overview (Prompt §3 item 7).

```markdown
> [!note] Architectural assessment
> Per-clinic EPIC integration cost: each new clinic onboarding is currently linear-cost
> because OAuth2 redirect URIs, App Orchard client IDs, FHIR endpoint bases are scattered
> across configuration. Proposed surface: extract a per-clinic config-store the
> Authorization Service and Patient Mobile App Backend both read from.
```

`> [!deprecated]` — content kept for traceability but no longer authoritative. Use sparingly — when a column / rule / decision is being phased out but cross-references still exist.

## 3. Open-questions sections

Mandatory at the bottom of every major doc unless the doc is trivially short (< 1 page reference material). Each entry:

- **Specific.** Not "needs more thought" — name the exact thing that needs answering.
- **Owned.** Where possible, name a person or role. "Owner: Architect" / "Owner: Compliance Engineer" / "Owner: Tech Lead".
- **Outcome-named.** What would resolve it? A workshop, a sandbox test, a regulatory query, a code spike.

3–5 entries is typical for the docs in this sample. An empty `## Open questions` section is a defect.

## 4. MADR ADR convention

Stored under `architecture/decisions/`. File pattern `NNNN-short-slug.md`. Required sections:

- **Status** — Accepted / Proposed / Superseded by NNNN / Deprecated. State retrospective or forward explicitly: "Accepted (retrospective — surfaced from discovery)" or "Accepted (forward — sample-authoring decision)".
- **Context** — the business or technical situation that created the decision.
- **Decision** — what is being decided. One sentence at the top; supporting detail follows.
- **Alternatives considered** — at least two, with rejection rationale.
- **Consequences** — *Positive*, *Negative*, *Open*. The Open subsection is what feeds future ADRs.
- **Notes** — provenance (which Confluence page, which workshop), cross-references to other ADRs and to the rule(s) downstream.

MADR is used in **two modes** per TA §2: *retrospective* (historical decision recovered from source) and *forward* (decision made during the engagement itself). This sample has [ADR-0001](architecture/decisions/0001-mychart-as-per-clinic-sso.md) (retrospective) and [ADR-0002](architecture/decisions/0002-mermaid-for-inline-diagrams.md) (forward).

## 5. Diagram-tool decision rule

Mermaid is the default for all inline diagrams (decided in [ADR-0002](architecture/decisions/0002-mermaid-for-inline-diagrams.md)). The full per-diagram-type rule from TA §7:

| Diagram type | Default | Escalate to |
| --- | --- | --- |
| C4 L1 System Context | Mermaid `C4Context` | drawio (visual match to existing artefact) |
| C4 L2 Container | Mermaid `C4Container` | drawio |
| C4 L3 Component | Mermaid `C4Component` | drawio for non-trivial layouts |
| UML Sequence | Mermaid `sequenceDiagram` | PlantUML for > 5 lifelines or complex async patterns |
| UML State | Mermaid `stateDiagram-v2` | PlantUML for nested / composite states |
| UML Activity | Mermaid `flowchart` | PlantUML for swimlanes |
| UML Use Case | PlantUML | — |

In this sample, every diagram is Mermaid. Source-substrate draw.io PNGs are referenced (in `context/project-h/project-h-diagrams-index.md`) but not embedded.

## 6. Validation flag triage

`VALIDATE:` flags have a lifecycle:

- **Created** when an author cannot resolve a fact from the corpus.
- **Resolved** when a workshop, a code reference, a sandbox test, or a regulatory check pins the answer. The flag is silently removed and the doc text updated.
- **Promoted to `## Open questions`** when the flag survives one validation cycle without being resolved — it is now a tracked workshop topic.
- **Closed** when the corresponding open-questions entry is resolved (same removal + update rule).

Unresolved flags older than two iterations are a smell — they usually mean the question is bigger than a workshop slot and needs a separate spike.

## 7. Reader mode by document

TA §2 distinguishes three reader modes; each doc declares its primary mode (in the first paragraph or implicitly via shape):

- **Reference** — look something up. Scan-friendly tables and lists. Examples in this sample: `schema/tables/patient-profile.md`, `architecture/integration-points.md`, [GLOSSARY](GLOSSARY.md), this file.
- **Explanation** — build a mental model. Narrative with diagrams. Examples: [architecture/overview.md](architecture/overview.md), [business-rules.md](modules/auth-authorization/business-rules.md), [variations.md](modules/auth-authorization/variations.md), [data-flows/](architecture/data-flows/patient-onboarding.md), ADRs.
- **Tutorial** — onboarding walkthrough, sequenced steps. Not in this sample — would be added in the integration-plan phase per TA §3 `process/` folder.

The mode dictates writing style: reference docs are scan-friendly; explanation docs are narrative + diagram; tutorial docs are step-by-step.

## 8. Tooling expectations

For this sample, **`mermaid-cli`** is used to render-check every diagram before delivery (self-review pass, see [_review/ai-readability-test.md](_review/ai-readability-test.md)).

In a real engagement, CONVENTIONS.md additionally calls out the CI tooling:

- **Vale** prose linter — terminology consistency + banned-phrase enforcement ("world-class", "best-in-class", "leveraging").
- **markdown-link-check** — cross-reference validation on every PR.
- **mermaid-cli** in CI — render-on-PR; broken diagrams fail the build.
- **Custom schema-sync check** — once a schema is committed, compares the documented column list per table against the live DDL and flags drift. For Project H the analog would be a check against the FHIR-resource declaration set once it is committed.

The sample names these as "future setup" but does not wire CI for the sample itself.

## Substrate-adaptation note

The substrate (Project H) has no committed code yet. Where the SourceWare engagement would cite `file_path:line` or stored-procedure names, this sample cites Confluence page IDs (e.g., "page 420911663") and user-story IDs (e.g., "Epic-1 Mobile US-1.5 Scenario 2"). Both are equally addressable, and both can be re-validated by the reader against the source corpus in `context/project-h/`.

## Open questions

- Whether per-folder rolled-up `open-questions.md` files (TA §3 pattern) add value beyond the per-doc `## Open questions` sections in a sample of this size. Owner: methodology lead. *Outcome:* decide in week 1 of the next engagement that uses this sample as input.
- Whether `> [!warning]` is the right MkDocs Material admonition for "validate" semantics, or whether a custom admonition type would render more clearly. Owner: site maintainer. *Outcome:* spike on a custom admonition; revisit during integration phase.
