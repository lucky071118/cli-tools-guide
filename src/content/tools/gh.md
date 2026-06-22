---
title: "gh — GitHub CLI"
description: "Manage GitHub from the command line with gh: issues, PRs, releases, and workflows."
category: scm
tags: [gh, github, cli, git]
featured: false
installCommand: "brew install gh"
officialUrl: "https://cli.github.com/"
related: [git, fzf]
pubDate: 2024-06-01
author: "CLI Tools Guide"
lastUpdated: 2024-06-01
---

# gh — GitHub CLI

## What is gh?

`gh` is the official GitHub command-line tool that brings the full power of GitHub into your terminal. Instead of switching between your editor, the command line, and a browser tab, `gh` lets you manage pull requests, issues, releases, GitHub Actions workflows, and more — all without leaving your terminal session.

Whether you are a solo developer wanting a faster PR workflow or a team lead automating code review pipelines, `gh` is an indispensable part of the modern developer toolkit.

## Why Use gh?

Most developers already use `git` for version control, but `git` only covers the local side of the story. The moment you need to open a pull request, triage issues, or trigger a CI run, the traditional workflow forces you to open a browser. `gh` eliminates that context switch entirely.

- **Speed** — Create, review, and merge PRs in seconds without leaving the terminal.
- **Scriptability** — Combine `gh` with shell scripts, `jq`, and `fzf` to build powerful automation.
- **Consistent JSON output** — Every command supports `--json` flags for machine-readable output.
- **GitHub Actions integration** — Trigger, list, and inspect workflow runs from your terminal.
- **Cross-platform** — Available on macOS, Linux, and Windows.
- **Extensible** — Install community extensions with `gh extension install`.

## Installation

```bash
# macOS (Homebrew)
brew install gh

# Debian / Ubuntu
sudo apt update && sudo apt install gh

# Fedora / RHEL
sudo dnf install gh

# Arch Linux
sudo pacman -S github-cli

# Windows (Winget)
winget install GitHub.cli

# Windows (Scoop)
scoop install gh

# Verify installation
gh --version
```

After installing, authenticate with your GitHub account:

```bash
gh auth login
# Follow the interactive prompts — supports browser OAuth or a personal access token
```

## Basic Usage

```bash
# Authenticate
gh auth login

# Create a new PR from the current branch (auto-fills title and body from commits)
gh pr create --fill

# List open pull requests
gh pr list

# View a specific PR in the terminal
gh pr view 123

# Open a PR in the browser
gh pr view 123 --web

# Check out a PR locally for review
gh pr checkout 456

# Merge a PR
gh pr merge 123 --squash
```

## Working with Issues

Issues are first-class citizens in `gh`. You can create, filter, assign, and close them entirely from the terminal.

```bash
# Create an issue interactively
gh issue create

# Create an issue non-interactively
gh issue create \
  --title "Fix login redirect" \
  --body "After OAuth the redirect URL is incorrect." \
  --label "bug" \
  --assignee "@me"

# List open issues assigned to you
gh issue list --assignee @me

# View an issue
gh issue view 99

# Close an issue
gh issue close 99 --comment "Fixed in PR #123"

# Reopen an issue
gh issue reopen 99
```

## Working with GitHub Actions

`gh` makes it trivial to trigger and inspect CI/CD workflows without leaving the terminal.

```bash
# List recent workflow runs
gh run list

# Watch a workflow run live
gh run watch

# Manually trigger a workflow
gh workflow run deploy.yml --ref main

# List available workflows
gh workflow list

# View logs for a failed run
gh run view 123456 --log-failed

# Download artifacts from a run
gh run download 123456
```

## 💡 Tips & Tricks

### Tip 1: Use `--json` and `jq` for Scripting

Almost every `gh` subcommand accepts a `--json` flag followed by a comma-separated list of fields. This makes it easy to pipe output into `jq` or other tools.

```bash
# Get a list of PR numbers and titles as JSON
gh pr list --json number,title,author | jq '.[] | "\(.number): \(.title) by \(.author.login)"' -r
```

### Tip 2: Create PRs with a Template

When your repository has a pull request template, `gh pr create` respects it automatically. You can also specify a body file:

```bash
gh pr create --title "feat: add dark mode" --body-file .github/PULL_REQUEST_TEMPLATE.md
```

### Tip 3: Set the Default Repository

If you work in a monorepo or have multiple remotes, tell `gh` which repo to use:

```bash
gh repo set-default owner/repo
```

### Tip 4: Use `gh alias` to Create Shortcuts

```bash
# Create a shortcut for a common query
gh alias set prs 'pr list --author @me --state open'

# Now just run:
gh prs
```

### Tip 5: Search Across GitHub

`gh` can search repositories, issues, and PRs across all of GitHub, not just your current repo:

```bash
# Search for open issues mentioning "memory leak" in a specific repo
gh issue list --repo cli/cli --search "memory leak" --state open

# Search for repos
gh repo list --limit 30 --language go
```

### Tip 6: Clone Repositories Quickly

