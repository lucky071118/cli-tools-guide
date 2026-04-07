---
title: "bat — A cat Clone with Syntax Highlighting"
description: "Learn how to use bat, the modern replacement for cat with syntax highlighting, Git integration, and automatic paging. Includes practical tips and tricks."
slug: bat
category: file-viewer
tags: [bat, cat, syntax-highlighting, terminal, file-viewer]
featured: true
installCommand: "cargo install bat"
officialUrl: "https://github.com/sharkdp/bat"
related: [vim, fzf]
pubDate: 2024-01-15
---

# bat — A cat Clone with Syntax Highlighting

## What is bat?

**bat** is a `cat` clone written in Rust that adds syntax highlighting, line numbers, Git integration, and automatic paging to your file viewing experience. It's one of the most popular modern CLI replacements, making reading source code in the terminal a pleasure instead of a chore.

## Why Use bat Instead of cat?

- 🎨 **Syntax highlighting** for hundreds of programming languages
- 🔢 **Line numbers** displayed by default
- 📂 **Git integration** — shows modified/added/deleted lines at a glance
- 📄 **Automatic paging** with `less` for long files
- 🔍 **Non-printable character display** for debugging
- 🚀 **Drop-in replacement** — same usage as `cat`

## Installation

```bash
# macOS (Homebrew)
brew install bat

# Ubuntu / Debian
sudo apt install bat
# Note: on some systems the binary is called batcat
# alias bat='batcat'

# Arch Linux
sudo pacman -S bat

# Cargo (Rust)
cargo install bat

# Windows (Scoop)
scoop install bat

# Windows (Chocolatey)
choco install bat
```

## Basic Usage

```bash
# Display a file with syntax highlighting
bat file.py

# Display multiple files
bat file1.js file2.ts

# Display with line numbers (default)
bat -n README.md

# Show without paging (like cat)
bat --paging=never config.yaml

# Show specific line range
bat -r 10:30 main.rs
```

## 💡 Tips & Tricks

### Tip 1: Set bat as Your Default Pager

Make `man` pages and `git diff` use bat's beautiful highlighting:

```bash
# Add to ~/.bashrc or ~/.zshrc
export MANPAGER="sh -c 'col -bx | bat -l man -p'"
export PAGER="bat"

# For git diff
git config --global core.pager bat
```

### Tip 2: Use bat with fzf for File Preview

Combine `bat` with `fzf` for an interactive file finder with live preview:

```bash
# Preview files while searching with fzf
fzf --preview 'bat --color=always --style=numbers --line-range=:100 {}'
```

Add this to your shell config for a handy `preview` alias:

```bash
alias preview="fzf --preview 'bat --color=always {}'"
```

### Tip 3: Highlight Specific Lines

Draw attention to important lines using the `--highlight-line` flag:

```bash
# Highlight line 42
bat --highlight-line 42 script.sh

# Highlight a range
bat --highlight-line 10:20 app.py
```

### Tip 4: Choose Your Theme

bat comes with many built-in themes. Pick one that matches your terminal:

```bash
# List all available themes
bat --list-themes

# Preview all themes on a file
bat --list-themes | fzf --preview="bat --theme={} --color=always /path/to/file.py"

# Set a permanent theme in bat's config
echo '--theme="Dracula"' >> "$(bat --config-file)"
```

### Tip 5: Use bat as a Syntax Highlighter in Other Tools

You can pipe content to bat and specify the language manually:

```bash
# Pipe command output with syntax highlighting
echo '{"name": "bat", "type": "cli"}' | bat -l json

# Highlight a script that has no extension
curl -s https://example.com/script | bat -l bash

# View clipboard content with highlighting (macOS)
pbpaste | bat -l python
```

### Tip 6: Show Non-Printable Characters

Debug encoding issues and invisible characters:

```bash
# Show non-printable and special characters
bat -A file.txt

# Show tabs as visible characters
bat --show-all config.ini
```

### Tip 7: Create a bat Config File

Persist your preferred settings so you don't have to retype flags:

```bash
# Create the config file
bat --config-file  # shows the config file location
mkdir -p "$(dirname $(bat --config-file))"
touch "$(bat --config-file)"

# Add your preferences
cat >> "$(bat --config-file)" << 'EOF'
--theme="Dracula"
--style="numbers,changes,header"
--italic-text=always
EOF
```

### Tip 8: Integrate bat with tail -f for Log Monitoring

Watch log files with syntax highlighting in real time:

```bash
# Live log monitoring with bat
tail -f /var/log/app.log | bat --paging=never -l log

# Or use the --follow flag (bat 0.24+)
bat --follow /var/log/app.log
```

## Advanced Applications

### bat as a Git Difftool

Use bat to replace the default `git diff` pager for colorful diffs:

```bash
# Set bat as the global diff pager
git config --global core.pager "bat --paging=always"

# Or just for a single command
GIT_PAGER='bat' git diff HEAD~1
```

### Integrate bat into Your Shell Functions

```bash
# A smarter cat: fall back to bat for code files, plain cat for others
smart_cat() {
  if [ -t 1 ]; then
    bat "$@"
  else
    cat "$@"
  fi
}
alias cat='smart_cat'
```

### bat in Scripts with Plain Output

When using bat inside shell scripts where you don't want color codes:

```bash
# Disable color and decorations for script use
bat --color=never --style=plain filename.txt

# Or set BAT_STYLE and BAT_THEME env vars
BAT_STYLE=plain BAT_THEME=ansi bat file.txt
```

## Related Resources

- 📦 [bat GitHub repository](https://github.com/sharkdp/bat) — source code and issue tracker
- 📖 [bat README](https://github.com/sharkdp/bat#readme) — full documentation
- 🎨 [bat themes list](https://github.com/sharkdp/bat/tree/master/assets/themes) — built-in themes

## Related Tools

- [fzf](/tools/fzf) — fuzzy finder that pairs perfectly with bat for file previews
- [vim](/tools/vim) — when you need to edit, not just view
