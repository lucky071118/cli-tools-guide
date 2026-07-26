---
title: "wget — Download Files from the Web"
description: "Use wget to retrieve files, mirror sites, and resume interrupted downloads from the command line."
category: http
tags: [wget, http, download, network]
featured: false
installCommand: "brew install wget"
officialUrl: "https://www.gnu.org/software/wget/"
related: [curl]
pubDate: 2026-07-26
author: "CLI Tools Guide"
lastUpdated: 2026-07-26
---

# wget — Download Files from the Web

## What is wget?

`wget` is a non-interactive command-line downloader for the web. It is part of the GNU project and excels at fetching files over HTTP, HTTPS, and FTP while handling redirects, retries, and interrupted downloads automatically.

`wget` is ideal for scripting downloads, mirroring websites for offline use, or grabbing files from remote servers in environments where graphical tools are unavailable.

## Why Use wget?

- **Reliable downloads** — automatically resumes interrupted transfers and retries failed requests.
- **Offline mirroring** — great for caching a website or downloading a directory tree.
- **Simple scripting** — works in shell scripts without requiring interaction.
- **Protocol support** — HTTP, HTTPS, and FTP are all supported.
- **Recursive download** — follow links and mirror entire sites or directories.
- **Lightweight and portable** — available on most Unix-like systems and installable on macOS and Windows.

## Installation

```bash
# Ubuntu / Debian
sudo apt update && sudo apt install wget

# macOS (Homebrew)
brew install wget

# Fedora / RHEL
sudo dnf install wget

# Arch Linux
sudo pacman -S wget

# Alpine Linux
apk add wget

# Windows (via Chocolatey)
choco install wget

# Verify
wget --version
```

## Basic Usage

```bash
# Download a single file to the current directory
wget https://example.com/file.tar.gz

# Save with a specific filename
wget -O latest.tar.gz https://example.com/file.tar.gz

# Resume an interrupted download
wget -c https://example.com/large-file.zip

# Download a file and follow redirects
wget -L https://example.com/latest
```

## Essential Flags

| Flag | Purpose |
|------|---------|
| `-O FILE` | Save output to `FILE` instead of the remote filename |
| `-c` | Continue/resume partial downloads |
| `-q` | Quiet mode (suppress output) |
| `-nv` | Non-verbose output |
| `-r` | Recursive download |
| `-l DEPTH` | Set recursion depth |
| `-k` | Convert links for local browsing |
| `-p` | Download all page requisites (images, stylesheets, scripts) |
| `-np` | No parent — avoid ascending to parent directories |
| `--limit-rate` | Limit download speed (e.g. `100k`, `1m`) |
| `--wait` | Wait between requests to be polite to servers |
| `--user` | Provide username for server authentication |
| `--password` | Provide password for server authentication |
| `--retry-connrefused` | Retry even if connection is refused |
| `--tries` | Number of retries for failed downloads |

## Tips & Tricks

### Download a full website for offline browsing

```bash
wget --mirror --convert-links --adjust-extension --page-requisites --no-parent https://example.com/
```

This command downloads the site recursively, converts links for local viewing, saves required assets, and avoids climbing above the target path.

### Download files listed in a text file

```bash
wget -i urls.txt
```

Use a plain text file with one URL per line to batch-download dozens or hundreds of files.

### Limit download speed to reduce bandwidth impact

```bash
wget --limit-rate=200k https://example.com/large.iso
```

This is useful on shared networks or when running downloads alongside other work.

### Use timestamping to avoid re-downloading unchanged files

```bash
wget -N https://example.com/file.tar.gz
```

Only downloads the file if the server has a newer version than the copy already stored locally.

### Save cookies and reuse them for authenticated downloads

```bash
wget --save-cookies cookies.txt --keep-session-cookies --no-check-certificate \
  --user alice --password secret https://example.com/protected/resource

wget --load-cookies cookies.txt https://example.com/protected/page
```

### Mirror an FTP directory

```bash
wget -r ftp://ftp.example.com/pub/software/
```

Recursive FTP downloads are useful when you need a local copy of a remote directory tree.

## When to Use wget vs curl

- Use `wget` when you need robust file downloads, resumed transfers, or recursive site mirroring.
- Use `curl` when you need flexible HTTP requests, API interaction, or fine-grained control over headers and request methods.

## Advanced Usage

```bash
# Retry downloads with exponential backoff
wget --tries=10 --retry-connrefused --wait=5 https://example.com/bigfile.iso

# Download only files with a specific extension
wget -r -A '*.jpg,*.png' https://example.com/gallery/

# Mirror a directory tree and save to a local folder
wget -m -nH --cut-dirs=2 https://example.com/path/to/files/
```
