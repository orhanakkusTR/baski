# PROGRESS

Single source of truth for which build steps are complete. Update at the end of every step.

---

## ADIM 1 — Setup & Foundation ✅ 2026-04-22

**Status:** Complete. `npm run dev` boots cleanly; `/` → `/sv` redirect works; `/sv` and `/en` both render 200 with correct `lang` attr, hreflang links, and brand fonts loaded.

**What was done:**
- Scaffolded Next.js 15 (App Router, TypeScript strict, `src/`, alias `@/*`, Turbopack dev). Pinned `next@^15`, `eslint-config-next@^15` to stay on 15 (ecosystem default is Next 16).
- Installed runtime deps: `framer-motion`, `@sanity/client`, `@sanity/image-url`, `next-sanity@^11` (v12 requires Next 16 — deliberately held back), `resend`, `react-email`, `@react-email/components`, `react-hook-form`, `@hookform/resolvers`, `zod`, `next-intl@^4`, `lucide-react`, `clsx`, `tailwind-merge`, `class-variance-authority`.
- Initialized shadcn/ui with `base-nova` preset + `neutral` base color + CSS variables → generated `components.json`, `src/lib/utils.ts` (`cn()` helper), `src/components/ui/button.tsx`.
- Wired next-intl: `src/i18n/routing.ts` (sv default, en secondary, prefix always), `src/i18n/request.ts` (async locale loader), `src/middleware.ts` (excludes `/api`, `/_next`, file paths), `createNextIntlPlugin` in `next.config.ts`. Empty `messages/{sv,en}.json` ready for ADIM 10.
- Restructured `src/app` → `src/app/[locale]/layout.tsx` (owns `<html>`, wraps children in `NextIntlClientProvider`, attaches font variables) + `src/app/[locale]/page.tsx` (foundation placeholder, Swedish copy). `src/app/globals.css` remains at app root and is imported by the locale layout.
- Configured fonts in `src/styles/fonts.ts` — Fraunces (display, `opsz` axis) + Inter (body), both latin + latin-ext, `display: swap`, exposed as `--font-fraunces` / `--font-inter`.
- Rewrote `globals.css` with the AW AB brand palette (ink, paper, gold, stone, bone, white) as Tailwind v4 `@theme` tokens; remapped shadcn's primitive tokens (`--primary`, `--accent`, `--ring`, etc.) to brand values; added base styles (smooth scroll, antialiased, `ss01`/`cv11` font-features, custom ::selection, gold focus-visible ring); defined `@utility container-edge` as the 1440px responsive page wrapper.
- Created `.env.example` with Sanity, Resend, and site env vars.

**Deviations from the step prompt:**
- **Tailwind config** — did not create `tailwind.config.ts`. Tailwind v4 (which the project requires) uses CSS-first config via `@theme` blocks in `globals.css`. Same outcome, idiomatic approach. Documented in `docs/01-tech-stack.md`.
- **Next.js version** — pinned to `^15` (scaffold default is now Next 16). Required pinning `next-sanity` to `^11` (v12 needs Next 16). If we decide later to upgrade to Next 16, both bumps happen together.

**Verified working:**
- `/` → 307 redirect → `/sv`, cookie `NEXT_LOCALE=sv` set.
- `/sv` → 200, `<html lang="sv">`, Fraunces + Inter preloaded, `bg-paper text-ink` applied, Stockholm timezone auto-detected by next-intl.
- `/en` → 200, `<html lang="en">`, `NEXT_LOCALE=en` cookie.
- `tsc --noEmit` clean.

**Up next:** ADIM 2 — Design System & Primitives (typography scale, base UI components, variants).
