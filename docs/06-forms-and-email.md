# Forms and email

This document is the contract between the two public-facing AW AB forms (`/contact` and `/quote`) and the mail pipeline that delivers each submission.

Source of truth: `src/components/forms/`, `src/app/api/*/route.ts`, `src/lib/validations/`, `src/lib/email/`.

---

## Forms at a glance

| Form | Route | API | Method | Payload | Side effects |
|---|---|---|---|---|---|
| Contact | `/kontakt` · `/contact` | `POST /api/contact` | JSON | 5 fields | 1 admin mail · 1 confirmation mail |
| Quote | `/offert` · `/quote` | `POST /api/quote` | `multipart/form-data` | 12 fields + up to 5 files | 1 admin mail with attachments · 1 confirmation mail |

Both forms:
- Use React Hook Form + `@hookform/resolvers/zod` as the client-side state + validation layer.
- Build Zod schemas via a factory that accepts the next-intl `t()` function so validation messages render in the user's locale.
- Re-validate on the server against a second, generic Zod schema (`contactSchemaServer`, `quoteSchemaServer`) — defence against clients that skip the UI.
- Replace the form frame with a `FormSuccess` block on submission success (not a toast).
- Show a red inline error under the form on network or server failure.

---

## Contact form

**Route:** `src/components/forms/contact-form.tsx`. Single-column editorial layout (hairline underline inputs). Grouped two-per-row on md+ so the form fills horizontal space without becoming an admin panel.

**Fields (5):**
| Field | Type | Required | Notes |
|---|---|:---:|---|
| `name` | string (2–200) | ✓ | `autoComplete="name"` |
| `company` | string (2–200) | ✓ | `autoComplete="organization"` |
| `email` | email (≤200) | ✓ | `autoComplete="email"` |
| `phone` | string, regex `^[+\d\s\-()]{6,}$` | | Optional. `autoComplete="tel"` |
| `message` | string (10–2000) | ✓ | Multi-line `<textarea>` |

Zod schema: `src/lib/validations/contact-schema.ts`.

---

## Quote form

**Route:** `src/components/forms/quote-form.tsx`. Three steps:

| Step | Contents | Validated on "Next" |
|---|---|---|
| 01 — Contact | name, company, email, phone (opt), website (opt) | ✓ |
| 02 — Project | productType, quantity, dimensions (opt), materials (opt), deadline (opt), budget (opt) | ✓ |
| 03 — Files & notes | file upload (up to 5), notes (opt), submit | files re-validated server-side |

Single React Hook Form instance holds all scalar fields across steps — moving back/forward does not lose state. Files are held in a sibling `useState<File[]>` array (RHF + native file inputs are finicky); both get assembled into a `FormData` at submit time.

Advancing calls `form.trigger(STEP_FIELDS[step])` so only the current step's fields need to be valid to move forward. Back never validates.

**Progress indicator:** typographic only — `Steg 01 av 03 · Kontakt` row + a 1-px ink rule with a gold fill that animates to `(step / 3) * 100%` width. No chips, no step markers — the section heading on each step tells the user where they are.

### Field catalogue (12 fields)

| Field | Type | Required | Notes |
|---|---|:---:|---|
| `name` | string (2–200) | ✓ | |
| `company` | string (2–200) | ✓ | |
| `email` | email (≤200) | ✓ | |
| `phone` | phone-regex | | Optional |
| `website` | starts with `http(s)://` | | Optional |
| `productType` | enum: boxes / bags / corporate / custom | ✓ | Matches `ServiceKey` |
| `quantity` | positive integer ≤ 1,000,000 | ✓ | String on client (`<input type="number">`); server coerces |
| `dimensions` | string (≤500) | | Freeform — "200×150×80 mm" |
| `materials` | string (≤500) | | Freeform — "FSC kraft 180 gsm, matt lam" |
| `deadline` | ISO date string | | `<input type="date">` |
| `budget` | enum: under50k / range50to150k / range150to500k / over500k / flexible | | |
| `notes` | string (≤2000) | | Freeform |

Zod schema: `src/lib/validations/quote-schema.ts`.

### File upload

File uploader lives at `src/components/forms/file-uploader.tsx`. Controlled component — parent owns the `File[]` state.

**Constraints (applied client-side AND server-side):**
- **Max files:** 5
- **Max size:** 10 MB per file
- **Accepted MIME:** `application/pdf`, `image/png`, `image/jpeg`, `image/webp`, `application/postscript`, `application/illustrator`
- **Accepted extensions:** `.pdf`, `.png`, `.jpg`, `.jpeg`, `.webp`, `.ai`, `.eps`

All constants live in `quote-schema.ts` (`FILE_MAX_BYTES`, `FILE_MAX_COUNT`, `FILE_ACCEPTED_MIME`, `FILE_ACCEPTED_EXT`) so client and server share the same allowlist. The server runs `validateUploadedFiles(files)` independently — clients are never trusted.

**UX:**
- Drag-and-drop zone (native HTML5 `dragover` / `drop` events) with visual state flip on drag-enter (gold border + bone tint).
- Click fallback via transparent `<input type="file" multiple>` (sr-only).
- Rejections surface inline as `<li>` entries under the dropzone with the filename + reason (`type`, `size`, `count`).
- Accepted files list below: name + formatted size + remove button.

