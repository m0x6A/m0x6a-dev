# ADR-0013: Link previews and LinkedIn sharing for posts

- **Status:** Accepted
- **Date:** 2026-11-07
- **Related:** ADR-0005 (front matter), ADR-0010 (static export on GitHub Pages)

## Context

Posts get shared on LinkedIn. LinkedIn builds a link preview from a page's Open Graph tags,
and in the feed it shows the image and the title, rarely the description. Posts had only a
`<title>` and a meta description, so a shared link showed no image and no summary. Other
sites read these tags with absolute URLs, but the static export only knows its basePath, not
the address it is served from.

## Decision

We will:

- Give every post Open Graph and Twitter card tags built from the front matter that already
  exists: `title`, `summary` as the description, `publishedAt`, and a canonical URL.
- Render a preview card per post at build time, `/blog/<slug>/og.png` (1200 × 627), showing the
  title and the summary in the site's colours, so the summary is visible in the preview itself.
  It is a route handler with a `.png` path, because the static export writes `opengraph-image`
  files without an extension and GitHub Pages would serve them as a download.
- Take the site's public address from `SITE_URL`, which the Pages workflow sets from
  `actions/configure-pages`, and use it for every absolute URL (`src/lib/site.ts`).
- Put a `:share linkedin` link under each post that opens LinkedIn's share dialog for it.

No new front matter fields: the preview uses what every post already has.

## Alternatives considered

- **One shared image for the whole site** — simpler, but every preview looks the same and the
  summary is not visible on LinkedIn.
- **Next's `opengraph-image` file convention** — the exported file has no extension, which
  GitHub Pages serves as `application/octet-stream`; crawlers may not treat it as an image.
- **A per-post image field in front matter** — more work for every post; can be added later
  through a front matter ADR if a post needs its own picture.

## Consequences

- Builds render one PNG per post with `next/og`; no external service.
- Absolute URLs are only right when `SITE_URL` is set. Locally they point at
  `http://localhost:3000`, which is fine for development but not for sharing a local build.
- LinkedIn caches previews; after changing a post's title or summary, refresh the preview with
  LinkedIn's Post Inspector.
