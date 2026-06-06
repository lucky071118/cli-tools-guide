---
title: "bat — A cat Clone with Syntax Highlighting"
description: "Learn how to use bat, the modern replacement for cat with syntax highlighting, Git integration, and automatic paging. Includes practical tips and tricks."
category: file-viewer
tags: [bat, cat, syntax-highlighting, terminal, file-viewer]
featured: true
installCommand: "cargo install bat"
officialUrl: "https://github.com/sharkdp/bat"
related: [vim, fzf]
pubDate: 2024-01-15
author: "CLI Tools Guide"
lastUpdated: 2024-01-15
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

## Real-world Use Cases

- Code review: quickly preview changed files before committing, with `git diff` integration to spot context-sensitive changes.
- Learning new languages: use `bat` to scan sample projects with syntax highlighting to understand structure faster.
- Debugging logs: colorize structured logs (JSON, YAML) to spot fields and anomalies.

## When Not To Use bat

- Very small environments where installing Rust binaries is not possible; fallback to `cat`.
- Scripts that require pure, colorless output — use `--color=never` or `--style=plain`.

---

*Author: CLI Tools Guide — [Contact](/contact) | Last updated: 2024-01-15*

## 實作範例：用 `bat` 建立可讀性更佳的檢視流程

以下範例示範如何把 `bat` 整合到日常工作流程，提高檔案檢視與除錯效率。範例涵蓋三個情境：快速預覽、Git 差異檢查，以及在管線中使用無色輸出。

1) 快速預覽專案檔案（搭配 fzf）

把 `bat` 與 `fzf` 結合，建立一個互動式檔案預覽工具：

```bash
# 將可預覽的檔案使用 fzf 選擇，右側顯示 bat 預覽
fzf --preview 'bat --color=always --style=numbers --line-range=:120 {}' \
  --preview-window 'right:60%' \
  --bind 'enter:accept' \
  --height 40%
```

這個指令可以快速在大型專案中定位檔案，且預覽會顯示語法高亮與行號，閱讀與導覽更直覺。

2) 在 Git 差異檢查中漂亮顯示變更

把 `bat` 設為 Git 的 pager，可在 `git diff` 時看到帶顏色與行號的差異：

```bash
git config --global core.pager "bat --paging=always --style=numbers,changes"

# 現在執行 git diff 時會用 bat 顯示（保留色彩與變動標記）
git diff HEAD~1
```

這能幫助審查變更時更快定位到改動的位置與語義。

3) 在自動化腳本中輸出純文字（無顏色）以便解析

若要在 CI 或腳本中使用 `bat` 輸出但不希望有顏色控制碼，可以關閉色彩並使用純輸出：

```bash
# 在腳本中使用無色輸出以保證被其他工具正確解析
bat --color=never --style=plain README.md > /tmp/readme-plain.txt

# 或在管線中直接傳給 grep/awk 處理
bat --color=never src/main.rs | rg "TODO|FIXME"
```

這樣可以在保有 `bat` 的語言推斷與格式化優勢下，提供機器讀取友好的輸出。

以上實作示例可立即提升日常使用 `bat` 的效率，並讓檔案檢視、版本檢查與自動化流程更穩定。
