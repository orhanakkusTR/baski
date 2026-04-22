# CLAUDE.md

Bu dosya, Claude Code'un bu projede tutarlı şekilde çalışması için persistent context sağlar. Her session başında otomatik okunur.

---

## 🎯 Proje: AW AB — Premium Packaging Agency Website

### Vizyon
AW AB, İsveç pazarında **orta ve büyük ölçekli kurumsal markalara** premium baskı ve ambalaj hizmeti veren bir ajanstır. Web sitesi, ajansın profesyonelliğini yansıtan, lead toplayan, multinational müşterilere hitap eden bir dijital vitrindir.

### Hedef Müşteri
- Premium içecek markaları (Absolut tarzı vodka, viski, şarap firmaları)
- Lüks tüketim markaları
- Orta-büyük ölçekli kurumsal firmalar (iç baskı işleri için)
- İsveç + uluslararası operasyonu olan firmalar

### Ana Ürün/Hizmetler
1. **Karton Kutu** (birincil odak — premium ambalaj)
2. **Karton Çanta** (birincil odak)
3. **Kurumsal İç Baskı** (ikincil)
4. **A++ Özel Üretim** (talep bazlı, özel projeler)

### ÇOK ÖNEMLİ — Tasarım Kriteri
> Site **AI/vibe-code tarzı görünmemeli**. Generic Tailwind componentleri, standart landing page şablonları, abartılı gradyanlar, glassmorphism'den **kaçın**. Hedef: Pentagram, &Walsh, Koto gibi ajansların sitelerinin hissi. Editorial, premium, minimal, tipografi-odaklı.

---

## 🛠 Tech Stack

| Katman | Teknoloji |
|--------|-----------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS 4 |
| UI Primitives | shadcn/ui (sadece ihtiyaç olanlar) |
| Animation | Framer Motion |
| CMS | Sanity v3 |
| Forms | React Hook Form + Zod |
| Email | Resend + React Email |
| i18n | next-intl (sv, en) |
| Deployment | Vercel |
| Analytics | Vercel Analytics + Plausible (İsveç GDPR uyumlu) |

---

## 📐 Design System

### Renk Paleti (Tailwind config'e eklenecek)
```
--color-ink: #0A0A0A         /* Primary dark — neredeyse siyah ama soft */
--color-paper: #F5F1EA        /* Cream — kağıt hissi */
--color-gold: #C9A961         /* Muted gold — accent */
--color-stone: #8B8680        /* Muted gray */
--color-bone: #E8E2D5         /* Light paper */
--color-white: #FAFAFA
```

### Tipografi
- **Display/Heading:** Fraunces (variable, opsz axis) — editorial, serif
- **Body:** Inter (variable) — readable, neutral
- **Mono/Accent:** JetBrains Mono — teknik detaylar, rakamlar

### Spacing Philosophy
- Generous whitespace (her şey nefes almalı)
- 8px base grid (Tailwind default)
- Section padding: `py-24 md:py-32 lg:py-40`
- Container max-width: `max-w-[1440px]` içinde `px-6 md:px-12 lg:px-20`

### Animation Philosophy
- **Abartısız.** Micro-interactions only.
- Scroll reveals: subtle fade + 20px translate Y
- Hover states: 200ms ease-out
- Page transitions: minimal (opacity only)
- Text reveals: line-by-line with stagger (hero headlines)
- **YAPMA:** Parallax, particle effects, 3D tilts, auto-playing videos, glassmorphism

---

## 🌍 i18n

- **Primary:** Svenska (sv) — İsveç pazarı
- **Secondary:** English (en) — multinational markalar
- URL yapısı: `/sv/tjanster`, `/en/services`
- Default locale: `sv`
- next-intl kullanılacak — tüm metinler `messages/*.json` dosyalarında

**Svenska ana terimler:**
- Hizmetler → Tjänster
- Hakkımızda → Om oss
- Portfolyo → Portfolio (veya Arbeten)
- Teklif Al → Begär offert
- İletişim → Kontakt
- Karton Kutu → Presentkartonger / Förpackningar
- Karton Çanta → Papperskassar / Presentpåsar
- Süreç → Process

---

## 📄 Sayfa Yapısı (10 ana sayfa)

1. `/` — Homepage
2. `/about` — Om oss
3. `/services` — Tjänster (overview)
4. `/services/boxes` — Karton kutu detay
5. `/services/bags` — Karton çanta detay
6. `/services/corporate-print` — Kurumsal iç baskı
7. `/services/custom` — A++ özel üretim (talep formu vurgulu)
8. `/portfolio` + `/portfolio/[slug]` — Case study'ler
9. `/process` — Çalışma süreci (brief → prodüksiyon → teslim)
10. `/quote` — Detaylı teklif formu (ürün tipi, adet, ölçü, malzeme, deadline, dosya)
11. `/contact` — İletişim
12. `/journal` + `/journal/[slug]` — Blog (SEO — Phase 1.5)

---

## 📨 Form Stratejisi (Phase 1)

### Contact Form
Fields: Ad, Firma, Email, Telefon, Mesaj
→ Resend ile iki email gönderir:
1. AW AB'ye bildirim
2. Müşteriye onay (React Email template)

### Quote Form (Detaylı)
Fields:
- Firma bilgileri (ad, firma, email, telefon, website)
- Ürün tipi (select: Kutu / Çanta / Kurumsal / Özel)
- Adet (number)
- Yaklaşık ölçüler (textarea veya structured)
- Malzeme tercihi (select veya "Bilmiyorum")
- Deadline (date)
- Bütçe aralığı (select, opsiyonel)
- Dosya yükleme (brief, logo, tasarım — max 10MB, PDF/AI/PNG/JPG)
- Ek notlar (textarea)

