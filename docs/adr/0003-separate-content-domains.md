# ADR-0003: Separate portfolio and blog content domains

- **Status:** Accepted
- **Date:** 2026-03-06
- **Related:** [ADR-0004](0004-server-side-blog-source-adapter.md), [ADR-0005](0005-markdown-front-matter-contract.md)

## Context

Profile information (identity, skills, selected work, contact) changes rarely and has a fixed structure. Blog posts are added often and should be publishable by committing Markdown.

## Decision

We will model the two kinds of content separately:

- **Portfolio content** is structured, typed data owned by the application (`src/content/portfolio.ts`).
- **Blog content** is Markdown files read from a configurable source through the blog adapter (see ADR-0004).

## Alternatives considered

- **Everything in Markdown** — adds parsing overhead and loses typing for profile sections that rarely change.
- **Blog content only inside the application repository** — less flexible for a separate content workflow. The `local` provider still reads `content/blog/` in this repo and is the default, but the `github` provider lets posts live in a separate repository.

## Consequences

- Profile edits are code changes, checked by TypeScript.
- Blog publishing doesn't need an application release when the `github` provider is used.
