# Content model — Sanity schemas

This document describes every schema the AW AB studio ships with. It is the contract between editors, the public site, and the admin surface. When a schema here changes, the corresponding reader in `src/lib/sanity/queries.ts` and `src/lib/sanity/types.ts` must change with it.

Source of truth: `sanity/schemas/`. Registration order: objects → documents → singletons (see `sanity/schemas/index.ts`).

## Conventions

- **Swedish is canonical.** Every localized field has a required `sv` value and an optional `en`. The site falls back to `sv` when `en` is missing — never the other way around.
- **Objects vs documents.** Objects are embedded shapes (localized strings, SEO block, gallery image). Documents are independent records (project, client, etc.). Singletons are regular documents pinned to a fixed id via the studio structure — not a special schema type.
- **Discretion by default.** Client names and testimonials require written consent before publication. The `client.publishedConsent` boolean gates both logo strips and per-project name display.

---

## Objects

### `localizedString`
Short, single-line strings in both locales.

| field | type | required | notes |
|---|---|:---:|---|
| `sv` | string | ✓ | Canonical Swedish value |
| `en` | string |  | Optional English value |

Used for: project titles, client roles, SEO meta title, image alt text, gallery captions.

---

### `localizedText`
Long-form rich text per locale. Each locale is its own Portable Text array so translations can diverge at paragraph level.

| field | type | required | notes |
|---|---|:---:|---|
| `sv` | `blockContent[]` | ✓ | Swedish body |
| `en` | `blockContent[]` |  | English body |

Used for: project `challenge` / `solution` / `results`.

---

### `blockContent`
Portable Text configuration. Deliberately narrow — editorial body copy, not a full blog editor.

- **Styles:** normal, H2, H3, blockquote
- **Lists:** bullet, numbered
- **Marks:** strong, emphasis, external link (with `href` + `blank` boolean)

No code blocks, no checklists, no image embeds. Gallery imagery lives on its own `galleryImage[]` array so it renders outside the text flow.

---

### `seo`
Optional SEO override per document. Any field left blank falls back to the document's own title / description / hero image.

| field | type | notes |
|---|---|---|
| `title` | `localizedString` | Overrides the `<title>` tag |
| `description` | `localizedString` | Used for `<meta description>` and OG |
| `ogImage` | image | 1200×630 recommended; falls back to hero |
| `noindex` | boolean | Blocks search engines when `true` |

---

### `galleryImage`
One image entry in a project gallery.

| field | type | required | notes |
|---|---|:---:|---|
| `image` | image (hotspot) | ✓ | |
| `alt` | `localizedString` | ✓ | Screen-reader text; required |
| `caption` | `localizedString` |  | Shown in lightbox only |

---

## Documents

### `project`
A portfolio case study.

| field | type | required | notes |
|---|---|:---:|---|
| `title` | `localizedString` | ✓ | |
| `slug` | slug (source: `title.sv`) | ✓ | URL fragment — do not rename once indexed |
| `client` | reference → `client` |  | Preferred over `anonymousClient` |
| `anonymousClient` | string |  | Placeholder shown when client is public but name is not |
| `category` | select: `boxes` / `bags` / `corporate` / `custom` | ✓ | Matches `ServiceKey` in `src/lib/constants.ts` |
| `year` | number |  | 2015 – current year + 1 |
| `services` | reference[] → `service` |  | Many-to-many; e.g. a kit can span `boxes` + `bags` |
| `materials` | string[] |  | Tags shown in detail-page meta strip |
| `heroImage` | image (hotspot) | ✓ | Used on listing + detail |
| `description` | `localizedString` | ✓ | One-line summary on listing + featured cards |
| `challenge` | `localizedText` |  | Narrative section 1 |
| `solution` | `localizedText` |  | Narrative section 2 |
| `results` | `localizedText` |  | Narrative section 3 |
| `gallery` | `galleryImage[]` |  | Rendered with the lightbox modal |
| `featured` | boolean |  | Eligible for homepage strip + service case teasers |
| `order` | number |  | Lower numbers appear first |
| `seo` | `seo` |  | Optional overrides |

**Category is a select, not a reference** — four disciplines are a fixed enum. The `services` reference array handles the one-to-many cases where a project spans multiple disciplines.

**Why `anonymousClient`:** some clients never green-light a public name but still allow the project to be shown. The detail page picks `client.name` when present, else `anonymousClient`, else renders a dash.

---

### `client`
A brand we have produced for.

| field | type | required | notes |
|---|---|:---:|---|
| `name` | string | ✓ | Public-facing brand name |
| `logo` | image (SVG or PNG) |  | Transparent background |
| `industry` | select |  | spirits / beauty / fashion / food / tech / finance / hospitality / other |
| `website` | url |  | |
| `publishedConsent` | boolean |  | **Must be `true`** before the logo appears publicly |

