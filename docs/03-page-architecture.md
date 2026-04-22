# 03 — Page Architecture

The site has **10 primary pages** in Phase 1 (plus `/journal` deferred to Phase 1.5, and `/styleguide` as an internal reference). URLs are always locale-prefixed — `/sv/…` (default) and `/en/…` mirror each other exactly.

Every page lives under `src/app/[locale]/`. The locale layout owns `<html>`, `<body>`, `<Header>`, `<main>` (with `pt-24 md:pt-28` to clear the fixed header), and `<Footer>`. Pages render section-level components only.

---

## Section language
Every page is composed from the same vocabulary:

- **Hero** — the first paint. Display typography, minimal UI, one primary CTA. Homepage uses `display-xl`; interior pages use `display-lg` or `h1`.
- **Section** — `<Container as="section" className="py-24 md:py-32 lg:py-40">`. Uses `SectionHeading` (eyebrow + heading + optional description).
- **Detail grid** — 2–4 column grid of cards, specs, or offerings. Hover affordance via border, not shadow.
- **Quote / testimonial band** — oversized serif quote, client attribution as eyebrow.
- **CTA band** — dark (`bg-ink`) section with a single call-to-action. Matches the footer aesthetic so hand-off is seamless.
- **Footer** — rendered by layout, not by pages.

Pages never repeat the same section twice in a row without a visual shift (colour, scale, or rhythm change). The editorial principle: each section should feel like it's announcing something new.

---

## Pages

### 1. `/` — Homepage
**Route:** `/sv`, `/en`
**File:** `src/app/[locale]/page.tsx`
**Purpose:** Lead the pitch. A premium packaging agency for Nordic + international luxury brands.

**Sections (top → bottom):**
1. Hero — oversized Fraunces display, one-line headline + 2-line sub, primary CTA ("Begär offert") + secondary (ButtonLink "Se arbeten").
2. Client logo marquee — 6–10 client wordmarks on an infinite horizontal scroll (Marquee component). Placeholder logos until real clients are cleared for display.
3. Service overview — 4 services as editorial cards (Kartonger, Kassar, Företagstryck, A++). Each card is hoverable, links to its detail page.
4. Featured work — 3 portfolio highlights, asymmetric grid (1 large + 2 smaller). Pulled from Sanity in ADIM 7.
5. Stats strip — three numbers in large display type (clients, markets served, years in business).
6. CTA band — "Ready to package like you mean it?" → Quote form.

---

### 2. `/about` — Om oss
**Route:** `/sv/about`, `/en/about`
**Purpose:** Establish credibility and personality — who AW AB is, why they do this, who's on the team.

**Sections:**
1. Editorial hero — display-lg heading, paragraph-length intro.
2. Values — three pillar cards (Kvalitet, Hantverk, Partnerskap) with short blurbs.
3. Timeline — founding → growth → today, vertical with year anchors.
4. Team (optional) — 4–8 portrait cards, sparse. If headshots aren't ready, skip.
5. CTA band.

---

### 3. `/services` — Tjänster (overview)
**Route:** `/sv/services`, `/en/services`
**Purpose:** Navigator page — one-paragraph summary of each service with a link to its detail.

**Sections:**
1. Hero — short. "Fyra hantverk, ett språk."
2. Four service cards — same four as the header dropdown, expanded. Image + eyebrow + title + 2-sentence description + ButtonLink to detail.
3. Process teaser — three-step preview linking to `/process`.
4. CTA band.

---

### 4. `/services/boxes` — Presentkartonger
**Route:** `/sv/services/boxes`, `/en/services/boxes`
**Purpose:** Convert premium-box buyers. Specs, craft, case proof.

**Sections:**
1. Hero with product-close-up image (right-half bleed).
2. What we build — bulleted specs: sizes, materials, finishes (foil, embossing, spot UV, cotton ribbon).
3. Craft details — photo row of close-up details with caption overlays.
4. Case study — 1 full-width example from Sanity: hero + 2 pull quotes + result.
5. Related services — links to bags and custom.
6. CTA band.

---

### 5. `/services/bags` — Papperskassar
Same shape as `/services/boxes`, specialised to paper bags (sizes, cotton/twisted handles, lamination finishes).

---

### 6. `/services/corporate-print` — Företagstryck
Same shape, specialised to cards, folders, presentation collateral. Emphasises matching-quality pairing with packaging.

---

### 7. `/services/custom` — A++ Specialproduktion
**Purpose:** The prestige tier — custom/limited-run showcase work.

**Sections:**
1. Hero with dramatic full-bleed image.
2. Positioning paragraph — who this is for (flagship launches, limited editions, events).
3. Process variant — 5 steps instead of the standard 3 (brief → concept → prototype → sign-off → production).
4. Gallery — 6–9 past custom builds (hover-zoom on grid).
5. **Prominent form CTA** — more emphatic than other services (since this is consultation-sold, not catalogue-sold). Link to quote form pre-filled with product type = custom.

