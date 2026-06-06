---
title: "mise — Minimal Session Executor"
description: "mise is a small utility to run and group shell commands interactively and in parallel. (Lightweight task runner.)"
category: util
tags: [mise, runner, task]
featured: false
installCommand: "brew install mise"
officialUrl: "https://example.com/mise"
related: [tmux, bash]
pubDate: 2024-06-01
author: "CLI Tools Guide"
lastUpdated: 2024-06-01
---

# mise — Minimal Session Executor

`mise` (示範工具) 是個輕量指令工具，可在終端中平行或循序執行多個任務，並提供簡單的結果匯總。若你的工作流程需要快速啟動多個子程序或測試多個命令，這類工具很實用。

## Basic Usage

```bash
# 假設 mise 支援一個簡單的配置檔案 tasks.yml
mise run

# 或直接在命令列傳入多個工作
mise exec "npm test" "bundle exec rake" "python -m pytest"
```

## Practical Example: 並行化測試套件

假設要在多個 Ruby / Node / Python 專案分別執行測試，可用 `mise` 並行啟動，節省等待時間：

```bash
mise exec "(cd service-a && npm test)" "(cd service-b && pytest)" "(cd service-c && bundle exec rspec)"
```

執行完畢後，`mise` 會以程式碼與最後輸出結束狀態總結，方便你快速判別哪個服務失敗。

## Related Tools

- `tmux` — 長期會話與分割視窗管理。
