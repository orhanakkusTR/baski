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

---

## ADIM 5 — About Page ✅ 2026-04-22

**Status:** Complete. `/sv/om-oss` and `/en/about` both render 200 with fully translated content; localized pathname routing wired for all future routes; tsc clean.

**What was done:**

### Localized pathnames (big structural change)
Wired full `pathnames` map in `src/i18n/routing.ts`: every route the app links to now has a locale-aware slug. `/about` → `/sv/om-oss` · `/en/about`, `/services` → `/sv/tjanster`, `/portfolio` → `/sv/arbeten`, `/quote` → `/sv/offert`, `/contact` → `/sv/kontakt`, privacy/terms/cookies likewise. File-system routes stay at canonical English paths (e.g. `src/app/[locale]/about/page.tsx`); middleware rewrites the Swedish URL onto the canonical path. `<Link href="/about">` auto-renders the right per-locale URL.

Added two exported helper types — `Pathname` (all routes including dynamic) and `StaticPathname` (excludes `/portfolio/[slug]` and other dynamic routes that need `{pathname, params}` object form when passed to `<Link>`).

Ripple fixes from typing:
- `src/lib/constants.ts` — NAVIGATION hrefs retyped `string → StaticPathname`, legal links got their own `LegalLinkItem` interface.
- `src/components/layout/header.tsx` — submenu param retyped to `SubmenuItem[]`.
- `src/components/layout/footer.tsx` — `FooterLink` href retyped to `StaticPathname`.
- `src/components/sections/services-grid.tsx` — `ServiceCard.item.href` retyped.
- `src/components/sections/portfolio-showcase.tsx` — dynamic Link moved to object form (`{ pathname: "/portfolio/[slug]", params: { slug } }`).

### CtaBlock → prop-driven
Was hard-coded to read `home.cta.*` translations. Refactored to accept `eyebrow`, `heading`, `description`, `primary: { label, href }`, `secondary: { label, href }` as props. Home and About pages now fetch their own CTA copy and pass it in. Swedish hero headline gets the same `lang="sv"` + `hyphens-auto` safety net already used in hero-home.

### About page (`src/app/[locale]/about/page.tsx`) + five sections under `src/components/sections/about/`
- `hero-about.tsx` — eyebrow + display-lg mission statement + one-paragraph intro. Breaks out of layout's top padding (`-mt-24 md:-mt-28`) like the home hero. `lang="sv"` + `hyphens-auto` to prevent long Swedish compounds from overflowing.
- `our-history.tsx` — 2-column asymmetric (per spec): narrow sidebar (sticky on desktop) with `01 — Vår historia` eyebrow + h1; wide prose column on right with three paragraphs (founding / growth / ethos). Collapses to single column on mobile.
- `our-values.tsx` — four equal-weight values in a uniform grid (1-col mobile, 2×2 md, 4-col lg). Each card: top-border + Lucide outline icon (ShieldCheck · Leaf · Target · Lock) + 2-digit index eyebrow + display-h4 name + one-sentence commitment. **No agency cliché** — each description is a concrete commitment ("Varje produkt genomgår en intern QA innan den lämnar studion", "Vi publicerar inga kundnamn utan skriftligt medgivande", etc.).
- `process-teaser.tsx` — section heading on the left, numbered 3-step preview on the right. Links to `/process` at the bottom with the underline-reveal + arrow pattern used elsewhere.
- `team-placeholder.tsx` — minimal, honest placeholder. Eyebrow + heading + paragraph explaining a team page is coming, plus a small `Kommer snart` pill. **No generic box grid** — filler grids look worse than a clean "in progress" statement.

Page composition: `<HeroAbout /> → <OurHistory /> → <OurValues /> → <ProcessTeaser /> → <TeamPlaceholder /> → <CtaBlock />`. All sections use the tightened `py-12 md:py-16 lg:py-20` padding.

### Translations (sv.json + en.json)
Added `about.*` namespace with the full Swedish B2B copy (canonical) and English mirror. Keys: `about.meta.{title,description}`, `about.hero.{eyebrow,heading,description}`, `about.history.{eyebrow,heading,body.{founding,growth,ethos}}`, `about.values.{eyebrow,heading,description,items.{quality,sustainability,precision,partnership}.{name,description}}`, `about.process.{eyebrow,heading,description,viewAll,steps.{brief,concept,production}.{title,description}}`, `about.team.{eyebrow,heading,description,status}`, `about.cta.*`. Tone deliberately non-marketing — "Det här är inte marknadsföringsfraser" / "These aren't marketing phrases" as the values section lede.

### Metadata
`generateMetadata` in the about page pulls `about.meta.title` + `about.meta.description` with OG mirror. `title` renders through the root template (`"%s · AW AB"`).

