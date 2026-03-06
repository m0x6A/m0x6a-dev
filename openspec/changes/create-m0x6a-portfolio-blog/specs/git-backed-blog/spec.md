## ADDED Requirements

### Requirement: Blog loads posts from a configured Git repository
The system SHALL load blog posts from Markdown files located in a configured Git repository source, including repository location settings and a content directory contract.

#### Scenario: Repository contains valid Markdown blog posts
- **WHEN** the blog index is requested
- **THEN** the system retrieves Markdown files from the configured repository source
- **AND** the system treats only files that satisfy the blog content contract as blog posts

### Requirement: Blog index presents post summaries in publication order
The system SHALL present a blog index that lists available posts from newest to oldest and shows each post's title, publication date, summary, and route.

#### Scenario: Multiple posts are available
- **WHEN** the blog index is rendered
- **THEN** the posts are listed in descending publication date order
- **AND** each listed post displays title, publication date, summary, and a route to the full article

### Requirement: Blog post pages render Markdown article content
The system SHALL render individual blog post pages from Markdown content, including standard article structures such as headings, paragraphs, lists, links, and fenced code blocks.

#### Scenario: Visitor opens a valid post
- **WHEN** a visitor navigates to a valid blog post route
- **THEN** the system displays the post title and publication metadata
- **AND** the system renders the Markdown body as formatted article content

### Requirement: Blog surfaces empty and failure states
The system SHALL provide explicit empty-state and unavailable-state UI when no valid posts are available, when a requested post does not exist, or when the repository source cannot be read.

#### Scenario: No valid posts are available
- **WHEN** the blog index is requested and the repository contains no valid posts
- **THEN** the interface shows a clear empty-state message instead of an empty list

#### Scenario: Requested post cannot be loaded
- **WHEN** a visitor requests a post that does not exist or cannot be retrieved
- **THEN** the interface shows a clear not-found or unavailable message
- **AND** the rest of the site remains navigable
