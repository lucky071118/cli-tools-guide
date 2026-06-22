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

## What is jq?

`jq` is the swiss-army knife for JSON on the command line. It lets you slice, filter, map, and transform structured JSON data with a compact, expressive query language — all in a single pipeline-friendly command. Where `grep` and `awk` work on plain text, `jq` works on JSON, making it the essential tool for any developer or sysadmin who works with REST APIs, configuration files, log streams, or cloud service output.

Whether you are fetching data from a REST API, processing AWS CLI responses, parsing GitHub event payloads, or debugging a failing CI job, `jq` transforms raw JSON into precisely the data you need.

## Why Use jq?

- **Purpose-built for JSON** — understands structure, arrays, objects, and nesting.
- **Composable** — fits naturally in Unix pipelines alongside `curl`, `aws`, `gh`, and `cat`.
- **Expressive language** — filter, map, reduce, select, and transform with a concise syntax.
- **Coloured output** — pretty-prints JSON with syntax highlighting in the terminal.
- **Fast** — written in C, handles large JSON files efficiently.
- **No runtime needed** — a single static binary, available everywhere.

## Installation

```bash
# Ubuntu / Debian
sudo apt update && sudo apt install jq

# macOS (Homebrew)
brew install jq

# Fedora / RHEL
sudo dnf install jq

# Arch Linux
sudo pacman -S jq

# Alpine Linux (containers)
apk add jq

# Windows (Scoop)
scoop install jq

# Windows (Chocolatey)
choco install jq

# Download binary directly
curl -Lo jq https://github.com/stedolan/jq/releases/latest/download/jq-linux64
chmod +x jq && sudo mv jq /usr/local/bin/

# Verify
jq --version
```

## Basic Syntax

The fundamental `jq` pattern is:

```bash
INPUT | jq 'FILTER'
```

Or from a file:

```bash
jq 'FILTER' data.json
```

| Filter | Meaning |
|--------|---------|
| `.` | Identity — output as-is, pretty-printed |
| `.key` | Get value of key |
| `.key.nested` | Access nested key |
| `.[0]` | First array element |
| `.[]` | Iterate over array or object values |
| `.key // "default"` | Value or default if null |
| `keys` | Array of object keys |
| `length` | Length of array, string, or object |
| `select(cond)` | Keep elements matching condition |
| `map(f)` | Apply filter to each array element |
| `del(.key)` | Delete a key |
| `to_entries` | Convert object to `[{key, value}]` array |
| `from_entries` | Reverse of `to_entries` |
| `add` | Sum/concatenate an array |
| `sort_by(.key)` | Sort array by a key |
| `group_by(.key)` | Group array elements by a key |
| `unique_by(.key)` | Deduplicate by a key |

## 💡 Tips & Tricks

### Tip 1: Pretty-Print JSON

The simplest use of `jq` is to pretty-print and colorize JSON:

```bash
cat messy.json | jq .
curl -s https://api.example.com/data | jq .
```

### Tip 2: Extract a Single Field

```bash
curl -s https://api.github.com/repos/cli/cli | jq '.stargazers_count'
```

### Tip 3: Extract Multiple Fields into an Object

```bash
curl -s https://api.github.com/repos/cli/cli | jq '{name, stars: .stargazers_count, language}'
```

### Tip 4: Iterate Over an Array

```bash
curl -s https://api.github.com/users/torvalds/repos | jq '.[] | .name'
```

### Tip 5: Filter Array Elements with `select`

```bash
# Get only repos with more than 1000 stars
curl -s https://api.github.com/users/torvalds/repos | \
  jq '[.[] | select(.stargazers_count > 1000) | {name, stars: .stargazers_count}]'
```

### Tip 6: Use `-r` for Raw String Output

By default, `jq` wraps strings in quotes. Use `-r` (raw output) when passing values to shell variables:

```bash
name=$(curl -s https://api.github.com/user -H "Authorization: Bearer $TOKEN" | jq -r '.login')
echo "Logged in as: $name"
```

### Tip 7: Transform an Array with `map`

```bash
# Extract just the names from an array of user objects
echo '[{"id":1,"name":"Alice"},{"id":2,"name":"Bob"}]' | jq '[.[] | .name]'
# or equivalently:
echo '[{"id":1,"name":"Alice"},{"id":2,"name":"Bob"}]' | jq 'map(.name)'
```

### Tip 8: Count and Aggregate

```bash
# Count items matching a condition
curl -s https://api.example.com/orders | jq '[.[] | select(.status == "shipped")] | length'

# Sum a numeric field
echo '[{"amount":10},{"amount":25},{"amount":15}]' | jq '[.[].amount] | add'
```

### Tip 9: Sort and Group

```bash
# Sort repositories by star count descending
curl -s https://api.github.com/users/torvalds/repos | \
  jq 'sort_by(-.stargazers_count) | .[:5] | .[] | {name, stars: .stargazers_count}'

# Group issues by label
cat issues.json | jq 'group_by(.label) | map({label: .[0].label, count: length})'
```

