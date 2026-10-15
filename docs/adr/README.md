# Architecture Decision Records

Each ADR captures one significant decision: its context, the choice made, the alternatives rejected and the consequences.

## Process

1. Copy [`0000-template.md`](0000-template.md) to `NNNN-short-kebab-title.md` using the next free number.
2. Start with status `Proposed`. Open questions and an implementation checklist may live in the ADR while it is proposed.
3. When the decision is made, set the status to `Accepted` and the date to the decision date.
4. To reverse or replace a decision, write a new ADR and set the old one to `Superseded by [ADR-NNNN](NNNN-....md)`. Don't edit the body of an accepted ADR.
5. Add the ADR to the log below.

Statuses: `Proposed` · `Accepted` · `Rejected` · `Deprecated` · `Superseded by ADR-NNNN`

## Log

| ADR | Title | Status |
| --- | --- | --- |
| [0001](0001-record-architecture-decisions.md) | Record architecture decisions | Accepted |
| [0002](0002-single-site-shell.md) | Single site shell with portfolio and blog routes | Accepted |
| [0003](0003-separate-content-domains.md) | Separate portfolio and blog content domains | Accepted |
| [0004](0004-server-side-blog-source-adapter.md) | Server-side blog source adapter | Accepted |
| [0005](0005-markdown-front-matter-contract.md) | Minimal Markdown front matter contract, no MDX | Accepted |
| [0006](0006-cli-styling-as-design-layer.md) | CLI styling as a design layer | Accepted |
| [0007](0007-isolate-blog-failures.md) | Isolate blog failures behind explicit states | Accepted |
| [0008](0008-azure-app-service-hosting.md) | Host on Azure App Service as a standalone Next.js server | Superseded by 0010 |
| [0009](0009-split-hosting-static-web-apps-and-blog-function.md) | Split hosting: Static Web Apps frontend + managed blog Function | Rejected |
| [0010](0010-static-export-on-github-pages.md) | Static export hosted on GitHub Pages | Accepted |
