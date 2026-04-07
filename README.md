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
slug: toolname
category: search          # file-viewer | editor | search | ...
tags: [tag1, tag2]
featured: false
installCommand: "brew install toolname"
officialUrl: "https://github.com/..."
related: [bat, fzf]       # slugs of related tools
pubDate: 2024-06-01
---
```

3. Write the content in Markdown. The page is generated automatically.

---

## 💰 Google AdSense Integration

Ad placements are handled by `src/components/AdBlock.astro`. To enable real ads:

1. Apply for [Google AdSense](https://www.google.com/adsense/start/)
2. Copy `.env.example` to `.env` and fill in your publisher ID and slot IDs
3. In `src/layouts/Layout.astro`, uncomment the AdSense `<script>` tag in `<head>`
4. In `src/components/AdBlock.astro`, uncomment the `<ins>` ad unit and remove the placeholder `<div>`

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

2. Push to `main` — GitHub Actions will build and deploy automatically.

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
| Framework | [Astro 4](https://astro.build) |
| Styling | [Tailwind CSS 3](https://tailwindcss.com) |
| Content | Markdown files |
| Deployment | [Cloudflare Pages](https://pages.cloudflare.com) |
| CI/CD | GitHub Actions |

---

## 📄 License

MIT
