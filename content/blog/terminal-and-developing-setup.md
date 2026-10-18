---
title: "Rebuilding my terminal as an IDE: tmux, zsh and Neovim"
publishedAt: "2026-10-15"
summary: "I turned an old packer-based Rust guide into a modular tmux, zsh and Neovim setup for Rust and C#, with git and markdown tooling, managed with chezmoi and installed with one script."
slug: "terminal-ide-tmux-zsh-neovim"
---

I started with a 2022 guide for using Neovim as a Rust IDE and tried to bring it up to date, but it was written for packer.nvim, which isn't maintained anymore, and half of its plugins were archived as well. So I ended up rebuilding the whole terminal: tmux, zsh and Neovim. It now works for both Rust and C#, everything shares one Tokyo Night theme, and one script installs it on Fedora, macOS and Ubuntu.

Updated 2026-10-18: since the first version I've added proper git support, a terminal markdown reader, and I've moved my laptop over to the setup with chezmoi, which taught me a few things about keeping two machines in sync.

## The idea

I wanted tmux, the shell, fzf and a file manager to be usable on their own, without Neovim. Neovim then plugs into them, so the same keys move between tmux panes and Neovim splits, and fzf looks the same in the shell as inside the editor.

VS Code does a lot for you, and here every behaviour is a line of config I wrote myself. That's more work, but it also means I can read why something does what it does. To keep it manageable, every feature is its own file: deleting `rust.lua` removes all Rust support and nothing else notices.

## The shell, in four files

`~/.zshrc` is now just the zsh core. Everything else lives in small files under `~/.config/env`, and zsh's startup files each load one folder:

| Startup file | Runs for | Loads from `~/.config/env` |
| --- | --- | --- |
| `~/.zshenv` | every zsh, scripts too | `environment`: PATH, `EDITOR`, `FZF_*` |
| `~/.zprofile` | login shells (every tmux pane) | `login.d/`: agents, `brew shellenv` |
| `~/.zshrc` | interactive shells | `shell.d/` (bash + zsh), then `zshrc.d/` (zsh only) |
| `~/.zlogout` | when a login shell exits | `logout.d/` |

The `environment` file is plain POSIX `sh` and only holds variables, so bash, scripts and Neovim all see the same values. fzf's settings live there once, so fzf in the shell and fzf-lua in Neovim look identical.

## Neovim, and what replaced what

Neovim moved from packer to lazy.nvim, and most of the plugins from the guide had successors:

| The 2022 guide | Now | Why |
| --- | --- | --- |
| packer.nvim | lazy.nvim | packer is unmaintained |
| rust-tools.nvim | rustaceanvim | rust-tools is archived and this is its successor |
| Vimspector + hand-written `.vimspector.json` | nvim-dap | `<leader>dr` picks a binary or test and debugs it, no launch file needed |
| nvim-treesitter `configs.setup{}` | nvim-treesitter `main` branch | the old branch is frozen |
| Telescope | fzf-lua | uses the same `fzf` I already have in the shell |
| Comment.nvim, impatient.nvim | removed | both are built into Neovim now |

For C# I use roslyn.nvim, which runs Microsoft's own Roslyn server, the same one VS Code's C# extension uses. overseer.nvim reads `.vscode/tasks.json` and nvim-dap reads `launch.json`, so `F5` builds first and then stops at the breakpoint, the same way it does in VS Code.

## Git

I wanted the best git support I could get inside Neovim, but it also had to work in a plain tmux pane, so I went with lazygit. It's a full git UI in the terminal, and inside Neovim it opens in a floating window. Next to it diffview gives me side-by-side diffs, file history and a three-way view for merge conflicts, and gitsigns shows changed lines in the margin and lets me stage single changes without leaving the file.

| Keys | What it does |
| --- | --- |
| `Space gg` | lazygit in a floating window (`lg` in a shell) |
| `Space gd` / `Space gD` | diff of all changes / close it |
| `Space gh` / `Space gH` | history of this file / of the whole repo |
| `Space gm` | merge conflicts, ours, result and theirs side by side |
| `]h` / `[h` | next / previous changed block |
| `Space hs` | stage the change under the cursor, press again to unstage |
| `Space hp` / `Space hr` | preview / discard the change |
| `Space hb` / `Space hB` | blame this line / blame on every line |

lazygit has the same Tokyo Night colours as everything else, and pressing `e` on a file opens it in the Neovim that started lazygit.

## Reading markdown

