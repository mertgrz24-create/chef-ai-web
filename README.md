> Güncel düzen: mobil ve sunucu `chef-ai/mobile/` + `chef-ai/backend/` olarak aynı repodadır. Bu repo yalnız tanıtımdır. Önceki standalone-backend referansları tarihsel; aktif API kaynağı `chef-ai/backend/`.

# Chef-AI — Tanıtım sitesi

Bu repo yalnız ürünün tanıtım sitesidir. Türkçe ve İngilizce sayfa girişleri `app/(tr)/` ve `app/en/` altında, ortak tanıtım bölümleri `app/components/` içindedir. Statik davet sayfalarını ve tanıtım görsellerini de içerir.

- Mobil istemci: `chef-ai` (Expo/React Native).
- Mobil API, Gemini, Supabase sunucu erişimi, migration ve e-posta şablonları: **`chef-ai/backend/`**.
- Repo'lar arasında dosya sistemi bağımlılığı yoktur.

## Geliştirme

```sh
npm ci
npm run dev
# http://127.0.0.1:3001
```

Bu site Supabase veya Gemini anahtarı istemez. `.env.example` yalnız isteğe bağlı public mağaza adreslerini gösterir. Backend development API'si chef-ai/backend içinde 127.0.0.1:3000'de çalışır. `/api/mobile/config` burada bulunmaz; uygulama ekranı değil backend JSON endpoint'idir.

## 16 Ekim 2026 ayrımı

API/şema/servis dosyaları, kaydedilmemiş düzeltmeleri korunarak backend'e taşındı. Gerçek staging `.env.local` yalnız backend'dedir (Git dışında0600). Public recipe ürün sayfası ve cooking bileşenleri de backend'e taşındı; statik invite tanıtımı burada kaldı. Güvenlik bağımlılık yaması `scripts/security/` altında devam eder.

Ayrımda **yeni build/deploy yapılmadı**. Mevcut web ve staging yayınları önceki artefaktlarını kullanır. Staging adresi ve APK değişmedi. Web'in API'siz sürümünü yayınlamadan önce eski production API tüketicileri ve public recipe URL'leri için kontrollü geçiş gerekir. Bu repo gelecekte mobil backend dağıtımı için kullanılmamalı.

`npm run typecheck` ve `npm run lint` kaynak kontrolleridir. Yayın ve geri dönüş ayrıntıları backend `docs/REPOSITORY_SPLIT.md` içinde; eski kayıtlar `PROGRESS.md` içinde tarihsel olarak korunur.

## Tanıtım sayfaları ve yerel kontrol

- `/`: Türkçe; `/en`: İngilizce. Dil değiştirme bölüm hedefini korur.
- `/invite/CHEF-ABCD` ve `/en/invite/CHEF-ABCD`: aynı kodun iki dildeki statik tanıtımı. Kod kullanımı henüz açık değildir; web kodun hesap durumunu sorgulamaz.
- Mağaza bağlantıları isteğe bağlı public env alanlarından gelir. Boş veya geçersiz değerler bağlantı yerine “Yakında / Coming soon” gösterir. URL biçimi denetimi, bir mağaza kaydının gerçekten yayımlandığını doğrulamaz; yalnız doğrulanmış Chef-AI ürün adresleri yapılandırılmalıdır.
- Ortak metinler `lib/marketing.ts` içindedir. İngilizce sözlük Türkçe sözlüğün yapısıyla tip kontrolünden geçer. Yeni özelliklerin kaynakta bulunması, staging veya mobil pakette yayımlandıkları anlamına gelmez.

Geliştirme sunucusu açıkken ayrı terminalde:

```sh
npm run lint
npm run typecheck
node scripts/security/apply-dependency-patches.cjs --check
python3 scripts/test-marketing.py -v
```

Tarayıcı kontrolleri bu makinedeki Python Playwright, headless Google Chrome ve TypeScript'i doğrudan okuyabilen Node 24 ile çalıştırıldı. Başka kurulumlarda `CHEF_TEST_BROWSER_CHANNEL` ile mevcut Playwright tarayıcı kanalı seçilebilir. Testler yalnız `127.0.0.1:3001` adresini kullanır; store URL örnekleriyle ağ isteği yapılmaz. Ek bir npm test bağımlılığı eklenmedi. Yeni build ve deploy almama sınırı devam eder.
