# Chef-AI Web — Progress Tracker

> Her seans sonu güncellenir. Bu dosya **30 Temmuz 2026'daki repo ayrımından itibaren** başlıyor.
> V1'den V5.11'e kadarki tüm ürün geçmişi (hem web hem mobil, kronolojik) [chef-ai/PROGRESS.md](https://github.com/mertgrz24/chef-ai/blob/main/PROGRESS.md)'de duruyor.

## 📍 Şu an neredeyiz?

**Bu repo:** Chef-AI'ın Next.js sitesi (landing + API) — `chef-ai` monorepo'sundan ayrıldı, tek başına yaşıyor.
**Canlı URL:** https://chef-ai-puce-zeta.vercel.app — bu repo'nun `main`'inden deploy oluyor.
**Diğer repo:** [chef-ai](https://github.com/mertgrz24/chef-ai) — mobil app (Expo/React Native), ürünün asıl kullanım yüzü. Store'da henüz yayında değil (EAS build bekliyor).

### 📦 30 Temmuz 2026 — Repo ayrımı (chef-ai monorepo → chef-ai-web)

- `chef-ai` monorepo'sundaki web kodu (`app/`, `components/`, `lib/`, `types/`, `public/`, `supabase/` + config'ler) bu repo'ya taşındı, tek "initial import" commit'iyle başladı (geçmiş taşınmadı — `chef-ai`'da hâlâ duruyor).
- Taşınan kod zaten "pazarlama yüzü" haline getirilmişti: PWA kurulumu (manifest, standalone display, service worker) sökülmüş, `app/(auth)/` + `app/(dashboard)/` kaldırılmış, landing CTA'ları store badge'lerine (`components/marketing/store-badges.tsx`, env-gated) bağlanmıştı.
- Referral: `/signup?ref=KOD` yerine `/invite/[code]` (statik, auth yok) — kod artık mobil app'te elle giriliyor (`POST /api/referral`).
- Vercel projesi (`chef-ai-puce-zeta`) **aynı kaldı** — sadece Git bağlantısı bu repo'ya çevrildi (dashboard üzerinden, Settings → Git → reconnect). Env variable'lar korundu.
- Doğrulama: typecheck 0 · lint 0 error · build 26/26 · canlı URL dışarıdan `curl` ile teyit edildi (`/dashboard` `/login` `/signup` `/manifest.webmanifest` → 404, `/invite/CHEF-XXXX` → 200).
- **Teknik not:** Bu ayrım *zorunlu* değildi — mobil app zaten kendi `node_modules`/bundler'ıyla izoleydi, web kodunun aynı repo'da durması ne app'in build boyutunu ne de store submission'ını etkiliyordu. Organizasyonel bir tercih olarak yapıldı.

### 🔴 Bilinen açık işler

- **Viral döngü üreticisiz:** mobil app'te tarif kaydet & paylaş yok → `/recipe/[id]`'yi besleyen hiçbir şey yok. Mobil'e `POST /api/recipes/save` eklenmeli.
- Store badge'leri henüz "Coming soon" — `NEXT_PUBLIC_IOS_APP_URL` / `NEXT_PUBLIC_ANDROID_APP_URL` mobil app store'a çıkınca Vercel'e eklenecek.
- Şu an web'in kullanmadığı 7 API route (`recipes/save`, `history`, `modify`, `meals-eaten`, `shopping-list`, `meal-image`, `health-export`) mobil app'in bu özellikleri kazanmasını bekliyor — bilinçli olarak silinmedi.