### Tip 10: Construct New JSON

```bash
# Build a new object from environment variables
jq -n --arg version "1.2.0" --arg env "production" \
  '{"version": $version, "environment": $env, "timestamp": now | todate}'
```

### Tip 11: Process Newline-Delimited JSON (NDJSON)

Log files and streaming APIs often produce one JSON object per line. Use `--slurp` or `-s` to read them all, or process them line by line with `-c`:

```bash
# Pretty-print each line of an NDJSON log file
cat events.ndjson | jq .

# Filter an NDJSON stream
cat events.ndjson | jq 'select(.level == "error") | {time: .timestamp, msg: .message}'
```

## Advanced Applications

### Aggregate API Data

The example below shows how to fetch JSON with `curl` and use `jq` for aggregation and analysis:

```bash
# Fetch a stream of API events and count how many of each type appear
curl -s https://api.example.com/events | \
  jq -r '.events[] | .type' | sort | uniq -c | sort -rn

# Find the largest file and display its details
curl -s https://api.example.com/files | \
  jq '.files | max_by(.size) | {name, size, uploaded: .created_at}'

# Find all failed jobs and extract their names and error messages
curl -s https://ci.example.com/api/runs/latest | \
  jq '.jobs[] | select(.conclusion == "failure") | {name, error: .steps[-1].name}'
```

### Transform AWS CLI Output

`jq` pairs naturally with the AWS CLI to produce clean, human-readable summaries:

```bash
# List running EC2 instances with name tags
aws ec2 describe-instances \
  --filters "Name=instance-state-name,Values=running" | \
  jq -r '.Reservations[].Instances[] |
    (.Tags // [] | map(select(.Key=="Name")) | .[0].Value // "unnamed") as $name |
    "\(.InstanceId)\t\($name)\t\(.InstanceType)\t\(.PublicIpAddress // "no-ip")"'
```

### CI/CD JSON Reporting

Generate a structured build report from test results:

```bash
#!/bin/bash
# Summarise test results from a JSON test report
report=$(cat test-results.json)

total=$(echo "$report" | jq '.tests | length')
passed=$(echo "$report" | jq '[.tests[] | select(.status == "pass")] | length')
failed=$(echo "$report" | jq '[.tests[] | select(.status == "fail")] | length')

echo "Test Summary: $passed/$total passed, $failed failed"

if [ "$failed" -gt 0 ]; then
  echo "Failed tests:"
  echo "$report" | jq -r '.tests[] | select(.status == "fail") | "  - \(.name): \(.error)"'
  exit 1
fi
```

## Related Resources

- 📖 [jq Manual](https://stedolan.github.io/jq/manual/)
- 🧪 [jq Playground](https://jqplay.org/) — try filters interactively in the browser
- 📘 [jq Cookbook](https://github.com/stedolan/jq/wiki/Cookbook)

## Related Tools

- `curl` — HTTP client; the most common source of JSON to pipe into `jq`.
- `awscli` — AWS CLI; outputs JSON by default, making `jq` an essential companion.
- `gh` — GitHub CLI; supports `--json` output for use with `jq`.
- `yq` — like `jq` but for YAML files.

## Real-world Use Cases

- **REST API scripting** — extract fields from `curl` responses and pass them to the next step in a pipeline.
- **AWS CLI output filtering** — transform verbose `aws` JSON responses into concise tables or CSV.
- **CI/CD reporting** — parse test result JSON to generate pass/fail summaries and post them to Slack or GitHub.
- **Config file transformation** — rewrite `package.json`, `docker-compose.json`, or Kubernetes manifests with `jq`.
- **Log stream analysis** — filter structured JSON logs by level, service, or time range.

## When Not To Use jq

- **YAML files** — use `yq` instead; `jq` only understands JSON.
- **Very large files (GBs)** — `jq` loads the entire input into memory; consider `jq`'s streaming mode (`--stream`) or tools like `gron` for huge datasets.
- **Simple key extraction in shell scripts** — if you only need one value and don't want a dependency, `python3 -c "import json,sys; print(json.load(sys.stdin)['key'])"` works too.
- **XML or CSV inputs** — use `xmlstarlet`, `mlr` (Miller), or `csvkit` for non-JSON structured data.

---

## Practical Examples: Filter and Transform JSON with jq

```bash
# 1. Count GitHub API results by category
curl -s "https://api.github.com/search/repositories?q=cli+language:go" | \
  jq '.items | group_by(.license.key) | map({license: .[0].license.key, count: length}) | sort_by(-.count)'

# 2. Convert a JSON array to CSV
curl -s https://api.example.com/users | \
  jq -r '["id","name","email"], (.[] | [.id, .name, .email]) | @csv'

# 3. Merge two JSON files into one
jq -s '.[0] * .[1]' base-config.json override-config.json > merged-config.json

# 4. Extract nested values and build a lookup table
cat endpoints.json | \
  jq 'reduce .services[] as $s ({}; . + {($s.name): $s.url})'
```
