# ADR-0012: Simplify the tmux shell's navigation and chrome

- **Status:** Accepted
- **Date:** 2026-10-18
- **Related:** [ADR-0011](0011-tmux-neovim-site-interface.md), [Developer portfolio](../requirements/developer-portfolio.md), [Git-backed blog](../requirements/git-backed-blog.md)

## Context

ADR-0011 gave the site the look of tmux running Neovim. The tone works, but the interface got in the way:

- Navigation was split. The site nav was the tmux window list at the bottom of the screen, and the blog had a second nav in the bufferline with one tab per post. Neither looked like navigation, and on mobile the post tabs scrolled out of sight.
- The zsh side pane repeated what the buffer already said (identity, blog status, key hints) and was hidden below 1180px anyway.
- On mobile, line numbers, tildes, lualine, the command line, the bufferline and the colour column took space from the content.

## Decision

We keep tmux, Neovim and Tokyo Night, and cut the chrome down to what helps people get around:

- The tmux status bar moves to the top (`status-position top`), sticks there, and is the only primary nav. Window index numbers are decorative and hidden on mobile. The external profile window is marked `↗`.
- A Neovim winbar replaces the bufferline. It shows the path of the open buffer as a breadcrumb (`~ › blog › post.md`), and the preview toggle sits at its right end.
- Posts end with `:bprev` / `:bnext` links to the older and newer post. `H` and `L` follow them.
- `ShellPane` is removed. A post with three or more headings gets a collapsible `grep '^##'` table of contents under its header. Key hints move to a which-key style popup opened with `?`, and the command line says `? for keys` on devices that can hover.
- The document scrolls instead of an inner buffer, so find-in-page, anchors and mobile browser chrome behave normally. Lualine and the command line stick to the bottom.
- On screens up to 640px, line numbers, tildes, the colour column, lualine and the command line are hidden. The command line still shows when it carries an error.

Everything else in ADR-0011 still applies: README.md home buffer, Markdown posts with a preview/source toggle, `BufferNotice` and `E484` for empty and error states, semantic HTML and real links.

## Alternatives considered

- **Keep the bottom tmux bar.** It is authentic, but readers look for site navigation at the top.
- **Keep the post tabs on desktop only.** That still leaves two navs on wide screens, and it doesn't scale as the number of posts grows.
- **Keep a slim lualine on mobile.** It takes a line from every screen without telling the reader anything new.

## Consequences

- There is one nav system, at the top, and the blog index is the way to browse posts.
- Vim motions scroll the window, and the lualine position tracks the document scroll.
- Sticky bars depend on `body` not being a scroll container, so `globals.css` uses `overflow-x: clip` rather than `hidden`.
- Headings have a larger `scroll-margin-top` so anchors land below the sticky bars.
- This supersedes ADR-0011.
