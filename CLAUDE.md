# CLAUDE.md — Chef-AI Web

> Bu dosya, Claude Code'un her oturum başında otomatik olarak okuduğu proje "anayasası"dır.
> Kısa tut, spesifik tut, çalışan komutlar ver. Bilgi mantıksal olarak değişirse bu dosyayı güncelle.

---

## 1. Bu repo ne, ne değil

**Chef-AI**, buzdolabındaki malzemelerin fotoğrafını çekip elindekilere göre tarif üreten, gıda israfını azaltan AI destekli mutfak asistanı. **Ürün artık mobil bir uygulama** (Expo/React Native) — bu repo o değil.

Bu repo iki şeyi barındırıyor:
- **Landing page** (`app/page.tsx` + `app/components/`) — saf pazarlama yüzü, hesap oluşturma/giriş/dashboard **yok**
- **API** (`app/api/`) — Supabase + Claude + Gemini kullanan backend; hem bu sitenin public sayfalarına (`/recipe/[id]`) hem **mobil app'e** (ayrı repo: [chef-ai](https://github.com/mertgrz24/chef-ai)) hizmet eder

Mobil app ile aramızda **dosya-sistemi bağımlılığı yok** — sadece runtime'da mobil'in `EXPO_PUBLIC_API_URL`'i buradaki API'ye HTTP ile bağlanıyor. Bu repo'da yaptığın bir API değişikliği mobil'i etkileyebilir; kontrat değiştirirken (request/response şekli) mobil tarafını da güncellemek gerekebilir — ama kod olarak ayrı ilerliyorlar.

**Not:** Bu proje bir mühendislik yarışı değil, bir **deneyim** projesidir. Kod kalitesi önemli ama UX premium hissi her zaman öncelikli.

---

## 2. Tech Stack

- **Framework:** Next.js 16 (App Router, Server Components varsayılan)
- **Language:** TypeScript (strict mode, `any` yasak)
- **Styling:** Tailwind CSS — özel CSS dosyası açma, utility-first kal
- **Animations:** Framer Motion — geçişler ve micro-interaction'lar için
- **Backend & Auth:** Supabase (Postgres + Auth). API route'ları `createApiClient()` ile hem Bearer (mobil) hem cookie'yi (bu sitenin kendi public sayfaları) kabul eder — bkz. `lib/supabase/api.ts`
- **AI — Görüntü:** Gemini API — buzdolabı fotoğrafından malzeme tanıma (fotoğraflar hiç saklanmıyor: base64 → Gemini → atılıyor)
- **AI — Tarif/İçerik:** Gemini API (birincil), Claude wrapper (`lib/ai/claude.ts`) hazır ama şu an aktif route'larda kullanılmıyor
- **Deployment:** Vercel (`chef-ai-puce-zeta` projesi, bu repo'nun `main`'inden deploy)
- **Package Manager:** `npm`

---

## 3. Directory Structure

```
chef-ai-web/
├── app/
│   ├── page.tsx             # Landing page
│   ├── components/          # Landing bölümleri (hero, navbar, pricing, footer...)
│   ├── recipe/[id]/         # Public tarif paylaşım sayfası (auth yok)
│   ├── invite/[code]/       # Referral davet sayfası (auth yok)
│   ├── api/                 # API routes — mobil app + bu sitenin ortak backend'i
│   ├── layout.tsx, icon.tsx, apple-icon.tsx
│   └── globals.css
├── components/
│   ├── marketing/            # store-badges.tsx vb. — pazarlama-özel bileşenler
│   └── cooking-mode*.tsx      # /recipe/[id]'nin client-side pişirme modu
├── lib/
│   ├── supabase/              # api.ts (Bearer+cookie), server.ts, admin.ts (cron, service-role)
│   ├── ai/                    # claude.ts, gemini.ts
│   ├── pexels.ts, date.ts
├── types/                     # Domain tipleri (Recipe, Profile, MealPlan...)
├── public/                    # sw.js (tombstone — bkz. aşağıdaki not), ikonlar
└── supabase/migrations/       # SQL şema geçmişi
```

**Kural:** Yeni dosya eklerken önce mevcut yapıyı oku, pattern'i izle. Yeni bir top-level klasör açmadan önce dur ve sor.

**`public/sw.js` dokunma:** Bu bir "tombstone" service worker — site eskiden PWA'ydı, artık değil. Bu dosya kurulu eski istemcilerin cache'ini temizleyip kendini `unregister()` ediyor. Silme, ~6 ay sonra (kurulu istemciler temizlenince) kaldırılabilir.

---

## 4. Code Style

