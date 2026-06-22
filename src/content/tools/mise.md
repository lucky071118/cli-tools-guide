---
title: "mise — Dev Tools Version Manager"
description: "mise is a fast, polyglot version manager for dev tools like Node.js, Python, Ruby, Go, and more. Replaces nvm, rbenv, pyenv, and others with a single tool."
category: util
tags: [mise, version-manager, node, python, ruby, go, tools]
featured: false
installCommand: "brew install mise"
officialUrl: "https://mise.jdx.dev/"
related: [tmux, bash]
pubDate: 2024-06-01
author: "CLI Tools Guide"
lastUpdated: 2024-06-01
---

# mise — Dev Tools Version Manager

## What is mise?

`mise` (pronounced "meez", as in *mise en place*) is a fast, polyglot development tool version manager. It replaces a fragmented collection of language-specific version managers — `nvm` for Node.js, `pyenv` for Python, `rbenv` for Ruby, `goenv` for Go, `sdkman` for Java — with a single unified tool that manages all of them.

`mise` reads a `.mise.toml` (or `.tool-versions`) configuration file and automatically activates the right versions of your tools depending on which directory you are in. This makes it trivial to work on multiple projects that require different language versions without any manual switching.

Originally a rewrite and extension of `asdf`, `mise` is significantly faster, written in Rust, and adds powerful features like task running, environment variable management, and a richer configuration system.

## Why Use mise?

- **One tool, all languages** — manage Node, Python, Ruby, Go, Java, Rust, Deno, Bun, and hundreds more.
- **Per-project versions** — `.mise.toml` in a project root automatically activates the right versions.
- **Fast** — written in Rust; tool activations are nearly instant.
- **Task runner** — define project tasks in `.mise.toml` and run them with `mise run`.
- **Environment variables** — set env vars per project or per directory.
- **Compatible with `.tool-versions`** — drop-in replacement for `asdf`.
- **Plugin ecosystem** — install tools via `asdf` plugins or `mise`'s built-in backends.

## Installation

```bash
# macOS (Homebrew)
brew install mise

# Linux / macOS (install script — installs to ~/.local/bin/mise)
curl https://mise.run | sh

# Windows (PowerShell)
winget install jdx.mise

# Arch Linux (AUR)
yay -S mise-bin

# After installation, activate mise in your shell:

# For bash — add to ~/.bashrc
echo 'eval "$(mise activate bash)"' >> ~/.bashrc
source ~/.bashrc

# For zsh — add to ~/.zshrc
echo 'eval "$(mise activate zsh)"' >> ~/.zshrc
source ~/.zshrc

# For fish — add to ~/.config/fish/config.fish
echo 'mise activate fish | source' >> ~/.config/fish/config.fish

# Verify
mise --version
```

## Basic Usage

```bash
# Install a tool at a specific version
mise install node@20
mise install python@3.12
mise install go@1.22

# Install the latest stable version
mise install node@latest

# Set the global default version
mise use --global node@20
mise use --global python@3.12

# Set a version for the current project (creates .mise.toml)
mise use node@20
mise use python@3.12

# List installed versions
mise list

# List all available versions of a tool
mise ls-remote node

# Show current active versions
mise current
```

## Project Configuration with .mise.toml

Create a `.mise.toml` file in your project root to pin tool versions and define tasks:

```toml
[tools]
node = "20.11.0"
python = "3.12.2"
go = "1.22.0"

[env]
DATABASE_URL = "postgres://localhost/myapp_dev"
NODE_ENV = "development"

[tasks.dev]
run = "npm run dev"
description = "Start development server"

[tasks.test]
run = "npm test"
description = "Run test suite"

[tasks.lint]
run = "npm run lint && npm run typecheck"
description = "Lint and type-check the codebase"

[tasks.build]
run = "npm run build"
description = "Build for production"
```

When you `cd` into this directory, `mise` automatically activates Node 20.11.0, Python 3.12.2, and Go 1.22.0, and sets the environment variables.

## Running Tasks

`mise` includes a built-in task runner. Define tasks in `.mise.toml` and run them with `mise run`:

```bash
# Run a task
mise run dev
mise run test
mise run build

# List available tasks
mise tasks
mise tasks ls

# Run with arguments
mise run test -- --watch

# Run multiple tasks
mise run lint && mise run test
```

Tasks support dependencies, file watching, and parallel execution:

```toml
[tasks.ci]
depends = ["lint", "test", "build"]
description = "Full CI pipeline"

[tasks.lint]
run = "eslint src/"

[tasks.test]
run = "jest --coverage"

[tasks.build]
run = "vite build"
```

## Managing Multiple Projects

`mise`'s directory-based activation means you can have different versions active in different directories without any manual intervention:

```bash
cd ~/projects/legacy-app   # uses Node 16, Python 3.9 (from .mise.toml)
node --version             # v16.x.x

cd ~/projects/new-service  # uses Node 22, Python 3.12 (from .mise.toml)
node --version             # v22.x.x
```