```bash
# Clone a repository (no need to copy the URL)
gh repo clone owner/repo

# Fork and clone in one command
gh repo fork owner/repo --clone
```

### Tip 7: Manage Releases

```bash
# List releases
gh release list

# Create a new release
gh release create v1.2.0 --title "v1.2.0" --notes "Bug fixes and performance improvements."

# Upload an asset to a release
gh release upload v1.2.0 ./dist/app-linux-amd64

# Download the latest release
gh release download --pattern "*.tar.gz"
```

## Advanced Applications

### Batch Review and Merge PRs

This script finds open PRs targeting `main`, checks for passing CI, and merges those that are approved:

```bash
for pr in $(gh pr list --base main --state open --json number --jq '.[].number'); do
  status=$(gh pr checks $pr --json conclusion --jq '.[0].conclusion')
  approvals=$(gh pr view $pr --json reviews --jq '.reviews | map(select(.state=="APPROVED")) | length')
  if [ "$status" = "SUCCESS" ] && [ "$approvals" -ge 1 ]; then
    gh pr merge $pr --merge --admin
    echo "Merged PR #$pr"
  else
    echo "Skipping PR #$pr (status: $status, approvals: $approvals)"
  fi
done
```

### Daily Standup Report

Generate a quick summary of your GitHub activity for a standup or daily log:

```bash
#!/bin/bash
echo "=== My Open PRs ==="
gh pr list --author @me --state open --json number,title,createdAt \
  --jq '.[] | "#\(.number) \(.title) (opened \(.createdAt[:10]))"'

echo ""
echo "=== Issues Assigned to Me ==="
gh issue list --assignee @me --json number,title,labels \
  --jq '.[] | "#\(.number) \(.title)"'

echo ""
echo "=== Recent Workflow Failures ==="
gh run list --status failure --limit 5 --json name,conclusion,updatedAt \
  --jq '.[] | "\(.name) failed at \(.updatedAt[:16])"'
```

### Integrating gh with fzf

Combine `gh` with `fzf` for interactive, fuzzy-searchable GitHub workflows:

```bash
# Interactively select and checkout a PR
gh pr list --json number,title,author \
  --jq '.[] | "\(.number)\t\(.title)\t\(.author.login)"' | \
  fzf --delimiter='\t' --preview 'gh pr view {1}' | \
  awk '{print $1}' | \
  xargs gh pr checkout
```

### Extensions

The `gh` CLI has a rich extension ecosystem. Install community-built extensions to add new commands:

```bash
# Install an extension
gh extension install dlvhdr/gh-dash    # dashboard for PRs and issues

# List installed extensions
gh extension list

# Upgrade all extensions
gh extension upgrade --all
```

## Related Resources

- 📦 [GitHub CLI Official Docs](https://cli.github.com/manual/)
- 🔧 [gh Extensions Marketplace](https://github.com/topics/gh-extension)
- 📖 [GitHub REST API Reference](https://docs.github.com/en/rest)

## Related Tools

- `git` — local version control; `gh` complements `git` with remote GitHub features.
- `fzf` — fuzzy finder that pairs beautifully with `gh` for interactive selection.
- `jq` — JSON processor for parsing and transforming `gh --json` output.

## Real-world Use Cases

- **Code review workflows** — check out, review, approve, and merge PRs entirely from the terminal.
- **Release automation** — create tagged releases and upload compiled assets as part of a CI script.
- **Issue triage** — bulk-label, assign, and close issues using `gh` in a shell loop.
- **CI monitoring** — watch GitHub Actions workflow runs live and download failure logs automatically.
- **Onboarding scripts** — fork and clone repositories, set up issue templates, and configure branch protection rules programmatically.

## When Not To Use gh

- **Pure `git` operations** — cloning, committing, rebasing, and pushing are best handled by `git` directly.
- **Complex GitHub administration** — managing organization settings, billing, or audit logs is easier in the GitHub web UI.
- **Offline work** — `gh` requires an internet connection and GitHub authentication for all operations.
- **Non-GitHub remotes** — `gh` only works with GitHub; use GitLab CLI (`glab`) or similar for other platforms.

---

## Practical Examples: Automate Your GitHub Workflow with gh

```bash
# 1. Interactively pick a PR, check it out, and open it in the browser
gh pr list --json number,title,author \
  --jq '.[] | "\(.number)\t\(.title)\t\(.author.login)"' | \
  fzf --delimiter='\t' --preview 'gh pr view {1}' | \
  awk '{print $1}' | xargs -I{} sh -c 'gh pr checkout {} && gh pr view {} --web'

# 2. Create a release and upload build artifacts in one pipeline
VERSION=$(git describe --tags --abbrev=0)
npm run build
gh release create "$VERSION" \
  --title "Release $VERSION" \
  --generate-notes \
  dist/app-linux-amd64 dist/app-darwin-arm64

# 3. Close all issues with a specific label
gh issue list --label "wontfix" --json number --jq '.[].number' | \
  xargs -I{} gh issue close {} --comment "Closing as wontfix."
```
