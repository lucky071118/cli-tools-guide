---
title: "vim — The Ubiquitous Terminal Text Editor"
description: "Master vim, the powerful modal text editor found on virtually every Unix system. Learn essential commands, configuration tips, and pro tricks to boost your productivity."
slug: vim
category: editor
tags: [vim, editor, text-editor, terminal, modal-editing]
featured: true
installCommand: "sudo apt install vim"
officialUrl: "https://www.vim.org"
related: [bat, fzf]
pubDate: 2024-01-16
---

# vim — The Ubiquitous Terminal Text Editor

## What is vim?

**vim** (Vi IMproved) is a highly configurable, efficient terminal-based text editor available on virtually every Unix-like system. Originally based on the classic `vi` editor, vim adds hundreds of improvements while maintaining the same powerful modal editing paradigm that makes skilled users extremely fast.

## Why Learn vim?

- 🌍 **Ubiquitous** — available on every server, container, and Unix system
- ⚡ **Blazing fast** — edit without ever lifting your hands from the keyboard
- 🔧 **Highly customizable** — plugins and `.vimrc` configuration
- 💪 **Powerful editing** — macros, regex, motions, and text objects
- 🖥️ **Works anywhere** — SSH sessions, Docker containers, minimal environments
- 🧠 **Transfers to other tools** — vim keybindings available in bash, less, IDEs

## Installation

```bash
# Ubuntu / Debian
sudo apt update && sudo apt install vim

# macOS (pre-installed, or newer via Homebrew)
brew install vim

# Arch Linux
sudo pacman -S vim

# Fedora / RHEL
sudo dnf install vim

# Alpine Linux (containers)
apk add vim

# Check your version
vim --version | head -1
```

## Basic Usage — The Three Essential Modes

vim uses **modal editing** — the same key does different things depending on the active mode:

| Mode | How to Enter | Purpose |
|------|-------------|---------|
| Normal | `Esc` | Navigate and run commands |
| Insert | `i`, `a`, `o` | Type and edit text |
| Visual | `v`, `V`, `Ctrl+v` | Select text |
| Command | `:` | Execute ex commands |

```bash
# Open a file
vim filename.txt

# Open multiple files in split view
vim -O file1.py file2.py

# Open at a specific line
vim +42 main.go

# Read-only mode
vim -R config.conf
```

### Essential Commands Quick Reference

```
Normal mode:
  h j k l     — move left/down/up/right
  w / b       — move forward/back by word
  0 / $       — beginning/end of line
  gg / G      — first/last line
  dd          — delete (cut) current line
  yy          — yank (copy) current line
  p / P       — paste after/before cursor
  u           — undo
  Ctrl+r      — redo
  /pattern    — search forward
  n / N       — next/previous search result

Command mode (:):
  :w          — save
  :q          — quit
  :wq or :x   — save and quit
  :q!         — quit without saving
  :%s/old/new/g — replace all occurrences
  :set nu     — show line numbers
```

## 💡 Tips & Tricks

### Tip 1: Map jk to Escape for Faster Mode Switching

The default `Esc` key requires moving your hand away from the home row. Mapping `jk` as an escape sequence is a game-changer:

```vim
" Add to ~/.vimrc
inoremap jk <Esc>
inoremap kj <Esc>
```

Now you can exit insert mode by quickly typing `jk` — no hand movement required.

### Tip 2: Use Text Objects for Precise Editing

Text objects let you operate on logical chunks of code without moving the cursor first:

```
ci"   — change inside double quotes
ca(   — change around parentheses (includes the parens)
di{   — delete inside curly braces
yip   — yank inside paragraph
vis   — visually select inside sentence
dat   — delete around HTML tag (including the tag)
```

Example: cursor anywhere inside `"hello world"` → `ci"` → deletes the text and enters insert mode.

### Tip 3: Record and Replay Macros

Automate repetitive edits with vim macros:

```
qa        — start recording macro into register 'a'
(do your edits)
q         — stop recording
@a        — replay macro once
10@a      — replay macro 10 times
@@        — repeat last macro
```

Example: add a semicolon to the end of 50 lines → record adding `;` with `A;<Esc>j`, then `49@@`.

