---
title: "tree — Visualize directory structure as a tree"
description: "Use tree to inspect filesystem layout, filter files, and generate directory maps in a compact, readable tree view."
category: file-viewer
tags: [tree, directory, filesystem, files, file-viewer, navigation]
featured: false
installCommand: "brew install tree"
officialUrl: "https://mama.indstate.edu/users/ice/tree/"
related: [ripgrep, fzf]
pubDate: 2026-07-26
author: "CLI Tools Guide"
lastUpdated: 2026-07-26
---

# tree — Visualize directory structure as a tree

## What is tree?

tree is a small command-line utility that prints a directory listing in a recursive tree format. Rather than reading a long `ls` output, `tree` shows the filesystem hierarchy with branches, indentation, and file counts so you can understand folder layout instantly.

Designed for developers, sysadmins, site reliability engineers, and anyone who works with nested directories, `tree` is especially useful for exploring project structure, documenting repositories, and detecting unexpected files in a folder.

## Why Use tree?

- 🌲 **Clear directory visualization** — shows nested folders and files with ASCII tree branches.
- 🔍 **Quick structure review** — inspect layout without manually walking the filesystem.
- 📄 **Exportable maps** — save directory trees to text files for documentation or code reviews.
- 🚀 **Fast recursive view** — one command replaces multiple `find`, `ls`, and `sed` steps.
- 🧹 **Filter by extension or depth** — focus on the files and folders that matter.
- 🧭 **Useful for auditing** — quickly spot hidden files, build output, or unusual directory depths.

## Installation

```bash
# macOS (Homebrew)
brew install tree

# Ubuntu / Debian
sudo apt update && sudo apt install tree

# Fedora / RHEL
sudo dnf install tree

# Arch Linux
sudo pacman -S tree

# Alpine Linux
sudo apk add tree

# Windows (WSL / Git Bash)
# Install via the Linux distribution package manager, then run tree from the shell.

# Verify installation
tree --version
```

## Basic Usage

```bash
# Show the current directory tree
tree

# Show the tree for a specific directory
tree src

# Limit output depth to 2 levels
tree -L 2

# Show only directories
tree -d

# Print file sizes with the tree layout
tree -h
```

## 💡 Tips & Tricks

### Tip 1: Use `-L` to limit recursion depth

When exploring a large repository, restrict the output to the top levels:

```bash
tree -L 2
```

This is ideal for quickly understanding the project root without scrolling through deep folders.

### Tip 2: Filter by file extension

Use the `-P` option to show only files that match a shell pattern:

```bash
tree -P '*.md' -I 'node_modules|.git'
```

This is great for viewing only documentation, source files, or test files.

### Tip 3: Ignore unwanted directories

Combine `-I` with patterns to hide build artifacts and dependency directories:

```bash
tree -I 'node_modules|dist|build|.git'
```

### Tip 4: Output a directory map to a file

Generate a shareable directory listing for README or documentation:

```bash
tree -a -I 'node_modules|.git' > tree.txt
```

### Tip 5: Show hidden files

Include dotfiles and hidden directories using `-a`:

```bash
tree -a
```

This helps verify whether config files like `.env`, `.gitignore`, or `.dockerignore` are present.

### Tip 6: Combine with `grep` for quick searches

Search the tree output with `grep` when you want to find a path pattern:

```bash
tree -a | grep -E 'Dockerfile|README|config'
```

### Tip 7: Use `-h` for human-readable sizes

Show file sizes in a human-friendly format:

```bash
tree -h
```

This is useful when checking whether one directory is consuming most of the space.

### Tip 8: Count directories and files

Use `-a` with `-F` and `-I` for a complete count plus a cleaner summary:

```bash
tree -a -I 'node_modules|.git'
```

The summary at the bottom tells you how many directories and files are included.

### Tip 9: Show only directories and file counts

```bash
tree -d | tail -n +1
```

This is a good way to review folder structure without file noise.

### Tip 10: Use `-f` to print full path prefixes

```bash
tree -f -P '*.sh'
```

The output shows absolute or relative file paths, which is helpful when generating a file list for scripts.

## Advanced Applications

### Generate a documentation-friendly repository map

Add a `tree` snapshot to a README or docs file for a clean overview of repo contents:

```bash
tree -L 3 -I 'node_modules|.git|dist|build' > docs/repo-tree.txt
```

Use this in PR descriptions or project onboarding guides so reviewers can see the structure before opening files.

### Inspect workspace layout in CI

Automate a directory layout check in CI to confirm important folders exist:

```bash
if command -v tree > /dev/null; then
  tree -L 2 -I 'node_modules|.git' || true
fi
```

This is useful for validating build outputs and verifying generated artifacts.

### Use `tree` with `jq` and `ripgrep`

Combine tools to inspect file types and search inside directories:

```bash
# List markdown files and count them with ripgrep
tree -P '*.md' -f | rg -c '\.md$'
```

### Explore hidden configuration files quickly

```bash
tree -a -I 'node_modules|.git' | grep '^\.'
```

This reveals hidden project files at a glance.

## Related Resources

- 📖 [tree official documentation](https://mama.indstate.edu/users/ice/tree/)
- 🔧 [GitHub mirror of tree source](https://github.com/trevorsenior/tree)
- 📘 [Unix `tree` tutorial](https://www.cyberciti.biz/faq/linux-unix-tree-command/)

## Related Tools

- `ripgrep` — fast search through files and directories while `tree` shows the layout.
- `fzf` — interactive file selection after using `tree` to review the project structure.
- `bat` — preview file contents once you locate them with `tree`.

## Real-world Use Cases

- **Reviewing a new project** — inspect the repository layout before diving into source code.
- **Documenting an app structure** — save a directory map for onboarding or architecture notes.
- **Spotting accidental files** — find unwanted build artifacts, temporary files, or `.env` leaks quickly.
- **Comparing branches** — capture `tree` output from two branches to compare project structure changes.
- **CI log debugging** — print a directory tree when tests fail to show what was actually built.
- **Writing tutorials** — include a visual tree map in blog posts or docs so readers understand file placement.

## When Not To Use tree

- **Large filesystems without filters** — raw `tree` can generate overwhelming output for huge directories.
- **Searching inside files** — use `ripgrep` when you need content search instead of layout inspection.
- **Binary-only file analysis** — use `du`, `ncdu`, or `find` for disk usage and file metadata queries.
- **Complex file filtering** — `find` is better when you need fine-grained path logic and advanced predicates.

## Practical Examples: Common tree commands

```bash
# 1. Show the top 3 directory levels in the current project

tree -L 3 -I 'node_modules|.git|dist|build'

# 2. Output only markdown and text files

tree -P '*.md' -o tree-markdown.txt

# 3. Print a tree that includes hidden files and full paths

tree -a -f

# 4. Generate a directory map while ignoring common dependency folders

tree -L 4 -I 'node_modules|.git|target' > repo-layout.txt
```
