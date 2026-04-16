# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev        # local dev server
pnpm build      # production build
pnpm deploy     # deploy to AWS (runs sst deploy --stage production)
```

No test suite or linter is configured.

## Architecture

**Personal portfolio site** — Next.js 15 App Router, TypeScript, Tailwind CSS 4, deployed to AWS via SST v3.

### Pages

- `/` — landing page
- `/blog` — lecture notes index, grouped by category
- `/blog/[category]/[slug]` — individual post
- `/projects` — projects showcase
- `/cv` — CV/portfolio

### Blog content pipeline

Posts live in `/posts/[category]/[slug].md` as Markdown files with YAML frontmatter (`title`, `date`, `description`). All reading, parsing, and HTML compilation happens in `src/lib/posts.ts`:

- `gray-matter` extracts frontmatter
- `remark → remark-gfm → remark-math → remark-rehype → rehype-highlight → rehype-katex → rehype-slug → rehype-stringify` compiles to HTML
- Headings (h2/h3) are extracted from raw Markdown for the table of contents — they are **not** derived from the compiled HTML
- `generateStaticParams()` pre-renders all posts at build time

To add a new blog category, create a new directory under `/posts/`. No other registration is needed.

### Bilingual UI

Language switching is CSS-based: the Nav component toggles `document.documentElement.lang` between `en` and `tr`. Content uses `<span class="lang-en">` / `<span class="lang-tr">` sibling elements, with CSS showing/hiding the appropriate one.

### Theme system

Dark/light mode uses CSS variables on `data-theme` attribute of `<html>`. Theme preference is persisted via cookie (1-year expiry) and `localStorage`. The `MarkdownTheme` component swaps between `github-markdown-light.css` and `github-markdown-dark.css` in `public/` by observing theme changes.

### Deployment

GitHub Actions (`.github/workflows/deploy.yml`) triggers on push to `main`, authenticates to AWS via OIDC (no stored credentials), and runs `sst deploy --stage production`.

SST provisions: S3 (static assets), Lambda (server function), CloudFront (CDN).

**Important — public directory naming:** Static assets in `public/` are served at the root URL. SST/OpenNext creates a CloudFront behavior for each public subdirectory prefix. If a public subdirectory name matches a page route (e.g. `public/projects/` conflicts with the `/projects` page), CloudFront routes the page request to S3 instead of Lambda, causing a 403. Keep public asset directories named differently from page routes. Currently `public/media/` holds project logos.

**Domain:** `umutybaki.com` DNS is managed in Cloudflare with a CNAME pointing to `d3fa7y3saqg36l.cloudfront.net`. SST is configured without a `domain` field — no Route 53 hosted zone is used. After any deployment that changes the CloudFront distribution URL, the Cloudflare CNAME must be updated manually.