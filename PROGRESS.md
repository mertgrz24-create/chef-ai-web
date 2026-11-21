# Chef-AI Web — Progress Tracker

> **10 Kasım 2026 — güncel durum:** Bu repo yalnız TR/EN tanıtım ve statik davet sayfalarıdır. Mobil ve backend `chef-ai/mobile/` ile `chef-ai/backend/` altındadır. Aşağıdaki eski “landing + API”, bağımsız backend ve yayın durumu ifadeleri tarihsel kayıttır; güncel mimari için `AGENTS.md` ve `README.md` geçerlidir. Bu güncellemede hosted web/staging ve mobil paket değiştirilmedi.

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


## 15 Ekim 2026 — Mobil API yayın güvenliği

Kullanıcı mobilin API dosyalarını bu repoda düzeltmeyi açıkça onayladı; tanıtım sayfaları değiştirilmedi. Özel/idempotent tarif kaydı, config, sürümlü izinler, rate-limitli raporlar, service-only atomik kota/AI iş kaydı, profil yetki koruması, RevenueCat doğrulama/HMAC webhook, push opt-in/timezone/dedup/receipt, silme outbox ve anonim analytics aggregate eklendi. Beş migration hazırlanıp izole PostgreSQL 17 üzerinde denendi; gerçek Supabase’e uygulanmadı. 26 Node güvenlik testi, lint (iki mevcut hook uyarısı), TypeScript ve Next build geçti. Next 16.4.1 güncellemesi kritik bulguyu giderdi; ham npm audit 17→7 high (tamamı yerel yamalı braces zinciri), uyarılar gizlenmedi. HawkScan CLI/key bulunmadığından DAST yok. Production deploy/push/ödeme yapılmadı. Staging bağlantısı, servis hesapları/ürünleri, hukuki sayfalar, gerçek cihaz/sandbox/beta hâlâ yayın engeli. Ayrıntılar: lib/mobile/release-notes.md.


## 16 Ekim 2026 — yalnız tanıtım sitesine ayrılma

Mobil API'leri, sunucu kütüphaneleri, tipler, Supabase migration/e-posta şablonları ve özel staging `.env.local` bağımsız `chef-ai-backend` reposuna taşındı. Public recipe/cooking ürün işlevleri de oraya alındı; landing ve statik invite burada kaldı. Kaydedilmemiş güvenlik/AI düzeltmeleri hash doğrulamasıyla korundu. Web artık Supabase/Gemini sunucu bağımlılığı veya API cron'u içermez; bağımlılık güvenlik yaması scripts/security altında korunur. Önceki notlar tarihsel konumu anlatır.

Mevcut hosted staging/web yayınları değiştirilmedi. Yeni build/deploy yok; mobile API URL ve mevcut APK aynı. Web'in API'siz kaynağı yayına gönderilmeden önce eski production istemcileri için backend geçişi planlanmalıdır. Ayrıntı: backend docs/REPOSITORY_SPLIT.md.

## 10 Kasım 2026 — İki dilde tanıtım ve ürün doğruluğu

### Ürün kanıtı ve sınırlar

Web ve ana ürün reposunun güncel talimatları, README/PROGRESS kayıtları; mobil Scan, Profile, Premium, haftalık plan, tarif kartı, alışveriş listesi ve pişirme/zamanlayıcı kodları incelendi. Backend üyelik/limit kodu, staging kayıtları ve 20 Ekim test paketi / 22 Ekim simülatör önizleme raporu karşılaştırıldı. Kaynakta uygulanmış davranış, tarihsel staging kabulü ve mevcut paketin kapsamı birbirine eşit sayılmadı. Yeni staging/cihaz oturumu veya AI isteği yapılmadı.

