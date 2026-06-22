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

## What is curl?

`curl` (Client URL) is one of the most widely used command-line tools in existence. It transfers data to or from a server using virtually any network protocol — HTTP, HTTPS, FTP, SFTP, SMTP, and more. Whether you are debugging an API, downloading a file, testing authentication flows, or automating HTTP requests in a CI/CD pipeline, `curl` is an essential tool every developer and sysadmin should master.

First released in 1998, `curl` is installed by default on macOS, most Linux distributions, and Windows 10+. Its ubiquity and scriptability make it the go-to tool for HTTP from the command line.

## Why Use curl?

- **Universal availability** — pre-installed on virtually every Unix system and modern Windows.
- **Protocol support** — HTTP, HTTPS, FTP, SFTP, LDAP, SMTP, and many more.
- **Scriptable** — fits naturally into shell scripts, CI pipelines, and automation.
- **Detailed output** — verbose mode shows headers, TLS handshake details, timing, and more.
- **Stable interface** — the `curl` command-line interface has been stable for decades.
- **Pairs perfectly with `jq`** — the combination of `curl | jq` is the de-facto standard for REST API work in the terminal.

## Installation

```bash
# Ubuntu / Debian (usually pre-installed)
sudo apt update && sudo apt install curl

# macOS (pre-installed, or newer via Homebrew)
brew install curl

# Fedora / RHEL
sudo dnf install curl

# Arch Linux
sudo pacman -S curl

# Alpine Linux (containers)
apk add curl

# Windows — pre-installed in Windows 10 1803+ and later (curl.exe)
# or install via Scoop:
scoop install curl

# Verify
curl --version
```

## Basic Usage

```bash
# Simple GET request
curl https://api.example.com/health

# Download a file (following redirects)
curl -L -o latest.tar.gz https://example.com/download

# POST JSON data
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"name": "Alice", "role": "admin"}' \
  https://api.example.com/users

# Send form data
curl -X POST \
  -F "username=alice" \
  -F "password=secret" \
  https://example.com/login
```

## Essential Flags

| Flag | Purpose |
|------|---------|
| `-s` | Silent mode — suppress progress meter |
| `-S` | Show errors even in silent mode |
| `-f` | Fail silently on HTTP errors (non-2xx) |
| `-L` | Follow redirects |
| `-o FILE` | Write output to a file |
| `-O` | Save with the remote filename |
| `-I` | Fetch headers only (HEAD request) |
| `-v` | Verbose — show request and response headers |
| `-w FORMAT` | Write custom output after request completes |
| `-u USER:PASS` | HTTP Basic authentication |
| `-H "Header: Value"` | Add a custom header |
| `-X METHOD` | Specify HTTP method (GET, POST, PUT, DELETE, PATCH) |
| `-d DATA` | Send request body data |
| `--max-time N` | Timeout after N seconds |
| `-k` | Skip TLS certificate verification (insecure) |
| `-c FILE` | Save cookies to a file |
| `-b FILE` | Read cookies from a file |

## 💡 Tips & Tricks

### Tip 1: Pretty-Print JSON Responses

Pipe `curl` output directly into `jq` for readable, coloured JSON:

```bash
curl -s https://api.github.com/repos/cli/cli | jq '{name, description, stars: .stargazers_count}'
```

### Tip 2: Check HTTP Status Code

Use `-w` to extract the HTTP status code without the response body:

```bash
status=$(curl -s -o /dev/null -w "%{http_code}" https://example.com/health)
echo "HTTP Status: $status"

if [ "$status" -ne 200 ]; then
  echo "Health check failed!"
  exit 1
fi
```

### Tip 3: Measure Request Timing

Use `-w` with timing variables to profile API latency:

```bash
curl -s -o /dev/null -w "
  DNS lookup:    %{time_namelookup}s
  TCP connect:   %{time_connect}s
  TLS handshake: %{time_appconnect}s
  TTFB:          %{time_starttransfer}s
  Total:         %{time_total}s
" https://api.example.com/endpoint
```

### Tip 4: Upload Files

```bash
# Upload a single file
curl -X POST -F "file=@/path/to/report.pdf" https://api.example.com/upload

# Upload with authentication
curl -X POST \
  -H "Authorization: Bearer $TOKEN" \
  -F "image=@avatar.png;type=image/png" \
  https://api.example.com/profile/avatar
```

### Tip 5: Use Bearer Token Authentication

```bash
TOKEN="your-api-token-here"

curl -s \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  https://api.example.com/protected/resource | jq .
```

### Tip 6: Follow Redirects and Handle Cookies

```bash
# Login and save session cookie
curl -c cookies.txt -X POST \
  -d "username=admin&password=secret" \
  https://example.com/login

# Use saved cookie for subsequent requests
curl -b cookies.txt https://example.com/dashboard
```

### Tip 7: Download Multiple Files in Parallel

```bash
# Download several files simultaneously using xargs
cat urls.txt | xargs -P 5 -I {} curl -s -L -O {}
```

### Tip 8: Resume an Interrupted Download

```bash
curl -C - -O https://example.com/large-file.tar.gz
```

