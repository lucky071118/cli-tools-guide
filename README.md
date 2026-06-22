# ⚡ CLI Tools Guide

A modern website introducing command-line tools like **bat**, **vim**, **fzf**, and more — built with [Astro](https://astro.build) + [Tailwind CSS](https://tailwindcss.com) and deployed on [Cloudflare Pages](https://pages.cloudflare.com).

Each tool page combines a complete introduction with practical tips & tricks, advanced usage, and links to official resources — making it a one-stop reference for levelling up your terminal workflow.

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm

### Local Development

```bash
# 1. Clone the repository
git clone https://github.com/lucky071118/cli-tools-guide.git
cd cli-tools-guide

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

Open [http://localhost:4321](http://localhost:4321) to see the site.

### Security Checks

```bash
# Check known vulnerabilities in installed dependencies
npm run security:audit

# Check the lockfile only (useful in CI or fast reviews)
npm run security:audit:lockfile
```

---

## 🏗️ Project Structure

```
cli-tools-guide/
├── src/
│   ├── components/
│   │   ├── Header.astro       # Hero banner
│   │   ├── Footer.astro       # Site footer
│   │   ├── NavBar.astro       # Navigation + dark mode toggle
│   │   └── AdBlock.astro      # Google AdSense ad unit component
│   ├── layouts/
│   │   ├── Layout.astro       # Base HTML layout (SEO meta tags)
│   │   └── ToolLayout.astro   # Tool page layout (TOC + ad placements)
│   ├── pages/
│   │   ├── index.astro        # Home page
│   │   ├── about.astro        # About page
│   │   └── tools/
│   │       ├── index.astro    # All tools listing
│   │       └── [slug].astro   # Dynamic per-tool page
│   ├── content/
│   │   └── tools/
│   │       ├── bat.md         # bat tool guide
│   │       ├── vim.md         # vim tool guide
│   │       └── fzf.md         # fzf tool guide
│   └── styles/
│       └── global.css         # Tailwind base + custom component styles
├── public/
│   └── favicon.svg
├── astro.config.mjs            # Astro + Cloudflare adapter config
├── tailwind.config.mjs         # Tailwind CSS config
├── tsconfig.json
├── .env.example                # Required environment variables
├── .github/
│   └── workflows/
│       └── deploy-cloudflare.yml  # GitHub Actions CI/CD
└── package.json
```

---

## ➕ Adding a New Tool

1. Create `src/content/tools/<tool-name>.md`
2. Add the required frontmatter (see an existing file as a template):

```yaml
---
title: "toolname — Short description"
description: "SEO meta description for the tool page."
category: search          # file-viewer | editor | search | ...
tags: [tag1, tag2]
featured: false
installCommand: "brew install toolname"
officialUrl: "https://github.com/..."
related: [bat, fzf]       # slugs of related tools (= markdown filenames without .md)
pubDate: 2024-06-01
---
```

3. Write the content in Markdown following the **required page structure** below. The page is generated automatically.

---

## 📄 Tool Page Structure

Every tool guide must follow this exact section order to keep the site consistent. Use the template below as your starting point.

```markdown
# toolname — Full Descriptive Name

## What is toolname?

One paragraph explaining what the tool is, what problem it solves, and who it is for.
Keep it concise but informative — this is the first thing readers see.

## Why Use toolname?

- 🔑 **Key benefit 1** — brief explanation.
- ⚡ **Key benefit 2** — brief explanation.
- 🔧 **Key benefit 3** — brief explanation.
(aim for 5–7 bullet points with emoji)

## Installation

```bash
# Ubuntu / Debian
sudo apt install toolname

# macOS (Homebrew)
brew install toolname

# Fedora / RHEL
sudo dnf install toolname

# Arch Linux
sudo pacman -S toolname

# Verify
toolname --version
` ``

## Basic Usage

` ``bash
# Most common commands with short comments
toolname --flag value
` ``

## 💡 Tips & Tricks

### Tip 1: Title of the tip

Explanation of the tip.

` ``bash
# Code example
` ``

### Tip 2: Title of the tip
...
(aim for 6–10 tips)

## Advanced Applications

### Subsection: Real Workflow Name

Explanation + code block showing a complete, real-world use of the tool.

### Subsection: Another Workflow

Another advanced example — integrations with other CLI tools, automation scripts, etc.

## Related Resources

- 📖 [Official Documentation](https://example.com/docs)
- 🔧 [GitHub Repository](https://github.com/org/repo)
- 📘 [Tutorial or Cheat Sheet](https://example.com)

## Related Tools

- `other-tool` — one-line description of how it relates.
- `another-tool` — one-line description.

## Real-world Use Cases

- **Scenario 1** — what problem this solves in practice.
- **Scenario 2** — another concrete use case.
- **Scenario 3** — another concrete use case.
(aim for 4–6 bullet points)

## When Not To Use toolname

- **Case 1** — when a different tool or approach is better.
- **Case 2** — a known limitation.
- **Case 3** — another scenario to avoid.

---

## Practical Examples: Descriptive Title Summarising the Examples

` ``bash
# 1. Short label
command --flags

# 2. Another example
command | other-command
` ``
```

### Section rules

| Section | Required | Notes |
|---------|----------|-------|
| `## What is X?` | ✅ | Named heading — not a bare paragraph |
| `## Why Use X?` | ✅ | Bulleted list with emoji |
| `## Installation` | ✅ | Cover at least macOS + Ubuntu + one other |
| `## Basic Usage` | ✅ | Most common day-to-day commands |
| `## 💡 Tips & Tricks` | ✅ | Use `### Tip N: Title` format; 6–10 tips |
| `## Advanced Applications` | ✅ | 2–4 named subsections with real workflows |
| `## Related Resources` | ✅ | External links with emoji prefix |
| `## Related Tools` | ✅ | Internal cross-references |
| `## Real-world Use Cases` | ✅ | 4–6 bullet points of concrete scenarios |
| `## When Not To Use X` | ✅ | Honest limitations; 3–5 bullet points |
| `## Practical Examples: Title` | ✅ | Footer code section; 2–4 self-contained examples |

### Minimum content requirement

Each guide must be **at least 800 words** of original content (frontmatter excluded). Google AdSense and general quality standards require substantial, non-thin content on every page.

---

## 💰 Google AdSense Integration

Ad placements are handled by `src/components/AdBlock.astro`. To enable real ads:

1. Apply for [Google AdSense](https://www.google.com/adsense/start/)
2. Copy `.env.example` to `.env` and fill in your publisher ID and slot IDs
3. Set the `PUBLIC_ADSENSE_*` values in your deployment environment
4. The AdSense loader in `src/layouts/Layout.astro` and the ad units in `src/components/AdBlock.astro` will enable automatically when those values are present
5. Cloudflare Pages security headers, including CSP for AdSense, are defined in `public/_headers`

Ad positions in every tool page:
- **Top** — below the breadcrumb, before content
- **Mid** — after the main content, before related tools
- **Bottom** — after related tools and metadata

---

## ☁️ Deployment

### Cloudflare Pages (automatic via GitHub Actions)

1. Add the following secrets to your GitHub repository (`Settings → Secrets → Actions`):
   - `CLOUDFLARE_API_TOKEN`
   - `CLOUDFLARE_ACCOUNT_ID`
   - (Optional) `PUBLIC_ADSENSE_CLIENT_ID`, `PUBLIC_ADSENSE_SLOT_TOP`, etc.

2. Push to `main` — GitHub Actions will run dependency review for pull requests, audit npm dependencies, build the site, and deploy automatically after the checks pass.

### Manual Cloudflare Pages setup

1. Go to [Cloudflare Pages](https://pages.cloudflare.com/) → **Create a project** → **Connect to Git**
2. Select this repository
3. Use these build settings:
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
4. Add environment variables from `.env.example`

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | [Astro 5](https://astro.build) |
| Styling | [Tailwind CSS 3](https://tailwindcss.com) |
| Content | Markdown files |
| Deployment | [Cloudflare Pages](https://pages.cloudflare.com) |
| CI/CD | GitHub Actions |

---

## 📄 License

MIT
