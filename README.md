# m0x6a portfolio blog

CLI-inspired portfolio and Git-backed blog for Mattias Jonsson (`m0x6a`), built with Next.js App Router.

## Documentation

Architecture, requirements, and Architecture Decision Records (ADRs) live in [`docs/`](docs/README.md). Record significant decisions as a new ADR in [`docs/adr/`](docs/adr/README.md).

## Development

```bash
npm install
npm run dev
```

The site runs on `http://localhost:3000`.

## Blog source configuration

The application supports two source modes:

- `local` (default): reads Markdown posts from `content/blog`
- `github`: reads Markdown posts from a GitHub repository over the server-side API adapter

Create `.env.local` from `.env.example` if you want to override the defaults.

## Deployment

The site is a static export (`output: "export"`) published to GitHub Pages by `.github/workflows/deploy-github-pages.yml`:

- **Pull requests:** lint, test, and build.
- **Pushes to `main`:** also deploy to Pages.
- **Manual runs or a `blog-content-updated` repository dispatch:** rebuild and redeploy, e.g. after publishing a post in an external blog repo.

Blog posts are read at build time, so a new post goes live on the next deploy. When the blog lives in another repository, configure these under **Settings → Secrets and variables → Actions**:

- Variables: `BLOG_SOURCE_PROVIDER` (`local` or `github`), `BLOG_SOURCE_PATH`, `BLOG_SOURCE_OWNER`, `BLOG_SOURCE_REPO`, `BLOG_SOURCE_BRANCH`
- Secret: `BLOG_SOURCE_TOKEN` if the blog repo is private

To trigger a rebuild from the content repo:

```bash
gh api repos/m0x6A/m0x6a-dev/dispatches -f event_type=blog-content-updated
```

The Pages workflow sets `PAGES_BASE_PATH` (`/m0x6a-dev` for the project site, empty with a custom domain). To preview the export locally:

```bash
npm run build && npx serve out
```

See [ADR-0010](docs/adr/0010-static-export-on-github-pages.md) for the reasoning.

## Checks

```bash
npm run lint
npm run test
npm run build
```

## Content contract

Each blog post must be a Markdown file with front matter:

```md
---
title: "Post title"
publishedAt: "2026-03-06"
summary: "Short summary shown on the index page."
slug: "optional-custom-slug"
---
```

If `slug` is omitted, the route is derived from the filename.
