#!/usr/bin/env bash
# ═══════════════════════════════════════════════════════════════════════════
# install-deps.sh — install everything the tmux / zsh / Neovim setup needs.
#
# Supports: macOS (Homebrew), Fedora (dnf), Ubuntu 25.10+ / Debian 13+ / WSL (apt).
# Safe to re-run: anything already installed is skipped.
# It installs TOOLS only; it never overwrites your config files.
#
# Usage:
#   ./install-deps.sh               core + Rust
#   ./install-deps.sh --csharp      also the .NET SDK and the C# servers
#   ./install-deps.sh --no-rust     skip rustup, rust-analyzer, codelldb
#   ./install-deps.sh --no-fonts    skip the Nerd Font
#   ./install-deps.sh --no-nvim     skip installing Neovim plugins and servers
#   ./install-deps.sh --dry-run     print what would run, change nothing
#
# What it installs:
#   core      git curl unzip tar make/gcc zsh tmux neovim(0.12+) vim ripgrep fd
#             fzf bat tree jq file zoxide clipboard-tool (wl-clipboard/xclip)
#   shell     oh-my-zsh, oh-my-posh, tmux plugin manager (TPM)
#   git, md   lazygit (git UI), glow (markdown reader)
#   files     yazi + preview helpers (7zip, poppler, ffmpeg, imagemagick)
#             + its Tokyo Night flavor
#   neovim    tree-sitter CLI; plugins via lazy.nvim; lua_ls + taplo via Mason
#   rust      rustup (stable) + rust-analyzer + rust-src; codelldb via Mason
#   csharp    .NET SDK; roslyn + netcoredbg via Mason
#   font      JetBrainsMono Nerd Font
# ═══════════════════════════════════════════════════════════════════════════
set -uo pipefail

# ─── Options ──────────────────────────────────────────────────────────────
WITH_RUST=1 WITH_CSHARP=0 WITH_FONTS=1 WITH_NVIM=1 DRY_RUN=0
for arg in "$@"; do
  case "$arg" in
    --csharp)   WITH_CSHARP=1 ;;
    --no-rust)  WITH_RUST=0 ;;
    --no-fonts) WITH_FONTS=0 ;;
    --no-nvim)  WITH_NVIM=0 ;;
    --dry-run)  DRY_RUN=1 ;;
    -h|--help)  sed -n '3,28p' "$0" | sed 's/^# \{0,1\}//'; exit 0 ;;
    *) echo "Unknown option: $arg (see --help)" >&2; exit 2 ;;
  esac
done

BIN="$HOME/.local/bin"            # our own binaries and symlinks
OPT="$HOME/.local/opt"            # unpacked tools (Neovim on Linux)
export PATH="$BIN:$HOME/.cargo/bin:$PATH"

# ─── Output helpers ───────────────────────────────────────────────────────
if [ -t 1 ]; then B=$'\e[1m' G=$'\e[32m' Y=$'\e[33m' R=$'\e[31m' N=$'\e[0m'; else B='' G='' Y='' R='' N=''; fi
FAILED=()
section() { printf '\n%s== %s ==%s\n' "$B" "$*" "$N"; }
ok()      { printf '  %s✓%s %s\n' "$G" "$N" "$*"; }
skip()    { printf '  %s–%s %s\n' "$Y" "$N" "$*"; }
have()    { command -v "$1" >/dev/null 2>&1; }

# Full output of every step goes to this log; the screen shows one line per
# step, plus the last lines of output when a step fails.
LOG="${XDG_CACHE_HOME:-$HOME/.cache}/install-deps.log"
mkdir -p "$(dirname "$LOG")" && : > "$LOG"

# Full output of every step goes to this log; the screen shows one line per
# step, plus the last lines of output when a step fails.
LOG="${XDG_CACHE_HOME:-$HOME/.cache}/install-deps.log"
mkdir -p "$(dirname "$LOG")" && : > "$LOG"

# step "description" command...  — runs (or prints, with --dry-run) and keeps
# going on failure; every failure is listed again at the end.
step() {
  local desc=$1; shift
  if [ "$DRY_RUN" = 1 ]; then printf '  would: %s\n         %s\n' "$desc" "$*"; return 0; fi
  printf '  … %s\r' "$desc"
  local out rc; out=$(mktemp)
  "$@" > "$out" 2>&1 < /dev/null; rc=$?
  { printf '\n### %s (exit %s)\n' "$desc" "$rc"; cat "$out"; } >> "$LOG"
  if [ "$rc" -eq 0 ]; then
    ok "$desc"
  else
    printf '  %s✗ %s%s\n' "$R" "$desc" "$N"
    tail -n 6 "$out" | sed 's/^/      /'      # this step's last lines only
    FAILED+=("$desc")
  fi
  rm -f "$out"; return "$rc"
}