### Tip 4: Split Windows and Tabs for Multi-File Editing

```vim
" Split horizontally
:split other_file.py
" or shortcut
Ctrl+w s

" Split vertically
:vsplit other_file.py
" or shortcut
Ctrl+w v

" Navigate splits
Ctrl+w h/j/k/l   — move between splits
Ctrl+w =         — equalize split sizes

" Tabs
:tabnew file.py  — open in new tab
gt / gT          — next/previous tab
```

### Tip 5: Use the Global Command for Bulk Operations

The `:g` (global) command applies an operation to every line matching a pattern:

```vim
" Delete all empty lines
:g/^$/d

" Delete all lines containing TODO
:g/TODO/d

" Copy all lines matching a pattern to end of file
:g/error/t$

" Print all lines with the word 'function'
:g/function/p
```

### Tip 6: Master the Substitution Command

The `:%s` command is one of vim's most powerful features:

```vim
" Basic: replace first occurrence per line
:%s/old/new/

" Replace all occurrences (g flag)
:%s/old/new/g

" Case-insensitive (i flag)
:%s/old/new/gi

" Confirm each replacement (c flag)
:%s/old/new/gc

" Use captures in replacement
:%s/\(foo\)\(bar\)/\2\1/g

" Replace in visual selection only (highlight first, then :s)
:'<,'>s/old/new/g
```

### Tip 7: Create a Minimal but Powerful .vimrc

Start with this well-commented `.vimrc` to make vim much more comfortable:

```vim
" ~/.vimrc

" Basic settings
set nocompatible          " Use vim defaults, not vi
set encoding=utf-8
set number relativenumber " Hybrid line numbers
set cursorline            " Highlight current line
set wildmenu              " Better command-line completion
set incsearch             " Incremental search
set hlsearch              " Highlight search results
set ignorecase smartcase  " Smart case sensitivity

" Indentation
set tabstop=4
set shiftwidth=4
set expandtab             " Use spaces instead of tabs
set autoindent

" Visual
syntax on
set background=dark
colorscheme desert

" Keymaps
let mapleader = " "
inoremap jk <Esc>
nnoremap <leader>w :w<CR>
nnoremap <leader>q :q<CR>

" Clear search highlight with Enter
nnoremap <CR> :nohlsearch<CR>
```

### Tip 8: Use Marks to Jump Between Locations

vim marks let you teleport to any position in any open file:

```
ma        — set mark 'a' at current position
'a        — jump to line of mark 'a'
`a        — jump to exact position of mark 'a'

Uppercase marks persist between sessions:
mA        — set global mark 'A'
'A        — jump to mark 'A' from anywhere

Special marks:
''        — jump to last jump position
'.        — jump to last edited position
'^        — jump to last insert position
```

## Advanced Applications

### vim as a Git Commit Editor

Set vim as your Git editor for beautifully editing commit messages:

```bash
git config --global core.editor vim
```

Inside the editor you get syntax highlighting for commit messages and can use all vim motions.

### Using vimdiff for Code Review

```bash
# Compare two files side by side with differences highlighted
vimdiff file1.py file2.py

# In vimdiff:
]c / [c   — jump to next/previous difference
dp        — diff put (copy current diff to other window)
do        — diff obtain (get change from other window)
:diffupdate — refresh diff
```

### Running Shell Commands Inside vim

```vim
" Run a shell command and see output
:!ls -la

" Run current file as a script
:!python %

" Insert command output into buffer
:r !date

" Shell out temporarily (Ctrl+z to suspend, fg to return)
:sh
```

## Related Resources

- 🏠 [vim official website](https://www.vim.org) — downloads and documentation
- 📚 [Vim Adventures](https://vim-adventures.com) — learn vim through an interactive game
- 📖 [Learn Vim the Smart Way](https://learnvim.irian.to) — comprehensive free book
- ⚙️ [vim-plug](https://github.com/junegunn/vim-plug) — popular plugin manager

## Related Tools

- [bat](/tools/bat) — view files with syntax highlighting when you don't need to edit
- [fzf](/tools/fzf) — fuzzy finder with excellent vim integration
