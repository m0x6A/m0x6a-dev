# ADR-0007: Isolate blog failures behind explicit states

- **Status:** Accepted
- **Date:** 2026-03-06
- **Related:** [Git-backed blog](../requirements/git-backed-blog.md)

## Context

The blog depends on an external content source that can be empty, misconfigured or unreachable. The portfolio must never break because of that.

## Decision

Blog loading returns tagged result unions instead of throwing (`src/lib/blog/types.ts`):

- Index: `ready` · `empty` · `unavailable`
- Post: `ready` · `not_found` · `unavailable`

Source failures are raised as `BlogSourceUnavailableError` and mapped to `unavailable`. Any other error is rethrown. Pages render each state explicitly (`src/components/state-panel.tsx`). `not_found` triggers the route's `not-found.tsx`. All states keep the site shell and navigation.

## Alternatives considered

- **Fail the whole page load when the source is unavailable** — makes the site fragile for no good reason.
- **Treat an empty source as an error** — "no posts yet" is a valid state.

## Consequences

- The homepage never depends on the blog source.
- Any future transport, such as the API in ADR-0009, must preserve these states in its contract.