- **Imports:** ES modules, named exports tercih et. Default export sadece Next.js page/layout dosyalarında.
- **TypeScript:** Strict mode. `any` kullanma — bilmiyorsan `unknown` + narrowing yap.
- **Components:** Server Component varsayılan. `"use client"` sadece state/event/effect gerektiğinde.
- **Styling:** Tailwind utility-first.
- **Naming:** Component dosyaları `kebab-case.tsx`, component isimleri `PascalCase`.
- **Animations:** Framer Motion. Paylaşılan hareket dili `lib/motion.ts`'te (`EASE_OUT`/`EASE_IN_OUT` custom cubic-bezier, `revealContainer`/`revealItem`, `iconDraw`) — yeni component'lerde bunları tekrar tanımlamak yerine import et. Süreler genelde 150-500ms; pazarlama-özel bir vurgu anıysa (Hero ticket'ının print-in'i gibi) 650ms'e kadar çıkabilir.
- **Tema:** Tek tema (pantry-green/electric-lime/ink/chalk paleti) — dark/light toggle yok, next-themes kaldırıldı.

---

## 5. Commands

```bash
npm run dev        # http://localhost:3000
npm run build      # Deploy öncesi mutlaka çalıştır
npm run lint       # ESLint
npm run typecheck  # tsc --noEmit
```

**Verification rule:** Bir feature'ı "tamam" demeden önce sırayla `npm run lint && npm run typecheck && npm run build` geçtiğinden emin ol. Hatalı build commit etme.

---

## 6. Environment Variables

`.env.local` gerekli, **ASLA commit etme**. Güncel liste `.env.example`'da:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=       # sadece server-side (cron, account deletion)
ANTHROPIC_API_KEY=
GEMINI_API_KEY=
PEXELS_API_KEY=                  # meal-plan görselleri
CRON_SECRET=                     # /api/push/send-expiry-alerts'ı korur
NEXT_PUBLIC_IOS_APP_URL=         # store badge'leri — boşken "Coming soon"
NEXT_PUBLIC_ANDROID_APP_URL=
```

---

## 7. Important Rules & Gotchas

- **Asla** `.env.local`, `node_modules/`, `.next/` commit etme.
- **Asla** Supabase service role key'ini client tarafında kullanma — sadece API route/cron içinde (`lib/supabase/admin.ts`).
- **AI API çağrıları her zaman server-side** (`app/api/...`). API key'ler client'a sızmamalı.
- **Rate limiting:** Freemium tarif limiti `consume_recipe_credit` RPC'siyle **veritabanı seviyesinde** zorlanıyor — bu repo'da gizlenecek bir UI yok, ihlal her zaman API'de engellenmeli.
- **Hata yönetimi:** AI API'leri başarısız olabilir. Her çağrıyı try/catch ile sar, anlamlı bir mesaj döndür.
- **Supabase RLS** her tabloda zorunlu. Kullanıcı sadece kendi verisini görebilmeli.
- **Görseller:** Buzdolabı fotoğrafları hiç diske/Storage'a yazılmıyor — base64 olarak Gemini'ye gidip atılıyor. Yeni bir görsel-kaydetme akışı eklersen bu davranışı bilerek boz.
- **Bu repo'ya yeni bir dashboard/auth UI ekleme.** Ürün mobil'de — web'e "app" işlevi geri getirme kararı sadece kullanıcı ile konuşulup CLAUDE.md'ye yazılarak alınır.

---

## 8. How to Verify Your Work

1. `npm run typecheck` — sıfır hata
2. `npm run lint` — sıfır error
3. `npm run dev` — sayfa render oluyor mu, console error yok mu
4. UI değişikliğiyse: ne eklendiğini, hangi route'tan görülebileceğini açıkça söyle

**Tahmin etme** — emin değilsen `Read` ile dosyayı oku, `Bash` ile komutu çalıştır, kanıt topla.

---

## 9. Working Style with Me

- **Türkçe konuş.** Kod yorumları İngilizce, benimle konuşma Türkçe.
- **Plan modunda başla.** Karmaşık görevlerde önce planı çıkar, "tamam" dedikten sonra koda geç.
- **Soru sor.** Belirsiz bir gereksinim varsa AskUserQuestion ile sor, varsayım yapma.
- **Karar verirken sebebini söyle.**

---

## 10. Product Vision

**Pozisyon:** Yemek karar motoru — tarif uygulaması değil.
**Slogan:** "Elindekilerle ne yapacağını söyleyen sistem."
**Hedef Kitle:** Türkiye'deki öğrenciler ve genç profesyoneller.
**Bu repo'nun rolü:** Mağaza öncesi/sırası pazarlama yüzü + ortak API. Aktif özellik geliştirme artık `chef-ai` (mobil) repo'sunda.

**Geçmiş:** V1-V5 arası tüm ürün gelişiminin (tam kronolojik günlük) [chef-ai/PROGRESS.md](https://github.com/mertgrz24/chef-ai/blob/main/PROGRESS.md) içinde. Bu repo'nun kendi günlüğü `PROGRESS.md` — 30 Temmuz 2026'daki repo ayrımından itibaren başlıyor.

---

_Bu dosya proje büyüdükçe güncellenecektir. Yeni kural eklerken önce eski kuralla çelişip çelişmediğini kontrol et._
