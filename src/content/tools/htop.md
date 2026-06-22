---
title: "htop — Interactive Process Viewer"
description: "Monitor system processes, resource usage, and performance interactively with htop."
category: monitoring
tags: [htop, monitoring, processes]
featured: false
installCommand: "sudo apt install htop"
officialUrl: "https://htop.dev/"
related: [top, ps]
pubDate: 2024-06-01
author: "CLI Tools Guide"
lastUpdated: 2024-06-01
---

# htop — Interactive Process Viewer

## What is htop?

`htop` is an interactive, cross-platform system monitor and process viewer for the terminal. It is a dramatically improved replacement for the traditional `top` command, adding colour, real-time filtering, mouse support, scrollable process lists, and a much more intuitive interface for managing running processes.

Whether you are investigating a slow server, identifying runaway processes, checking memory pressure, or just monitoring system health in real time, `htop` gives you a clear, at-a-glance picture of everything happening on your machine.

## Why Use htop?

- **Colourful, readable UI** — CPU, memory, and swap usage rendered as visual bar graphs.
- **Per-core CPU meters** — see load on each individual CPU core at a glance.
- **Mouse support** — click to select processes, drag to resize columns.
- **Interactive filtering** — search and filter processes by name in real time.
- **Tree view** — visualize parent/child process relationships.
- **Kill processes** — send signals to processes without leaving the interface.
- **Sort by any column** — CPU, memory, PID, user, command, and more.
- **Scrollable** — scroll vertically and horizontally to see all processes.
- **Configurable** — customize the display, meters, and columns.

## Installation

```bash
# Ubuntu / Debian
sudo apt update && sudo apt install htop

# macOS (Homebrew)
brew install htop

# Fedora / RHEL
sudo dnf install htop

# Arch Linux
sudo pacman -S htop

# Alpine Linux
apk add htop

# FreeBSD
pkg install htop

# Verify
htop --version
```

## Basic Usage

Simply run `htop` to open the interactive monitor:

```bash
htop

# Monitor processes for a specific user
htop -u alice

# Set the update delay (in tenths of seconds, default 15 = 1.5s)
htop -d 5

# Show only processes matching a string (start with filter active)
htop -F "nginx"
```

## Understanding the htop Interface

The htop interface has three main areas:

### Header — System Meters

The top section shows:

- **CPU bars** — one bar per logical CPU core, coloured by usage type:
  - Blue: low-priority (nice) processes
  - Green: normal user processes
  - Red: kernel processes
  - Orange: I/O wait
- **Memory bar** — RAM usage (green = used, blue = buffers, yellow = cache)
- **Swap bar** — swap space usage
- **Load average** — 1, 5, and 15-minute averages
- **Uptime** — how long the system has been running
- **Task count** — total tasks, threads, and running processes

### Process List

The main area shows all running processes with columns including:

| Column | Meaning |
|--------|---------|
| `PID` | Process ID |
| `USER` | Owner of the process |
| `PRI` | Priority |
| `NI` | Nice value (-20 to 19) |
| `VIRT` | Virtual memory used |
| `RES` | Resident (physical) memory used |
| `SHR` | Shared memory |
| `S` | State (R=running, S=sleeping, Z=zombie) |
| `CPU%` | CPU usage percentage |
| `MEM%` | Memory usage percentage |
| `TIME+` | Total CPU time consumed |
| `Command` | Full command line |

### Function Key Bar

The bottom bar shows available actions:
- **F1** Help
- **F2** Setup (configuration)
- **F3** Search (filter by process name)
- **F4** Filter
- **F5** Tree view
- **F6** Sort by column
- **F7** Nice - (decrease priority)
- **F8** Nice + (increase priority)
- **F9** Kill (send signal)
- **F10** Quit

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `F3` or `/` | Search for a process by name |
| `F5` or `t` | Toggle tree view |
| `F6` or `>` | Choose sort column |
| `F9` or `k` | Kill selected process |
| `F4` or `\` | Filter processes |
| `u` | Filter by user |
| `Space` | Tag a process |
| `U` | Untag all processes |
| `H` | Toggle user threads |
| `K` | Toggle kernel threads |
| `I` | Invert sort order |
| `M` | Sort by memory usage |
| `P` | Sort by CPU usage |
| `T` | Sort by time |
| `q` or `F10` | Quit |
| `e` | Show process environment variables |

## 💡 Tips & Tricks

### Tip 1: Find the Highest CPU or Memory Consumer

Press `P` to sort by CPU percentage, or `M` to sort by memory. The hungriest process jumps to the top instantly.

### Tip 2: Use Tree View to Understand Process Relationships

Press `F5` or `t` to switch to tree view. Child processes are indented under their parents, making it easy to see which processes belong to a service, shell, or container.

### Tip 3: Filter Processes by Name

Press `F4` or `\` and type a substring. The list filters in real time to show only matching processes. Useful for finding all `nginx`, `node`, or `python` workers.

### Tip 4: Kill a Runaway Process

1. Navigate to the process with arrow keys (or use `/` to search by name).
2. Press `F9` or `k` to open the signal menu.
3. Select `SIGTERM` (15) for a graceful stop, or `SIGKILL` (9) to force-kill.
4. Press `Enter` to send the signal.

### Tip 5: Monitor a Specific User's Processes

Press `u` and select a username from the list. htop will then show only that user's processes.

### Tip 6: Customize the Display

Press `F2` to open the Setup menu. You can:
- Add or remove meters from the header
- Choose which columns appear in the process list
- Change colour themes
- Configure the update frequency

### Tip 7: Tag Multiple Processes and Kill Them All

1. Navigate to a process and press `Space` to tag it (an asterisk appears).
2. Tag additional processes with `Space`.
3. Press `F9` to send a signal to all tagged processes at once.

## Advanced Applications

### Find the Highest-Memory Process and Inspect It

```bash
# Sort by memory in htop (interactive)
htop
# Press M to sort by MEM%

