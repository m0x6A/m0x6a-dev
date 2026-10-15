# ADR-0009: Split hosting: Static Web Apps frontend + managed blog Function

- **Status:** Rejected in favour of [ADR-0010](0010-static-export-on-github-pages.md)
- **Date:** 2026-03-06
- **Related:** would supersede [ADR-0008](0008-azure-app-service-hosting.md) and amend [ADR-0004](0004-server-side-blog-source-adapter.md); must preserve [ADR-0007](0007-isolate-blog-failures.md)

## Context

App Service was chosen only because the blog loader needs a server runtime (ADR-0008). Most of the site is a static portfolio and blog reader, but the whole site is tied to a Node web host. Splitting responsibilities could:

- reduce the operational surface,
- keep secrets off the frontend host,
- match hosting to what each part actually does.

## Decision

We would:

1. **Host the frontend on Azure Static Web Apps.** The frontend keeps routing, metadata, Markdown rendering and user-facing states. It no longer contains provider-specific blog adapters.
2. **Add a managed Azure Function blog API.** The Function owns source configuration, GitHub access, front matter normalization and failure mapping. It exposes:
   - `GET /api/blog`: the normalized index, with `ready` / `empty` / `unavailable`
   - `GET /api/blog/{slug}`: the full post, with `ready` / `not_found` / `unavailable`
3. **Keep the normalized contract.** Responses use the current fields: `slug`, `title`, `summary`, `publishedAt`, `publishedLabel`, `route`, plus `content` for posts. A thin frontend API client returns the same result unions the UI uses today.
4. **Make failure states part of the API contract.** HTTP status codes and bodies map one-to-one to the states in ADR-0007.
5. **Keep secrets only in the backend.** `BLOG_SOURCE_TOKEN` and provider settings live in the Function configuration.

Goals don't include a UI redesign, a CMS, tags, search, comments, or writes from the frontend to the blog source.

## Alternatives considered

- **Keep App Service** — works, but doesn't achieve the hosting split.
- **Another static host** — moves away from the established Azure direction.
- **Call GitHub directly from the frontend** — exposes credentials and implementation details.
- **Prebuild all blog pages in CI** — simpler at runtime, but publishing a post would need a rebuild, and there'd be no managed API.
- **Return raw Markdown and parse on the frontend** — duplicates logic and weakens who owns the contract.
- **Render blog pages in the backend** — blurs the separation of responsibilities.

## Consequences

- Two deployables (frontend and Function) instead of one. Mitigation: a single repository workflow with separate frontend and backend stages and shared environment naming.
- **Risk:** Next.js 16 support on Static Web Apps (App Router, `generateMetadata`, revalidation) must be verified before starting.
- **Risk:** behaviour may drift between the current loader and the API. Mitigation: extract the shared normalization module, or port it with contract tests.
- **Risk:** cold starts and latency. Mitigation: keep the Function narrow, add light caching, and rely on the frontend's `unavailable` state.
- Local development needs both processes running, plus a configured API base URL.

## Open questions

- Should the Function live in this repository or in a sibling project with its own runtime and tests?
- Static Web Apps integrated API, or an independently deployed Function App addressed through a configured base URL?
- Is the `local` filesystem provider still needed outside development, or can hosted environments standardize on GitHub?
- What caching and revalidation policy should the API expose without overloading GitHub?

## Implementation plan

**1. Hosting strategy validation**
- [ ] Confirm the SWA deployment approach supports the current Next.js version, routes and metadata behaviour
- [ ] Decide between SWA integrated APIs and a separate Function App
- [ ] Define the runtime configuration: frontend API base URL and backend source credentials

**2. Managed blog backend**
- [ ] Create the Function project structure and deployment target
- [ ] Port or extract the source adapters, normalization and error mapping
- [ ] Implement `GET /api/blog` with `empty` / `unavailable` states
- [ ] Implement `GET /api/blog/{slug}` with `not_found` / `unavailable` states
- [ ] Add backend tests: GitHub loading, metadata validation, empty source, unavailable source, missing slug

**3. Frontend integration**
- [ ] Replace direct adapter usage with an API client for the backend contract
- [ ] Preserve index rendering, post rendering and `generateMetadata`
- [ ] Preserve the empty, unavailable and not-found states without exposing backend details
- [ ] Update local development so the frontend and backend run together

**4. Azure infrastructure and deployment**
- [ ] Replace or supplement the App Service Bicep with Static Web Apps and Function resources
- [ ] Replace the App Service workflow with frontend and backend deploy steps
- [ ] Keep GitHub tokens and provider credentials only in the backend environment
- [ ] Validate the custom domain, HTTPS and environment wiring

**5. Validation and cutover**
- [ ] Verify the frontend renders the same content and states as the current implementation
- [ ] Verify backend responses, caching and failure handling against live or mocked sources
- [ ] Compare with the App Service behaviour and document intentional differences
- [ ] Retire the App Service packaging and deployment path. Mark ADR-0008 superseded and this ADR accepted.
