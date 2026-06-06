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

## Practical Example: 開發工作區範本

為了快速建立一致的開發環境，可以用一個簡單的 tmux 腳本建立多窗格：

```bash
tmux new-session -d -s workspace
tmux rename-window -t workspace:0 'editor'
tmux send-keys -t workspace:0 'cd ~/projects/myapp && vim' C-m
tmux split-window -h -t workspace:0
tmux send-keys -t workspace:0.1 'cd ~/projects/myapp && ./run-dev-server.sh' C-m
tmux select-pane -t 0
tmux attach -t workspace
```

這會在一個 session 建立編輯器窗格與開發伺服器窗格，方便在本機或遠端工作時保持一致的視窗佈局。

## Related Resources

- 📖 [tmux Cheat Sheet](https://tmuxcheatsheet.com/)
