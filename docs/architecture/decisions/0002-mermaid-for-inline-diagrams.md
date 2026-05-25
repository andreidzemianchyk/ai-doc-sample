# ADR-0002 — Mermaid for inline diagrams

## Status

**Accepted** (forward — methodology decision made while authoring this sample).

This ADR is the worked example of TA §2's *forward* MADR use — it captures a decision the team makes during the engagement itself, alongside the *retrospective* ADRs that capture decisions recovered from discovery (e.g., [ADR-0001](0001-mychart-as-per-clinic-sso.md)). Both modes are demonstrated so the sample shows both halves of TA §2's MADR discipline.

## Context

*SourceWare Technical Approach* §2 names Mermaid as the preferred default for C4 + UML diagrams "where the team's rendering toolchain handles it cleanly". TA §7 makes this a per-diagram-type table: Mermaid by default for C4 L1 / L2 / L3, sequence, state, activity, flowchart; PlantUML for complex sequences and state machines; drawio reserved for visual-match cases against existing artefacts.

For a sample whose purpose is to demonstrate the methodology end-to-end on a real substrate, the diagramming choice has consequences:

- The reader scans the sample in markdown form or in the rendered MkDocs Material site. Diagrams that require an external rendering step (PNG export from drawio, server-side render of PlantUML) create friction.
- Diagrams that are committed as source (Mermaid in markdown fences) are editable by agents — Claude Code, Cursor, Copilot can read, modify, and re-render them without an export tooling step.
- Some flows are complex enough that Mermaid's flowchart limit is reached (the 22-step patient onboarding flow is the example in this sample — see [patient-onboarding.md](../data-flows/patient-onboarding.md)).

The decision must pick one default for the sample, with explicit escalation rules to the alternatives.

## Decision

All diagrams embedded in the Project H sample are authored in **Mermaid**:

- **C4 L1 System Context** — Mermaid `flowchart` styled as C4 (using `classDef` for person / system / external). MkDocs Material's `C4Context` plugin works for many viewers; the styled-flowchart variant renders everywhere and is what this sample uses.
- **C4 L2 Container** — same approach: Mermaid `flowchart` with C4-style classDefs and subgraphs for system boundary + data layer.
- **C4 L3 Component** — Mermaid `flowchart` with subgraphs per decomposed container. Two L3 views in this sample (Patient Mobile App Backend and Authorization Service).
- **UML Sequence** — Mermaid `sequenceDiagram`. Used for the [report-to-clinician flow](../data-flows/report-to-clinician.md).
- **UML State** — Mermaid `stateDiagram-v2`. Used for [session lifecycle](../../modules/auth-authorization/overview.md).
- **UML Activity / flowchart** — Mermaid `flowchart`. Used for [patient onboarding](../data-flows/patient-onboarding.md).

**Source-substrate draw.io PNGs are referenced** (in the `context/project-h/` bundle via direct download URLs into the source wiki) but **not embedded** in the sample. Instead, faithful Mermaid reconstructions from `context/project-h/project-h-diagrams-mermaid.md` are pasted into the sample documents.

## Alternatives considered

- **PlantUML** for everything. Pros: more expressive for complex sequences, native swimlane support, deeper UML coverage. Cons: requires a build step (`.puml` source files + PNG/SVG generation in CI); not natively editable by agents in markdown context; readers without PlantUML rendering see source-form text. *Rejected* as the default; kept as the **escalation target** for complex sequences and nested state machines (per TA §7 decision rule).
- **drawio** for the C4 views. Pros: matches the source substrate's AVD-style artefacts; existing diagrams could be embedded directly via `.drawio` source + PNG exports. Cons: binary in repo, heavier maintenance, agents cannot edit, methodology-demo signal is wrong (the sample is supposed to show that markdown-first works). *Rejected* as the default; the source-substrate draw.io diagrams remain in the context bundle but are not embedded.
- **tldraw / Excalidraw** (hand-drawn aesthetics). Pros: visually friendly for casual reading. Cons: methodology direction is different (these tools are not in TA §7's decision rule); rejecting them is consistent with "we use established frameworks, not invented ones". *Rejected* — out of scope.

## Consequences

### Positive

- **Every diagram is editable by an agent in markdown.** No build step. No binary blobs. Claude Code, Cursor, Copilot can read, modify, regenerate diagrams without external tooling.
- **Single render path.** MkDocs Material has Mermaid rendering wired in via `pymdownx.superfences`; GitHub renders Mermaid in markdown previews; VS Code's markdown preview renders Mermaid via extension. The sample looks the same on every reader's screen.
- **The convention is uniformly testable.** The AI-readability task battery (process artefact, kept outside the published site) includes "modify this diagram to add a new state" as one of its tasks — an agent can do this in seconds in Mermaid, whereas in drawio it would require opening an external editor.

### Negative

- **A few complex sequences push Mermaid's flowchart readability limit.** The 22-step patient onboarding flow is the prominent example — its diagram has 14 decision diamonds and is dense in any rendering. Flagged in [patient-onboarding.md](../data-flows/patient-onboarding.md) as `> [!warning]` Diagram complexity. In a real engagement, this is the trigger to escalate to PlantUML for that specific flow (per TA §7 decision rule).
- **Some Mermaid features are renderer-specific.** `C4Context` / `C4Container` / `C4Component` syntax has uneven support across renderers; this sample uses the more-portable styled-flowchart approach for C4. If a future MkDocs Material version supports the native C4 macros cleanly, the sample can be upgraded.

### Open

- **C4 L3 rendering in MkDocs Material.** Verified in this sample to render acceptably as styled flowcharts. If a future release supports the native `C4Component` macro better, switch and re-test.
- **PlantUML escalation for the onboarding flow.** If the diagram-complexity callout in [patient-onboarding.md](../data-flows/patient-onboarding.md) survives a future iteration without being simplified, escalate per TA §7 rule. *Open* — revisit in the next iteration.

## Notes

- **Provenance.** Decision made during sample authoring, ratified against TA §2 + §7 rules. No prior precedent in the substrate; this is a sample-scope decision.
- **In a real engagement.** Week-1 toolchain verification (TA §8 must-have deliverable) re-confirms Mermaid rendering against the actual MkDocs Material + GitHub setup before locking the convention.
- **Cross-references.** [CONVENTIONS.md §5 Diagram-tool decision rule](../../CONVENTIONS.md) replicates the TA §7 table that this ADR ratifies; [overview.md](../overview.md) Component view section is the most demanding test case (C4 L3 in Mermaid) — passing there is the empirical confirmation this decision works.
