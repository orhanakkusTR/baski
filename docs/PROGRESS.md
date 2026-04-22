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

---

## ADIM 3 — Layout Components ✅ 2026-04-22

**Status:** Complete. Header + Footer render on every page; SV and EN locales both serve 200 with translated nav + footer; `tsc --noEmit` clean; homepage + styleguide unaffected.

**What was done:**
- Added `src/i18n/navigation.ts` — exports `Link`, `redirect`, `usePathname`, `useRouter`, `getPathname` from `next-intl`'s `createNavigation(routing)`. Every internal link in the layout stack goes through this (locale-aware by default).
- Wrote `src/lib/constants.ts` — `SITE_CONFIG` (name, URL, email, phone, address, org.nr, VAT, social) + `NAVIGATION` (header items with submenu, mobile flat list, CTA target, footer column structure). No user-facing strings here — those live in messages/*.json or Sanity.
- Built `src/components/layout/language-switcher.tsx` — client component, two-locale toggle (SV · EN) with minimal typographic styling. Uses `router.replace({pathname, params}, {locale})` so switching preserves the current route across locales. `tone="ink" | "paper"` so it works on both light and dark surfaces (footer uses paper). `useTransition` smooths the swap.
- Built `src/components/layout/mobile-menu.tsx` — fullscreen `bg-ink text-paper` overlay with stagger animation. AnimatePresence-wrapped, body-scroll locked while open, ESC-to-close wired, prefers-reduced-motion honoured (animation collapses to instant). Big Fraunces display-lg links with two-digit mono index numbers on the left (01–07). Footer of the overlay carries office address, email, language switcher.
- Built `src/components/layout/header.tsx` — `motion.header` fixed to the top; height animates from 96 px → 64 px on scroll; background transitions from transparent to `bg-paper/92` with optional backdrop-blur (feature-gated with `@supports (backdrop-filter)`). Desktop nav (lg+) shows five primary links; Services is a hover-triggered dropdown that renders a 4-column editorial mega-menu with eyebrow numbers, display-h4 service name, description, and a reveal arrow. A 120 ms grace timer prevents the dropdown from closing when the user is moving the cursor between trigger and panel. Mobile (<lg) shows a `Menu` icon that opens the MobileMenu overlay. Logo size shrinks from `md` → `sm` on scroll.
- Built `src/components/layout/footer.tsx` — server component (uses `getTranslations`) rendering a 4-column grid: **Tagline + CTA**, **Services**, **Company**, **Contact** (address/email/phone/org.nr/VAT). An oversized `AW·AB` wordmark with a gold mid-dot fills the mid-footer (fluid `clamp(6rem, 22vw, 20rem)`). Bottom rail carries copyright + legal links + language switcher (paper tone). `bg-ink text-paper` makes it a dramatic full-stop for the scroll.
- Updated `src/app/[locale]/layout.tsx` — calls `setRequestLocale(locale)` for static-generation compatibility, adds full metadata (title template, description, OG, Twitter card, `metadataBase` from `SITE_CONFIG.url`), and wires Header + `<main className="flex-1 pt-24 md:pt-28">` + Footer into the root.
- Populated `messages/sv.json` and `messages/en.json` with nav, header, services (name + description for dropdown), and footer keys — Swedish is the canonical B2B copy, English mirrors it exactly. Footer tagline: "Vi bygger förpackningar som ser ut som varumärket känner sig." / "We build packaging that looks how your brand feels."
- Simplified `src/app/[locale]/page.tsx` — removed its inner `<main>` (layout owns that now), wrapped content in `<Container>`.
- Wrote `docs/03-page-architecture.md` — authoritative 10-page (+ 2 internal) architecture doc: section vocabulary, per-page section list, data source, locale parity policy, header/footer presence rule.

**Deviations & notes:**
- **Mega-menu is bespoke, not Base UI's navigation-menu.** We wanted full editorial control (grid, typography, reveal arrows); Base UI's navigation-menu would have added a lot of scaffolding for little gain. Accessibility (aria-expanded, aria-haspopup, role="menu", role="menuitem") wired manually; hover grace handled with a setTimeout.
- **`transition` object literals were inlined in mobile-menu.** Framer Motion v12 refuses to widen a `[number, number, number, number]` tuple when assigned to an intermediate variable; extracted the cubic-bezier array into `EASE_EDITORIAL = [...] as const` and inlined the transitions.
- **No JetBrains Mono still.** All mono uses (eyebrows, caption labels, language switcher) render through the system mono stack. Still no audit evidence that it's worse.
- **CTA Button is a Link + `buttonVariants`, not `<Button render={…}>`.** Simpler composition, same output.

**Verified working:**
- `/sv` and `/en` → 200, body contains translated nav (`Tjänster` / `Services`, `Presentkartonger` / `Gift boxes`, `Begär offert` / `Request quote`) and footer strings (`Alla rättigheter förbehållna` / `All rights reserved`, `Sedan 2019` / `Since 2019`).
- Header fixed-position class + 96 px initial height rendered in SSR.
- ARIA labels all present and locale-correct (`Öppna menyn`, `Huvudnavigation`, `Juridiska länkar`).
- `/sv/styleguide` and `/en/styleguide` still 200 (no regression).
- `tsc --noEmit` clean.

**Interactive behaviours to verify in-browser (user test):**
- Header shrinks 96 → 64 px on scroll past 24 px; background becomes `bg-paper/92` with subtle backdrop blur.
- Services dropdown opens on hover (desktop), closes with 120 ms grace.
- Mobile menu fullscreen overlay opens from the hamburger, staggers link reveal, locks body scroll, ESC closes.
- Language switcher swaps `/sv/<route>` ↔ `/en/<route>` preserving the current path.

**Up next:** ADIM 4 — Homepage (hero, services overview, featured work, stats, CTA band).

---

## ADIM 4 — Homepage ✅ 2026-04-22

**Status:** Complete. All six home sections render in both locales; `tsc --noEmit` clean; no warnings in dev log.

**What was done:**
- Added `src/components/shared/image-placeholder.tsx` — editorial stand-in for imagery (aspect-locked, labelled, subtle diagonal-line grain). Every hero/project/service visual uses this until real photography lands; parents can swap to `<Image>` as they come online.
- Added `src/lib/mock-projects.ts` and `src/lib/mock-clients.ts` — fully fictional Nordic-sounding brand names (Meridian Spirits, Atelier Veka, Lund & Berg, Studio Nordisk, …). Swap to Sanity queries in ADIM 7 (projects) and Phase 1.5 (client roster). No real trademarks.
- Built `src/components/sections/hero/hero-home.tsx` — client component. Full `min-h-[100svh]`, breaks out of the layout's top padding with `-mt-24 md:-mt-28` so the transparent header reads over content instead of sitting on a strip of paper. Re-pads internally (`pt-40 md:pt-52 lg:pt-56`) to clear the header visually. Headline gets a word-stagger reveal (overflow-hidden spans + motion, `y: 110% → 0%`, ease-editorial, ~85 ms between words). Eyebrow, subtitle, and CTA trio fade up with staggered delays keyed off `custom` index. Scroll indicator (mono "SCROLLA" + gold 40 px line that cycles top→bottom every 2.4 s + arrow) anchors the viewport bottom. All animation paths honour `useReducedMotion()`.
- Built `src/components/sections/services-grid.tsx` — server component. Asymmetric 5-col grid on desktop: hero card spans cols 1–3 and both rows (boxes), three smaller cards stack in cols 4–5 (bags / corporate / custom). Each card is a whole-card Link: eyebrow number + service name, arrow up-right, description; `ImagePlaceholder` scales 1.03× on group hover. Section heading is left-aligned with a "Alla tjänster" link pinned to the bottom-right.
- Built `src/components/sections/featured-clients.tsx` — server-wrapped marquee. Uses `Marquee` (Step 2) running at 60 s. Client names render in Fraunces display-h3, stone-60 by default, ink + gold dot on hover. A bordered strip (border-y) separates the section visually.
- Built `src/components/sections/portfolio-showcase.tsx` — server component. Asymmetric 2-col grid: hero project (Meridian Signature) on the left spanning both rows with a 4/5 portrait placeholder; two stacked landscape (3/2) projects on the right. Each card: `ImagePlaceholder` + solid paper Badge (category) on image, client + year eyebrow, project title, arrow. Mock data seeded; swap to Sanity in ADIM 7.
- Built `src/components/sections/stats-counter.tsx` — client component with `useInView` gating. Four stats (150+ projekt, 40+ varumärken, 12 länder, A++ kvalitet). Count-up uses `requestAnimationFrame` + cubic ease-out over 1500 ms; `prefersReducedMotion` falls back to static `staticValue`. The A++ stat is intentionally text-only (non-numeric) so the component's StatDef union captures both cases. Grid of 4 on desktop, 2 on mobile, with top borders per column for editorial rhythm.
- Built `src/components/sections/cta-block.tsx` — server component. `bg-ink text-paper` full-width band. Gold 64 px accent line above a mono eyebrow, display-lg heading, paper/70 subtitle. Dual CTA: primary button styled paper-on-ink (fill inverted), outline button with paper border that fills on hover. Acts as the momentum full-stop before the footer's own dark band.
- Wired everything in `src/app/[locale]/page.tsx` as a flat list of sections: Hero → FeaturedClients → ServicesGrid → PortfolioShowcase → StatsCounter → CtaBlock.
- Populated homepage strings in `src/i18n/messages/{sv,en}.json` under `home.*`: `hero.{eyebrow,headline,subtitle,secondary,scroll}`, `clients.{eyebrow,heading}`, `services.{eyebrow,heading,description,viewAll}`, `portfolio.{eyebrow,heading,description,viewAll,items.{meridian,veka,lund}}`, `stats.{srHeading,projects,brands,countries,quality}`, `cta.{eyebrow,heading,description,primary,secondary}`. Swedish is canonical B2B; English mirrors it.

**Deviations & notes:**
- **Hero headline splits on word, not line.** The design system's `text-reveal` component supports `splitBy="line"` but requires explicit `\n`s in the source string — awkward for responsive breakpoints. Word stagger produces the same "wave" reading effect on a wrapped headline and preserves responsiveness. Ported the pattern inline in `hero-home.tsx` (rather than reusing `<TextReveal>`) so the hero can orchestrate its own sequence (eyebrow → headline words → subtitle → CTAs) as one timeline.
- **Hydration flash on initial paint.** Framer's motion spans render SSR with `style="opacity:0;transform:translateY(110%)"` — so for an instant after first paint, the headline is invisible. H1's `aria-label` carries the full text, so screen readers and JS-rendering crawlers (Googlebot) see it. Acceptable tradeoff for the editorial reveal; if future audit flags LCP on mobile, we'll swap to CSS-driven animation.
- **Images:** zero real `<img>` tags. All visuals are `ImagePlaceholder` divs. This is intentional per CLAUDE.md — once shots are delivered, swap call sites to `<Image>`.
- **Stat #4 is static ("A++"), not a counter.** Prompt listed it among the 4 stats; the StatDef type allows `to: null` for this case so we don't fake-animate a non-number.
- **Mock brand names.** Every client and project name is invented. No real brand substitution without written permission (CLAUDE.md warning).

**Verified:**
- `/sv` → 200, renders Premiumförpackningar + all 6 sections' key strings (Utvalda samarbeten, Fyra hantverk, Senaste projekten, Levererade projekt, Redo att skapa).
- `/en` → 200, renders Premium packaging + all 6 English equivalents.
- `/sv/styleguide` + `/en/styleguide` → 200 (no regression).
- `tsc --noEmit` clean.
- OG + Twitter meta complete (title, description, url, site_name, type, twitter:card).
- H1 present with `aria-label` containing full headline.
- No warnings or errors in dev log.

**Pending in-browser checks (user):**
- Headline word-stagger reveal timing reads well on mobile (should hit within ~1 s).
- Services grid asymmetric layout on desktop looks right (hero card spans 2 rows).
- Marquee scrolls smoothly, pauses on hover, wordmarks recolour ink + gold dot.
- Stats count up once when scrolled into view (not every scroll).
- CTA band inverts nicely (paper button on ink bg).
- Full-page Lighthouse — perf/accessibility/SEO all 95+ (real-image replacement in ADIM 11 will affect LCP).

**Up next:** ADIM 5 — About page (agency story, values, timeline, optional team).
