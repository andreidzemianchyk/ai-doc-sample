# Project H — AGENTS.md

Canonical cross-tool AI-agent contract for this repository. [CLAUDE.md](CLAUDE.md) @-imports this file; agents that follow the AGENTS.md convention (Cursor, Copilot, Codex CLI, OpenHands, others) read this file directly.

## Rationale for canonical-in-AGENTS.md

Per TA §6, "CLAUDE.md can reference AGENTS.md via @import to avoid duplication, OR mirror its content; the choice depends on how the team's tools resolve includes; locked in week 1." This sample picks **@import** for two reasons:

1. **Proves the convention to a scanning reader.** Anyone opening CLAUDE.md sees `@import AGENTS.md` at the top and immediately understands AGENTS.md is the single source of truth. No silent drift between two parallel files.
2. **Easier to extend the AI-readability test.** When non-Claude agents are introduced (Cursor / Copilot / Codex CLI), they read AGENTS.md directly without needing to know CLAUDE.md exists. The test surface stays one file, not two.

In a real engagement this is revisited in week 1 against the actual agent set in use.

## Agents this contract applies to

- **Claude Code** (Anthropic) — primary author and reviewer in this sample.
- **Cursor** (Anysphere) — supported via AGENTS.md.
- **GitHub Copilot CLI / Copilot in IDE** — supported via AGENTS.md.
- **Codex CLI** (OpenAI) — supported via AGENTS.md.
- **OpenHands / other AGENTS.md-aware agents** — supported.

## What this system is

(Same content as in [CLAUDE.md](CLAUDE.md); kept short here, referenced from there.)

Project H is a precision-psychiatry SaaS platform — Patient Mobile App + Clinic Web App (with EPIC plugin) + clinician report assembled into EPIC via FHIR. AWS HIPAA-eligible infrastructure. Class I CDSS. Discovery-phase substrate, no committed code yet — citations point to Confluence page IDs and user-story IDs.

## Read these before doing anything substantive

- [Architecture overview](architecture/overview.md)
- [CONVENTIONS.md](CONVENTIONS.md)
- [GLOSSARY.md](GLOSSARY.md)

## Task routing

See the same table in [CLAUDE.md](CLAUDE.md) — it is the single canonical version. The routing is by file path, not by agent identity.

## Known gotchas

See [CLAUDE.md](CLAUDE.md) — same list applies to every agent.

## Acceptance test

This file's correctness is validated against a scripted task battery (e.g., "add a column to `patient_profile`", "explain the EPIC vs non-EPIC auth fork") that grades whether each supported agent routes to the correct files and quotes the right US IDs / D-codes / BR-IDs. The battery itself is a process artefact and is not part of the published site.

Drift between AGENTS.md and CLAUDE.md is a defect. If you are an agent and discover an inconsistency, surface it as an open question in this file (or in the corresponding CLAUDE.md section) before silently picking one.
