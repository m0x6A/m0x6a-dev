# ADR-0008: Host on Azure App Service as a standalone Next.js server

- **Status:** Superseded by [ADR-0010](0010-static-export-on-github-pages.md)
- **Date:** 2026-03-06
- **Related:** [ADR-0004](0004-server-side-blog-source-adapter.md), [ADR-0009](0009-split-hosting-static-web-apps-and-blog-function.md) (proposed replacement)

## Context

Blog content is resolved on the server at request time, sometimes with a GitHub token (ADR-0004). The site therefore needs a Node runtime. The deployment direction is Azure.

## Decision

We will deploy to Azure App Service (Linux) as a Next.js standalone server:

- `next.config.ts` sets `output: "standalone"`.
- `scripts/package-azure-webapp.mjs` stages the standalone bundle for zip deployment.
- `infra/azure/main.bicep` provisions the App Service plan, web app, site config and app settings.
- `.github/workflows/deploy-azure-webapp.yml` runs lint, test, build, package, infra reconcile and zip deploy on pushes to `main`. It authenticates to Azure with OIDC.
- Blog source settings are App Service app settings. `BLOG_SOURCE_TOKEN` is a GitHub environment secret.

## Alternatives considered

- **Static export** — not compatible with resolving blog content at runtime.

## Consequences

- One deployable unit, one runtime, simple local parity (`npm run start`).
- The whole site depends on a long-running Node host, even though most of it is static. [ADR-0009](0009-split-hosting-static-web-apps-and-blog-function.md) proposes addressing this.
