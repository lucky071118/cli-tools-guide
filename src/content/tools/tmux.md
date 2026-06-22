---
title: "tmux — Terminal Multiplexer"
description: "Use tmux to manage multiple terminal sessions, split panes, and persistent sessions across SSH connections."
category: terminal
tags: [tmux, terminal, multiplexer]
featured: false
installCommand: "sudo apt install tmux"
officialUrl: "https://github.com/tmux/tmux"
related: [ssh, colima]
pubDate: 2024-06-01
author: "CLI Tools Guide"
lastUpdated: 2024-06-01
---

# tmux — Terminal Multiplexer

## What is tmux?

`tmux` is a terminal multiplexer — a program that lets you run multiple terminal sessions inside a single window, detach from those sessions, and reattach to them later. Whether you are working on a remote server over SSH, running a long-lived development environment, or simply want to split your terminal into multiple panes, `tmux` is the standard tool for the job.

The key insight behind `tmux` is that it decouples your terminal session from your connection. You can start a session, detach from it, and reconnect hours or days later to find everything exactly as you left it — even if the SSH connection dropped in between. This makes `tmux` essential for any developer who works extensively in the terminal.

## Why Use tmux?

- **Persistent sessions** — SSH disconnects don't kill your processes. Reattach and keep working.
- **Multiple windows** — organize work into named windows (like browser tabs) in one terminal.
- **Split panes** — view an editor, a server log, and a shell simultaneously in one terminal.
- **Scriptable** — automate complex workspace setups with shell scripts.
- **Remote-friendly** — works perfectly over SSH with minimal bandwidth.
- **Customizable** — extensive key binding and status bar configuration via `~/.tmux.conf`.
- **Shared sessions** — multiple users can view and interact with the same session simultaneously.

## Installation

```bash
# Ubuntu / Debian
sudo apt update && sudo apt install tmux

# macOS (Homebrew)
brew install tmux

# Fedora / RHEL
sudo dnf install tmux

# Arch Linux
sudo pacman -S tmux

# Alpine Linux (containers)
apk add tmux

# Verify
tmux -V
```

## Core Concepts

tmux is organized into three levels:

- **Sessions** — a collection of windows, detachable and persistent.
- **Windows** — like browser tabs, each containing one or more panes.
- **Panes** — individual terminal splits within a window.

All tmux commands start with a **prefix key** — by default `Ctrl+b`. Press the prefix, then a command key to execute an action.

## Basic Usage

```bash
# Start a new session
tmux

# Start a named session
tmux new -s dev

# List active sessions
tmux ls

# Attach to the most recent session
tmux attach

# Attach to a named session
tmux attach -t dev

# Detach from the current session (keeps it running)
# Ctrl+b, then d

# Kill a session
tmux kill-session -t dev
```

## Essential Key Bindings

All bindings assume the default prefix `Ctrl+b`.

### Sessions

| Key | Action |
|-----|--------|
| `Ctrl+b d` | Detach from session |
| `Ctrl+b $` | Rename current session |
| `Ctrl+b s` | List and switch sessions |
| `Ctrl+b (` | Switch to previous session |
| `Ctrl+b )` | Switch to next session |

### Windows

| Key | Action |
|-----|--------|
| `Ctrl+b c` | Create a new window |
| `Ctrl+b ,` | Rename current window |
| `Ctrl+b n` | Next window |
| `Ctrl+b p` | Previous window |
| `Ctrl+b w` | List and select windows |
| `Ctrl+b &` | Kill current window (with confirmation) |
| `Ctrl+b 0–9` | Switch to window by number |

### Panes

| Key | Action |
|-----|--------|
| `Ctrl+b %` | Split pane vertically (side by side) |
| `Ctrl+b "` | Split pane horizontally (top and bottom) |
| `Ctrl+b Arrow` | Move between panes |
| `Ctrl+b z` | Toggle zoom (maximize/restore current pane) |
| `Ctrl+b x` | Kill current pane |
| `Ctrl+b q` | Show pane numbers |
| `Ctrl+b {` | Move pane left |
| `Ctrl+b }` | Move pane right |

### Copy Mode

| Key | Action |
|-----|--------|
| `Ctrl+b [` | Enter copy/scroll mode |
| `q` | Exit copy mode |
| `Space` | Begin selection |
| `Enter` | Copy selection |
| `Ctrl+b ]` | Paste buffer |

## 💡 Tips & Tricks

### Tip 1: Customize the Prefix Key

Many users find `Ctrl+b` awkward and prefer `Ctrl+a` (similar to GNU Screen):

```bash
# ~/.tmux.conf
unbind C-b
set-option -g prefix C-a
bind-key C-a send-prefix
```

### Tip 2: Enable Mouse Support

```bash
# ~/.tmux.conf
set -g mouse on
```

With mouse support enabled, you can click to select panes, scroll with the mouse wheel, and resize panes by dragging borders.

### Tip 3: Use vi Key Bindings in Copy Mode

```bash
# ~/.tmux.conf
set-window-option -g mode-keys vi
bind-key -T copy-mode-vi v send-keys -X begin-selection
bind-key -T copy-mode-vi y send-keys -X copy-selection-and-cancel
```

### Tip 4: Increase History Limit

By default, tmux keeps 2,000 lines of scrollback. Increase it:

```bash
# ~/.tmux.conf
set-option -g history-limit 50000
```

### Tip 5: Status Bar Customization

```bash
# ~/.tmux.conf
set -g status-bg colour235
set -g status-fg colour136
set -g status-left '[#S] '
set -g status-right ' %Y-%m-%d %H:%M '
set -g status-right-length 50
```

### Tip 6: Reload Configuration Without Restarting

