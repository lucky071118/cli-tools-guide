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

`tmux` lets you create persistent terminal sessions, split windows, and manage long-running processes in detachable sessions.

## Basic Usage

```bash
# Start a session
tmux new -s dev

# Detach: Ctrl-b d
# Re-attach
tmux attach -t dev

# List sessions
tmux ls
```

## Practical Example: Development Workspace Template

To create a consistent development environment quickly, you can use a simple tmux script to build a multi-pane workspace:

```bash
tmux new-session -d -s workspace
tmux rename-window -t workspace:0 'editor'
tmux send-keys -t workspace:0 'cd ~/projects/myapp && vim' C-m
tmux split-window -h -t workspace:0
tmux send-keys -t workspace:0.1 'cd ~/projects/myapp && ./run-dev-server.sh' C-m
tmux select-pane -t 0
tmux attach -t workspace
```

This creates editor and development-server panes in a single session, which helps keep the window layout consistent whether you work locally or remotely.

## Related Resources

- 📖 [tmux Cheat Sheet](https://tmuxcheatsheet.com/)
