# Architecture overview

The m0x6a site is a single Next.js 16 App Router application (React 19, TypeScript). It serves a portfolio styled as tmux running Neovim and a Markdown blog loaded from a configurable Git source. It is built as a static export and hosted on GitHub Pages, so all content, including blog posts, is resolved at build time.

## Components

```
src/
├── app/
│   ├── page.tsx               /             portfolio homepage
│   ├── blog/page.tsx          /blog         blog index
│   ├── blog/[slug]/page.tsx   /blog/:slug   blog post       (generateStaticParams)
│   ├── layout.tsx, globals.css               root layout + design tokens
│   └── not-found.tsx
├── components/
│   ├── tmux-shell.tsx         shared tmux frame; status bar is the primary navigation
│   ├── nvim-pane.tsx          Neovim pane, zsh side pane, BufferNotice error/empty states
│   ├── vim-motions.tsx        client: j/k, gg/G, H/L and the scroll indicator
│   └── blog-markdown.tsx      react-markdown + remark-gfm renderer
├── content/portfolio.ts       typed portfolio content
└── lib/blog/
    ├── source.ts              env → BlogSourceConfig
    ├── adapter.ts             BlogSourceAdapter interface
    ├── local-adapter.ts       filesystem provider
    ├── github-adapter.ts      GitHub contents API provider
    ├── headings.ts            heading ids and table of contents
    ├── posts.ts               load, normalize, sort, dedupe, map to result states
    ├── errors.ts              BlogSourceUnavailableError
    └── types.ts               config, post and result types
```

## Blog data flow

```
page.tsx ──► getBlogIndex() / getBlogPost(slug)        (posts.ts, runs at build time)
               │
               ├─ getBlogSourceConfig()                (source.ts, env vars)
               ├─ createBlogSourceAdapter()            local | github
               ├─ listMarkdownFiles() + readFile()
               ├─ normalizeBlogPost()                  gray-matter, contract validation
               └─ sort desc by publishedAt, dedupe slugs
                     │
                     ▼
        ready | empty | unavailable | not_found  ──►  page renders content or BufferNotice
```

See [ADR-0004](../adr/0004-server-side-blog-source-adapter.md) and [ADR-0007](../adr/0007-isolate-blog-failures.md).

## Configuration

| Variable | Default | Purpose |
| --- | --- | --- |
| `BLOG_SOURCE_PROVIDER` | `local` | `local` or `github` |
| `BLOG_SOURCE_PATH` | `content/blog` | Content directory (relative to the repo root or the GitHub repo) |
| `BLOG_SOURCE_OWNER` / `BLOG_SOURCE_REPO` | — | Required for `github` |
| `BLOG_SOURCE_BRANCH` | `main` | GitHub ref |
| `BLOG_SOURCE_TOKEN` | — | Optional, for private repositories |

`.env.example` documents these for local development.

## Deployment

See [ADR-0010](../adr/0010-static-export-on-github-pages.md). In short:

- `next.config.ts` sets `output: "export"`, `trailingSlash: true` and `basePath` from `PAGES_BASE_PATH`.
- `.github/workflows/deploy-github-pages.yml` lints, tests, builds `out/` and deploys it with `actions/deploy-pages`. It runs on pushes to `main`, manual dispatch and the `blog-content-updated` repository dispatch. Pull requests run validation only.
- Blog source variables are GitHub Actions repository variables. `BLOG_SOURCE_TOKEN` is an Actions secret used only during the build.
- `/blog/[slug]` pre-renders one page per post (`dynamicParams = false`). Unknown slugs get the exported `404.html`. If the source is empty or unavailable, a placeholder `/blog/_/` page is rendered, because the export can't have zero params.

## Testing

`npm run test` runs `tests/*.test.ts` with Node's test runner through `tsx`. It covers blog loading, front matter normalization and the result states.
