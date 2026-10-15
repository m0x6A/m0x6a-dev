# Requirements: Git-backed blog

Discover, list and render blog posts from Markdown content stored in a Git repository.

- **Implementation:** `src/lib/blog/`, `src/app/blog/`, `src/components/blog-markdown.tsx`, `tests/blog.posts.test.ts`
- **Decisions:** [ADR-0004](../adr/0004-server-side-blog-source-adapter.md), [ADR-0005](../adr/0005-markdown-front-matter-contract.md), [ADR-0007](../adr/0007-isolate-blog-failures.md)

## BLOG-1: Blog loads posts from a configured Git repository

The system SHALL load blog posts from Markdown files in a configured Git repository source. The configuration includes the repository location and a content directory contract.

**Scenario: Repository contains valid Markdown blog posts**
- **WHEN** the blog index is requested
- **THEN** the system retrieves Markdown files from the configured repository source
- **AND** the system treats only files that satisfy the [content contract](../adr/0005-markdown-front-matter-contract.md) as blog posts

## BLOG-2: Blog index presents post summaries in publication order

The system SHALL present a blog index that lists available posts from newest to oldest and shows each post's title, publication date, summary and route.

**Scenario: Multiple posts are available**
- **WHEN** the blog index is rendered
- **THEN** the posts are listed in descending publication date order
- **AND** each listed post displays its title, publication date, summary and a route to the full article

## BLOG-3: Blog post pages render Markdown article content

The system SHALL render individual blog post pages from Markdown content, including headings, paragraphs, lists, links and fenced code blocks.

**Scenario: Visitor opens a valid post**
- **WHEN** a visitor navigates to a valid blog post route
- **THEN** the system displays the post title and publication metadata
- **AND** the system renders the Markdown body as formatted article content

## BLOG-4: Blog surfaces empty and failure states

The system SHALL provide explicit empty-state and unavailable-state UI when no valid posts are available, when a requested post does not exist, or when the repository source cannot be read.

**Scenario: No valid posts are available**
- **WHEN** the blog index is requested and the repository contains no valid posts
- **THEN** the interface shows a clear empty-state message instead of an empty list

**Scenario: Requested post cannot be loaded**
- **WHEN** a visitor requests a post that does not exist or cannot be retrieved
- **THEN** the interface shows a clear not-found or unavailable message
- **AND** the rest of the site remains navigable
