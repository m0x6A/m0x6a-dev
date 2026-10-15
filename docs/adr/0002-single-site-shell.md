# ADR-0002: Single site shell with portfolio and blog routes

- **Status:** Accepted
- **Date:** 2026-03-06
- **Related:** [Developer portfolio](../requirements/developer-portfolio.md), [Git-backed blog](../requirements/git-backed-blog.md)

## Context

The site has two surfaces: a personal portfolio and a lightweight blog. Both should read as one developer identity, and individual articles must be linkable.

## Decision

We will use one Next.js App Router application with a shared shell (`src/components/site-shell.tsx`) and three routes:

- `/`: the portfolio homepage
- `/blog`: the blog index
- `/blog/[slug]`: individual posts

## Alternatives considered

- **Separate portfolio and blog applications** — more to maintain, and the shared identity gets weaker.
- **A single long-scrolling page with embedded posts** — harder to read and link to individual articles.

## Consequences

- Navigation, branding and styling are shared from one place.
- New views (RSS, tags) can be added as extra routes inside the same shell.