## Environment Variable Management

`mise` can manage per-project environment variables, eliminating the need for a separate `.env` tool:

```toml
[env]
APP_ENV = "development"
LOG_LEVEL = "debug"
DATABASE_URL = "postgres://localhost/myapp_dev"

# Reference other env vars
API_BASE_URL = "https://{{env.APP_ENV}}.api.example.com"
```

```bash
# View active environment
mise env

# Export env vars for use in a script
eval "$(mise env)"
```

## 💡 Tips & Tricks

### Tip 1: Install All Tools Defined in .mise.toml

When you clone a project, one command installs all required tool versions:

```bash
mise install
```

### Tip 2: Trust Configuration Files

`mise` requires you to trust `.mise.toml` files before executing them (a security feature):

```bash
mise trust
# or trust all files in the current directory and below:
mise trust --all
```

### Tip 3: Use Fuzzy Version Matching

You don't have to pin an exact version. `mise` supports fuzzy matching:

```toml
[tools]
node = "20"        # latest 20.x.x
python = "3.12"    # latest 3.12.x
ruby = "latest"    # always latest stable
```

### Tip 4: Shims vs. PATH Activation

`mise` can work in two modes — PATH activation (recommended, via `eval "$(mise activate)"`) or shim-based (for editor integration):

```bash
# Generate shims for editors that don't source your shell profile
mise reshim
```

### Tip 5: Upgrade All Tools at Once

```bash
# Upgrade all tools to their latest matching versions
mise upgrade
```

### Tip 6: Check for Outdated Tools

```bash
mise outdated
```

## Advanced Applications

### CI/CD Integration

`mise` works great in CI pipelines, ensuring the same tool versions used locally are used in CI:

```yaml
# .github/workflows/ci.yml
steps:
  - uses: actions/checkout@v4
  - uses: jdxcode/mise-action@v2   # official GitHub Action
    with:
      mise_toml: .mise.toml
  - run: mise run ci
```

Or without the action:

```bash
# In your CI script
curl https://mise.run | sh
export PATH="$HOME/.local/bin:$PATH"
mise install
mise run test
mise run build
```

### Migrating from nvm, pyenv, or rbenv

If you are currently using `nvm`, `pyenv`, or `rbenv`, migration is straightforward:

```bash
# Check which version you currently use
nvm current            # e.g. v20.11.0
pyenv version          # e.g. 3.12.2

# Set those versions globally in mise
mise use --global node@20.11.0
mise use --global python@3.12.2

# Remove old tools from your shell profile
# (remove nvm/pyenv/rbenv init lines from ~/.bashrc, ~/.zshrc)
```

`mise` reads existing `.tool-versions` files (the `asdf` format), so `asdf` users get immediate compatibility without any changes to their existing configuration files.

## Related Resources

- 📖 [mise Documentation](https://mise.jdx.dev/)
- 🔧 [mise GitHub Repository](https://github.com/jdx/mise)
- 📦 [Available Tools / Plugins](https://mise.jdx.dev/registry.html)

## Related Tools

- `tmux` — terminal multiplexer for running long-lived development sessions.
- `direnv` — similar per-directory env var management (can be used alongside `mise`).
- `asdf` — the original polyglot version manager that `mise` is compatible with.

## Real-world Use Cases

- **Monorepo teams** — each sub-package specifies its own tool versions in `.mise.toml`, and developers automatically get the right versions without any manual steps.
- **Onboarding new developers** — run `mise install` once after cloning, and all required language runtimes are installed and active immediately.
- **CI/CD pipelines** — pin exact tool versions in `.mise.toml` and use the official `mise-action` for perfectly reproducible CI builds.
- **Multiple active projects** — switch between a Node 16 legacy app and a Node 22 new service just by changing directories.
- **Task standardization** — replace scattered `Makefile`, `package.json scripts`, and `Rakefile` with unified `mise run` tasks shared across all projects.

## When Not To Use mise

- **Production servers** — use OS package managers or Docker images for server-side runtime installation; `mise` is a development tool.
- **System-wide tools** — tools like `git`, `curl`, or `docker` are better managed by the OS package manager.
- **Containers** — inside a Docker container, pin versions in the `Dockerfile` directly rather than using `mise`.
- **Windows without WSL** — `mise` has limited Windows support; WSL2 is the recommended path for Windows users.

---

## Practical Examples: Manage Dev Environments with mise

```bash
# 1. Set up a new project with pinned tool versions and tasks
cat > .mise.toml << 'EOF'
[tools]
node = "20.11.0"
python = "3.12.2"

[env]
NODE_ENV = "development"

[tasks.dev]
run = "node server.js"

[tasks.test]
run = "node --test"
EOF

mise install   # install all pinned tools
mise run dev   # start the dev server

# 2. Verify all team members are using the same versions
mise current
# node    20.11.0  .mise.toml
# python  3.12.2   .mise.toml

# 3. Run the full CI pipeline locally
mise run lint && mise run test && mise run build
```
