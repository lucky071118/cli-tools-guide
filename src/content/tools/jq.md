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

The example below shows how to fetch JSON with `curl` and use `jq` for aggregation and analysis.

```bash
# Fetch a stream of API events and count how many of each type appear
curl -s https://api.example.com/events | \
  jq -r '.events[] | .type' | sort | uniq -c | sort -rn

# Another example: find the largest file and display its details
curl -s https://api.example.com/files | jq '.files | max_by(.size) | {name: .name, size: .size}'
```

`jq` is especially powerful because it fits naturally into shell scripts, making JSON filtering and reshaping concise and repeatable.

## Related Resources

- 📖 [jq Manual](https://stedolan.github.io/jq/manual/)
