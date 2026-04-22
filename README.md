# AW AB Website — Başlangıç Rehberi

## 📦 Dosyalar

Bu paket 3 dosyadan oluşuyor:

1. **`PROJECT_STRUCTURE.md`** — Tüm proje klasör/dosya yapısı (referans için)
2. **`CLAUDE.md`** — Claude Code'un her session'da okuyacağı persistent context
3. **`CLAUDE_CODE_PROMPTS.md`** — 12 adımlık build sequence (initial + 12 step prompts)

## 🚀 Nasıl Başlanır?

### 1. VS Code'da boş bir klasör aç
```bash
mkdir aw-ab-website
cd aw-ab-website
code .
```

### 2. CLAUDE.md'yi kök dizine kopyala
`CLAUDE.md` dosyasını proje kök dizinine koy. Claude Code otomatik okuyacak.

### 3. Claude Code'u başlat
```bash
claude
```

### 4. İlk prompt'u gir
`CLAUDE_CODE_PROMPTS.md` dosyasındaki **INITIAL SETUP PROMPT** bölümünü kopyala, yapıştır.

### 5. Adım adım ilerle
Initial setup bittikten sonra **ADIM 1**'i kopyala. Tamamlandıktan sonra **ADIM 2**'ye geç. Ve böyle 12. adıma kadar.

## ⏱ Tahmini Süre

| Adım | Süre (Claude Code ile) |
|------|------------------------|
| Initial + ADIM 1 | 20-30 dk |
| ADIM 2-3 | 30-40 dk |
| ADIM 4 (Homepage) | 45-60 dk |
| ADIM 5-6 (About + Services) | 60-90 dk |
| ADIM 7 (Portfolio/Sanity) | 90-120 dk |
| ADIM 8 (Process) | 30-45 dk |
| ADIM 9 (Forms) | 90-120 dk — en kritik |
| ADIM 10 (i18n) | 60-90 dk |
| ADIM 11 (SEO/Polish) | 60-90 dk |
| ADIM 12 (Deploy) | 30-60 dk |

**Toplam: 8-12 saat** (aralıklı yapılabilir)

## 🔑 Hazırlaman Gerekenler

### Başlamadan önce:
- [ ] GitHub hesabı + yeni repo (aw-ab-website)
- [ ] Vercel hesabı (deployment için)
- [ ] Sanity.io hesabı (ücretsiz tier yeterli)
- [ ] Resend.com hesabı (ücretsiz tier: 3000 email/ay)
- [ ] Domain (awab.se gibi — opsiyonel, sonra da eklenebilir)

### İçerik için (Phase 1 sonunda lazım olacak):
- [ ] AW AB logo (şimdilik wordmark yeterli, sonradan gerçek logo)
- [ ] 3-4 örnek portfolyo projesi (görsel + metin)
- [ ] Featured client placeholder logoları (gerçek müşteri olmayabilir başta — "ipotetik" örnekler)
- [ ] Şirket adresi, VAT number, iletişim bilgileri
- [ ] Profesyonel hero görseli (kutu/çanta close-up, studio shot)

## ⚠️ Dikkat Edilmesi Gerekenler

1. **Gerçek marka logolarını kullanma** — Absolut, Bacardi vs. logoları portfolyo'da göstermek için yazılı izin lazım. Başlangıçta "case study" anlatırken "uluslararası premium içecek markası" gibi anonim referans kullan.

2. **İsveç GDPR** — Form submission'ları kayıt ediyorsan (Phase 2) privacy policy + cookie consent şart.

3. **FSC Sertifikası** — Sürdürülebilirlik İsveç'te çok önemli. Eğer gerçekten FSC sertifikalı materyal kullanacaksan sertifikayı göster; kullanmıyorsan bu claim'i yazma.

4. **VAT / Org.nr** — İsveç'te business website'inde org.nr göstermek kurumsal güven sağlar (footer'da).

## 🎯 Phase 2 (Sonra)

İlk 12 adım bittikten sonra, site canlıdayken:
- Admin panel (form submissions dashboard)
- PostgreSQL + Prisma kayıt sistemi
- LOGO ERP entegrasyonu (opsiyonel)
- CRM (HubSpot veya Pipedrive)
- Customer portal (sipariş takip)

Bunları `docs/11-phase-2-roadmap.md`'de detayladık — Phase 1 bittikten sonra planlarız.

## 💬 Takılırsan

Bana şunu söyle, devam ederim:
- "ADIM X'te şu hata aldım: [error]"
- "Şu component'in tasarımını değiştirmek istiyorum"
- "Y sayfasına Z özelliği eklemek istiyorum"
- "Svenska çeviri şurası kulağa AI çevirisi gibi geliyor"

Hazır — şimdi VS Code'da klasörü aç, CLAUDE.md'yi kök dizine koy, ve ilk prompt'la başla. 🚀
