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

All pages are under the `[locale]` dynamic segment. `/` redirects to `/en` via middleware.

- `/[locale]` — landing page
- `/[locale]/blog` — lecture notes index, grouped by category
- `/[locale]/blog/[category]/[slug]` — individual post
- `/[locale]/projects` — projects showcase
- `/[locale]/cv` — CV/portfolio

### Blog content pipeline

Posts live in `/posts/[category]/[slug].md` as Markdown files with YAML frontmatter (`title`, `date`, `description`). All reading, parsing, and HTML compilation happens in `src/lib/posts.ts`:

- `gray-matter` extracts frontmatter
- `remark → remark-gfm → remark-math → remark-rehype → rehype-highlight → rehype-katex → rehype-slug → rehype-stringify` compiles to HTML
- Headings (h2/h3) are extracted from raw Markdown for the table of contents — they are **not** derived from the compiled HTML
- `generateStaticParams()` pre-renders all posts at build time

To add a new blog category, create a new directory under `/posts/`. No other registration is needed.

### i18n / Dictionary system

Language is determined by the `[locale]` URL segment. `src/middleware.ts` redirects `/` → `/en`.

Dictionaries live in `src/dictionaries/`:
- `types.ts` — the `Dictionary` type covering every UI string and all CV content
- `en.ts` — English strings (the only locale currently)
- `index.ts` — `getDictionary(locale): Dictionary` (sync, falls back to `en`)

`src/app/[locale]/layout.tsx` validates the locale, calls `getDictionary`, and passes `dict.nav` + `locale` to the `Nav` client component. All page server components call `getDictionary(locale)` directly from their `params`.

To add a new locale: create `src/dictionaries/tr.ts` satisfying the `Dictionary` type and add it to the map in `index.ts`. The routes are already pre-generated for `tr`.

The language toggle in Nav navigates to `/${otherLocale}${restOfPath}` via `router.push`.

CV content strings (job titles, descriptions, dates) all live in the dictionary. `src/app/[locale]/cv/cvData.tsx` is a factory `getCvData(dict.cv)` that composes the JSX (with links and HTML descriptions) from those strings. The SVG icons and skill tags stay in that file.

### Theme system

Dark/light mode uses CSS variables on `data-theme` attribute of `<html>`. Theme preference is persisted via cookie (1-year expiry) and `localStorage`. The `MarkdownTheme` component swaps between `github-markdown-light.css` and `github-markdown-dark.css` in `public/` by observing theme changes.

### Deployment

GitHub Actions (`.github/workflows/deploy.yml`) triggers on push to `main`, authenticates to AWS via OIDC (no stored credentials), and runs `sst deploy --stage production`.

SST provisions: S3 (static assets), Lambda (server function), CloudFront (CDN).

**Important — public directory naming:** Static assets in `public/` are served at the root URL. SST/OpenNext creates a CloudFront behavior for each public subdirectory prefix. If a public subdirectory name matches a page route (e.g. `public/projects/` conflicts with the `/projects` page), CloudFront routes the page request to S3 instead of Lambda, causing a 403. Keep public asset directories named differently from page routes. Currently `public/media/` holds project logos.

**Domain:** `umutybaki.com` DNS is managed in Cloudflare with a CNAME pointing to `d3fa7y3saqg36l.cloudfront.net`. SST is configured without a `domain` field — no Route 53 hosted zone is used. After any deployment that changes the CloudFront distribution URL, the Cloudflare CNAME must be updated manually.