```bash
# Inside tmux:
# Ctrl+b, then :
# Type: source-file ~/.tmux.conf

# Or bind it to a key:
# ~/.tmux.conf
bind r source-file ~/.tmux.conf \; display "Config reloaded"
```

### Tip 7: Split and Send Commands to All Panes

```bash
# Send the same command to all panes in a window
tmux set-window-option synchronize-panes on
# Ctrl+b, :, setw synchronize-panes on
```

## Advanced Applications

### Development Workspace Template

Create a consistent, reproducible development environment with a shell script:

```bash
#!/bin/bash
# start-workspace.sh

SESSION="workspace"

# Kill existing session if it exists
tmux kill-session -t "$SESSION" 2>/dev/null

# Create new session with initial window: editor
tmux new-session -d -s "$SESSION" -n "editor"
tmux send-keys -t "$SESSION:editor" "cd ~/projects/myapp && vim" C-m

# Create second window: dev server
tmux new-window -t "$SESSION" -n "server"
tmux send-keys -t "$SESSION:server" "cd ~/projects/myapp && npm run dev" C-m

# Create third window with split panes: logs + shell
tmux new-window -t "$SESSION" -n "terminal"
tmux split-window -h -t "$SESSION:terminal"
tmux send-keys -t "$SESSION:terminal.left" "cd ~/projects/myapp && tail -f logs/app.log" C-m
tmux send-keys -t "$SESSION:terminal.right" "cd ~/projects/myapp" C-m

# Select the editor window and attach
tmux select-window -t "$SESSION:editor"
tmux attach -t "$SESSION"
```

Run this script from anywhere to get the same workspace every time:

```bash
chmod +x start-workspace.sh
./start-workspace.sh
```

### SSH + tmux for Remote Work

When working on remote servers, always start a tmux session so that SSH disconnects don't interrupt your work:

```bash
# Connect to a remote server
ssh user@server.example.com

# On the remote server, check for existing sessions
tmux ls

# Attach to an existing session or create a new one
tmux attach 2>/dev/null || tmux new -s main

# Work normally...
# If the connection drops, just SSH back in and run:
tmux attach -t main
```

### Pair Programming with Shared Sessions

Two developers can share the same tmux session and see each other's keystrokes in real time:

```bash
# Developer A creates a session and makes it accessible
tmux new -s shared

# Developer B attaches to the same session (read-write)
tmux attach -t shared

# For read-only access:
tmux attach -t shared -r
```

## tmux Plugin Manager (TPM)

The tmux Plugin Manager (TPM) makes it easy to install and manage tmux plugins:

```bash
# Install TPM
git clone https://github.com/tmux-plugins/tpm ~/.tmux/plugins/tpm

# Add to ~/.tmux.conf:
set -g @plugin 'tmux-plugins/tpm'
set -g @plugin 'tmux-plugins/tmux-sensible'       # sensible defaults
set -g @plugin 'tmux-plugins/tmux-resurrect'      # save and restore sessions
set -g @plugin 'tmux-plugins/tmux-continuum'      # auto-save sessions
set -g @plugin 'tmux-plugins/tmux-yank'           # copy to system clipboard

run '~/.tmux/plugins/tpm/tpm'

# Inside tmux, install plugins with: Ctrl+b I
```

## Related Resources

- 📖 [tmux Cheat Sheet](https://tmuxcheatsheet.com/)
- 🔧 [tmux GitHub Repository](https://github.com/tmux/tmux)
- 📘 [The Tao of tmux (free book)](https://leanpub.com/the-tao-of-tmux/read)

## Related Tools

- `screen` — the older terminal multiplexer that `tmux` largely replaced.
- `zellij` — a newer Rust-based terminal multiplexer with a friendlier default UX.
- `colima` — container runtime; useful to run in a tmux session for persistent access.

## Real-world Use Cases

- **Remote server work over SSH** — detach from a long-running deployment or compilation without interrupting it when the connection drops.
- **Development workspaces** — keep editor, dev server, and logs open simultaneously in named panes, instantly restorable with a script.
- **Pair programming** — share a tmux session so two developers can see and type in the same terminal simultaneously.
- **Running multiple services** — split a window into panes for each microservice's logs during local integration testing.
- **Long-running jobs** — leave database migrations, test suites, or data processing jobs running in a detached session and check back later.

## When Not To Use tmux

- **Short tasks** — for quick one-off commands there is no benefit to wrapping them in a tmux session.
- **GUI-based IDEs** — VSCode, IntelliJ, and similar tools have their own integrated terminal panels that may be more convenient.
- **Beginners** — the key binding model has a learning curve; `zellij` offers a more beginner-friendly entry point to terminal multiplexing.
- **Containerized workloads** — inside a Docker container, `tmux` is rarely needed; use the container orchestration tool to manage process lifecycles.

---

## Practical Examples: Build Persistent Terminal Workflows with tmux

```bash
# 1. One-command workspace setup: editor + server + logs
tmux new-session -d -s dev -n editor
tmux send-keys -t dev:editor 'vim .' C-m
tmux new-window -t dev -n server
tmux send-keys -t dev:server 'npm run dev' C-m
tmux new-window -t dev -n logs
tmux split-window -h -t dev:logs
tmux send-keys -t dev:logs.left 'tail -f logs/app.log' C-m
tmux select-window -t dev:editor
tmux attach -t dev

# 2. Run a long job and check back later
tmux new -d -s build 'make release 2>&1 | tee build.log'
# ... hours later ...
tmux attach -t build   # see if it finished

# 3. Quick pane layout for microservice debugging
tmux split-window -h && tmux split-window -v
tmux send-keys -t 0 'docker logs -f service-a' C-m
tmux send-keys -t 1 'docker logs -f service-b' C-m
tmux send-keys -t 2 'kubectl get pods -w' C-m
```
