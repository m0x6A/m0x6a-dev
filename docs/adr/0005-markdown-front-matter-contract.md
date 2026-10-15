# ADR-0005: Minimal Markdown front matter contract, no MDX

- **Status:** Accepted
- **Date:** 2026-03-06
- **Related:** [Git-backed blog](../requirements/git-backed-blog.md)

## Context

The blog index needs reliable titles, dates and summaries to list and order posts. Free-form Markdown makes that brittle. Rich embedded components add complexity the blog doesn't need.

## Decision

Each post is a Markdown file (`.md` or `.markdown`) with YAML front matter:

```md
---
title: "Post title"              # required
publishedAt: "2026-03-06"        # required, parseable date
summary: "Short index summary."  # required
slug: "optional-custom-slug"     # optional, falls back to the filename
---
```

- Slugs are lower-cased, and runs of non-alphanumeric characters become `-`.
- Files missing a required field are skipped silently. If two posts share a slug, the first one loaded wins.
- Bodies are rendered with `react-markdown` + `remark-gfm` (headings, lists, links, tables, fenced code). MDX and executable components aren't supported.

## Alternatives considered

- **Free-form Markdown with inferred metadata** — indexing and ordering become brittle.
- **MDX** — more complexity and attack surface than a simple blog needs.

## Consequences

- Publishing means committing a Markdown file. `content/blog-post-template.md` is the starting point.
- Invalid posts disappear quietly instead of breaking the build. Authors need to check that a new post appears.
