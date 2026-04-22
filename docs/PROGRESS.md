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

---

## ADIM 2 — Design System & Primitives ✅ 2026-04-22

**Status:** Complete. `/sv/styleguide` renders all tokens and primitives; `tsc --noEmit` clean; dev server hot-reloads in <200 ms per change.

**What was done:**
- Extended `globals.css` `@theme` with the full design-token catalogue: typography scale (`display-2xl` → `caption`, clamp-fluid for displays, fixed for body, with baked-in line-height and letter-spacing), radius tokens (`none`, `sm`, `md`; `lg`/`xl` remapped to `md` so shadcn's defaults collapse to sharp), shadow tokens (`subtle`, `elevated`), duration tokens (`fast` 150 ms, `base` 250 ms, `slow` 400 ms) and a single `ease-editorial` curve. Added marquee keyframes at the bottom of the file.
- Installed shadcn primitives: `input`, `textarea`, `select`, `label`, `separator` via `shadcn add`. `form` is not in the `base-nova` preset registry so it was hand-written in the canonical shadcn shape (`FormField` / `FormItem` / `FormLabel` / `FormControl` / `FormDescription` / `FormMessage`) on top of `react-hook-form` + `@radix-ui/react-slot`. Base UI underpins the interactive primitives (select, button) — documented in `02-design-system.md`.
- Rewrote `ui/button.tsx` with four editorial variants (`primary`, `outline`, `ghost`, `link`) in `sm` / `md` / `lg` / `icon` sizes. Compound variant zeroes out padding/height on `link` so size prop still works without fighting the styling.
- Created five shared components under `src/components/shared/`: `container`, `section-heading` (eyebrow + heading + description trio), `button-link` (text CTA with arrow + underline-from-left reveal, internal vs. external, up-right vs. right direction), `badge` (plain / outline / solid / dot variants), `logo` (placeholder wordmark, ink or paper tone).
- Created three motion wrappers under `src/components/animations/`: `fade-in` (whileInView, 40 px translate, once), `text-reveal` (word-by-word stagger, `splitBy="line"` option), `marquee` (CSS-driven infinite scroll with mask fade and optional hover-pause). All three honour `useReducedMotion()`.
- Built `/[locale]/styleguide/page.tsx` — full token + primitive catalogue in 10 numbered sections: colour swatches, display scale, body scale, radius/shadow/motion triptych, every button variant + size, full form row, every badge variant, logo on light + dark surfaces, all three motion components. `robots: noindex, nofollow` via metadata.
- Wrote `docs/02-design-system.md` — authoritative record of tokens, conventions, and the three component tiers (`ui/`, `shared/`, `animations/`).

**Deviations & notes:**
- **No JetBrains Mono font loaded.** Spec mentions it for numeric accents, but the system mono stack (`SF Mono` → `Menlo` → `Consolas`) reads near-identically, saves one variable-font request, and keeps the foundation lean. Promote to a loaded font only when typography audits flag a real difference.
- **shadcn `base-nova` preset uses Base UI, not Radix.** This is a significant ecosystem note — Select, Button, Checkbox, etc. are from `@base-ui/react` instead of `@radix-ui/react-*`. Same accessibility guarantees, different import paths. Documented in `docs/01-tech-stack.md` and `docs/02-design-system.md`.
- **`form` component written by hand.** The `base-nova` registry doesn't expose `form`, so we authored it to match the canonical shadcn shape (keeping API parity with docs and tutorials).
- **Radius `lg` / `xl` collapsed to `md`.** shadcn's defaults (`rounded-lg` on inputs and selects) would feel consumer-grade against the sharp editorial palette. The `@theme inline` remap flattens them. If a component ever genuinely needs more curve, call it out in review.

**Verified working:**
- `/sv/styleguide` and `/en/styleguide` → 200, render in full with noindex meta (`<meta name="robots" content="noindex, nofollow">`).
- Brand tokens render as utilities (`bg-ink`, `bg-paper`, `bg-gold`, `bg-bone` all present in compiled output).
- Display scale renders through Fraunces (`font-display`) with correct letter-spacing.
- Form primitives, button variants, all 4 badge variants all display and respond to hover/focus.
- `tsc --noEmit` clean.

**Up next:** ADIM 3 — Layout (Header, Footer, Navigation, Mobile Menu, Language Switcher).
