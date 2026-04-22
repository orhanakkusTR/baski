# 02 — Design System

Authoritative record of tokens and primitives. The styleguide page at
`/[locale]/styleguide` is a living render of everything in this doc — if the
two drift, the CSS wins (it's what users see), and this file gets updated.

All tokens live in [src/app/globals.css](../src/app/globals.css) inside the
`@theme` block. Utilities (`bg-ink`, `text-display-xl`, `rounded-sm`,
`duration-150`, etc.) resolve to these tokens — no raw hex, px, or ms
values should appear in component files.

---

## 1 — Color

| Token | Hex | Tailwind | Where to use |
|-------|-----|----------|--------------|
| `ink` | `#0A0A0A` | `bg-ink`, `text-ink`, `border-ink` | Primary text, headings, strong UI (primary button fill, icons). |
| `paper` | `#F5F1EA` | `bg-paper`, `text-paper` | Page background. The default canvas on every page. |
| `gold` | `#C9A961` | `bg-gold`, `text-gold` | Accent — used sparingly. Focus ring, small dot marks, featured badge. Never a large surface. |
| `stone` | `#8B8680` | `text-stone`, `border-stone` | Muted body copy, eyebrow labels, secondary meta. |
| `bone` | `#E8E2D5` | `bg-bone`, `border-bone` | Subtle contrast surface — hover states, muted cards, section alternation. |
| `white` | `#FAFAFA` | `bg-white`, `text-white` | Cards, popovers, anything that should float visually. |

### shadcn primitive remap
shadcn's `--primary`, `--accent`, `--ring`, `--muted`, etc. are all re-pointed at the AW AB palette in `:root`. A vanilla `<Button>` renders in `ink` / `paper`; a focused input shows a `gold` ring. **Don't add new shadcn imports with the stock neutral palette — the remap in `globals.css` handles it.**

### Dark mode
Not wired. `@custom-variant dark` hook is present in case Phase 2 needs it, but no `.dark` block is defined. Leave it that way.

---

## 2 — Typography

### Families
- **Fraunces** (`font-display`) — serif, variable, with `opsz` axis for optical-size adjustments at display sizes. Used for every heading.
- **Inter** (`font-sans`) — neutral, variable, latin-ext subset (for å/ä/ö). Used for body and UI.
- **System mono** (`font-mono`) — SF Mono / Menlo / Consolas fallback stack. Used for eyebrows, captions, numeric accents. **JetBrains Mono** not loaded — the system stack reads nearly identically and saves one variable font.

### Scale
All display sizes use `clamp()` so they scale smoothly between mobile and desktop. All sizes have line-height and letter-spacing baked into the token — don't override them at the utility level.

| Token | Utility | Intended use |
|-------|---------|--------------|
| `display-2xl` | `text-display-2xl` | Hero eyecatch — max **one** per page. |
| `display-xl` | `text-display-xl` | Primary hero headline. |
| `display-lg` | `text-display-lg` | Section leads (About, Services overview). |
| `h1` | `text-h1` | Page title where there's no hero. |
| `h2` | `text-h2` | Section title. |
| `h3` | `text-h3` | Sub-section. |
| `h4` | `text-h4` | Card heading. |
| `h5` | `text-h5` | Small heading. |
| `h6` | `text-h6` | Meta heading. |
| `body-lg` | `text-body-lg` | Lead paragraphs, hero subtitle. |
| `body` | `text-body` | Default paragraph. |
| `body-sm` | `text-body-sm` | Secondary copy, form help text. |
| `caption` | `text-caption` (with `uppercase tracking-[0.18em] font-mono`) | Eyebrows, metadata, labels. |

### Hierarchy rule
Skipping levels is fine (`h1 → h3`), but never **invert** them within a
section. Visual weight follows this scale exactly — a body-lg paragraph
must read as "larger body", not as "small heading".

---

## 3 — Spacing

Tailwind's default 4-point scale (`p-4`, `gap-8`, etc.) applies everywhere. Two conventions on top:

- **Section padding:** `py-12 md:py-16 lg:py-20` (48 / 64 / 80 px) on content sections. The original CLAUDE.md spec `py-24 md:py-32 lg:py-40` gave combined section-to-section gaps of 192 / 256 / 320 px — excessive dead space, not editorial whitespace. Even a first tighten (`py-20 md:py-24 lg:py-28`) landed at 160 / 192 / 224 combined, which on a tall desktop viewport still felt like blank scroll. The current values land combined gaps at 96 / 128 / 160 px — matching the density of Pentagram / Instrument / Basic Agency. Featured strips (marquee, stat strips with a `border-y` separator) use the same padding now — the border carries the visual break. The styleguide page is exempt — it's an internal reference, not user-facing.
- **Page canvas:** 1440 px max-width with responsive inline padding. Exposed as a custom utility `container-edge` and wrapped in `<Container>` from `src/components/shared/container.tsx`. Use `<Container as="section">` for every section.

---

## 4 — Radius

**Sharp by default.** We define three tokens; anything curvier feels
consumer-grade and clashes with the editorial-serif identity.

| Utility | Value | When |
|---------|-------|------|
| `rounded-none` | 0 | Default. Images, dividers, large surfaces. |
| `rounded-sm` | 2 px | Buttons, badges, pills. |
| `rounded-md` | 4 px | Cards, popovers, inputs. |

`rounded-lg`, `rounded-xl`, and `rounded-2xl` are **remapped to `--radius-md`** in the `@theme inline` block so shadcn's built-in `rounded-lg` on inputs/selects collapses back to the sharp 4 px. If you genuinely need a curve larger than 4 px, flag it in review.

---

## 5 — Shadow

Almost flat. Elevation is communicated with **borders and whitespace**, not drop-shadows. Two tokens exist for the rare case a dropdown or popover genuinely needs to float.

| Token | CSS variable | Use |
|-------|--------------|-----|
| `shadow-subtle` | `var(--shadow-subtle)` | Ambient lift on interactive cards. Dropdowns by default. |
| `shadow-elevated` | `var(--shadow-elevated)` | Menus, popovers, overlays. |

Everything else uses `shadow-none`. Hover affordance is colour + border, not shadow-pulse.

---

## 6 — Motion

Three durations, one curve. If a new animation wants a different number, reject the PR.

| Token | Value | Where |
|-------|-------|-------|
| `duration-fast` | `150 ms` | Hover state, button colour transitions, focus ring. |
| `duration-base` | `250 ms` | In-viewport reveals (FadeIn), small layout shifts. |
| `duration-slow` | `400 ms` | Section-level emphasis, text-reveal stagger total. |
| `ease-editorial` | `cubic-bezier(0.22, 1, 0.36, 1)` | The only easing. Fast start, long settle. Feels "out-expo but kinder". |

**Respect `prefers-reduced-motion`.** Every animation component in `src/components/animations/` short-circuits to a static render when the user opts out. When you write a new animated component, call `useReducedMotion()` first.

### What not to do
No parallax. No scroll-hijacking. No auto-playing video. No particle effects. No 3D tilts. No glassmorphism. The site earns attention with typography and whitespace, not with animation.

---

## 7 — Components

Every component lives under `src/components/`. Three tiers:

### `src/components/ui/` — shadcn primitives
Imported via `npx shadcn@latest add <name>`. Current inventory:

| File | Notes |
|------|-------|
| `button.tsx` | **Customised** — our four variants (`primary`, `outline`, `ghost`, `link`) + four sizes (`sm`, `md`, `lg`, `icon`). Uses Base UI's button primitive. |
| `input.tsx` | Stock shadcn. `rounded-lg` collapses to `rounded-md` via the radius remap. |
| `textarea.tsx` | Stock shadcn. |
| `select.tsx` | Stock shadcn (Base UI under the hood). |
| `label.tsx` | Stock shadcn. |
| `form.tsx` | **Manually written** — the `base-nova` preset doesn't ship a `form` component, so we wrote the canonical shadcn `FormField` / `FormItem` / `FormLabel` / `FormControl` / `FormDescription` / `FormMessage` wrapper on top of `react-hook-form` + `@radix-ui/react-slot`. Form labels use `font-mono text-caption uppercase` — the eyebrow style. |
| `separator.tsx` | Stock shadcn. |

### `src/components/shared/` — AW AB patterns
Our own primitives, safe to import everywhere. Five files:

| File | Props | What it does |
|------|-------|--------------|
| `container.tsx` | `as`, `bleed`, standard div props | Wraps children in `.container-edge` (1440 max, responsive inline padding). `bleed` turns the wrapper off. |
| `section-heading.tsx` | `eyebrow`, `heading`, `description`, `align`, `as`, `size` | Editorial header block — mono caption + display heading + stone description. `size` picks between `display-lg` / `h1` / `h2`. |
| `button-link.tsx` | `href`, `external`, `tone`, `size`, `direction`, `showArrow` | Text CTA with arrow + underline-from-left reveal on hover. `direction="up-right"` for external-ish links, `right` for internal-flow. Wraps Next.js `<Link>` when internal, `<a>` when `external`. |
| `badge.tsx` | `tone`, `variant` | Mono uppercase pill. Variants: `plain`, `outline`, `solid`, `dot`. |
| `logo.tsx` | `href`, `tone`, `size`, `withMark` | Placeholder typographic wordmark. `tone="ink"` on paper, `tone="paper"` on ink. Swap out for the real wordmark once branding lands. |

### `src/components/animations/` — motion wrappers
All are `"use client"`. All honour `useReducedMotion()`.

| File | What it does |
|------|--------------|
| `fade-in.tsx` | `whileInView` fade + 40 px translate. `once: true` default. Wrap any section. |
| `text-reveal.tsx` | Word-by-word stagger for headings. Splits on whitespace, each word rises from `110% → 0%` with opacity. `splitBy="line"` for `\n`-separated lines. |
| `marquee.tsx` | Infinite horizontal scroll. CSS keyframes (`marquee-left` / `marquee-right`) live in `globals.css`. Duplicates children N times; mask fade on both edges. `pauseOnHover` by default. |

### Component conventions
1. **Server Components by default.** Add `"use client"` only when you need state, effects, or Framer Motion.
2. **Interface, not type.** Props typed with `interface` (per CLAUDE.md).
3. **cn() everywhere.** Tailwind classes merged via `cn()` from `@/lib/utils` (clsx + tw-merge, handles conflicts correctly).
4. **No inline styles** — except for dynamic CSS custom properties (e.g. Marquee's `--marquee-duration`), which aren't expressible as utility classes.
5. **No prop drilling of colour tokens.** If a component needs a brand colour, hardcode the utility (`bg-ink`); don't make colour a prop.

---

## 8 — The styleguide page

Route: `/[locale]/styleguide` (file: [src/app/[locale]/styleguide/page.tsx](../src/app/[locale]/styleguide/page.tsx)).

It's a server-rendered, internal reference — `robots: { index: false, follow: false }` and no nav link. Treat it as the canonical "does it look right" check after touching any token or primitive. If a new primitive doesn't have a section here, it shouldn't be merged.
