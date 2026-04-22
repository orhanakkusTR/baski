# 01 — Tech Stack

Authoritative record of every runtime and tooling decision in the AW AB codebase.
If a dependency is not listed here, don't add it — raise a discussion first.

## Runtime

| Layer | Package | Version pin | Notes |
|-------|---------|-------------|-------|
| Framework | `next` | `^15.0.0` (resolves to 15.5.x) | App Router, React Server Components, Turbopack dev. Pinned to 15 per project spec; Next 16 is available but several ecosystem packages (e.g. `next-sanity@12`) have moved to require it — we stay on 15 deliberately. |
| UI runtime | `react`, `react-dom` | `^19.0.0` | React 19 stable, ships with Next 15.1+. |
| Language | `typescript` | `^5` | `strict: true` in tsconfig; `any` is forbidden — narrow from `unknown`. |
| Styling | `tailwindcss`, `@tailwindcss/postcss` | `^4` | Tailwind v4 — CSS-first config (`@theme` directive in `globals.css`), not a JS `tailwind.config.ts`. See "Tailwind v4 note" below. |
| Primitives | `shadcn` CLI (installed as dep), `tw-animate-css` | latest | Base preset `base-nova`, base color `neutral`, CSS variables on. Components pulled in one-at-a-time from the CLI. |
| Animation | `framer-motion` | `^12` | Micro-interactions only — no parallax, no 3D tilts, no particle effects. |
| CMS client | `next-sanity`, `@sanity/client`, `@sanity/image-url` | `next-sanity@^11` | v11 is the last major supporting Next 15; v12 requires Next 16. |
| Email | `resend`, `react-email`, `@react-email/components` | latest | Transactional only. Contact + Quote forms route through here. |
| Forms | `react-hook-form`, `@hookform/resolvers`, `zod` | latest | RHF + Zod resolver for typed validation. |
| i18n | `next-intl` | `^4` | App Router integration via `src/i18n/request.ts` loader + `src/middleware.ts`. |
| Icons | `lucide-react` | latest | Outline icon set; no emoji in UI. |
| Class utilities | `clsx`, `tailwind-merge`, `class-variance-authority` | latest | `cn()` helper in `src/lib/utils.ts` combines clsx + twMerge. CVA for variant-heavy components. |

## Dev-only

| Package | Purpose |
|---------|---------|
| `eslint`, `eslint-config-next` | Linting. `eslint-config-next` pinned to `^15` to match Next version. |
| `@types/node`, `@types/react`, `@types/react-dom` | TS types. |

## Locked design decisions

### Tailwind v4 — CSS-first configuration
Tailwind 4 deprecated `tailwind.config.ts` in favour of CSS-native configuration.
**All theme tokens live in `src/app/globals.css` inside `@theme` blocks**, not in a
JS config file. This is a deliberate deviation from the Step 1 prompt — the prompt
was written assuming Tailwind 3 conventions, but the project spec requires Tailwind 4.

Practical impact:
- Brand tokens (`ink`, `paper`, `gold`, `stone`, `bone`, `white`) live in `@theme`
  and are usable as `bg-ink`, `text-paper`, `border-stone`, etc. out of the box.
- Font variables (`--font-fraunces`, `--font-inter`) are bound to Tailwind's
  `font-display` and `font-sans` utilities via `@theme`.
- The page-width wrapper is exposed as a custom `@utility container-edge` class
  (1440px max, responsive horizontal padding 1.5rem → 3rem → 5rem). Use it on
  every section: `<section className="container-edge">…`.

### shadcn/ui primitives remapped to brand palette
shadcn ships with OKLCH neutral tokens (`--primary`, `--secondary`, etc.). We keep
those tokens for compatibility with future shadcn imports, but in `:root` we
re-point them at the AW AB palette:
- `--primary` → `ink`
- `--primary-foreground` → `paper`
- `--accent` → `gold`
- `--muted` / `--secondary` → `bone`
- `--muted-foreground` → `stone`
- `--ring` → `gold`

This means a vanilla `<Button>` from shadcn renders in brand colors without per-import overrides.

### Dark mode — not wired in Phase 1
CLAUDE.md does not require dark mode. The `@custom-variant dark` hook is left in
place (it's free) but no `.dark` tokens are defined. If Phase 2 needs it, add a
`.dark { … }` block in `globals.css` inverting the palette.

### Fonts — self-hosted via `next/font/google`
`src/styles/fonts.ts` exports two variable fonts:
- **Fraunces** (display/serif) — `--font-fraunces`, `opsz` axis enabled for
  optical-size adjustments at large display sizes.
- **Inter** (body/sans) — `--font-inter`, latin + latin-ext subsets for Swedish
  diacritics (å, ä, ö).

Both are loaded with `display: 'swap'`. No JetBrains Mono yet — will be added
in ADIM 2 when we wire the typography scale (used sparingly for numeric accents).

### i18n — `sv` default, URL-prefixed always
- `defaultLocale: 'sv'`, `localePrefix: 'always'` → root `/` 307-redirects to `/sv`.
- Messages live in `src/i18n/messages/{sv,en}.json` (currently empty — populated
  incrementally as components come online).
- Middleware matcher excludes `/api`, `/trpc`, `/_next`, `/_vercel`, and any path
  containing a file extension.
- `next.config.ts` wraps the config with `createNextIntlPlugin('./src/i18n/request.ts')`.

### App Router layout — `src/app/[locale]/`
There is **no** `src/app/layout.tsx`. The root layout lives at
`src/app/[locale]/layout.tsx` and owns the `<html lang={locale}>` element,
`NextIntlClientProvider` wrapper, and the Fraunces + Inter font class names.
`globals.css` stays one level up at `src/app/globals.css` and is imported by the
locale layout.

## Environment variables
Defined in `.env.example`. Copy to `.env.local` (gitignored) when wiring Sanity / Resend.

## What's deliberately NOT installed (yet)
- **State management** — React Server Components + form state via RHF cover Phase 1. Revisit if we add admin UIs in Phase 2.
- **Date library** — `Intl.DateTimeFormat` + next-intl formatters suffice for the scope.
- **Testing framework** — deferred; lint + TypeScript check act as the gate in Phase 1.
- **Analytics SDK** — `@vercel/analytics` and Plausible script will be added in ADIM 11 (SEO & Polish).
