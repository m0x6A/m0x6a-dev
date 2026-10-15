# ADR-0001: Record architecture decisions

- **Status:** Accepted
- **Date:** 2026-10-15

## Context

The project was originally planned with OpenSpec. Each change produced a proposal, a design, spec deltas and a task list under `openspec/changes/`, driven by tool-specific slash commands and skills (`/opsx:*`). That workflow tied the project's documentation to one tool and one way of working. It also spread long-lived decisions across per-change folders, so the reasoning behind the current system was hard to find once a change was done.

## Decision

We will document the project with plain Markdown in `docs/`:

- **ADRs** (`docs/adr/`) record each significant decision, using the template and process in [`docs/adr/README.md`](README.md).
- **Requirements** (`docs/requirements/`) describe the expected behaviour of each capability.
- **Architecture** (`docs/architecture/`) describes how the system is built today.

The existing OpenSpec material has been migrated:

| OpenSpec source | Migrated to |
| --- | --- |
| `create-m0x6a-portfolio-blog/design.md` decisions | ADR-0002 to ADR-0007 |
| `create-m0x6a-portfolio-blog/specs/*` | `docs/requirements/*` |
| Azure App Service deployment (README, infra) | ADR-0008 |
| `split-static-webapp-blog-function-hosting/*` (not started) | ADR-0009 (Proposed) |

The OpenSpec directory, its slash commands and its agent skills have been removed.

## Alternatives considered

- **Keep OpenSpec** — rejected. It ties the docs to its tooling and buries decisions in per-change folders.
- **README only** — rejected. It is too flat to hold the reasoning behind decisions.

## Consequences

- Decisions can be found in one log and read without any tooling.
- Planning a change now means writing a `Proposed` ADR, and updating requirements and architecture docs when it lands. Nothing generates or archives these files automatically.
