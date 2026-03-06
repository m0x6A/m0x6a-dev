## Why

Mattias Jonsson (m0x6a) needs a personal site that feels like a developer's home on the web instead of a generic portfolio template. A CLI-inspired portfolio with a lightweight Git-backed blog keeps the brand distinct while making publishing simple through Markdown in a repository.

## What Changes

- Add a personal portfolio page for m0x6a with sections for introduction, background, skills, selected work, and contact links.
- Add a developer-focused visual style with terminal and CLI-inspired UI details while keeping the experience readable and responsive.
- Add a simple blog that lists posts and renders individual articles from Markdown files stored in a Git repository.
- Define how blog post metadata is discovered, how Markdown is rendered, and what loading, empty, and failure states the blog must show.
- Structure the site so future blog posts can be published by updating Markdown content in Git without requiring a CMS workflow.

## Capabilities

### New Capabilities
- `developer-portfolio`: Present m0x6a's profile, work, and contact details through a developer-branded portfolio experience.
- `git-backed-blog`: Discover, list, and render blog posts from Markdown content stored in a Git repository.

### Modified Capabilities
- None.

## Impact

- Frontend application routes, layout, components, and styling for the portfolio and blog experience.
- Content loading and Markdown rendering logic for blog posts sourced from Git-managed files.
- Configuration for blog content source location, metadata parsing, and user-visible error handling.