- Alışveriş listesi, pişirme modu ve yerel bildirimli zamanlayıcı kaynakta var; yeni API/migration ve mobil değişiklikleri mevcut paket/hosted staging kabulü değildir. Tanıtımda açıkça “Geliştiriliyor / In development” altında, kullanıma açık olmayan özellikler olarak anlatılıyor. Bildirimlerin izin/cihaz ayarlarına bağlı olduğu belirtildi; zamanında ses garantisi yok.
- Web'in $9.99, sınırsız fotoğraf analizi, “en popüler” ve doğrulanmamış Premium hakları kaldırıldı. Mevcut aylık 10 ücretsiz tarif kararı korundu; Premium fiyat ve haklarının satın alma açıldığında uygulamada gösterileceği yazıldı. Staging'de ödeme kapalı olduğu kaydından yeni bir ticari fiyat çıkarılmadı.
- Fotoğraf analizi, kullanıcının sonuçları kontrol ettiği bir yardımcı yol olarak sunuldu. Her malzemeyi tanıma, kesin besin/alerjen güvenliği, garanti edilmiş tasarruf veya kullanıcı/ödül/yorum iddiası kullanılmadı.
- Üç eski tanıtım screenshot'ı ve üç mevcut simülatör ekranı görsel olarak karşılaştırıldı. Eski tasarım farklı; yeni görüntülerde dil karışıklığı ve boş hesap var. Dosyalar korunarak vitrinden çıkarıldı. Yerine uygulama ekranı olmadığı açıkça yazılan, HTML/CSS malzeme–tarif fişi anlatımı kullanıldı; sahte screenshot üretilmedi.
- Güncel Profile ekranında davet kodu girişi bulunmadığından eski “Profile → Invite friends” talimatı kaldırıldı. Kodun saklanabileceği, kullanımın henüz açık olmadığı yazıldı. Kod biçimi ve statik, hesapsız akış korundu.

### Yerel uygulama

`/` Türkçe, `/en` İngilizce; `/invite/[code]` ve `/en/invite/[code]` aynı kodu iki dilde sunuyor. Ayrı kök yerleşimler aynı içerik/bileşenleri kullanıyor; sözlük yapıları TypeScript ile karşılaştırılıyor. Dil bağlantıları bölüm hedefini/kodu koruyor; yenileme ve geri/ileri çalışıyor. HTML dili, metadata, canonical/hreflang ve dil içi 404 başlıkları düzenlendi. Otomatik dil yönlendirmesi, çerez veya takip eklenmedi.

