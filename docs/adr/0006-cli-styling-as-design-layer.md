# ADR-0006: CLI styling as a design layer

- **Status:** Superseded by [ADR-0010](0010-tmux-neovim-site-interface.md)
- **Date:** 2026-03-06
- **Related:** [Developer portfolio](../requirements/developer-portfolio.md)

## Context

The site should feel developer-native rather than like a generic portfolio template, without hurting readability or usability.

## Decision

We will treat terminal styling as accents on a conventional, accessible layout:

- monospace accents
- prompt-like eyebrows (`whoami`, `cat ./slug.md`)
- command and status motifs
- code-oriented framing

These sit on top of semantic HTML, accessible contrast and a responsive layout. Global tokens live in `src/app/globals.css`, and component styles use CSS Modules.

## Alternatives considered

- **Generic portfolio theme** — doesn't give the site a distinct identity.
- **Fully simulated terminal UI** — limits usability and how content can be presented.

## Consequences

- The theme stays readable on mobile and with assistive technology.
- New pages should reuse the existing motifs rather than invent new terminal effects.
