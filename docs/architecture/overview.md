# Architecture overview

The m0x6a site is a single Next.js 16 App Router application (React 19, TypeScript). It serves a CLI-styled portfolio and a Markdown blog loaded from a configurable Git source. It is deployed to Azure App Service as a standalone Node server.

## Components

```
src/
├── app/
│   ├── page.tsx               /             portfolio homepage
│   ├── blog/page.tsx          /blog         blog index      (revalidate 300s)
│   ├── blog/[slug]/page.tsx   /blog/:slug   blog post       (revalidate 300s)
│   ├── layout.tsx, globals.css               root layout + design tokens
│   └── not-found.tsx
├── components/
│   ├── site-shell.tsx         shared layout + navigation
│   ├── state-panel.tsx        empty / unavailable / not-found panels
│   └── blog-markdown.tsx      react-markdown + remark-gfm renderer
├── content/portfolio.ts       typed portfolio content
└── lib/blog/
    ├── source.ts              env → BlogSourceConfig
    ├── adapter.ts             BlogSourceAdapter interface
    ├── local-adapter.ts       filesystem provider
    ├── github-adapter.ts      GitHub contents API provider
    ├── posts.ts               load, normalize, sort, dedupe, map to result states
    ├── errors.ts              BlogSourceUnavailableError
    └── types.ts               config, post and result types
```

## Blog data flow

```
page.tsx ──► getBlogIndex() / getBlogPost(slug)        (posts.ts, React cache per request)
               │
               ├─ getBlogSourceConfig()                (source.ts, env vars)
               ├─ createBlogSourceAdapter()            local | github
               ├─ listMarkdownFiles() + readFile()
               ├─ normalizeBlogPost()                  gray-matter, contract validation
               └─ sort desc by publishedAt, dedupe slugs
                     │
                     ▼
        ready | empty | unavailable | not_found  ──►  page renders content or StatePanel
```

See [ADR-0004](../adr/0004-server-side-blog-source-adapter.md) and [ADR-0007](../adr/0007-isolate-blog-failures.md).

## Configuration

| Variable | Default | Purpose |
| --- | --- | --- |
| `BLOG_SOURCE_PROVIDER` | `local` | `local` or `github` |
| `BLOG_SOURCE_PATH` | `content/blog` | Content directory (relative to the repo root or the GitHub repo) |
| `BLOG_SOURCE_OWNER` / `BLOG_SOURCE_REPO` | — | Required for `github` |
| `BLOG_SOURCE_BRANCH` | `main` | GitHub ref |
| `BLOG_SOURCE_TOKEN` | — | Optional, for private repositories |

`.env.example` documents these for local development.

## Deployment

See [ADR-0008](../adr/0008-azure-app-service-hosting.md). In short:

- `infra/azure/main.bicep` provisions the App Service.
- `.github/workflows/deploy-azure-webapp.yml` runs lint, test, build, `package:azure` and zip deploy on pushes to `main`.

A move to Static Web Apps plus a managed blog Function is proposed in [ADR-0009](../adr/0009-split-hosting-static-web-apps-and-blog-function.md).

## Testing

`npm run test` runs `tests/*.test.ts` with Node's test runner through `tsx`. It covers blog loading, front matter normalization and the result states.