`publishedConsent` defaults to `false`. Filters at query time so logo strips and project cards hide clients without consent. Revoking consent pulls every surface that references that client.

---

### `service`
A service discipline. Currently four: `boxes`, `bags`, `corporate`, `custom`.

| field | type | required | notes |
|---|---|:---:|---|
| `key` | select | ✓ | Must match `ServiceKey` enum — do not rename |
| `name` | `localizedString` | ✓ | |
| `summary` | `localizedString` |  | Short one-liner |
| `order` | number |  | Sort position in service lists |

The site's static service pages currently hardcode copy in `src/i18n/messages/*.json` — this document is the join target for `project.services` references and an anchor point for later migration to Sanity-driven service pages.

---

### `testimonial`
A client quote. Never published without written consent on the referenced `client` document.

| field | type | required | notes |
|---|---|:---:|---|
| `quote` | `localizedText` | ✓ | |
| `attribution` | string | ✓ | Name of the person quoted |
| `role` | `localizedString` |  | Job title |
| `client` | reference → `client` |  | |
| `project` | reference → `project` |  | Optional — links quote to a specific case |
| `featured` | boolean |  | Eligible for homepage rotation |

---

## Singletons

Singletons are regular document types, rendered single-instance via the studio structure (`sanity/structure.ts`). The structure builder creates a direct editor entry for the fixed document id (`homePage`, `siteSettings`) and filters the type out of auto-generated lists so editors cannot create a second instance.

### `homePage`
Home-page content that editors need to change without code.

| field | type | notes |
|---|---|---|
| `featuredProjects` | reference[] → `project` | Max 3. Index 0 = hero banner, 1–2 = supporting row |
| `featuredClients` | reference[] → `client` | Logo strip; filter by `publishedConsent` |
| `stats.projectsDelivered` | number | |
| `stats.brands` | number | |
| `stats.countries` | number | |
| `stats.qualityGrade` | string | |

**Not** in this document: hero headline / eyebrow / subtitle / CTA text. Those stay in i18n JSON because they are brand voice, not editorial content that rotates.

### `siteSettings`
Global contact + social + default OG.

| field | type | notes |
|---|---|---|
| `contactEmail` | string | Public-facing; shown on /contact + footer |
| `contactPhone` | string | |
| `address.line1` | string | Street |
| `address.line2` | string | Postal + city |
| `address.country` | string | |
| `social.instagram` | url | |
| `social.linkedin` | url | |
| `defaultOgImage` | image | Fallback for pages without their own `seo.ogImage` |

Structural facts (org number, VAT, founding year) stay in `src/lib/constants.ts` — do not duplicate them here.

---

## Query map

`src/lib/sanity/queries.ts` exposes:

| function | GROQ | purpose |
|---|---|---|
| `getAllProjects()` | `*[_type=="project" && defined(slug.current)] \| order(order asc, year desc)` | /portfolio listing |
| `getFeaturedProjects(limit = 3)` | `*[_type=="project" && featured==true]` slice | Homepage PortfolioShowcase |
| `getProjectsByCategory(category, excludeSlug?, limit = 2)` | category filter, optional exclude | Service page ServiceCaseTeaser + detail-page "Similar" |
| `getProjectBySlug(slug)` | single project + full narrative + gallery | /portfolio/[slug] |
| `getAllProjectSlugs()` | slug array | `generateStaticParams` |

Each function returns an empty array / null when `NEXT_PUBLIC_SANITY_PROJECT_ID` is unset. The site degrades to mock data gracefully.

---

## Writing content: editor checklist

Creating a project:
1. Client document exists and has `publishedConsent = true` (or leave `client` blank and fill `anonymousClient`).
2. Fill `title.sv` — the slug auto-generates from it. Slugs must be stable once a project is public.
3. Pick `category` (single select) and optionally add `services` references for cross-discipline projects.
4. Upload `heroImage` with a hotspot.
5. Write `description.sv` (one line, shown on listings).
6. Fill `challenge` / `solution` / `results` in `localizedText` — each is optional but a case study feels empty without all three.
7. Upload gallery images with required `alt.sv`.
8. If eligible for homepage / service teasers, set `featured = true`. Set `order` to control sort position.
9. Publish.

---

## Not modelled (deferred)

- **Blog / journal** — `post` schema planned for Phase 1.5 (SEO), not in this step.
- **Locations / production partners** — listed on about page as plain copy; not editorial enough to warrant a schema yet.
- **FAQ** — will live on a contact / quote page only if demand emerges.

See `docs/11-phase-2-roadmap.md` for scope beyond this step.