# ─── Platform ─────────────────────────────────────────────────────────────
OS=unknown
if [ "$(uname -s)" = Darwin ]; then
  OS=mac
elif [ -r /etc/os-release ]; then
  # shellcheck disable=SC1091
  . /etc/os-release
  case " ${ID:-} ${ID_LIKE:-} " in
    *" fedora "*|*" rhel "*) OS=fedora ;;
    *" ubuntu "*|*" debian "*) OS=ubuntu ;;
  esac
fi
case "$(uname -m)" in
  x86_64|amd64)  ARCH=x86_64 ;;
  arm64|aarch64) ARCH=aarch64 ;;
  *) ARCH=$(uname -m) ;;
esac
[ "$OS" = unknown ] && { echo "Unsupported OS. Supported: macOS, Fedora, Ubuntu/Debian." >&2; exit 1; }

SUDO=""
if [ "$OS" != mac ] && [ "$(id -u)" -ne 0 ]; then SUDO=sudo; fi

printf '%sInstalling for %s (%s)%s  rust=%s csharp=%s fonts=%s nvim=%s%s\n' \
  "$B" "$OS" "$ARCH" "$N" "$WITH_RUST" "$WITH_CSHARP" "$WITH_FONTS" "$WITH_NVIM" \
  "$([ "$DRY_RUN" = 1 ] && echo '  (dry run)')"
[ "$DRY_RUN" = 1 ] || mkdir -p "$BIN" "$OPT"

# run_remote <interpreter> <url> [args...] — download an installer script, then
# run it. (A plain `curl | sh` reports success even when the download fails.)
run_remote() {
  local shell=$1 url=$2 f rc; shift 2
  f=$(mktemp) || return 1
  if curl -fsSL "$url" -o "$f"; then "$shell" "$f" "$@"; rc=$?; else rc=1; fi
  rm -f "$f"; return $rc
}

# ═══════════════════════════════════════════════════════════════════════════
# Packages per OS
# ═══════════════════════════════════════════════════════════════════════════
install_mac() {
  section "Homebrew packages"
  if ! xcode-select -p >/dev/null 2>&1; then
    step "Xcode command line tools (a window opens; re-run this script afterwards)" xcode-select --install
  fi
  if ! have brew; then
    NONINTERACTIVE=1 step "Homebrew" run_remote bash https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh
    for b in /opt/homebrew/bin/brew /usr/local/bin/brew; do [ -x "$b" ] && eval "$("$b" shellenv)"; done
  fi
  step "core tools" brew install git curl neovim vim tmux ripgrep fd fzf bat tree jq zoxide tree-sitter-cli
  step "yazi + preview helpers" brew install yazi ffmpeg sevenzip poppler imagemagick
  step "lazygit + glow" brew install lazygit glow
  step "oh-my-posh" brew install jandedobbeleer/oh-my-posh/oh-my-posh
  if [ "$WITH_FONTS" = 1 ]; then step "JetBrainsMono Nerd Font" brew install --cask font-jetbrains-mono-nerd-font; fi
  if [ "$WITH_CSHARP" = 1 ]; then step ".NET SDK" brew install --cask dotnet-sdk; fi
}