Inside Neovim, render-markdown shows headings, tables and checkboxes properly while I edit, and `Space mp` opens a live preview in the browser that also draws Mermaid diagrams. For reading markdown outside the editor I use glow, which has a built-in Tokyo Night style: `glow README.md` opens a file in a pager, and just `glow` lets me browse every markdown file in the folder. glow can't draw diagrams though, so for those the browser preview is still the way.

## The keys I use every day

| Keys | What it does |
| --- | --- |
| `Ctrl-R` / `Ctrl-T` / `Alt-C` | fzf in the shell: history, insert a file path, cd into a folder |
| `Ctrl-h/j/k/l` | move between tmux panes and Neovim splits with the same keys |
| `Space ff` / `Space fg` | find a file / grep the project |
| `Space e` | file tree |
| `Space .` | code actions: fixes, remove unused usings, add imports |
| `K` / `gd` / `Space rn` | hover docs / go to definition / rename |
| `Space db`, then `F5` / `Space dr` | breakpoint, then debug (C# / Rust) |
| `Space ob` | run a task: build, test, watch |
| `Space gg` | lazygit |
| `Space` and wait | which-key lists everything else |

Menus where you just pick one thing, like code actions, have no search field, so `j`/`k` move and `l` applies. The search pickers keep their search field since there you actually type.

## What broke along the way

A few things broke along the way, and those were some of the more useful parts.

Middle-click paste stopped working in tmux. With `mouse on` tmux takes every click, so middle-click pasted tmux's own buffer instead of the system selection. I fixed it by piping through `wl-copy` and `wl-paste` myself, without a plugin.

`cargo` disappeared after I rewrote `~/.zshenv`. rustup had added a line there and I deleted it together with everything else, so now PATH lives in one place, the `environment` file, including `~/.cargo/bin`.

`Ctrl-T` typed a character instead of opening fzf. `bindkey '^T'` showed `self-insert`, which meant fzf's key bindings never loaded, and `zsh -o sourcetrace -i -c exit` shows which file in the chain is missing.

Tree-sitter complained about "not in runtimepath" on the first start. The folder didn't exist when Neovim started and was created during the session, so a restart fixed it.

The install script reported success on failed downloads, because `curl … | sh` exits with 0 even when curl fails. It now downloads first and runs second.

## Managing it all with chezmoi

Copying config files around by hand breaks easily, and I tried a plain dotfiles repo with symlinks before, which never worked well across my machines. chezmoi keeps a copy of every file in one git repo and writes real files into the home folder, with templates for the parts that differ per machine.

Configs go in the repo, and anything a tool downloads stays out since each machine fetches its own:

| Path | In the repo? | Why |
| --- | --- | --- |
| `~/.zshenv`, `~/.zprofile`, `~/.zshrc`, `~/.zlogout` | yes | the shell startup chain |
| `~/.config/env/` | yes | environment and the per-topic folders |
| `~/.tmux.conf` | yes, as a template | the clipboard commands differ on macOS |
| `~/.config/nvim/` | yes | including `lazy-lock.json`, which pins plugin versions |
| `~/.config/lazygit/`, `~/.config/glow/` | yes | colours and settings for the git UI and markdown reader |
| `~/.config/oh-my-posh/`, `~/.config/yazi/` | yes | the prompt theme, the yazi theme and plugin list |
| `~/.config/tmux/plugins/` | no | TPM downloads it |
| `~/.config/yazi/flavors/` | no | `ya pkg` downloads it |
| `~/.local/share/nvim/` | no | lazy.nvim and Mason download it |
| `~/.oh-my-zsh/` | no | its installer clones it |

### Two questions per machine

`.chezmoi.toml.tmpl` in the repo root asks once per machine whether I want Rust and C#, and remembers the answers:

```toml
{{- $rust   := promptBoolOnce . "rust"   "Rust support (rust-analyzer, codelldb)" true -}}
{{- $csharp := promptBoolOnce . "csharp" "C# support (.NET SDK, Roslyn)" false -}}

[data]
  rust   = {{ $rust }}
  csharp = {{ $csharp }}
```

`.chezmoiignore` then uses the answers, and since every feature is one file, turning Rust off just means not installing `rust.lua`:

```text
# Downloaded per machine, never in the repo
.config/tmux/plugins
.config/yazi/flavors
.local/share/nvim

# Files in the repo that aren't dotfiles
README.md
install-deps.sh

# Languages, per machine
{{ if not .rust }}
.config/nvim/lua/plugins/rust.lua
{{ end }}
{{ if not .csharp }}
.config/nvim/lua/plugins/csharp.lua
{{ end }}
```

### One template for the clipboard

tmux copies with `wl-copy` on Wayland, but macOS has `pbcopy`. After `chezmoi chattr +template ~/.tmux.conf` the clipboard section picks the right commands:

```text
{{- if eq .chezmoi.os "darwin" }}
{{-   $copy := "pbcopy" }}{{ $copySel := "pbcopy" }}{{ $paste := "pbpaste" }}
{{- else }}
{{-   $copy := "wl-copy" }}{{ $copySel := "wl-copy -p" }}{{ $paste := "wl-paste -p -n" }}
{{- end }}
bind -T copy-mode-vi MouseDragEnd1Pane send -X copy-pipe-no-clear "{{ $copySel }}"
set -s copy-command "{{ $copy }}"
```

### The install script runs itself

`install-deps.sh` sits in the repo root, ignored as a dotfile, and a small script next to it runs it:

```bash
#!/usr/bin/env bash
# run_onchange_after_install-deps.sh.tmpl
# Runs after the first `chezmoi apply`, and again whenever install-deps.sh
# changes (the hash below changes with it).
# install-deps.sh hash: {{ include "install-deps.sh" | sha256sum }}
exec bash {{ joinPath .chezmoi.sourceDir "install-deps.sh" | quote }} \
  {{- if not .rust }} --no-rust{{ end }}
  {{- if .csharp }} --csharp{{ end }}
```

It runs after the dotfiles are in place, so the Neovim step finds the config and can install the plugins and language servers. And because of the hash, adding lazygit and glow to the script was enough to get them installed on the other machines on their next `chezmoi update`.

### A new machine is one command

```bash
sh -c "$(curl -fsLS get.chezmoi.io)" -- init --apply <github-user>
```

That clones the repo, asks the two questions, writes the files and runs the install script. After that there are three manual steps left: `chsh -s "$(command -v zsh)"`, picking the Nerd Font in the terminal, and `C-a I` in tmux to install its plugins.

### Moving the laptop over

My laptop already had chezmoi and an older setup, and moving it over was less straightforward than a fresh machine, so a few notes.

chezmoi never deletes files it doesn't manage. Leftovers from the old packer setup in `~/.config/nvim` would have stayed next to the new config and been loaded with it, so I moved `~/.config/nvim`, `~/.config/env` and Neovim's data folders aside before applying.

The laptop's repo had commits that weren't on GitHub, and GitHub had the new setup, so git complained about diverging branches. Rebasing the laptop's commits on top is safe here and doesn't need a force push, since those commits were never pushed. I also made it the default so `chezmoi update` handles it next time:

```bash
chezmoi git -- pull --rebase origin main
chezmoi git -- config pull.rebase true
```

And when the git support didn't show up on the laptop, it turned out I had never run `chezmoi add` on the new files on the desktop. chezmoi only knows about files you've added, so after a change it's worth checking `chezmoi managed` before wondering why the other machine doesn't have it.

### Day to day

| I want to | Command |
| --- | --- |
| Change a config | `chezmoi edit --apply ~/.zshrc`, or edit in place and `chezmoi re-add` |
| Add a new config file | `chezmoi add ~/.config/lazygit/config.yml` |
| See what would change | `chezmoi diff` |
| Commit and push | `chezmoi git add .`, `chezmoi git -- commit -m "..."`, `chezmoi git push` |
| Get changes from another machine | `chezmoi update` (pull and apply) |
| Keep plugin updates | after `:Lazy update`: `chezmoi re-add ~/.config/nvim/lazy-lock.json` |
| Use the locked plugin versions | `nvim +"Lazy restore"` after an update |
| Change a machine's Rust/C# answer | `chezmoi init --prompt`, then `chezmoi apply` |

The `--` after `chezmoi git` is needed whenever the git command has flags of its own, otherwise chezmoi tries to read them.

## Get the install script

Download [install-deps.sh](/blog/assets/install-deps.sh). Run it with `--dry-run` first to see every command before anything is installed, and `--help` for the flags (`--csharp`, `--no-rust`, `--no-fonts`, `--no-nvim`). It's safe to re-run since anything already installed is skipped, failures are listed at the end, and the full output goes to `~/.cache/install-deps.log`.

It now also installs lazygit and glow: from Homebrew on macOS, from a COPR repo and Charm's repo on Fedora, and from apt and Charm's repo on Ubuntu. For Ubuntu it expects 25.10 or newer, since that's the first release with lazygit in apt. The Ubuntu path has had a full run, the lazygit and glow steps are newer, and the macOS and Fedora paths haven't had a full run yet, so the Mac is next.
