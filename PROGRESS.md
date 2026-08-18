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

### 🎨 18 Ağustos 2026 — UI/animasyon craft turu (v1–v6)

Altı ardışık tur halinde, kurulu skiller (`emil-design-eng`, `redesign-skill`, `frontend-design`, `web-design-guidelines`, `ui-ux-pro-max`) kullanılarak landing page'in görsel/animasyon kalitesi yükseltildi.

**v1 — Motion dili + emoji/palet temizliği:** Tekrarlanan `opacity/y/duration` kalıpları `lib/motion.ts`'te tek kaynağa indirildi (güçlü ease-out eğrisi, 60ms stagger). Emoji ikonlar → custom line-art SVG seti (`components/marketing/icons.tsx`). `.ticket-edge` perforasyon motifi Hero'daki fiş kartına + scroll parallax. Tüm basılabilir öğelere press/hover feedback. Turuncu palet kalıntıları temizlendi, footer'ın amaçsız reveal'i kaldırıldı (server component'e döndü).

**v2 — Motion çeşitliliği:** `SectionHeading` (eyebrow + başlık iki ayrı vuruş), line-art ikonlarda `pathLength` draw-in, HowItWorks bağlayıcı çizgisi adımlarla dolan bir animasyon kazandı, AppScreens kartlarına hover + çeşitlendirilmiş giriş açıları, navbar scroll'a tepki veriyor (koyulaşma + gölge).

**v3 — Doku/derinlik + layout kırılımı:** Fiş kağıdı grain dokusu (Hero/AppScreens/Footer, SVG feTurbulence). `.ticket-tear` — perforasyon motifi Hero dışına, section sınırına taşındı. Features'taki "3 eşit kart" grid'i kırıldı. `:focus-visible` eklendi.

**v4 — Küçük ama gerçek eksikler:** Smooth scroll (reduced-motion'a saygılı), jenerik `shadow-2xl` → markanın kendi tonunda `--shadow-brand`, markalı 404 sayfası (`app/not-found.tsx`), store badge linkleri `target="_blank"`, `text-wrap: balance`, kasıtlı `-webkit-tap-highlight-color: transparent`.

**v5 — "Çok bir şey değişmiş gibi durmuyor" geri bildirimi sonrası çarpıcı tur:** Kullanıcı canlı siteyi görüp dört turun da ince ayar seviyesinde kaldığını fark etti. Bilinçli olarak Hero'ya yoğunlaşan gerçek bir görsel risk alındı: başlık 52px → 74px, ticket kartı büyütülüp asimetrik olarak metin sütununa taştı; yeni tam-lime "WakeUp" bandı (`app/components/wake-up.tsx`) eklendi — paletin "tek cesur hamle" dediği rengin ilk kez tam arka plan olarak kullanılması; AppScreens artık düz sıra değil, orta kart yukarı kaymış kademeli bir kompozisyon.

**v6 — Kalite tabanı (emil-design-eng + web-design-guidelines + ui-ux-pro-max denetimi):** `ui-ux-pro-max` skill'i eksik kurulu bulundu (sadece `SKILL.md` var, `scripts/`+`references/` yok) — aranabilir veritabanına erişilemedi, skill'in kendi öncelik tablosu manuel denetim listesi olarak kullanıldı, uydurma sonuç üretilmedi. Gerçek WCAG kontrast ölçümüyle 6 hata bulundu ve düzeltildi (`--text-muted` 3.09:1 → 4.74:1, footer "POWERED BY" 2.40:1 → 4.76:1, ve diğerleri). Kalan karakter-ikonlar (`⏱ ▪ ✓`) SVG'ye çevrildi (`TimerIcon`, `DotIcon`, `CheckIcon`). Dokunmatik hedefler 44×44px'e çıkarıldı (mobil menü, footer linkleri, hamburger). Hamburger'a `aria-expanded`/`aria-controls` eklendi. `cooking-mode.tsx`'teki `transition-all` → `transition-transform` düzeltildi.

Her turda `typecheck && lint && build` temiz geçti. Tarayıcı doğrulaması, bu oturumda tekrarlayan bir ortam kısıtına (`document.visibilityState: hidden` olduğunda Framer animasyonları donuyor, ekran görüntüsü güncellenmiyor) rağmen DOM/computed-style üzerinden yapıldı.

### 🔴 Bilinen açık işler

- **Viral döngü üreticisiz:** mobil app'te tarif kaydet & paylaş yok → `/recipe/[id]`'yi besleyen hiçbir şey yok. Mobil'e `POST /api/recipes/save` eklenmeli.
- Store badge'leri henüz "Coming soon" — `NEXT_PUBLIC_IOS_APP_URL` / `NEXT_PUBLIC_ANDROID_APP_URL` mobil app store'a çıkınca Vercel'e eklenecek.
- Şu an web'in kullanmadığı 7 API route (`recipes/save`, `history`, `modify`, `meals-eaten`, `shopping-list`, `meal-image`, `health-export`) mobil app'in bu özellikleri kazanmasını bekliyor — bilinçli olarak silinmedi.