# Alternatively, do this non-interactively from the command line:
# Show the top 10 memory-consuming processes
ps aux --sort=-%mem | head -n 11

# Get the PID of the top memory user
top_pid=$(ps aux --sort=-%mem | awk 'NR==2{print $2}')
echo "Top memory PID: $top_pid"

# Show detailed info about the process
cat /proc/$top_pid/status | grep -E "^(Name|VmRSS|VmSize|Threads)"

# Restart a specific service if it's consuming too much memory
pid=$(pgrep -f 'myservice')
if [ -n "$pid" ]; then
  kill -HUP $pid
  echo "Sent SIGHUP to $pid"
fi
```

### Watch Resource Usage During a Build or Test Run

Open two panes in `tmux` — one running your build, one running `htop` — to see resource usage in real time:

```bash
# In tmux, split the window horizontally
# Ctrl+b, then "

# In the top pane, start htop
htop

# In the bottom pane, run your workload
npm run build
```

### System Health Check Script

Use `ps` and related commands in shell scripts where `htop` is not available (or for automation):

```bash
#!/bin/bash
echo "=== System Resource Summary ==="
echo ""
echo "Load averages:"
uptime

echo ""
echo "Memory:"
free -h

echo ""
echo "Top 5 CPU-consuming processes:"
ps aux --sort=-%cpu | awk 'NR<=6 {printf "%-10s %-6s %-6s %s\n", $1, $2, $3, $11}'

echo ""
echo "Top 5 memory-consuming processes:"
ps aux --sort=-%mem | awk 'NR<=6 {printf "%-10s %-6s %-6s %s\n", $1, $2, $4, $11}'

echo ""
echo "Disk usage:"
df -h | grep -v tmpfs
```

## Alternatives and Related Tools

| Tool | Purpose |
|------|---------|
| `top` | Classic, pre-installed on all Unix systems |
| `btop` | Modern, resource-graph-focused monitor (successor to `bpytop`) |
| `glances` | Python-based monitor with web interface support |
| `nmon` | IBM's performance monitor, popular on servers |
| `iotop` | I/O-specific monitor — see which processes are using disk |
| `nethogs` | Network traffic monitor per process |
| `ps` | Static snapshot of processes, scriptable |

## Related Resources

- 🔧 [htop Official Website](https://htop.dev/)
- 📦 [htop GitHub Repository](https://github.com/htop-dev/htop)
- 📖 [Linux `ps` Manual](https://man7.org/linux/man-pages/man1/ps.1.html)

## Related Tools

- `ps` — static process snapshot; perfect for scripting.
- `top` — the original, pre-installed on every Unix system.
- `tmux` — run `htop` in a persistent tmux pane alongside your development work.

## Real-world Use Cases

- **Incident investigation** — quickly spot the runaway process consuming 100% CPU or exhausting RAM on a production server.
- **Development profiling** — watch memory and CPU usage in real time while running a build, test suite, or data processing job.
- **Container monitoring** — run `htop` inside a container to inspect its processes when `docker stats` isn't detailed enough.
- **Server capacity planning** — observe real-world resource usage under load to decide when to scale up or add more instances.
- **Process tree debugging** — use tree view to understand parent/child relationships, especially for daemons, workers, and forking servers.

## When Not To Use htop

- **Scripting and automation** — `htop` is interactive; use `ps`, `top -bn1`, or `/proc` filesystem for scriptable process information.
- **Remote monitoring dashboards** — use Prometheus + Grafana, Datadog, or similar for persistent metrics and alerting.
- **Containers in CI** — container environments often lack a TTY; use `ps aux` or structured JSON logs instead.
- **Windows** — `htop` is Unix-only; use Task Manager or `Get-Process` in PowerShell on Windows.

---

## Practical Examples: Monitor Processes Interactively and from Scripts

```bash
# 1. Start htop filtered to a specific process group
htop -F "node"

# 2. Script: alert if any process exceeds 80% memory
threshold=80
while true; do
  high_mem=$(ps aux --sort=-%mem | awk 'NR>1 && $4+0 > '"$threshold"' {print $1, $2, $4"%", $11}')
  if [ -n "$high_mem" ]; then
    echo "HIGH MEMORY ALERT:"
    echo "$high_mem"
  fi
  sleep 30
done

# 3. Snapshot the top 5 processes to a log file every minute
while true; do
  echo "=== $(date -Iseconds) ===" >> /var/log/process-snapshot.log
  ps aux --sort=-%cpu | head -6 >> /var/log/process-snapshot.log
  sleep 60
done
```
