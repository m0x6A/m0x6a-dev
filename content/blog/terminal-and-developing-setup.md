---
title: "Rebuilding my terminal as an IDE: tmux, zsh and Neovim"
publishedAt: "2026-10-15"
summary: "I turned an old packer-based Rust guide into a modular tmux, zsh and Neovim setup for Rust and C#, managed with chezmoi and installed with one script."
slug: "terminal-ide-tmux-zsh-neovim"
---

I started with a 2022 guide for using Neovim as a Rust IDE and tried to bring it up to date. It was written for packer.nvim, which is no longer maintained, and half of its plugins were archived too. I ended up rebuilding the whole terminal: tmux, zsh and Neovim. They now work for both Rust and C#, share one Tokyo Night theme, and install from one script on Fedora, macOS and Ubuntu.

Some of the most useful parts were the small things that broke along the way, so they get a section of their own.

## Why it matters

- **The terminal has to work without the editor.** tmux, the shell, fzf and a file manager are useful on their own. Neovim plugs into them, not the other way round.
- **The tradeoff is ownership.** VS Code does a lot for you. Here, every behaviour is a line of config I wrote, which also means I can read why it does what it does.
- **What stays simple:** one file per feature. Deleting `rust.lua` removes Rust support, and nothing else notices.

## What changed

1. **tmux got a cleanup.** Prefix `Ctrl-a`, `Ctrl-h/j/k/l` to move between panes, and a Tokyo Night theme written inline instead of loaded from a plugin. It also fixed middle-click paste, which had quietly stopped working (more on that below).
2. **The shell is split into small files.** `~/.zshrc` is now just the zsh core. Everything else lives in `~/.config/env`, loaded at the right moment by zsh's startup files.
3. **Neovim moved from packer to lazy.nvim.** Archived plugins were swapped for their successors, and every feature is its own file.
4. **Rust and C# behave like they do in VS Code.** rust-analyzer and Roslyn give completion, code actions and inline errors. Debugging works with breakpoints, and existing `.vscode/tasks.json` and `launch.json` files are reused as they are.
5. **One script installs it all:** `install-deps.sh`, for macOS (Homebrew), Fedora (dnf) and Ubuntu/WSL (apt). You can [download it here](/blog/assets/install-deps.sh).
6. **chezmoi ties it together.** One repo holds every config file, asks each machine whether it wants Rust and C#, and runs the install script for you.

## The shell, in four files

zsh reads up to four startup files, and each one now loads one folder:

| Startup file | Runs for | Loads from `~/.config/env` |
| --- | --- | --- |
| `~/.zshenv` | every zsh, scripts too | `environment`: PATH, `EDITOR`, `FZF_*` |
| `~/.zprofile` | login shells (every tmux pane) | `login.d/`: agents, `brew shellenv` |
| `~/.zshrc` | interactive shells | `shell.d/` (bash + zsh), then `zshrc.d/` (zsh only) |
| `~/.zlogout` | when a login shell exits | `logout.d/` |

The `environment` file is plain POSIX `sh` and holds only variables, so bash, scripts and Neovim all see the same values. One example: fzf's settings live there once, and fzf in the shell and fzf-lua in Neovim look identical.

## Neovim: what replaced what

| The 2022 guide | Now | Why |
| --- | --- | --- |
| packer.nvim | lazy.nvim | packer is unmaintained |
| rust-tools.nvim | rustaceanvim | rust-tools is archived; this is its successor |
| Vimspector + hand-written `.vimspector.json` | nvim-dap | `<leader>dr` picks a binary or test and debugs it, with no launch file |
| nvim-treesitter `configs.setup{}` | nvim-treesitter `main` branch | the old branch is frozen |
| Telescope | fzf-lua | uses the real `fzf` I already have in the shell |
| Comment.nvim, impatient.nvim | removed | both are built into Neovim now |

For C#, roslyn.nvim runs Microsoft's own Roslyn server, the same one behind VS Code's C# extension. overseer.nvim reads `.vscode/tasks.json`, and nvim-dap reads `launch.json`. So `F5` builds first, then stops at the breakpoint, exactly like it does in VS Code.

## The keys I use every day

