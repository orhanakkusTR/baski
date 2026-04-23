# i18n strategy

How AW AB's bilingual site is organised. This is the contract between content authors, translators, and the renderer.

Source of truth: `src/i18n/`, `src/i18n/messages/*.json`.

---

## Locales

| Locale | Role | URL prefix | Status |
|---|---|---|---|
| `sv` | **Primary** | `/sv/...` | Canonical — always complete |
| `en` | Secondary | `/en/...` | Edited parallel, not literal translation |

- **Default locale:** `sv`. Users who hit `/` are redirected to `/sv`.
- **Locale prefix:** `"always"` — every URL is prefixed. There is no prefix-less version of the site. This is deliberate: Swedish customers expect `/sv/om-oss`, and the middleware keeps the routing typed.
- **Content completeness:** Swedish is the canonical. English is written in parallel, not machine-translated. When a Sanity field has `{ sv, en }` and `en` is blank, the site falls back to `sv`.

## Tone

**Swedish.** B2B, spec-first, non-marketing. "Vi" (we) and "ni" (formal you, plural). Direct sentences, concrete nouns. No cliché verbs like "strävar efter excellens" or "levererar lösningar". When in doubt, prefer the sentence an in-house printing engineer would write over the one a marketing department would.

- "Vi" addresses the agency.
- "Ni" addresses the client when the form permits a formal register (contact / quote forms, legal pages).
- "Du" is used on the home hero and calls-to-action where a warmer voice reads better ("Berätta om uppdraget").
- Mix is deliberate — register is set per context, not applied globally.

**English.** International corporate, British-neutral. British spellings (`colour`, `organisation`, `palletise`, `-ise` endings). No US-specific idioms. Avoid "curate", "solution", "synergy", "excellence" and similar agency boilerplate.

---

## Stack