### Submission flow

On final submit:

```ts
const formData = new FormData();
for (const [k, v] of Object.entries(scalarValues)) formData.append(k, String(v));
formData.append("locale", locale);
for (const f of files) formData.append("file", f);
await fetch("/api/quote", { method: "POST", body: formData });
```

---

## API routes

Both routes live under `src/app/api/` and run on the Node runtime (`export const runtime = "nodejs"`) — the Edge runtime cannot stream the raw file bytes into a Buffer for Resend's `attachments` field.

### `POST /api/contact`
1. Parse body as JSON. Return `400 Invalid JSON` on parse failure.
2. `contactSchemaServer.safeParse(body)` — on failure return `400 Validation failed` with a flattened issues object.
3. Extract `locale` (default `"sv"`).
4. If `resendEnabled === false` → log + return `{ ok: true, mock: true }`. Lets dev runs without creds succeed the UI flow.
5. Fire two Resend sends in parallel (`Promise.all`):
   - Admin inquiry: `from` = `noreply@awab.se`, `to` = admin, `replyTo` = sender's email, subject includes sender name + company.
   - User confirmation: `to` = sender's email.
6. Return `{ ok: true }` on success or `502` on Resend failure.

### `POST /api/quote`
Similar shape, differences:
- Body is `multipart/form-data` read via `request.formData()`.
- Extract scalar string entries → server Zod.
- Extract `file` entries (`formData.getAll("file").filter(isFile)`) → server file gate → reject with `400` on any violation.
- Convert accepted files to `{ filename, content: Buffer }` for Resend's `attachments` array.
- Admin mail includes `attachments`; confirmation mail does not.
- Hard-cap payload: `content-length` check before calling `formData()` (early reject if proxy-level limit was bypassed somehow).

---

## Email templates

All four templates share a wrapper at `src/lib/email/templates/_layout.tsx` and use `@react-email/components` primitives (`Html`, `Head`, `Body`, `Container`, `Section`, `Text`, `Hr`, `Link`, `Preview`, `Tailwind`).

| Template | Recipient | Attachments | Reply-to |
|---|---|---|---|
| `ContactInquiryEmail` | admin | — | sender email |
| `ContactConfirmationEmail` | sender | — | — |
| `QuoteInquiryEmail` | admin | uploaded files | sender email |
| `QuoteConfirmationEmail` | sender | — | — |

### Brand treatment (in-email)
- Background: bone `#E8E2D5` outer, paper `#F5F1EA` container.
- Gold top rule (4 px) on the container as the brand marker.
- Wordmark + inline gold dot in the header.
- Display lines use `Georgia, "Times New Roman", serif` — the closest universally-available fallback for Fraunces (email clients strip custom fonts).
- Body uses the system UI stack as Inter fallback.
- Field rows are mono-caption uppercase label + ink body, matching the site's `FieldRow` pattern.

### Localization
Each template accepts a `locale: "sv" | "en"` prop. Copy dictionaries live inside each file as a `const copy = { sv: {...}, en: {...} }` — no external i18n runtime inside react-email rendering (simpler + decouples email render from Next's request context).

### Preview
React Email ships a preview harness. To preview locally:

```bash
npx react-email dev --dir src/lib/email/templates
```

(If you add that script to `package.json` later.)

---

## Environment

```env
# Required for real sends. When absent, API routes log + return
# { ok: true, mock: true } so the UI flow still resolves.
RESEND_API_KEY=
CONTACT_EMAIL_TO=info@awab.se
CONTACT_EMAIL_FROM=noreply@awab.se
```

For dev, the simplest setup is a Resend test key + their sandbox domain (`onboarding@resend.dev`) — real messages, no deliverability risk.

---

## Security

- **File type allowlist on the server.** The client's allowlist is UX; the server enforces. Rejections come back as structured errors with filename + reason.
- **No executable types.** `.exe`, `.zip`, `.docx` and office formats are not in the allowlist — packaging briefs arrive as PDF in this industry.
- **No magic-byte verification yet** (not required for email attachment flow — attachments are never executed on our infra). A future upgrade could pipe accepted files through a Content-Type sniff before sending.
- **Size cap per file + aggregate** (`content-length` pre-check) prevents accidental OOM on large uploads.
- **`replyTo` on admin inquiries** — editors reply to the customer from their own inbox; we never expose `noreply@awab.se` as the reply target.
- **No client-side storage.** Files are sent through the multipart POST, embedded in an email, and discarded from the server process. Nothing persists.

---

## Deferred (Phase 2)

- **Database write.** Both forms currently fire email only. Phase 2 adds a PostgreSQL insert + admin dashboard; see `docs/11-phase-2-roadmap.md`.
- **Rate limiting.** Resend has a per-domain rate; for now the form is unauthenticated and we rely on Resend's own limits. Phase 2 adds a short-window per-IP limiter.
- **Webhook notifications.** Optional Slack / HubSpot push on submit — easy to bolt onto each route's success path.
- **Spam filter.** No honeypot or hCaptcha yet; submissions are B2B and volumes low. Revisit if abuse appears.
