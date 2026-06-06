---
title: "curl — Transfer Data from or to a Server"
description: "Use curl to download files, test APIs, and script HTTP requests from the command line."
category: http
tags: [curl, http, api, download]
featured: false
installCommand: "sudo apt install curl"
officialUrl: "https://curl.se/"
related: [jq, nginx]
pubDate: 2024-06-01
author: "CLI Tools Guide"
lastUpdated: 2024-06-01
---

# curl — Transfer Data from or to a Server

`curl` is a versatile tool to make HTTP requests, test APIs, and interact with web servers from scripts or the terminal.

## Basic Usage

```bash
# Simple GET
curl https://api.example.com/health

# Download file
curl -L -o latest.tar.gz https://example.com/download

# POST JSON
curl -X POST -H "Content-Type: application/json" -d '{"name":"ok"}' https://api.example.com/items
```

## Practical Example: API Debugging Pipeline

使用 `curl` 搭配 `jq` 可以快速調試和串接 REST API：

```bash
# 呼叫 API，解析 JSON，並根據結果做條件處理
response=$(curl -s -w "%{http_code}" -o /tmp/resp.json "https://api.example.com/items/42")
http_code=${response:(-3)}
if [ "$http_code" -eq 200 ]; then
  cat /tmp/resp.json | jq '.data | {id, name, status}'
else
  echo "Request failed with status $http_code"
  cat /tmp/resp.json | jq
fi
```

另一個常見場景是把 `curl` 用於健康檢查與監控腳本：

```bash
if ! curl -sSf https://example.com/health >/dev/null; then
  echo "Service down" | mail -s "Service alert" ops@example.com
fi
```

## Related Resources

- 🔗 [curl Manual](https://curl.se/docs/manpage.html)