→ Resend ile email + dosya eki
→ **Phase 2:** PostgreSQL'e kayıt + admin panel

---

## 🔌 Sanity Schema (CMS İçerik Modeli)

### Singletons
- `homePage` — Hero text, featured projects, stats
- `siteSettings` — Logo, iletişim bilgileri, sosyal medya

### Documents
- `project` (Portfolio) — title, client, category, year, heroImage, gallery, description, challenge, solution, results
- `service` — Service detail içerikleri
- `client` — Featured client logoları (Absolut, vs.)
- `testimonial` — Müşteri yorumları
- `post` — Blog yazıları (Phase 1.5)

### Objects
- `localizedString` — { sv: string, en: string }
- `localizedText` — Portable Text (sv + en)
- `seo` — meta title, description, OG image

**Kural:** Tüm kullanıcı-görünür text fields `localizedString` veya `localizedText` kullanmalı.

---

## 🎨 Component Kuralları

1. **Server Components default.** Client component sadece interaktivite gerektiğinde (`"use client"`).
2. Her section component'i kendi dosyasında: `src/components/sections/*`
3. shadcn/ui primitives'i `src/components/ui/` içinde, gerekmedikçe eklenmez.
4. **Props:** TypeScript interface ile tanımla, `type` yerine `interface` tercih et.
5. Tailwind class'ları `cn()` utility ile birleştir (conflict handling için).
6. **Asla** inline style kullanma — her şey Tailwind token'ları üzerinden.

---

## 📏 Code Standards

- **TypeScript strict:** `any` yasak, `unknown` + narrow.
- **Imports:** Absolute paths (`@/components/...`)
- **File naming:** `kebab-case.tsx` (components), `camelCase.ts` (utilities)
- **Component naming:** PascalCase
- **Variables:** camelCase, descriptive (no `data`, `item`, `thing`)
- **Comments:** İngilizce, sadece **neden** (what/how açık olmalı zaten)

---

## 🚀 Build Steps (Sıralı)

Bu site **12 adımda** inşa edilecek. Her adım bir sonraki adıma foundation oluşturur:

1. **Setup & Foundation** — Next.js init, Tailwind, fonts, i18n setup, globals.css
2. **Design System & Primitives** — Color tokens, typography scale, base UI components
3. **Layout Components** — Header, Footer, Navigation, Mobile Menu, Language Switcher
4. **Homepage** — Hero, services overview, featured work, stats, CTA
5. **About Page** — Agency story, values, team (opsiyonel)
6. **Services Pages** — Main services + 4 detail pages (boxes, bags, corporate, custom)
7. **Portfolio System** — Sanity schema + listing + detail pages
8. **Process Page** — Timeline/steps visualization
9. **Forms & Email** — Contact form, Quote form, Resend integration, email templates
10. **i18n Content** — Tüm Svenska + English içerik translation
11. **SEO & Polish** — Metadata, sitemap, robots.txt, OG images, schema.org
12. **Deploy** — Vercel setup, Sanity deployment, domain, analytics

---

## ⚠️ Uyarılar & Kurallar

### YAPMA
- ❌ Lorem ipsum — gerçek veya placeholder-real içerik kullan
- ❌ Generic stock photos — her görsel için placeholder açıklaması yaz, sonra gerçek görsel eklenecek
- ❌ Emoji'li UI (tek istisna: journal post içerikleri)
- ❌ Bootstrap/Material tarzı componentler
- ❌ Auto-rotating carousel'lar
- ❌ Popup newsletter modal'ları
- ❌ "Lütfen iletişime geçin" tarzı generic CTA — spesifik, değer önerisi içeren CTA'lar

### YAP
- ✅ Editorial layout — grid-based, asymmetric OK
- ✅ Generous whitespace
- ✅ Real typography hierarchy (h1 h2 h3 belirgin fark olmalı)
- ✅ Accessible (WCAG AA minimum, form label'lar, focus states, alt text)
- ✅ Mobile-first responsive
- ✅ Performance — Lighthouse 95+ hedef (her sayfa)
- ✅ Her form submission'da success state + fallback error state

---

## 🔐 Environment Variables

```env
# Sanity
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=
SANITY_REVALIDATE_SECRET=

# Resend
RESEND_API_KEY=
CONTACT_EMAIL_TO=info@awab.se
CONTACT_EMAIL_FROM=noreply@awab.se

# Site
NEXT_PUBLIC_SITE_URL=https://awab.se
```

---

## 🎯 Phase 2 (Sonra)

- Admin panel (Next.js dashboard route group + NextAuth)
- PostgreSQL + Prisma (form submission storage)
- CRM webhook (HubSpot veya Pipedrive)
- LOGO ERP integration (opsiyonel — env flag ile)
- Customer portal (sipariş takibi)

Phase 2 kapsamı `docs/11-phase-2-roadmap.md`'de detaylı.

---

## 💬 Claude Code'a Özel Talimatlar

1. Her adımdan önce ilgili `docs/*.md` dosyasını oku.
2. Bir adım tamamlandığında, o adıma özgü test checklist'i çalıştır (her docs dosyasının sonunda var).
3. Yeni component oluştururken önce `src/components/` altına bak — benzer var mı?
4. Svenska çeviri gerektiğinde, cümleyi profesyonel B2B tonunda yaz — Google Translate tarzı literal çeviri YAPMA.
5. Görsel placeholder'ları: `<Image src="/images/placeholder-[context].jpg" alt="..." />` formatında bırak, gerçek görselleri sonra ekleyeceğim.
6. Tamamlanmış işler için `docs/PROGRESS.md` dosyasını güncelle.
