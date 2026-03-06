## Context

This change introduces the first defined product surface for m0x6a: a personal portfolio and a lightweight blog. The portfolio must feel like it belongs to a developer, with CLI-inspired styling cues, while the blog must stay simple to publish by sourcing Markdown files from a Git repository instead of a CMS.

There are no existing capabilities to extend, so this design defines the initial information architecture, content model, and content-loading approach. The main constraint is to keep the experience distinctive without making the interface feel gimmicky or fragile when the external blog content source is empty or unavailable.

## Goals / Non-Goals

**Goals:**
- Define a unified site structure that supports a portfolio homepage, blog index, and blog post pages.
- Preserve a clear developer identity through terminal and CLI-inspired presentation patterns.
- Keep the blog publishing flow content-driven by loading Markdown from a configured Git repository.
- Isolate blog content loading so failures do not break the rest of the portfolio experience.

**Non-Goals:**
- Building a CMS, admin dashboard, or authoring UI.
- Supporting comments, reactions, or advanced community features in the initial release.
- Supporting arbitrary MDX components or highly customized embedded content.
- Recreating a full terminal emulator experience in the UI.

## Decisions

### Use a single site shell with dedicated portfolio and blog routes
The site will use one application shell with a portfolio homepage at the root, a blog index route, and individual blog post routes. This keeps the personal brand consistent and makes the blog feel like part of the same experience instead of a disconnected property.

Alternatives considered:
- Separate portfolio and blog applications, which would increase maintenance and weaken the unified identity.
- A single long-scrolling page with embedded posts, which would make reading and linking to articles harder.

### Treat portfolio content and blog content as separate content domains
Portfolio content will be modeled as structured site content owned by the application, while blog posts will come from an external Git-backed Markdown source. This keeps stable profile information easy to control while preserving the lightweight publication workflow for articles.

Alternatives considered:
- Storing all content in Markdown, which would add unnecessary overhead for stable profile sections.
- Storing blog content inside the application repository, which would reduce flexibility for a separate content workflow.

### Use a server-side Git content adapter for blog loading
The blog will use a repository adapter configured with repository location details such as provider, owner, repo, branch, and content path. The adapter will list Markdown files, fetch their contents, parse metadata, and expose a normalized post model to the UI. Content loading should happen outside the client so repository credentials, rate limits, and content normalization remain controlled in one place.

Alternatives considered:
- Client-side fetching from Git endpoints, which would expose implementation details and make failure handling less reliable.
- A Git submodule or local checkout workflow, which would tightly couple deployment to repository synchronization mechanics.
- A headless CMS, which conflicts with the goal of keeping publishing simple and Git-native.

### Require a small, explicit blog content contract
Each blog post will be represented by a Markdown file with required metadata for title, publication date, and summary, with a stable slug derived from metadata or filename. Rendering will support standard article structures such as headings, paragraphs, lists, links, and fenced code blocks, but it will avoid MDX-style executable components.

Alternatives considered:
- Free-form Markdown with inferred metadata, which would make indexing and ordering brittle.
- MDX support, which would add complexity beyond the requested simple blog.

### Make CLI styling a design system layer, not a novelty effect
The UI will use monospace accents, prompt-like section treatments, command/status motifs, and code-oriented visual framing while maintaining accessible contrast, semantic HTML structure, and responsive layout behavior. The interface should feel developer-native without sacrificing readability or navigation clarity.

Alternatives considered:
- A generic portfolio theme, which would not satisfy the requested identity.
- A heavily simulated terminal-only interface, which would restrict usability and content presentation.

### Isolate blog failures from the rest of the site
If the blog repository is empty, unavailable, or missing a requested post, the blog surface will present explicit empty or unavailable states while keeping the broader site navigable. The portfolio homepage and core navigation must remain functional even when the content source has issues.

Alternatives considered:
- Failing the entire page load when the blog source is unavailable, which would make the site unnecessarily fragile.

## Risks / Trade-offs

- [Remote content availability] -> Mitigation: cache normalized blog data where supported and show explicit unavailable states when the repository cannot be read.
- [Metadata inconsistency across Markdown files] -> Mitigation: enforce a small required front matter contract and ignore or flag invalid entries during content loading.
- [CLI theme hurting readability] -> Mitigation: keep terminal styling as accents layered onto a conventional accessible layout and typography system.
- [Future expansion pressure] -> Mitigation: keep the content adapter and route structure modular so RSS, tags, or additional views can be added later without rewriting the core model.

## Migration Plan

1. Implement the base site shell and portfolio homepage structure.
2. Add the blog routes and the Git-backed content adapter with the required metadata contract.
3. Seed the site with portfolio content and at least one valid Markdown post source.
4. Configure deployment for the chosen repository source, including credentials only if a private repository is used.
5. If rollback is needed, disable the blog adapter and routes while leaving the portfolio experience intact.

## Open Questions

- Which repository, branch, and directory should be treated as the initial blog source?
- Will the blog source be public, or will deployment require authenticated repository access?
- What exact portfolio sections and outbound profile links should be present in the first release?