install_fedora() {
  section "dnf packages"
  step "core tools" $SUDO dnf install -y git curl unzip tar xz gcc gcc-c++ make file \
    zsh tmux neovim vim-enhanced ripgrep fd-find fzf bat tree jq zoxide \
    wl-clipboard xclip ncurses-term tree-sitter-cli
  if ! have yazi; then
    have dnf-3 || $SUDO dnf install -y dnf-plugins-core >/dev/null 2>&1 || true
    step "yazi COPR repo" $SUDO dnf copr enable -y lihaohong/yazi
    step "yazi" $SUDO dnf install -y yazi
  else skip "yazi already installed"; fi
  step "yazi preview helpers" $SUDO dnf install -y 7zip poppler-utils ImageMagick ffmpeg-free
  if ! have lazygit; then
    step "lazygit COPR repo" $SUDO dnf copr enable -y dejan/lazygit
    step "lazygit" $SUDO dnf install -y lazygit
  else skip "lazygit already installed"; fi
  if ! have glow; then
    step "Charm repo (glow)" bash -c "printf '%s\\n' '[charm]' 'name=Charm' \\
      'baseurl=https://repo.charm.sh/yum/' 'enabled=1' 'gpgcheck=1' \\
      'gpgkey=https://repo.charm.sh/yum/gpg.key' | $SUDO tee /etc/yum.repos.d/charm.repo >/dev/null"
    step "glow" $SUDO dnf install -y glow
  else skip "glow already installed"; fi
  if [ "$WITH_CSHARP" = 1 ]; then step ".NET SDK" $SUDO dnf install -y dotnet-sdk-10.0; fi
}

install_ubuntu() {
  section "apt packages"
  step "package lists" $SUDO apt-get update -qq
  # --force-confold: keep config files you already have instead of asking
  step "core tools" $SUDO env DEBIAN_FRONTEND=noninteractive apt-get install -y -qq \
    -o Dpkg::Options::=--force-confdef -o Dpkg::Options::=--force-confold \
    git curl unzip tar xz-utils build-essential file zsh tmux vim ripgrep fd-find bat tree jq \
    zoxide wl-clipboard xclip ncurses-term fontconfig \
    p7zip-full poppler-utils imagemagick ffmpeg

  # Debian/Ubuntu rename two tools; link them to their usual names
  [ -x /usr/bin/fdfind ] && [ ! -e "$BIN/fd" ] && step "fd -> fdfind" ln -s /usr/bin/fdfind "$BIN/fd"
  [ -x /usr/bin/batcat ] && [ ! -e "$BIN/bat" ] && step "bat -> batcat" ln -s /usr/bin/batcat "$BIN/bat"

  local nv_arch=$ARCH; [ "$ARCH" = aarch64 ] && nv_arch=arm64
  # apt's Neovim is far too old (need 0.12+): use the official release
  if ! nvim_ok; then
    step "Neovim (official release)" bash -c "
      set -e; tmp=\$(mktemp -d)
      curl -fsSL https://github.com/neovim/neovim/releases/latest/download/nvim-linux-$nv_arch.tar.gz -o \$tmp/nvim.tgz
      rm -rf '$OPT/nvim' && mkdir -p '$OPT/nvim'
      tar -xzf \$tmp/nvim.tgz -C '$OPT/nvim' --strip-components=1
      ln -sf '$OPT/nvim/bin/nvim' '$BIN/nvim'; rm -rf \$tmp"
  else skip "Neovim $(nvim_version) already installed"; fi

  # apt's fzf is too old for `fzf --zsh` (need 0.48+): fzf's own installer
  if ! fzf_ok; then
    step "fzf (official installer)" bash -c "
      set -e
      [ -d '$HOME/.fzf' ] || git clone -q --depth 1 https://github.com/junegunn/fzf.git '$HOME/.fzf'
      '$HOME/.fzf/install' --bin >/dev/null
      ln -sf '$HOME/.fzf/bin/fzf' '$BIN/fzf'"
  else skip "fzf $(fzf --version | cut -d' ' -f1) already installed"; fi

  if ! have yazi; then
    local ya_arch=$ARCH
    step "yazi (official release)" bash -c "
      set -e; tmp=\$(mktemp -d)
      curl -fsSL https://github.com/sxyazi/yazi/releases/latest/download/yazi-$ya_arch-unknown-linux-gnu.zip -o \$tmp/yazi.zip
      unzip -q \$tmp/yazi.zip -d \$tmp
      install -m 755 \$tmp/yazi-*/yazi \$tmp/yazi-*/ya '$BIN/'; rm -rf \$tmp"
  else skip "yazi already installed"; fi

  if ! have tree-sitter; then
    local ts_arch=x64; [ "$ARCH" = aarch64 ] && ts_arch=arm64
    step "tree-sitter CLI (official release)" bash -c "
      set -eo pipefail; curl -fsSL https://github.com/tree-sitter/tree-sitter/releases/latest/download/tree-sitter-linux-$ts_arch.gz \
        | gunzip > '$BIN/tree-sitter'; chmod +x '$BIN/tree-sitter'"
  else skip "tree-sitter already installed"; fi

  # lazygit is in apt from Ubuntu 25.10
  if ! have lazygit; then
    step "lazygit" $SUDO apt-get install -y -qq lazygit
  else skip "lazygit already installed"; fi

  # glow: from Charm's own apt repository
  if ! have glow; then
    step "Charm repo (glow)" bash -c "
      set -eo pipefail
      $SUDO mkdir -p /etc/apt/keyrings
      curl -fsSL https://repo.charm.sh/apt/gpg.key | $SUDO gpg --dearmor --yes -o /etc/apt/keyrings/charm.gpg
      echo 'deb [signed-by=/etc/apt/keyrings/charm.gpg] https://repo.charm.sh/apt/ * *' | $SUDO tee /etc/apt/sources.list.d/charm.list >/dev/null
      $SUDO apt-get update -qq"
    step "glow" $SUDO apt-get install -y -qq glow
  else skip "glow already installed"; fi

  if [ "$WITH_CSHARP" = 1 ] && ! have dotnet; then
    step ".NET SDK (apt)" $SUDO apt-get install -y -qq dotnet-sdk-10.0 \
      || step ".NET SDK (Microsoft script, into ~/.dotnet)" \
           run_remote bash https://dot.net/v1/dotnet-install.sh --channel LTS
  fi
}

