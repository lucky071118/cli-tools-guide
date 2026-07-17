---
title: "ripgrep — Fast Recursive Search for the Terminal"
description: "Learn how to use ripgrep for blazing-fast recursive search in codebases and terminal workflows with practical examples and performance tips."
category: search
tags: [ripgrep, search, regex, terminal, productivity]
featured: false
installCommand: "brew install ripgrep"
officialUrl: "https://github.com/BurntSushi/ripgrep"
related: [fzf, grep, bat]
pubDate: 2026-07-17
author: "CLI Tools Guide"
lastUpdated: 2026-07-17
---

# ripgrep — Fast Recursive Search for the Terminal

## What is ripgrep?

**ripgrep** (rg) is a line-oriented search tool that recursively searches directories for a regex pattern. It combines the speed of `grep` with sensible defaults, automatic directory exclusion, and excellent Unicode handling. Developers use it when they need fast, reliable search across large source trees.

## Why Use ripgrep?

- ⚡ **Blazing speed** — written in Rust and optimized for search performance.
- 🔍 **Smart defaults** — ignores `.gitignore` and hidden files automatically.
- 🧠 **Regex power** — supports Rust-flavored regular expressions for precise matching.
- 📁 **Recursive search** — searches entire projects with one command.
- 🌐 **Unicode support** — handles Unicode filenames and text without trouble.
- 🧰 **Wide integration** — works well with editors, pipes, and shell workflows.

## Installation

```bash
# macOS (Homebrew)
brew install ripgrep

# Ubuntu / Debian
sudo apt install ripgrep

# Fedora / RHEL
sudo dnf install ripgrep

# Arch Linux
sudo pacman -S ripgrep

# Windows (Chocolatey)
choco install ripgrep

# Rust cargo
cargo install ripgrep
```

## Basic Usage

```bash
# Search for a word in the current directory
rg TODO

# Search for a regex pattern
rg "fix(es)?|bug"

# Search in a specific file type
rg --type py def

# Search case-insensitively
rg -i TODO

# Show line numbers with results
rg -n "search term"
```

## 💡 Tips & Tricks

### Tip 1: Use `--type` for language-aware search

`ripgrep` recognizes file types like `js`, `py`, `rs`, and more. Use `--type` to narrow the search to one language.

```bash
rg --type py async
```

### Tip 2: Exclude common directories with `--glob`

When you need to avoid build output or vendored code, use `--glob` to exclude directories.

```bash
rg TODO --glob '!node_modules/*' --glob '!build/*'
```

### Tip 3: Search only filenames, not contents

If you want to find files by name, use `-g` with `--files` and a pattern.

```bash
rg --files -g '*.md'
```

### Tip 4: Search with ripgrep and preview with bat

Pipe ripgrep results into `bat` to preview matching files in a readable way.

```bash
rg -l TODO | xargs bat --style=numbers --color=always
```

### Tip 5: Use `--context` to see surrounding lines

Add context to each match for better understanding.

```bash
rg --context 2 TODO
```

### Tip 6: Search across git-tracked files only

When you want to ignore untracked workspace files, combine ripgrep with git status.

```bash
git ls-files | rg TODO
```

## Advanced Applications

### Search inside compressed or archive files

ripgrep can search inside files with extensions ignored by default. If you need to inspect archives, use external tools to extract or combine with `find`.

```bash
find . -name '*.log' -print0 | xargs -0 rg "ERROR"
```

### Use ripgrep for multi-step code refactoring

Search for a pattern, review the matches, and perform safe substitutions in an editor.

```bash
rg "oldFunction" -n
# then open matching files in your editor for replacement
```

### Integrate ripgrep with fzf for fuzzy selection

Use `fzf` to select the exact file or match you want from ripgrep results.

```bash
rg "TODO" --line-number | fzf --delimiter : --preview 'bat --style=numbers --color=always {1} --highlight-line {2}'
```

## Related Resources

- 📖 [ripgrep GitHub repository](https://github.com/BurntSushi/ripgrep)
- 🔧 [ripgrep documentation](https://github.com/BurntSushi/ripgrep/blob/master/README.md)
- 🧰 [Rust regex reference](https://docs.rs/regex/latest/regex/)

## Related Tools

- `fzf` — use ripgrep results as fuzzy search input.
- `bat` — preview matching files with syntax highlighting.
- `grep` — traditional Unix search tool; ripgrep is faster for large repos.

## Real-world Use Cases

- **Codebase search** — find definitions, TODOs, or bug reports across a large repository.
- **Refactoring** — inspect every occurrence of a function or variable before changing it.
- **Log analysis** — scan log directories for errors or performance issues.
- **Configuration audits** — locate hard-coded values or secrets in infrastructure code.
- **CI / automation** — use ripgrep in scripts to detect patterns in generated files.
- **Editor integration** — quick project-wide search from within Vim, Neovim, or VS Code.

## When Not To Use ripgrep

- **Binary-only search** — ripgrep is designed for text, not binary diffing.
- **Very small files** — for a single small file, `grep` or `cat` may be faster to type.
- **Complex parsing** — if you need full AST-level understanding, use language-specific tools.
- **Search in non-text formats** — use a dedicated parser for JSON, YAML, or other structured formats if you need semantic analysis.

## Practical Examples: Common ripgrep Workflows

```bash
# 1. Search for a pattern in Python files only
rg --type py "def \w+"

# 2. Find all TODO comments and show two lines of context
rg -n --context 2 TODO

# 3. Search for function names and preview results in bat
rg --line-number "process_.*" | fzf --delimiter : --preview 'bat --style=numbers --color=always {1} --highlight-line {2}'

# 4. Search within git-tracked files only
git ls-files | rg "FIXME"
```
