# AGENTS.md

The canonical AI-agent contract for this repository is **[CLAUDE.md](CLAUDE.md)** — single source of truth for system overview, required-reading list, task routing, known gotchas, and conventions.

This file exists as a **filename alias** because some agent runtimes (Cursor, GitHub Copilot, Codex CLI, OpenHands, and other AGENTS.md-aware tools) discover their entry point by the name `AGENTS.md` rather than `CLAUDE.md`. The content reachable from either filename is identical by design.

→ **[Read CLAUDE.md](CLAUDE.md)** for everything substantive: what the system is, what to read first, task routing, known gotchas, conventions you must follow.

## Why one canonical file, not two

Maintaining two parallel files inevitably drifts. Keeping one canonical file (`CLAUDE.md`) and one thin pointer (`AGENTS.md`) means:

- A reader scanning either filename lands on the same content set.
- There is exactly one routing table, one gotchas list, one conventions section to keep accurate.
- Agent-readability checks need to verify only one body of content.

The `single canonical file + filename alias` shape is the lightest-friction default that fits both `CLAUDE.md`-aware and `AGENTS.md`-aware tools without duplication. If the team's agent set changes, the alias direction is revisited then.

## Agents this contract applies to

- **Claude Code** (Anthropic) — primary author and reviewer. Reads `CLAUDE.md`.
- **Cursor** (Anysphere) — supported. Reads `AGENTS.md` (this file), follows the pointer.
- **GitHub Copilot CLI / Copilot in IDE** — supported via `AGENTS.md`.
- **Codex CLI** (OpenAI) — supported via `AGENTS.md`.
- **OpenHands** and other `AGENTS.md`-aware agents — supported.

The routing is by file path, not by agent identity. Every supported agent ends up reading the same content; only the entry filename differs.