Mobildeki krem (#F5F0E5), açık kâğıt (#FFF9EF), koyu yeşil ve lime paleti; mevcut Bricolage Grotesque / Instrument Sans / Space Mono korunup latin-ext ile kullanıldı. Primitive/semantic/bileşen token'ları globals.css içinde; bilgi kartlarında tıklama izlenimi veren hover kaldırıldı. Ekran dışındaki başlıkları gizleyen reveal yerine görünür server içeriği, tek bir CSS fiş giriş hareketi kullanılıyor. Reduced-motion'da hareket ve smooth scroll yok. İkonlar dekoratif SVG olarak işaretlendi; ikon uçlarındaki kullanımdan kaldırılmış Edge runtime bildirimi kurulu Next rehberine göre kaldırıldı.

Her sayfada main/atlama bağlantısı, uygun başlık yapısı, açıkta koyu yeşil/koyuda lime odak, en az 44px site kontrolleri ve sabit başlık için anchor boşluğu var. Mobil menü Escape ile odağı tetikleyiciye döndürür; bölüm seçince ve masaüstüne geçince kapanır. JavaScript kapalı mobilde işlevsiz düğme yerine noscript gezinme görünür. Footer yalnız çalışan bölüm bağlantılarını içerir. Mağaza env desteği korunur; boş/hatalı veya mağaza ürün sayfası dışındaki URL bağlantıya dönüşmez. URL biçim kontrolü mağaza kaydının varlık doğrulaması değildir; şu an yapılandırma ve “Yakında” durumu değiştirilmedi.

### Kullanılan kişisel skill ve destekler

- `frontend/redesign-skill` ve `frontend/frontend-design`: mevcut yüzey denetimi, mutfağa özgü fiş anlatımı, tek görsel vurgu ve baştan framework değiştirmeden düzenleme.
- `frontend/emil-design-eng`: amaçlı/kısa hareket, hover/press/focus durumları, dokunma ve reduced-motion; önce/sonra inceleme tablosu.
- `frontend/design-system`: `states-and-variants.md`, `component-specs.md`, `token-architecture.md`, `primitive-tokens.md`, `semantic-tokens.md`, `component-tokens.md`, `tailwind-integration.md`. Durum/kontrast ve üç katmanlı token düzeni uygulandı. Sunum üretimi, eksik brand/ui-styling paketleri veya kullanılmayan üretici araçları çalıştırılmış gibi sunulmadı.
- `frontend/web-design-guidelines`: sabitlenmiş `references/guidelines.md`; semantik yapı, odak, anchor, dil, resim ve bağlantı kuralları.
- `code-quality/karpathy-coder`: `karpathy-principles.md`, `anti-patterns.md`; kapsamı tanıtımda tutma, kullanıcı diff'ini ayırma ve somut kabul hedefleri. `diff_surgeon.py` yalnız görev diff'inde çalıştırıldı; 26% NOISY sonucu büyük yeniden düzenlemedeki yorum/boşluk/noktalı virgül kaldırmalarını da sayıyor, otomatik temiz onay diye raporlanmadı. İkonlarda formatter kaynaklı gereksiz fark ayrıca geri alındı; yalnız runtime satırı değişti.
- `code-quality/tdd`: Escape, menü bağlantısı, dillerin JS'siz görünümü, genel 404 metadata'sı ve mobil JS'siz düğme için önce başarısız testler görülüp küçük düzeltmeler yapıldı; sonraki regresyonlar eklendi.
- `code-quality/code-reviewer`: `rules/universal.md`, `languages/typescript.md`; TS/React, kullanıcı kontrollü kod/URL, event cleanup ve istemci/sunucu sınırları incelendi. Heuristik kalite aracı 8 bölüm dosyasında çalıştı; JSX satır sayısı, copyright yılı ve regex kaynaklı fonksiyon sınırı işaretleri gerçek hata/bağımsız denetim sayılmadı.
- `code-quality/webapp-testing`: `with_server.py --help`, `examples/console_logging.py`, `examples/element_discovery.py` ve native Python Playwright yaklaşımı. Mevcut Chrome headless kullanıldı; indirilmeyen varsayılan Playwright Chromium'u varmış gibi gösterilmedi. Yeni npm test bağımlılığı yok.

Kurulu Next 16.4.1'in `dist/docs` altındaki internationalization, layout/page, route groups, navigation, font, metadata/OG, not-found ve runtime/ImageResponse rehberleri okundu. Sunum/CI veya kod değiştirmeyen diğer skill bölümleri bu işe uygulanmadı; subagent/insan incelemesi yapılmadı.

### Araştırmanın etkisi

- [SuperCook resmi ürün açıklaması](https://apps.apple.com/us/app/supercook-recipe-by-ingredient/id1477747816): malzemeden başlamanın ana mesaj olması. SuperCook sitesi metin erişiminde JS fallback döndürdü; görülmeyen landing tasarımı incelenmiş gibi sunulmadı.
- [Samsung Food](https://samsungfood.com/): tarif ve haftalık planı tek günlük mutfak akışında anlatma; Chef-AI'ın henüz hazır olmayan alışveriş adımını ayrıca etiketleme.
- [Sidekick](https://www.sortedfood.com/sidekick): özellik jargonundan önce günlük kullanım adımlarını açıklama ve bağlam içinde CTA.
- [Kısık Ateş Akademi](https://www.kisikatesakademi.com.tr/): Türkiye için tanıdık, doğrudan yemek fikri dili. Bu örnek kiler ürünüyle birebir aynı kapsamda sayılmadı.

Diğer markaların metni/tasarımı, kullanıcı sayısı, yorumları veya fiyatları kopyalanmadı. Mealime ana sayfasındaki 21 Ekim 2026 kapanış bildirimi görüldüğünden güncel aktif ürün örneği olarak kullanılmadı.

### Doğrulama ve kalanlar

- Başlangıç ve son `npm run lint`, `npm run typecheck` geçti. Lock ile kurulum beş mevcut güvenlik yamasını uyguladı; son `--check` bütünlüğü doğruladı. Paket, lock, güvenlik yaması dosyaları ve ortam/hosting ayarları görev başındaki hashleriyle aynı.
- `python3 scripts/test-marketing.py -v`: **11 test geçti**. Menü/Escape/odak, dil/deep-link/geçmiş, davet sınırları, 404, JS'siz mobil görünüm, URL doğrulama, reduced-motion, kontrast, bağlantı/hedef boyutları, konsol ve korunan statik dosyalar kapsanıyor. Mağaza örnekleri sentetiktir; bunlara ağ isteği yapılmadı.
- Ana sayfalar ve uzun kodlu davetler 320/390/768/1024/1440/1920 CSS px'de taşmadı. Yakınlaştırma/reflow, 1440px görünümün 720 CSS px karşılığı ve ayrıca %200 kök yazı büyütmeyle kontrol edildi; gerçek tarayıcı araç çubuğu zoom'u veya fiziksel cihaz testi yerine sayılmadı.
- Render edilmiş metin ve odak renkleri tarayıcıda hesaplandı: normal metin 4.5:1, büyük metin ve odak 3:1 hedefleri geçti. Bu, tam WCAG sertifikasyonu veya gerçek ekran okuyucu kabulü değildir. Fiziksel iOS/Android ve VoiceOver/TalkBack çalıştırılmadı.
- Türkçe/İngilizce masaüstü ve Türkçe mobil/dar davet screenshot'ları yerelde incelendi. Son geçerli sayfalarda konsol/page error yok. Client → server dönüşümü sırasında eski HMR manifesti geçici 500 üretti; dev sunucusu yeniden başlatıldı, son suite temiz geçti.
- Kullanıcının önceden mevcut 52 dosyalık diff'i, API/migration silmeleri, public/sw.js ve ürün screenshot dosyaları korundu. README güncel yollar/test komutlarıyla düzeltildi; bu günlükte eski geçmiş silinmedi.

Yeni web/mobil build, deploy, OTA, mağaza yükleme, push, uzak migration, backend veya mobil kaynak değişikliği, sır taşıma, AI/ödeme/bildirim gönderimi ya da ücretli servis işlemi yok. Yerel kontroller, hosted yayının güncellendiği veya mobil özelliklerin cihazda kabul edildiği anlamına gelmez. Eski production API tüketicileri için yayın öncesi geçiş gereksinimi hâlâ geçerlidir.

## 10 Kasım 2026 — Kullanıcı isteğiyle Vercel önizleme yayını

Kullanıcı tanıtımı Vercel'de görmek istedi; bu yeni talimat yalnız bu web önizlemesinin yayını ve Vercel'deki gerekli uzak web derlemesi için yetki olarak uygulandı. Yerelde `npm run build`, mobil build veya production terfisi yapılmadı.

- Mevcut `mertgrz24s-projects/chef-ai` projesine CLI ile Preview gönderildi. [Önizleme](https://chef-km02hvv5b-mertgrz24s-projects.vercel.app) · [Vercel inceleme](https://vercel.com/mertgrz24s-projects/chef-ai/GTrKeByyMMFRhAiffaWurXFsw9fr). Deployment `dpl_GTrKeByyMMFRhAiffaWurXFsw9fr`, hedef `preview`; `vercel inspect --wait` sonucu **Ready**. Bu kayıt yerelde yayın sonrasında eklendi.
- Yayın öncesi lint, TypeScript ve güvenlik yaması bütünlüğü tekrar geçti. Kaynakta yeni davranış değişikliği yapılmadığından önceki 11 yerel tarayıcı testi tekrarlanmış gibi sunulmadı.
- Önizleme Vercel oturum koruması altında: oturumsuz istek 302 ile Vercel girişine yönleniyor. Kullanıcı kendi Vercel hesabıyla açabilir. Uzak sayfanın oturum sonrası görsel/etkileşim kabulü bu turda yapılmadı; Ready durumu bu kabulün yerine sayılmadı. Mevcut automation bypass bulunmadığı salt okunur proje sorgusuyla görüldü; koruma ayarı değiştirilmedi ve bypass anahtarı üretilmedi.
- Production hedefi hâlâ önceki `chef-ae0uckx40-mertgrz24s-projects.vercel.app` deployment'ıdır; `chef-ai-puce-zeta.vercel.app` için terfi/alias değişikliği yok. Backend/staging, mobil paket, uzak migration, OTA ve Git main/push değişmedi. Eski API tüketicileri için kontrollü production geçişi gereksinimi sürüyor.
- CLI kullanımı için yalnız Git dışında kalan `.vercel/project.json` yerel proje bağlantısı oluştu. Paket/lock, `.env.example`, `.gitignore`, Next/Vercel ayarları ve güvenlik yaması dosyaları görev başındaki hashleriyle aynı; sunucu anahtarı okunup yazdırılmadı veya taşınmadı.