- **Runtime:** [`next-intl`](https://next-intl.dev) v4.
- **Request flow:** `src/middleware.ts` runs `createMiddleware(routing)` for every non-API path except `/studio`. The middleware rewrites `/sv/om-oss` onto the file-system route `/[locale]/about` transparently, so developers reference the canonical English path (`/about`) in code and get the localised URL rendered at the client.
- **Message loader:** `src/i18n/request.ts` imports the JSON file for the active locale on the server side.
- **Client access:** `useTranslations("namespace")` in `"use client"` components; `getTranslations("namespace")` from `next-intl/server` in server components.

---

## File structure

```
src/i18n/
├── routing.ts              — locale list + localised pathname map
├── request.ts              — server-side locale resolver
├── navigation.ts           — wraps next/link with routing awareness
└── messages/
    ├── sv.json             — Swedish (canonical)
    └── en.json             — English
```

Both JSON files mirror the same shape. A key present in `sv.json` but missing from `en.json` triggers a `MISSING_MESSAGE` warning in dev — shaped checks belong in dev, not a runtime fallback table.

---

## Localised pathnames

Public URLs are per-locale, defined in `src/i18n/routing.ts`:

```
/                    → /
/about               → /sv/om-oss         · /en/about
/services            → /sv/tjanster       · /en/services
/services/boxes      → /sv/tjanster/kartonger       · /en/services/boxes
/services/bags       → /sv/tjanster/kassar          · /en/services/bags
/services/corporate-print  → /sv/tjanster/foretagstryck  · /en/services/corporate-print
/services/custom     → /sv/tjanster/specialproduktion · /en/services/custom
/portfolio           → /sv/arbeten        · /en/portfolio
/portfolio/[slug]    → /sv/arbeten/[slug] · /en/portfolio/[slug]
/process             → /sv/process        · /en/process
/quote               → /sv/offert         · /en/quote
/contact             → /sv/kontakt        · /en/contact
/privacy, /terms     → /sv/integritetspolicy, /sv/villkor · /en/privacy, /en/terms
/cookies             → /sv/cookies        · /en/cookies
/styleguide          → /sv/styleguide     · /en/styleguide (internal)
```

The file-system routes live at the canonical English path (`src/app/[locale]/about/page.tsx`). The middleware handles the rewrite. Link with `<Link href="/about">` — next-intl renders the right per-locale URL at runtime.

### Pathname types

`Pathname` = every key in the map (static + dynamic). `StaticPathname` = `Pathname` minus dynamic-segment entries. Use `StaticPathname` for `href` props that accept a plain string; dynamic routes (e.g. `/portfolio/[slug]`) must pass `{ pathname, params }` object form to `<Link>`.

---

## Message namespacing

Top-level namespaces in `sv.json` / `en.json`:

| Namespace | Scope |
|---|---|
| `nav` | Navigation labels (Hem, Tjänster, Arbeten …) |
| `header` | Header controls (menu toggle, CTA, locale switcher, logo aria) |
| `services` | Four services (`boxes`, `bags`, `corporate`, `custom`) — short `name` / `description` used in nav + home grid, and nested `page.*` with full detail-page copy. Plus `overview.*` for the `/services` index. |
| `home` | Home-page sections (`hero`, `clients`, `services`, `portfolio`, `stats`, `cta`) |
| `portfolio` | Portfolio listing + detail page |
| `about` | About-page sections (`hero`, `history`, `values`, `process`, `team`, `cta`) |
| `process` | Process page (`hero`, `timeline`, `faq`, `cta`) |
| `quote` | Quote form page — fields, placeholders, validation, steps, success, sidebar |
| `contact` | Contact form page — fields, info block, office caption |
| `footer` | Footer copy |

**Conventions:**

- **Eyebrows** are `"01 — Section"` mono-caption labels. Keep the numeric prefix in the string so translators can choose whether to reorder (the numbering rarely changes but the string is authoritative).
- **Headings** end in `.` when they are statements ("Från idé till leverans.") and in `?` for rhetorical CTAs ("Redo att bygga kartongen?"). The site's `HeadingDot` component swaps trailing `.` for the wordmark's gold dot — do not strip the period from the JSON, or the dot won't render.
- **Punctuation style:** em-dashes ("—") over hyphens, Swedish quote marks (") in display copy (we don't nest quotes deeply, so matching pairs are not enforced).
- **ICU placeholders:** used sparingly. `quote.fileUploader.counter` uses `{current}` / `{max}`, `process.timeline.stepLabel` uses `{n}`. Never interpolate untrusted strings; all placeholders resolve against server-computed values.
- **Empty strings mean "use the section without this subfield"** — when a section is optional, the React component checks for falsy and omits the child. Do not put a space in as a "null placeholder".

---

## Validation messages

Form validation messages also live in the locale JSON, under `<formNamespace>.validation.*`. The Zod schema factory is called with the next-intl `t` function:

```ts
// src/lib/validations/contact-schema.ts
export function makeContactSchema(t: (key: string) => string) {
  return z.object({
    name: z.string().min(2, t("validation.nameMin")),
    email: z.string().email(t("validation.emailInvalid")),
    // ...
  });
}

// in the form component
const t = useTranslations("contact");
const schema = useMemo(() => makeContactSchema(t), [t]);
```

This keeps error messages in sync with the rest of the form copy — same translators, same locale switch.

**Server-side** schemas (`contactSchemaServer`, `quoteSchemaServer`) intentionally use no custom messages. If the server rejects a payload, the client already validated, so the failure means a hand-crafted request bypassed the UI. The generic English message goes back in the `issues` object without needing locale-aware copy.

---

## Email templates

The four Resend templates (`contact-inquiry`, `contact-confirmation`, `quote-inquiry`, `quote-confirmation`) each take `locale: "sv" | "en"` and carry their own copy dictionary inside the file — a `const copy = { sv: {...}, en: {...} }` object that the JSX reads through `copy[locale]`.

**Why not use next-intl inside templates?** React Email's `render()` can run outside the Next request context (e.g. `npx react-email dev`). Embedded copy means a designer can preview an email layout without spinning up the full Next app. The copy for email is email-specific anyway (different register, no navigation) — trying to share with site messages would couple the two for little gain.

---

## What is NOT in the locale JSON

- **`SITE_CONFIG`** (`src/lib/constants.ts`) — email, phone, address, org number, VAT, founding year. These are structural facts, not copy. They change once in a decade.
- **Client names on the portfolio** — come from Sanity per project (`client->name` or `anonymousClient` fallback). Brand names stay as the client wrote them, regardless of locale.
- **Sanity field labels** — editor-facing, keep in English in the schema files (editors read English in the studio UI).
- **Service / nav enum keys** — `"boxes"`, `"bags"`, `"corporate"`, `"custom"` are identifiers, never rendered. Their locale display names are in `services.<key>.name`.
- **Placeholder / form microtext that is purely structural** — e.g. `placeholder="https://"` on the website URL input. The `"https://"` prefix is a protocol hint, not prose.

---

## Adding a new locale

1. **Add the locale to `routing.ts`** — push to the `locales` tuple and extend any `pathnames` entries that differ per locale.
2. **Create `messages/<locale>.json`** — copy `sv.json` as a starting point, translate field by field. Keep the shape identical; a key missing will surface as a `MISSING_MESSAGE` warning in dev.
3. **Add locale-specific validation messages** inside the `validation` object of each form namespace.
4. **Add the locale to email templates** — extend the `copy = { sv, en, ... }` dicts in each of the four templates.
5. **Add the locale label** in `src/components/layout/language-switcher.tsx` if you want it to appear in the switcher.
6. **Update the `Locale` type alias** (`routing.ts`) — everywhere it is used.
7. **Check Sanity `localizedString` / `localizedText`** — they are hard-coded to `sv` + `en`. Adding a third locale means schema changes to the studio.
8. **Check `pickLocale()`** in `src/lib/sanity/types.ts` — today it only handles `sv | en`.
9. Re-deploy Sanity Studio (`npm run sanity:deploy`) so editors see the new fields.

---

## Known tradeoffs

- **Swedish `"ledtid"` vs English `"lead time"`.** We use the local term in each language rather than a bilingual fixed form. Consistent within each file.
- **Loan words.** Swedish B2B printing vocabulary mixes English loanwords (`"brief"`, `"scope"`, `"spec"`, `"soft-touch"`, `"hetfolie"`) — we keep them as they appear in industry usage rather than force-coining translations.
- **No JSON-based fallback table between locales.** If an `en` key is missing, next-intl throws in dev (`MISSING_MESSAGE`) so we notice early. Production shipped with a missing key will render the key path as text — loud, but the fail-loud is deliberate.
- **No automated translation QA.** The English side is hand-edited parallel, not machine-translated. Periodic tone audits happen manually; there is no CI check for "same meaning" between `sv.json` and `en.json`.

---

## Links

- `src/i18n/routing.ts` — locale + pathname configuration
- `src/i18n/request.ts` — server message loader
- `src/i18n/navigation.ts` — `<Link>` + `useRouter` wrappers
- `src/middleware.ts` — runtime rewriter (with `/studio` exclusion)
- `src/i18n/messages/sv.json`, `en.json` — the copy