nvim_version() { nvim --version 2>/dev/null | head -1 | sed 's/^NVIM v//'; }
nvim_ok() {   # true when Neovim 0.12 or newer is installed
  have nvim || return 1
  local v; v=$(nvim_version); local major=${v%%.*} rest=${v#*.}; local minor=${rest%%.*}
  [ "${major:-0}" -gt 0 ] || [ "${minor:-0}" -ge 12 ]
}
fzf_ok() {    # true when fzf 0.48 or newer is installed
  have fzf || return 1
  local v; v=$(fzf --version | cut -d' ' -f1); local minor=${v#0.}; minor=${minor%%.*}
  [ "${v%%.*}" -gt 0 ] || [ "${minor:-0}" -ge 48 ]
}

# ═══════════════════════════════════════════════════════════════════════════
# Shared steps (all platforms)
# ═══════════════════════════════════════════════════════════════════════════
install_shell_tools() {
  section "Shell tools"
  if [ ! -r "$HOME/.oh-my-zsh/oh-my-zsh.sh" ]; then
    # --keep-zshrc: never touch ~/.zshrc; --unattended: no shell switch, no prompt
    step "oh-my-zsh" run_remote sh https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh --unattended --keep-zshrc
  else skip "oh-my-zsh already installed"; fi

  if ! have oh-my-posh; then
    step "oh-my-posh (into ~/.local/bin)" run_remote bash https://ohmyposh.dev/install.sh -d "$BIN"
  else skip "oh-my-posh already installed"; fi

  if [ ! -d "$HOME/.config/tmux/plugins/tpm" ]; then
    step "tmux plugin manager (TPM)" git clone -q --depth 1 https://github.com/tmux-plugins/tpm "$HOME/.config/tmux/plugins/tpm"
  else skip "TPM already installed"; fi

  if have yazi && have ya && [ ! -d "$HOME/.config/yazi/flavors/tokyo-night.yazi" ]; then
    step "yazi Tokyo Night flavor" ya pkg add BennyOe/tokyo-night
  else skip "yazi flavor already installed (or yazi missing)"; fi
}

install_font_linux() {
  [ "$WITH_FONTS" = 1 ] && [ "$OS" != mac ] || return 0
  section "Font"
  local dir="$HOME/.local/share/fonts/JetBrainsMono"
  if [ ! -d "$dir" ]; then
    step "JetBrainsMono Nerd Font" bash -c "
      set -e; mkdir -p '$dir'
      set -o pipefail
      curl -fsSL https://github.com/ryanoasis/nerd-fonts/releases/latest/download/JetBrainsMono.tar.xz | tar -xJ -C '$dir'
      fc-cache -f '$dir' >/dev/null 2>&1 || true"
  else skip "JetBrainsMono Nerd Font already installed"; fi
}

install_rust() {
  [ "$WITH_RUST" = 1 ] || return 0
  section "Rust"
  if ! have rustup; then
    # --no-modify-path: PATH is managed in ~/.config/env/environment
    step "rustup + stable toolchain" run_remote sh https://sh.rustup.rs -y --no-modify-path
  else skip "rustup already installed"; fi
  have rustup && step "rust-analyzer + rust-src" rustup component add rust-analyzer rust-src
  if [ "$OS" = mac ] && ! have tree-sitter && have cargo; then
    step "tree-sitter CLI (cargo)" cargo install --locked tree-sitter-cli
  fi
}

install_nvim_plugins() {
  [ "$WITH_NVIM" = 1 ] || return 0
  section "Neovim plugins and language servers"
  if [ ! -f "$HOME/.config/nvim/init.lua" ]; then
    skip "no ~/.config/nvim yet; put the config in place and re-run"
    return 0
  fi
  step "plugins (lazy.nvim sync)" nvim --headless "+Lazy! sync" +qa
  local pkgs=(lua-language-server taplo)
  [ "$WITH_RUST" = 1 ] && pkgs+=(codelldb)
  [ "$WITH_CSHARP" = 1 ] && pkgs+=(roslyn netcoredbg)
  step "Mason: ${pkgs[*]}" mason_install "${pkgs[@]}"
  skip "Tree-sitter parsers compile on Neovim's first start"
}

# Install Mason packages headlessly: load the registry first (on a fresh
# machine it isn't downloaded yet), start every install, wait for all of them.
mason_install() {
  local lua
  lua=$(mktemp --suffix=.lua 2>/dev/null || mktemp)
  cat > "$lua" <<'LUA'
local names, failed = vim.split(vim.env.MASON_PKGS, " "), {}
local ok, reg = pcall(require, "mason-registry")
if not ok then io.stderr:write("mason.nvim is not installed\n") vim.cmd("cq") end
reg.refresh()                                   -- synchronous without a callback
local pending = {}
for _, name in ipairs(names) do
  local found, pkg = pcall(reg.get_package, name)
  if not found then table.insert(failed, name .. " (not in registry)")
  elseif pkg:is_installed() then print("  already installed: " .. name)
  else pkg:install(); pending[name] = pkg end
end
vim.wait(30 * 60 * 1000, function()
  for _, pkg in pairs(pending) do if pkg:is_installing() then return false end end
  return true
end, 500)
for name, pkg in pairs(pending) do
  if pkg:is_installed() then print("  installed: " .. name) else table.insert(failed, name) end
end
if #failed > 0 then io.stderr:write("  failed: " .. table.concat(failed, ", ") .. "\n") vim.cmd("cq") end
vim.cmd("qa")
LUA
  MASON_PKGS="$*" nvim --headless -c "luafile $lua" 2>&1
  local rc=$?; rm -f "$lua"; return $rc
}

# ═══════════════════════════════════════════════════════════════════════════
case "$OS" in
  mac)    install_mac ;;
  fedora) install_fedora ;;
  ubuntu) install_ubuntu ;;
