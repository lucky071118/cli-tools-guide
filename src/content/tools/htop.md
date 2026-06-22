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

`htop` is an improved, interactive alternative to `top`, showing resource usage, process trees, and allowing easy killing/renicing of processes.

## Basic Usage

```bash
htop

# Sort by memory: F6 -> MEM%
# Tree view: F5
```

## Practical Example: Find the Highest-Memory Process and Restart It

On a production or test machine, you can first use `ps` and `sort` to identify candidates, then inspect them interactively with `htop`:

```bash
# Show the top 5 memory-consuming processes
ps aux --sort=-%mem | head -n 6

# Restart a service from the command line if needed
pid=$(ps aux | rg 'myservice' | awk '{print $2}')
kill -HUP $pid
```

`htop` works best as an interactive monitoring tool, and it pairs well with logs and automation scripts to speed up troubleshooting.

## Related Resources

- 🔧 [htop project](https://htop.dev/)
