# Umut Yalçın Baki — Personal Portfolio & Blog

A bilingual personal portfolio and blog built with **Next.js 15**, **React 19**, and **Tailwind CSS 4**. Deployed on **AWS** using **SST**.

[![Website](https://img.shields.io/badge/Website-umutybaki.com-3b82f6)](https://umutybaki.com)
[![Tech Stack](https://img.shields.io/badge/Stack-Next.js%2015%20|%20React%2019%20|%20Tailwind%204-black)](https://nextjs.org)
[![Deployment](https://img.shields.io/badge/Deployment-SST%20|%20AWS-orange)](https://sst.dev)

---

## Overview

Personal site at [umutybaki.com](https://umutybaki.com) — professional experience, academic lecture notes, and technical blog posts. Bilingual (English / Turkish) throughout.

## Features

- **Markdown blog** — `remark` + `rehype` pipeline with syntax highlighting (`rehype-highlight`), math equations (`KaTeX`), and auto-generated heading slugs (`rehype-slug`) with duplicate deduplication.
- **Nested blog navigation** — category tree rendered as collapsible accordions on the blog index page and inside each post's sidebar.
- **Post sidebar** — sticky desktop panel (`Sidebar`) and a slide-in mobile/tablet drawer (`SidebarDrawer`) with floating blurred buttons. Both show a category tree (when `"sidebarRoot": true` is set in `_meta.json`) above the in-page TOC. Active heading is tracked via `IntersectionObserver` using a set of currently visible headings, picking the topmost.
- **Bilingual i18n** — URL-segment locale (`/en`, `/tr`), cookie-persisted preference, `Accept-Language` fallback. All UI strings live in `src/dictionaries/`.
- **Dark / light theme** — CSS-variable-based, persisted via cookie + `localStorage`. Theme init script (`public/theme-init.js`) runs synchronously in `<head>` to prevent FOUC.
- **Interactive CV** — fully dictionary-driven; no hardcoded strings.
- **Serverless deployment** — GitHub Actions CI/CD with AWS OIDC auth, SST v3 provisions S3 + Lambda + CloudFront.

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 15 (App Router) |
| UI | React 19, Tailwind CSS 4 |
| Content | Markdown + Unified (Remark / Rehype) |
| Infrastructure | SST v3 Ion |
| Cloud | AWS — Lambda, CloudFront, S3 |
| Language | TypeScript |

## Project Structure

```
.
├── posts/                          # Markdown content
│   └── [category]/
│       ├── _meta.json              # Locale labels; add "sidebarRoot": true to enable tree nav
│       └── [slug].md
├── public/
│   ├── media/                      # Project logos (name differs from page routes on purpose — CloudFront routing)
│   └── theme-init.js               # Synchronous theme init — prevents FOUC
├── src/
│   ├── app/[locale]/
│   │   ├── blog/[...path]/page.tsx # Post page — wires Sidebar + SidebarDrawer
│   │   ├── blog/page.tsx           # Blog index with TreeAccordion
│   │   ├── cv/                     # CV page
│   │   └── projects/               # Projects page
│   ├── components/
│   │   ├── Sidebar.tsx             # Desktop sticky TOC + category tree (≥1100px)
│   │   ├── SidebarDrawer.tsx       # Mobile/tablet slide-in drawer + floating top bar
│   │   ├── sidebar-types.ts        # Shared SidebarProps type used by both sidebar components
│   │   ├── SidebarTree.tsx         # Recursive accordion tree for post navigation
│   │   ├── SocialLink.tsx          # Styled external link button with icon + label (home page)
│   │   ├── TreeAccordion.tsx       # Category tree used on the blog index page
│   │   ├── Accordion.tsx           # Generic collapsible section
│   │   └── Nav.tsx                 # Sticky top navbar with mobile menu
│   ├── dictionaries/               # en.ts, tr.ts, types.ts, index.ts
│   ├── lib/
│   │   ├── icons.tsx               # GitHubIcon, LinkedInIcon — use these, don't inline SVGs
│   │   ├── locale.ts               # isValidLocale() narrowing helper
│   │   ├── metadata.ts             # getAlternates(), pageTitle() helpers
│   │   └── posts.ts                # Post reading, parsing, heading extraction, tree building
│   └── i18n-config.ts             # Locale list + default locale
└── sst.config.ts
```

## Local Development

```bash
pnpm install
pnpm dev        # http://localhost:3000
pnpm build      # production build
pnpm deploy     # sst deploy --stage production
```

## Adding Content

**New post** — create `posts/[category]/[slug].md` with frontmatter:
```markdown
---
title: Post Title
date: YYYY-MM-DD
description: Short description
---
```

**New category** — create a directory under `posts/` and add `_meta.json`:
```json
{ "en": "Category Label", "tr": "Kategori Etiketi" }
```

**Enable sidebar tree navigation** — add `"sidebarRoot": true` to the `_meta.json` of the directory you want as the tree root. Any post nested inside will display the full category tree in its sidebar.

**New locale** — add `src/dictionaries/<locale>.ts` satisfying the `Dictionary` type, register it in `src/dictionaries/index.ts` and `src/i18n-config.ts`.

## Deployment

GitHub Actions (`.github/workflows/deploy.yml`) triggers on push to `main`, authenticates to AWS via OIDC, and runs `sst deploy --stage production`.

DNS is managed in Cloudflare with a CNAME pointing to the CloudFront distribution. After any deployment that changes the CloudFront URL, update the CNAME manually.

---

Built by [Umut Yalçın Baki](https://umutybaki.com).
