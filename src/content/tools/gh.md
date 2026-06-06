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

`gh` is the official GitHub command-line tool that lets you interact with GitHub resources (issues, pull requests, releases, workflows) without leaving the terminal.

## Why Use gh?

- Create and review PRs quickly without switching to the browser.
- Manage issues, labels, and collaborators from scripts.
- Trigger and inspect GitHub Actions runs.

## Installation

```bash
# macOS
brew install gh

# Debian/Ubuntu
sudo apt install gh

# or download from https://cli.github.com/
```

## Basic Usage

```bash
# Authenticate
gh auth login

# Create a new PR from current branch
gh pr create --fill

# View PRs in terminal
gh pr list

# Open PR in browser
gh pr view 123 --web
```

## Practical Example: Review and Merge PRs in Batch

This script finds open PRs targeting `main`, checks for passing CI, and merges those that are approved:

```bash
for pr in $(gh pr list --base main --state open --json number --jq '.[].number'); do
  status=$(gh pr checks $pr --json conclusion --jq '.[0].conclusion')
  approvals=$(gh pr view $pr --json reviews --jq '.reviews | map(select(.state=="APPROVED")) | length')
  if [ "$status" = "SUCCESS" ] && [ "$approvals" -ge 1 ]; then
    gh pr merge $pr --merge --admin
  fi
done
```

## Related Resources

- 📦 [GitHub CLI docs](https://cli.github.com/manual/)

## Related Tools

- `git` — local version control; `gh` complements `git` with GitHub features.