**Verified working:**
- `/sv/om-oss` → 200, Swedish content. `/en/about` → 200, English content.
- `/sv/about` → 307 (middleware redirects to the canonical Swedish URL).
- `/en/om-oss` → 307 (symmetric).
- Header nav links on `/sv/om-oss` render as `/sv/arbeten`, `/sv/tjanster`, `/sv/kontakt`, `/sv/offert`, `/sv/integritetspolicy`, `/sv/villkor`, `/sv/cookies` — all auto-localized by next-intl's `<Link>`.
- Home page unaffected (`/sv` and `/en` still 200, CtaBlock prop-driven but renders same copy).
- Styleguide unaffected.
- `tsc --noEmit` clean.

**Deviations / notes:**
- **`StaticPathname` type split** is a new pattern I had to introduce. Without it, typed `href` props across constants.ts and several components complained that `/portfolio/[slug]` (dynamic) wasn't a valid string literal for `<Link>`. Dynamic routes require `{pathname, params}` object form; the type split enforces this distinction cleanly.
- **Not-yet-built routes** (services/*, portfolio, quote, contact, process, privacy/terms/cookies) are listed in pathnames anyway so internal links type-check. They 404 at runtime until the page file lands — that's the same behaviour as before, just now with prettier Swedish URLs.
- **Team section** stays minimal on purpose. The spec said "OPSIYONEL, şimdilik skip, placeholder olarak 'Kommer snart'". A grid of generic placeholder boxes would read worse than a clean "coming soon" pill with a real fact ("tolv personer") anchoring the section.

**Up next:** ADIM 6 — Services pages (main services page + 4 detail pages: boxes, bags, corporate-print, custom).

---

## ADIM 5 polish — editorial hero, gold-dot heading mark, values hover (commit `3ac552e`, 2026-04-23)

After the About page shipped, the user flagged three visual refinements before moving to ADIM 6:

1. **About hero got an image.** The textual-only hero was re-shaped into an editorial 2-col split: portrait `ImagePlaceholder` on the left (label `Studio · Gamla stan, Stockholm`), eyebrow + h1 + description on the right. On md+ both columns are vertically centred; mobile stacks image above text. The hero still breaks out of the layout's top padding so the transparent header reads over paper.
2. **Gold-dot heading mark.** New `src/components/shared/heading-dot.tsx` helper: strips a trailing `.` from a string and appends an em-scaled gold circle (`bg-gold size-[0.22em]`) — the same accent mark used in the logo wordmark. Headings ending in `?` pass through unchanged. Wired through `SectionHeading` automatically (wraps `heading` when it's a string), and manually on the three bespoke headings (`hero-home`, `hero-about`, `our-history`). For `hero-home` the gold dot renders *inside* the last word's motion wrapper so it reveals in sync with the word-stagger animation instead of popping in late.
3. **Values cards get a gold hover.** Each `<li>` became a `group` with `hover:border-gold` on the top rule and `group-hover:text-gold` on the Lucide icon (300 ms transition). Subtle — the title and body copy stay ink for legibility; only the structural mark and icon warm up on interaction.

Also added `about.hero.imageLabel` translation to both locales.

---

## ADIM 6 — Services pages (5 pages: overview + boxes / bags / corporate-print / custom)

### Structure

Five new pages under `src/app/[locale]/services/`:
- `page.tsx` — overview (hero + alternating 4-row large list + CtaBlock)
- `boxes/page.tsx` — Presentkartonger
- `bags/page.tsx` — Papperskassar
- `corporate-print/page.tsx` — Företagstryck
- `custom/page.tsx` — A++ Specialproduktion

Five new shared components under `src/components/sections/services/`:
- `service-hero.tsx` — editorial 2-col split; eyebrow + h1 (HeadingDot) + tagline on left, 4/5 `ImagePlaceholder` on right (reverses spec from about-hero to give detail pages their own visual rhythm).
- `service-feature-list.tsx` — numbered "Vad vi gör" list, sticky heading on lg+.
- `service-materials.tsx` — "Material & efterbehandling" grid with material-group cards, each with a row of hairline tag pills naming the actual options (typographic specifications, not marketing chips).
- `service-case-teaser.tsx` — 2-card "Related work" preview linking out to `/portfolio` (the per-project `/portfolio/[slug]` pages are still stubbed until ADIM 7).
- `service-direct-cta.tsx` — **custom-page-only** CTA variant. Lifts the phone number out of the footer to heading scale (`text-h2`, border-l gold rule) as the primary contact path, with the quote form as secondary and email as tertiary. Still dark `bg-ink` so the page closes with the same weight as the CtaBlock elsewhere.

### Overview page (/services)

Deliberately **different** from the home page's 2×2 services grid — the dedicated page gives each discipline its own full-width row. `ServicesOverviewList` produces four `<li>` rows, each a single `<Link>` with a 4/5 image on one side and a stacked `01 — Label / h1 / description / Läs mer` on the other. Rows alternate image side (L–R–L–R) for magazine-index rhythm.

### Detail pages — standard shape

All three standard detail pages (boxes / bags / corporate-print) share: `ServiceHero` → `ServiceFeatureList (4–5 items)` → `ServiceMaterials (3–4 groups)` → `ServiceCaseTeaser (2 cases)` → `CtaBlock`. Corporate-print adds a bespoke **Volym** section between materials and CTA — three pricing-tier rows (Kort serie / Standardvolym / Storserie) with hairline-bordered tier captions and a closing disclaimer that pricing is confirmed only after signed spec and press proof (no catalogue). The three-row list deliberately does **not** display prices — the spec was "volume pricing hint, ama kesin fiyat yok."

### Custom page (/services/custom)

Breaks the pattern on purpose — no materials grid, no case teaser. Shape: `ServiceHero` → manifesto section (`Ring innan du briefar.`) with three paragraphs explaining the engagement model (call first, capped at 8 projects/year, engagement letter within a week) → `ServiceFeatureList (5 project-type examples)` → `ServiceDirectCta` with phone at `text-h2` scale.

### Translations

Expanded the `services.*` namespace in both sv.json and en.json. Existing short `services.{key}.name` + `services.{key}.description` keys preserved (used by navigation + homepage grid). New page copy nested under `services.{key}.page.*`. New `services.overview.*` namespace for the overview page. Every detail page has: `meta.{title,description}`, `hero.{eyebrow,heading,tagline,imageLabel}`, type-of-section keys, `cta.*`.

Swedish copy is canonical; English is edited parallel (not literal translation). Tone: **B2B, non-marketing, specification-first** — e.g. Swedish "Stansad och automatlimmad kartong för serieproduktion från 500 enheter. Rätt val för butiksvolym och frakt" rather than "Beautiful custom boxes." Custom page opens with "Ring innan du briefar." and the phone emphasis is carried through to the dark CTA.

### Type system

- All detail page types import `FeatureListItem`, `MaterialGroup` and `CaseTeaserItem` from the shared section components, then build arrays from translation keys via explicit key tuples (`["rigid", "folding", "sleeve", "magnetic"] as const`) so JSON key drift triggers a type error instead of a silent runtime miss.
- `t.raw(...)` is used to pull material tag arrays out of the JSON; cast to `string[]`.

### Verified working

- `/sv/tjanster`, `/sv/tjanster/kartonger`, `/sv/tjanster/kassar`, `/sv/tjanster/foretagstryck`, `/sv/tjanster/specialproduktion` → 200.
- English equivalents (`/en/services`, `/en/services/boxes`, `/en/services/bags`, `/en/services/corporate-print`, `/en/services/custom`) → 200.
- `tsc --noEmit` clean.
- Custom page phone CTA renders `<a href="tel:+4680000000">` — tap-to-call works on mobile.
- Dev-server log: no missing-translation warnings, no runtime errors (only a benign Fast Refresh notice after the large translation edit).

### Deviations / notes

- **Services enum key stayed `corporate`, not `corporate-print`.** The URL slug is `/services/corporate-print` (English) and `/tjanster/foretagstryck` (Swedish), but the JSON namespace key is `services.corporate` to match the pre-existing `ServiceKey` enum in `constants.ts`. Renaming the enum would have cascaded through navigation/header/footer; the URL slug already differentiates.
- **Case teaser links out to `/portfolio`, not `/portfolio/[slug]`.** The per-project detail pages are ADIM 7 scope. The 2-card teaser renders as non-clickable `<article>` cards (no `<Link>`) with a single "Se alla projekt" link to the portfolio index. When detail pages land in ADIM 7, wrap each article in `<Link href={{pathname: "/portfolio/[slug]", params: {slug}}} />`.
- **Volume section in corporate-print is bespoke, not a component.** Built inline in the page rather than extracting to `services/service-volume.tsx`. Rationale: none of the other service pages have a comparable section, so premature abstraction; inline keeps the structure legible.
- **Custom page has no materials grid on purpose.** The brief framed custom as a consult-first service where the spec emerges in scoping, not on a website. Publishing a tag-pill materials grid would undermine the "Ring innan du briefar" stance.

**Up next:** ADIM 7 — Portfolio system (Sanity schema + listing page + per-project detail pages).
