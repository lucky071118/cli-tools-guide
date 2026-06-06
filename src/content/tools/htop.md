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

## Practical Example: 找出佔用最多記憶體的進程並重啟

在生產或測試機上，你可以使用 `ps` 與 `sort` 先找出候選，再用 `htop` 做互動檢查：

```bash
# 找出 top 5 記憶體消耗進程
ps aux --sort=-%mem | head -n 6

# 如果要從命令列重啟一個服務
pid=$(ps aux | rg 'myservice' | awk '{print $2}')
kill -HUP $pid
```

`htop` 更適合作為互動式監控工具，配合記錄與自動化腳本可以加速故障排查流程。

## Related Resources

- 🔧 [htop project](https://htop.dev/)