---

### 8. `/portfolio` — Arbeten (listing)
**Route:** `/sv/portfolio`, `/en/portfolio`
**Purpose:** Grid browse all case studies.

**Sections:**
1. Hero — one-line "Urval". Category filter chips below (All / Boxes / Bags / Corporate / Custom).
2. Project grid — 2-col desktop, 1-col mobile. Each card: hero image, client name (eyebrow), project title, year.
3. CTA band.

**Data:** Sanity `project` documents, fetched server-side, ordered by `year desc` then `title asc`.

---

### 9. `/portfolio/[slug]` — Case study detail
**Route:** `/sv/portfolio/<slug>`, `/en/portfolio/<slug>`
**Purpose:** Single-project depth. Story + imagery + outcome.

**Sections:**
1. Project hero — full-bleed image, project title (display-lg), meta row (client, year, category, role).
2. Context block — two-column: challenge (left), solution (right).
3. Gallery — mixed grid (full-bleed, 2-col, 3-col rows alternating). Images pulled from Sanity.
4. Pull quote — oversized serif, client attribution.
5. Next project link — pagination, always visible, drives depth.
6. CTA band.

**Data:** Sanity `project` by slug; generateStaticParams for each project slug.

---

### 10. `/process` — Process
**Route:** `/sv/process`, `/en/process`
**Purpose:** Demystify working with AW AB. Shows the engagement as craft, not sales.

**Sections:**
1. Hero — "Från brief till leverans, i sex steg."
2. Step timeline — Brief → Concept → Prototype → Production → QA → Delivery. Each step has a number, eyebrow, title, and paragraph. Left-rail sticky progress indicator on desktop.
3. What you'll need — 3 checklist cards (brief contents, assets we need, approval expectations).
4. FAQ (3–5 items) — uses Base UI's accordion primitive when we adopt it.
5. CTA band.

---

### 11. `/quote` — Begär offert
**Route:** `/sv/quote`, `/en/quote`
**Purpose:** Convert. Structured quote form.

**Sections:**
1. Hero — one-line value prop, short.
2. Form — two-column on desktop (form left, summary sidebar right). Fields per `CLAUDE.md`:
   - Firma bilgileri (name, company, email, phone, website)
   - Product type (select: boxes / bags / corporate / custom)
   - Quantity (number)
   - Approximate dimensions (textarea or structured inputs)
   - Material preference (select, includes "Unsure")
   - Deadline (date)
   - Budget range (select, optional)
   - File upload (brief, logo, design — max 10 MB, PDF / AI / PNG / JPG)
   - Notes (textarea)
3. Success state — same template regardless of entry source.
4. Trust rail (below or in sidebar) — 2–3 short case-study proof points.

**Data flow:** RHF + Zod → server action → Resend (dual email: internal + customer confirmation).

---

### 12. `/contact` — Kontakt
**Route:** `/sv/contact`, `/en/contact`
**Purpose:** General-inquiry channel — not a quote request. Office address, direct email / phone, quick contact form.

**Sections:**
1. Hero — "Prata med oss." One line.
2. Contact card grid — 3 cards: Email, Phone, Office (address + map pin icon). Office card links to Google Maps.
3. Short contact form — Name, Company, Email, Phone, Message. Submits via same Resend path as quote, different template.
4. Office photo (optional, if assets available).

---

### 13. `/journal` and `/journal/[slug]` — **Phase 1.5**
Not shipped in the initial launch. When added: listing page + MDX or Sanity-backed article pages. SEO-oriented. Linked from the footer only, not the primary nav.

---

## Reserved / internal

### `/styleguide`
Internal, `robots: noindex, nofollow`. Not linked from anywhere user-facing. Canonical render of every token and primitive — treat as the design-system test page.

### Legal: `/privacy`, `/terms`, `/cookies`
Linked from the footer. Single-column long-form pages, typography only. Content comes from legal review in ADIM 11.

---

## Locale parity

Every route exists under both `/sv/…` and `/en/…`. No page should ship without its English counterpart — content translation happens in ADIM 10. Swedish is canonical (primary market), English is the secondary.

When a route takes a slug (`/portfolio/[slug]`), both locales use the **same slug** by default. If marketing needs locale-specific slugs later, next-intl's `pathnames` mapping in `routing.ts` handles it.

---

## Header & footer presence

- **Header** is rendered on every page by the locale layout. On homepage hero, the page content pulls up under the header (see `pt-24` on main) — the header is transparent until scroll, so the hero reads clean.
- **Footer** is rendered on every page by the locale layout. Dark ink bg with oversized wordmark — acts as a full-stop for the scroll. Pages don't render their own footer sections.

If a page genuinely shouldn't have header/footer (e.g. a future gated admin), move it under a route group (`/(public)` vs `/(admin)`) with a layout per group. Phase 1 ships everything under the public group; admin is Phase 2.