### Tip 9: Test TLS Certificate Details

```bash
# Show TLS certificate information
curl -v --silent https://example.com 2>&1 | grep -A 10 "Server certificate"
```

### Tip 10: Simulate Different Clients with User-Agent

```bash
curl -A "Mozilla/5.0 (compatible; MyBot/1.0)" https://example.com/
```

## Advanced Applications

### API Debugging Pipeline

Using `curl` together with `jq` is a fast way to debug and compose REST API workflows:

```bash
# Call the API, capture both body and status code separately
response=$(curl -s -w "\n%{http_code}" https://api.example.com/items/42)
body=$(echo "$response" | head -n -1)
http_code=$(echo "$response" | tail -n 1)

if [ "$http_code" -eq 200 ]; then
  echo "$body" | jq '.data | {id, name, status}'
else
  echo "Request failed with status $http_code"
  echo "$body" | jq
fi
```

### Health Check Script

Use `curl` in a monitoring or CI script to verify that a service is up before proceeding:

```bash
#!/bin/bash
ENDPOINT="https://api.example.com/health"
MAX_RETRIES=5
RETRY_DELAY=10

for i in $(seq 1 $MAX_RETRIES); do
  status=$(curl -s -o /dev/null -w "%{http_code}" --max-time 5 "$ENDPOINT")
  if [ "$status" -eq 200 ]; then
    echo "Service is healthy (attempt $i)"
    exit 0
  fi
  echo "Attempt $i failed (HTTP $status). Retrying in ${RETRY_DELAY}s..."
  sleep $RETRY_DELAY
done

echo "Service failed to respond after $MAX_RETRIES attempts"
exit 1
```

### Automated API Pagination

Many APIs return paginated results. Use a loop to fetch all pages:

```bash
#!/bin/bash
page=1
all_items=()

while true; do
  response=$(curl -s "https://api.example.com/items?page=$page&per_page=100" \
    -H "Authorization: Bearer $TOKEN")

  items=$(echo "$response" | jq '.items | length')
  [ "$items" -eq 0 ] && break

  echo "Fetched page $page with $items items"
  all_items+=("$response")
  ((page++))
done

echo "Total pages fetched: $((page - 1))"
```

### Integrating curl with Other Tools

`curl` works best as part of a pipeline:

```bash
# Fetch JSON and filter with jq
curl -s https://api.github.com/users/torvalds | jq '{name, company, followers}'

# Fetch and format with Python
curl -s https://api.example.com/data | python3 -m json.tool

# Fetch and store in a variable
config=$(curl -s https://config.example.com/settings.json)
db_host=$(echo "$config" | jq -r '.database.host')
```

## Related Resources

- 🔗 [curl Manual](https://curl.se/docs/manpage.html)
- 📖 [Everything curl — The Book](https://everything.curl.dev/)
- 🧪 [httpbin.org](https://httpbin.org/) — Free HTTP testing service

## Related Tools

- `jq` — JSON processor; the ideal companion for processing `curl` API responses.
- `wget` — simpler alternative for file downloading.
- `httpie` (`http`) — more human-friendly HTTP CLI, great for interactive use.
- `nginx` — web server you can test and inspect with `curl`.

## Real-world Use Cases

- **API testing** — send GET, POST, PUT, and DELETE requests during development without a GUI tool like Postman.
- **CI/CD health checks** — verify that a deployment succeeded by hitting a `/health` endpoint in a pipeline script.
- **File downloads in scripts** — download binaries, archives, and configuration files as part of provisioning scripts.
- **Authentication testing** — test OAuth flows, cookie-based login, and Bearer token endpoints.
- **Performance profiling** — use `-w` timing variables to measure DNS lookup, TLS handshake, and time-to-first-byte.

## When Not To Use curl

- **Downloading large files with a progress bar** — `wget` or `aria2c` offer better user experience for long downloads.
- **Interactive API exploration** — `httpie` (`http`) has friendlier syntax and coloured output for interactive use.
- **WebSocket connections** — `websocat` is better suited to WebSocket testing.
- **Complex session flows** — for multi-step browser-like sessions, `playwright` or `puppeteer` are more appropriate.

---

## Practical Examples: Test APIs and Automate HTTP Workflows with curl

```bash
# 1. Full API request with status check and JSON parsing
response=$(curl -s -w "\n%{http_code}" \
  -H "Authorization: Bearer $TOKEN" \
  https://api.example.com/v1/users)
body=$(echo "$response" | head -n -1)
status=$(echo "$response" | tail -n 1)
[ "$status" -eq 200 ] && echo "$body" | jq '.users[] | .email' || echo "Error: HTTP $status"

# 2. Upload a file and capture the response URL
upload_url=$(curl -s -X POST \
  -F "file=@report.pdf" \
  -H "Authorization: Bearer $TOKEN" \
  https://api.example.com/upload | jq -r '.url')
echo "Uploaded to: $upload_url"

# 3. Measure endpoint latency across multiple regions
for region in us-east eu-west ap-south; do
  time=$(curl -s -o /dev/null -w "%{time_total}" "https://$region.api.example.com/ping")
  echo "$region: ${time}s"
done
```
