---
title: "jq — Command-line JSON Processor"
description: "Parse, filter, and transform JSON effortlessly with jq. Perfect for scripting and debugging APIs."
category: data
tags: [jq, json, parsing, cli]
featured: false
installCommand: "sudo apt install jq"
officialUrl: "https://stedolan.github.io/jq/"
related: [curl, awscli]
pubDate: 2024-06-01
author: "CLI Tools Guide"
lastUpdated: 2024-06-01
---

# jq — Command-line JSON Processor

`jq` is the swiss-army knife for JSON on the command line. It allows you to select fields, map arrays, and perform transformations with a compact query language.

## Basic Usage

```bash
# Pretty-print JSON
cat data.json | jq .

# Extract a field
jq '.users[] | {id, name}' data.json
```

## Practical Example: Aggregate API Data

以下範例示範如何用 `curl` 取得一組 JSON，並用 `jq` 做聚合分析。

```bash
# 取得 API 回傳的一系列事件，計算不同類型的數量
curl -s https://api.example.com/events | \
  jq -r '.events[] | .type' | sort | uniq -c | sort -rn

# 另一個範例：取出最大檔案並顯示資訊
curl -s https://api.example.com/files | jq '.files | max_by(.size) | {name: .name, size: .size}'
```

`jq` 的強大在於它可以嵌入 shell 腳本中，讓 JSON 的過濾與重組變得簡潔而可重複。

## Related Resources

- 📖 [jq Manual](https://stedolan.github.io/jq/manual/)
