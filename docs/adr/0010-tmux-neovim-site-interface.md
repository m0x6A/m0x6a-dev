# ADR-0010: tmux and Neovim interface for the site

- **Status:** Accepted
- **Date:** 2026-10-15
- **Related:** [ADR-0006](0006-cli-styling-as-design-layer.md), [Developer portfolio](../requirements/developer-portfolio.md), [Git-backed blog](../requirements/git-backed-blog.md)

## Context

ADR-0006 kept terminal styling to accents on a conventional layout and rejected a fully simulated terminal UI. The blog now covers terminal tooling, and we want the site to look like the environment it writes about: tmux running Neovim with the Tokyo Night theme.

## Decision

We will render every route as a tmux window:

- `TmuxShell` is the frame, with a tmux status bar at the bottom. Its window list (`0:home`, `1:blog`, the profile link) is the primary navigation.
- `NvimPane` is the editor: a bufferline, a buffer with line numbers, lualine and a command line that shows status and error messages. On the blog, the bufferline has one tab per post.
- `ShellPane` is a zsh pane beside the editor. It shows identity and a table of contents on the home page, the blog source on the index and a table of contents on posts. It is hidden below 1180px.
- The home page is a `README.md` buffer: profile details as YAML front matter, then Markdown-styled sections. Posts render as Markdown with their front matter shown as YAML.
- Empty, unavailable and not-found states use `BufferNotice` and an `E484` command-line error instead of a card.
- `j`/`k`, `gg`/`G` and `H`/`L` scroll the buffer and switch buffers. They are optional extras that never replace links or native scrolling.

The design rules from ADR-0006 still apply: semantic HTML, real links, readable contrast and a responsive layout. Decorative text (line numbers, `#` markers, lualine) is CSS-generated or `aria-hidden`.

## Alternatives considered

- **Keep the ADR-0006 accents.** They don't give the site the identity we want.
- **Restyle only the blog.** The home page and blog would look like two different sites.
- **A terminal emulator with typed commands.** Content would sit behind a command language, which hurts reading, linking and accessibility.

## Consequences

- The whole site uses a monospace font, with prose set at 80 columns.
- The panes fill the viewport and the buffer scrolls on its own, so the buffer is focusable and has a skip link.
- `SiteShell`, `StatePanel` and the card and button utilities are removed.
- This supersedes ADR-0006.
