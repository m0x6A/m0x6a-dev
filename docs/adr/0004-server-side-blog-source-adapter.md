# ADR-0004: Server-side blog source adapter

- **Status:** Accepted, amended by [ADR-0010](0010-static-export-on-github-pages.md) (content is resolved at build time)
- **Date:** 2026-03-06
- **Related:** [Git-backed blog](../requirements/git-backed-blog.md), [ADR-0009](0009-split-hosting-static-web-apps-and-blog-function.md) (proposes moving this behind an API)

## Context

Blog posts are Markdown files in a Git repository. Loading them involves repository location, optional credentials, API rate limits and content normalization. None of that should reach the browser.

## Decision

We will load blog content on the server through a small adapter interface (`src/lib/blog/adapter.ts`):

```ts
interface BlogSourceAdapter {
  listMarkdownFiles(): Promise<BlogSourceEntry[]>;
  readFile(filePath: string): Promise<string>;
}
```

- `BLOG_SOURCE_PROVIDER` selects the implementation (`src/lib/blog/source.ts`):
  - `local`: reads files from disk under `BLOG_SOURCE_PATH`.
  - `github`: reads through the GitHub contents API (`BLOG_SOURCE_OWNER`, `BLOG_SOURCE_REPO`, `BLOG_SOURCE_BRANCH`, optional `BLOG_SOURCE_TOKEN`).
- Normalization, ordering and status mapping live in `src/lib/blog/posts.ts`, independent of the provider.
- Responses are cached and revalidated every 300 seconds.

## Alternatives considered

- **Client-side fetching from Git endpoints** — exposes implementation details and credentials, and makes failures harder to handle.
- **Git submodule or local checkout synced at deploy time** — ties deployment to repository sync.
- **Headless CMS** — conflicts with the goal of simple, Git-native publishing.

## Consequences

- Repository tokens stay server-side.
- Adding a provider means adding one adapter class.
- The application needs a server runtime to resolve content per request. That drives the hosting choice in [ADR-0008](0008-azure-app-service-hosting.md).
