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
- `/[locale]/guide/deBeers` — De Beers antitrust timeline

### Blog content pipeline

Posts live in `/posts/[category]/[slug].md` as Markdown files with YAML frontmatter (`title`, `date`, `description`). All reading, parsing, and HTML compilation happens in `src/lib/posts.ts`:

- `gray-matter` extracts frontmatter
- `remark → remark-gfm → remark-math → remark-rehype → rehype-highlight → rehype-katex → rehype-slug → rehype-stringify` compiles to HTML
- Headings (h2/h3) are extracted from raw Markdown for the sidebar — they are **not** derived from the compiled HTML. Duplicate heading slugs are deduplicated with a counter suffix (`-1`, `-2`, …) to match `rehype-slug`'s `github-slugger` behaviour.
- `generateStaticParams()` pre-renders all posts at build time

To add a new blog category, create a new directory under `/posts/`. No other registration is needed.

### Blog post page layout

`src/app/[locale]/blog/[...path]/page.tsx` renders two sidebar components:

- **`Sidebar`** (`src/components/Sidebar.tsx`) — desktop-only sticky panel (`hidden min-[1100px]:block`). Highlights the active heading via `IntersectionObserver`. The observer uses a `Set` ref to track which headings are currently inside the top 30% of the viewport (`rootMargin: '0px 0px -70% 0px'`), then picks the topmost one — this is intentional so the active item follows what the reader is actually on rather than what just entered the viewport.
- **`SidebarDrawer`** (`src/components/SidebarDrawer.tsx`) — client component that owns the sticky top bar (back button + sidebar toggle) and the slide-in drawer for mobile/tablet (`min-[1100px]:hidden`). The drawer opens below the navbar (`top-18`) and uses the same blurred background as the navbar. The sticky bar uses `sticky top-18` with the same blur. Do **not** set `document.body.overflow = hidden` when the drawer is open — it breaks the sticky navbar. This rule also applies to any future modal/overlay on this site (Timeline modal included).
- **Shared props type** lives in `src/components/sidebar-types.ts` (`SidebarProps`). `SidebarDrawer` extends it with `backHref`/`backLabel` required; `Sidebar` uses the base type with both optional.

`dict.post.onThisPage` is the sidebar heading label; `dict.post.backToCategory` is the back button label.

### i18n / Dictionary system

Language is determined by the `[locale]` URL segment. The `<html lang={locale}>` attribute is set in `src/app/[locale]/layout.tsx` (not the root layout) so SSR always emits the correct language.

**Centralized config:** `src/i18n-config.ts` exports `locales` (`['en', 'tr']`), `defaultLocale` (`'en'`), and the `Locale` type. All other files import from here — never duplicate locale lists. Use `isValidLocale(s)` from `src/lib/locale.ts` for locale narrowing — do not repeat the `locales.includes(s as Locale)` cast inline.

**Middleware** (`src/middleware.ts`) redirects bare paths to `/${locale}...`. Locale detection priority:
1. `NEXT_LOCALE` cookie (set when user explicitly switches language)
2. `Accept-Language` header (parsed with quality values)
3. Fallback to `defaultLocale` (`en`)

**Dictionaries** live in `src/dictionaries/`:
- `types.ts` — the `Dictionary` type covering every UI string and all CV content
- `en.ts` — English strings
- `tr.ts` — Turkish strings
- `index.ts` — `getDictionary(locale): Dictionary` (sync, falls back to `en`)

`src/app/[locale]/layout.tsx` validates the locale, calls `getDictionary`, and passes `dict.nav` + `locale` to the `Nav` client component. All page server components call `getDictionary(locale)` directly from their `params`.

To add a new locale: create `src/dictionaries/<locale>.ts` satisfying the `Dictionary` type, add it to the map in `index.ts`, and add the locale code to `locales` in `src/i18n-config.ts`. Routes are pre-generated automatically via `generateStaticParams`.

The language toggle in `Nav` navigates to `/${otherLocale}${restOfPath}` via `router.push` and persists the choice in the `NEXT_LOCALE` cookie.

**Localized metadata:** Every page under `[locale]/` uses `generateMetadata()` (not static `metadata` exports) to produce locale-aware `<title>`, `<meta description>`, and `<link rel=alternate hreflang>` tags. The helper `getAlternates(locale, path)` in `src/lib/metadata.ts` generates canonical + hreflang links for all locales.

**Blog category labels** live in `dict.blog.categories` (not hardcoded). The old `CATEGORY_LABELS` objects have been removed.

CV content strings (job titles, descriptions, dates) all live in the dictionary. `src/app/[locale]/cv/cvData.tsx` is a factory `getCvData(dict.cv)` that composes the JSX (with links) from those strings using three private helpers — `renderParagraphs`, `renderJobTitle`, `renderEduTitle`. The SVG icons and skill tags stay in that file. Description strings are plain text — no `dangerouslySetInnerHTML` is used.

**Layout structure:** The root `src/app/layout.tsx` is a passthrough (returns `children` only). The real `<html>`/`<body>` shell lives in `src/app/[locale]/layout.tsx` so that `lang={locale}` is set correctly on every request. Font loading, theme script, GA, and `NextTopLoader` are all in the locale layout.

### Shared UI primitives

- **`src/lib/icons.tsx`** — `GitHubIcon` and `LinkedInIcon` as function components with an optional `size` prop (default `20`). Use these everywhere instead of inlining the SVG. The mail SVG in `cv/page.tsx` is not extracted because it only appears once.
- **`src/components/SocialLink.tsx`** — styled external link button with icon + label, used on the home page. CV contact links use a different visual style and are kept inline in `cv/page.tsx`.
- **Accent hover border colors** are CSS variables, not Tailwind theme tokens: `--accent-hover-border` (`rgba(255,100,0,0.25)`) and `--accent-hover-border-strong` (`rgba(255,100,0,0.3)`). Use them as Tailwind arbitrary values: `hover:border-(--accent-hover-border)`. Do not hardcode the rgba values in components.

### Theme system

Dark/light mode uses CSS variables on `data-theme` attribute of `<html>`. Theme preference is persisted via cookie (1-year expiry) and `localStorage`. The `MarkdownTheme` component swaps between `github-markdown-light.css` and `github-markdown-dark.css` in `public/` by observing theme changes.

The theme init script lives in `public/theme-init.js` and is loaded as a synchronous `<script src="/theme-init.js" />` in `<head>` — this is intentionally render-blocking to prevent flash of unstyled content (FOUC). Do not add `async` or `defer` to it.

### Deployment

GitHub Actions (`.github/workflows/deploy.yml`) triggers on push to `main`, authenticates to AWS via OIDC (no stored credentials), and runs `sst deploy --stage production`.

SST provisions: S3 (static assets), Lambda (server function), CloudFront (CDN).

**Important — public directory naming:** Static assets in `public/` are served at the root URL. SST/OpenNext creates a CloudFront behavior for each public subdirectory prefix. If a public subdirectory name matches a page route (e.g. `public/projects/` conflicts with the `/projects` page), CloudFront routes the page request to S3 instead of Lambda, causing a 403. Keep public asset directories named differently from page routes. Currently `public/media/` holds project logos.

**Domain:** `umutybaki.com` DNS is managed in Cloudflare with a CNAME pointing to `d3fa7y3saqg36l.cloudfront.net`. SST is configured without a `domain` field — no Route 53 hosted zone is used. After any deployment that changes the CloudFront distribution URL, the Cloudflare CNAME must be updated manually.