esac
install_shell_tools
install_font_linux
install_rust
install_nvim_plugins

# ─── Summary ──────────────────────────────────────────────────────────────
section "Summary"
if [ "$DRY_RUN" = 0 ]; then
  for t in zsh tmux nvim fzf fd rg bat yazi lazygit glow oh-my-posh tree-sitter; do
    if have "$t"; then ok "$t"; else printf '  %s✗%s %s missing\n' "$R" "$N" "$t"; fi
  done
  [ "$WITH_RUST" = 1 ] && { have rust-analyzer && ok rust-analyzer || printf '  %s✗%s rust-analyzer missing\n' "$R" "$N"; }
  [ "$WITH_CSHARP" = 1 ] && { have dotnet && ok dotnet || printf '  %s✗%s dotnet missing\n' "$R" "$N"; }
  nvim_ok || printf '  %s!%s Neovim is older than 0.12 (roslyn.nvim needs 0.12)\n' "$Y" "$N"
fi
if [ ${#FAILED[@]} -gt 0 ]; then
  printf '\n%sThese steps failed (re-run the script, or install them by hand):%s\n' "$R" "$N"
  printf '  - %s\n' "${FAILED[@]}"
  printf '  Full output: %s\n' "$LOG"
fi
cat <<EOF

Next:
  - PATH: ~/.local/bin and ~/.cargo/bin must be on PATH (they are in ~/.config/env/environment).
  - Default shell: chsh -s "\$(command -v zsh)"   (log out and back in)
  - Terminal font: pick "JetBrainsMono Nerd Font" in your terminal's settings.
  - tmux plugins: start tmux, press C-a I.
EOF
[ ${#FAILED[@]} -eq 0 ]
