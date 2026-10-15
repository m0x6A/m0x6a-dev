# ADR-0010: Static export hosted on GitHub Pages

- **Status:** Accepted
- **Date:** 2026-10-15
- **Related:** supersedes [ADR-0008](0008-azure-app-service-hosting.md); rejects [ADR-0009](0009-split-hosting-static-web-apps-and-blog-function.md); amends [ADR-0004](0004-server-side-blog-source-adapter.md); preserves [ADR-0007](0007-isolate-blog-failures.md)

## Context

The Azure App Service pipeline (ADR-0008) never deployed successfully: the Azure OIDC secrets were never configured, so the site has never been live. ADR-0009 proposed an even larger Azure setup (Static Web Apps plus a Function) to address the cost of running a Node host.

The site is a portfolio plus a blog that changes a few times a month. Nothing in it needs request-time rendering. The only runtime dependency was the 300-second revalidation of blog content. The repository is public, so GitHub Pages is free and needs no cloud credentials.

## Decision

We will build the site as a Next.js static export and publish it to GitHub Pages:

- `next.config.ts` uses `output: "export"`, `trailingSlash: true` and unoptimized images.
- `basePath` comes from `PAGES_BASE_PATH`, which the workflow takes from `actions/configure-pages`. It is `/m0x6a-dev` for the project site, or empty with a custom domain.
- Blog content is loaded **at build time** through the existing adapters (ADR-0004). `/blog/[slug]` uses `generateStaticParams` with `dynamicParams = false`. Route-level `revalidate` is removed.
- `.github/workflows/deploy-github-pages.yml` runs lint, test, build and deploy. It triggers on pushes to `main`, manual dispatch, and a `blog-content-updated` repository dispatch, so an external content repo can request a rebuild after publishing. Pull requests run validation only.
- The Azure workflow, Bicep templates and App Service packaging script are removed.

## Alternatives considered

- **Fix the Azure App Service deployment (ADR-0008)** — pays for a server the site doesn't need, and requires Azure credentials and infrastructure upkeep.
- **Static Web Apps + Azure Function (ADR-0009)** — even more moving parts for the same content.
- **Vercel / Netlify** — would keep ISR, but adds a third-party account. GitHub is already where the code and content live.

## Consequences

- Hosting is free and needs no secrets beyond an optional blog-source token, which is used only in CI.
- New posts appear only after a rebuild. With the `local` provider that's automatic on push. With the `github` provider, the content repo must send the `blog-content-updated` dispatch or someone must run the workflow manually.
- ADR-0007 states are now decided at build time. If the source is unavailable during a build, the deployed `/blog` page shows the unavailable state until the next successful build.
- `output: "export"` rejects an empty `generateStaticParams` result, so when there are no posts a placeholder `/blog/_/` route renders not-found.
- Unknown post slugs are served by the exported `404.html`, not the route-specific `blog/[slug]/not-found.tsx`.
- Root-relative links inside Markdown posts are rendered through `next/link` so they pick up the base path.
- The old Azure resources, if any were ever created by hand, are no longer managed by this repository.
