---
title: "fzf — A General-Purpose Fuzzy Finder"
description: "Supercharge your terminal workflow with fzf, the blazing-fast fuzzy finder. Learn to search files, history, processes, and integrate fzf with other tools for maximum productivity."
category: search
tags: [fzf, fuzzy-finder, search, terminal, productivity]
featured: true
installCommand: "brew install fzf"
officialUrl: "https://github.com/junegunn/fzf"
related: [bat, vim]
pubDate: 2024-01-17
---

# fzf — A General-Purpose Fuzzy Finder

## What is fzf?

**fzf** is an interactive Unix filter for command-line that can be used with any list — files, command history, processes, hostnames, bookmarks, and more. It's written in Go, extremely fast even on massive lists, and integrates seamlessly with your shell and other tools.

## Why Use fzf?

- ⚡ **Blazing fast** — handles millions of items without lag
- 🔍 **Fuzzy matching** — find items even with typos or partial matches
- 🖥️ **Interactive UI** — real-time filtering with a beautiful preview window
- 🔗 **Highly composable** — works with any command that outputs lines
- 🐚 **Shell integration** — `Ctrl+R` history, `Ctrl+T` file search, `Alt+C` directory jump
- 🎨 **Customizable** — themes, key bindings, preview window, layout

## Installation

```bash
# macOS (Homebrew)
brew install fzf
# Install shell integration (recommended)
$(brew --prefix)/opt/fzf/install

# Ubuntu / Debian
sudo apt install fzf

# Arch Linux
sudo pacman -S fzf

# Git clone (any platform)
git clone --depth 1 https://github.com/junegunn/fzf.git ~/.fzf
~/.fzf/install

# Cargo
cargo install fzf

# Verify installation
fzf --version
```

## Basic Usage

```bash
# Launch fzf on all files in current directory (recursive)
fzf

# Pipe any list to fzf
ls | fzf
cat /etc/hosts | fzf

# Use selected output in a command
vim $(fzf)

# Multi-select with Tab key (-m flag)
cat file_list.txt | fzf -m

# Search with initial query
fzf -q "main"
```

### Shell Key Bindings (after running install script)

```
Ctrl+T    — fuzzy search files and paste selected path into command line
Ctrl+R    — fuzzy search command history and run selected command
Alt+C     — fuzzy search directories and cd into selected one
```

## 💡 Tips & Tricks

### Tip 1: Enable Live File Previews with bat

Pair `fzf` with `bat` for a stunning file search experience with live syntax-highlighted previews:

```bash
# Interactive file finder with preview
fzf --preview 'bat --color=always --style=numbers --line-range=:100 {}'

# Add as an alias in ~/.bashrc or ~/.zshrc
alias ff='fzf --preview "bat --color=always --style=numbers {}"'
```

### Tip 2: Fuzzy-Search Git Branches

Never mistype a branch name again — fuzzy-search and checkout in one command:

```bash
# Fuzzy git checkout
alias gco='git checkout $(git branch --all | fzf | tr -d "* ")'

# Or with a preview of the branch's recent commits
alias gcop='git checkout $(git branch --all | fzf --preview "git log --oneline --color=always {1}" | tr -d "* ")'

# Or checkout a commit hash
alias gcoh='git log --oneline | fzf | awk "{print \$1}" | xargs git checkout'
```

### Tip 3: Interactive Process Killer

Kill processes interactively without remembering PIDs:

```bash
# Kill a process interactively
alias fkill='kill -9 $(ps aux | fzf | awk "{print \$2}")'

# Or for macOS with a nicer display
fkill() {
  local pid
  pid=$(ps -ef | sed 1d | fzf -m | awk '{print $2}')
  [ -n "$pid" ] && echo "$pid" | xargs kill -${1:-9}
}
```

### Tip 4: Fuzzy cd (Change Directory)

Navigate your filesystem interactively — no more `cd ../../../`:

```bash
# Fuzzy cd using fzf
fcd() {
  local dir
  dir=$(find ${1:-.} -type d 2>/dev/null | fzf +m) && cd "$dir"
}

# Or use Alt+C (built-in shell binding after fzf install)
# Customize it to show directory tree in preview
export FZF_ALT_C_OPTS="--preview 'tree -C {} | head -50'"
```