| Keys | What it does |
| --- | --- |
| `Ctrl-R` / `Ctrl-T` / `Alt-C` | fzf in the shell: history, insert a file path, cd into a folder |
| `Ctrl-h/j/k/l` | Move between tmux panes and Neovim splits with the same keys |
| `Space ff` / `Space fg` | Find a file / grep the project |
| `Space e` | File tree |
| `Space .` | Code actions: fixes, remove unused usings, add imports |
| `K` / `gd` / `Space rn` | Hover docs / go to definition / rename |
| `Space db`, then `F5` / `Space dr` | Breakpoint, then debug (C# / Rust) |
| `Space ob` | Run a task: build, test, watch |
| `Space` and wait | which-key lists everything else |

Menus that are just "pick one", like code actions, have no search field: `j`/`k` move and `l` applies. Search pickers keep their search field, because there you need to type.

## What broke along the way

- **Middle-click paste disappeared in tmux.** With `mouse on`, tmux takes every click, so middle-click pasted tmux's own buffer instead of the system selection. The fix was to pipe through `wl-copy` and `wl-paste` myself, with no plugin.
- **`cargo` vanished after I rewrote `~/.zshenv`.** rustup had added a line there, and I deleted it with the rest. PATH now lives in one place, `environment`, including `~/.cargo/bin`.
- **`Ctrl-T` typed a character instead of opening fzf.** `bindkey '^T'` showed `self-insert`, which meant fzf's bindings had never loaded. One command tells you which part of that chain is missing.
- **Tree-sitter said "not in runtimepath" on the first start.** The folder didn't exist when Neovim started, and appeared during the session. A restart was the whole fix.
- **The install script reported success on failed downloads.** `curl … | sh` exits 0 when curl fails. The script now downloads first and runs second.

## Managing it all with chezmoi

Configs spread across `~/.tmux.conf`, four zsh files, `~/.config/env` and `~/.config/nvim` are easy to break when you copy them by hand. I tried a plain dotfiles repo with symlinks before, and it never worked well across machines. chezmoi keeps a copy of each file in one git repo and writes real files into your home folder, with templates for the parts that differ per machine.

### What goes in the repo, and what doesn't

Configs go in. Anything a tool downloads stays out, because each machine fetches its own:

| Path | In the repo? | Why |
| --- | --- | --- |
| `~/.zshenv`, `~/.zprofile`, `~/.zshrc`, `~/.zlogout` | yes | the shell startup chain |
| `~/.config/env/` | yes | environment and the per-topic folders |
| `~/.tmux.conf` | yes, as a template | the clipboard commands differ on macOS |
| `~/.config/nvim/` | yes | including `lazy-lock.json`, which pins plugin versions |
| `~/.config/oh-my-posh/`, `~/.config/yazi/` | yes | the prompt theme, the yazi theme and plugin list |
| `~/.config/tmux/plugins/` | no | TPM downloads it |
| `~/.config/yazi/flavors/` | no | `ya pkg` downloads it |
| `~/.local/share/nvim/` | no | lazy.nvim and Mason download it |
| `~/.oh-my-zsh/` | no | its installer clones it |

### Two questions per machine

`.chezmoi.toml.tmpl` in the repo root asks once per machine and remembers the answers:

```toml
{{- $rust   := promptBoolOnce . "rust"   "Rust support (rust-analyzer, codelldb)" true -}}
{{- $csharp := promptBoolOnce . "csharp" "C# support (.NET SDK, Roslyn)" false -}}

[data]
  rust   = {{ $rust }}
  csharp = {{ $csharp }}
```

`.chezmoiignore` uses the answers. This is where "one file per feature" pays off: turning Rust off means not installing one file.

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

tmux copies with `wl-copy` on Wayland Linux, but macOS has `pbcopy`. After `chezmoi chattr +template ~/.tmux.conf`, the clipboard section picks the right commands:

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

`install-deps.sh` sits in the repo root, ignored as a dotfile, and this script next to it runs it:

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

`after` matters here: the dotfiles are in place before the script runs, so its Neovim step finds the config and installs the plugins and language servers.

### A new machine is one command

```bash
sh -c "$(curl -fsLS get.chezmoi.io)" -- init --apply <github-user>
```

That clones the repo, asks the two questions, writes the files, and runs the install script. What's left is three manual steps: `chsh -s "$(command -v zsh)"`, picking the Nerd Font in the terminal, and `C-a I` in tmux.

### Day to day

| I want to | Command |
| --- | --- |
| Change a config | `chezmoi edit --apply ~/.zshrc`, or edit in place and `chezmoi re-add` |
| See what would change | `chezmoi diff` |
| Get changes from another machine | `chezmoi update` |
| Keep plugin updates | after `:Lazy update`: `chezmoi re-add ~/.config/nvim/lazy-lock.json` |
| Change a machine's Rust/C# answer | `chezmoi init --prompt`, then `chezmoi apply` |

## One small principle

Make each feature a file you can delete. The Rust support is one file, and turning it off on a machine means leaving that file out:

```lua
-- lua/plugins/rust.lua
-- Rust. Delete this file to turn all Rust support off.
return {
  { "mrcjkb/rustaceanvim", lazy = false },
  { "saecki/crates.nvim", event = { "BufRead Cargo.toml" }, opts = {} },
}
```

The same idea runs through the shell, where a new topic is a new numbered file in `~/.config/env`, and through tmux, which works fully without its plugins.

With chezmoi in place, a new machine goes from nothing to this whole setup with one command and three small manual steps.

## Get the install script

Download [install-deps.sh](/blog/assets/install-deps.sh). Run it with `--dry-run` first to see every command before anything is installed, and `--help` for the flags (`--csharp`, `--no-rust`, `--no-fonts`, `--no-nvim`). It's safe to re-run: anything already installed is skipped, failures are listed at the end, and the full output goes to `~/.cache/install-deps.log`.

I've run the Ubuntu path end to end. The macOS and Fedora paths follow the same structure, but haven't had a full run yet.