### Tip 5: Search and Open Files in vim

Create a shortcut to fuzzy-find and instantly open a file in vim:

```bash
# Add to ~/.bashrc or ~/.zshrc
vf() {
  local file
  file=$(fzf --preview 'bat --color=always {}' \
             --bind 'ctrl-/:change-preview-window(down|hidden|)')
  [ -n "$file" ] && vim "$file"
}
```

### Tip 6: Fuzzy Search Docker Containers

Manage Docker containers without memorizing container IDs:

```bash
# Exec into a running container
alias dexec='docker exec -it $(docker ps --format "{{.Names}}" | fzf) bash'

# Stop a container
alias dstop='docker stop $(docker ps --format "{{.Names}}" | fzf)'

# View container logs
alias dlogs='docker logs -f $(docker ps --format "{{.Names}}" | fzf)'
```

### Tip 7: Customize fzf Appearance and Defaults

Set your preferred fzf defaults via the `FZF_DEFAULT_OPTS` environment variable:

```bash
# Add to ~/.bashrc or ~/.zshrc
export FZF_DEFAULT_OPTS="
  --height 40%
  --layout=reverse
  --border
  --color=fg:#f8f8f2,bg:#282a36,hl:#bd93f9
  --color=fg+:#f8f8f2,bg+:#44475a,hl+:#bd93f9
  --color=info:#ffb86c,prompt:#50fa7b,pointer:#ff79c6
  --color=marker:#ff79c6,spinner:#ffb86c,header:#6272a4
"

# Use ripgrep for faster file searching
export FZF_DEFAULT_COMMAND='rg --files --hidden --follow --glob "!.git"'
export FZF_CTRL_T_COMMAND="$FZF_DEFAULT_COMMAND"
```

### Tip 8: Fuzzy Search Kubernetes Resources

If you work with Kubernetes, fzf makes `kubectl` much more manageable:

```bash
# Fuzzy exec into a pod
alias kexec='kubectl exec -it $(kubectl get pods --no-headers | fzf | awk "{print \$1}") -- bash'

# Fuzzy get logs
alias klogs='kubectl logs -f $(kubectl get pods --no-headers | fzf | awk "{print \$1}")'

# Fuzzy switch context
alias kctx='kubectl config use-context $(kubectl config get-contexts --no-headers | fzf | awk "{print \$1}")'
```

## Advanced Applications

### fzf as a Complete File Manager

Build a lightweight file manager entirely from fzf:

```bash
# file manager: fzf + bat preview + enter to open in $EDITOR
fm() {
  local file
  file=$(
    fzf --preview 'bat --color=always --style=numbers {}' \
        --preview-window 'right:60%' \
        --bind 'ctrl-/:toggle-preview' \
        --bind 'ctrl-y:execute-silent(echo {} | pbcopy)' \
        --header 'Enter: open | Ctrl-/: toggle preview | Ctrl-Y: copy path'
  )
  [ -n "$file" ] && ${EDITOR:-vim} "$file"
}
```

### Integrate fzf with ripgrep for Content Search

Search file *contents* with ripgrep and select results interactively with fzf:

```bash
# Fuzzy search file contents and open at matching line
rg_fzf() {
  local result
  result=$(rg --color=always --line-number "$@" |
    fzf --ansi \
        --delimiter=: \
        --preview 'bat --color=always --highlight-line {2} {1}' \
        --preview-window 'right:60%:+{2}+3/3')
  [ -n "$result" ] && vim "${result%%:*}" +"$(echo "$result" | cut -d: -f2)"
}
alias rgf='rg_fzf'
```

## Related Resources

- 📦 [fzf GitHub repository](https://github.com/junegunn/fzf) — source, docs, and examples
- 📖 [fzf Wiki](https://github.com/junegunn/fzf/wiki) — advanced usage and integrations
- 🎥 [fzf examples](https://github.com/junegunn/fzf/wiki/examples) — community-contributed snippets

## Related Tools

- [bat](/tools/bat) — pairs perfectly with fzf for file previews
- [vim](/tools/vim) — edit files found with fzf
