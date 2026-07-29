# Chef-AI — Website

Chef-AI'ın pazarlama sitesi ve API backend'i (Next.js App Router). Ürünün mobil uygulaması ayrı bir repo'da: [chef-ai](https://github.com/mertgrz24/chef-ai) (Expo/React Native).

Bu repo iki şeyi barındırıyor:
- **Landing page** (`app/page.tsx` ve `app/components/`) — pazarlama yüzü, hiçbir auth/dashboard içermiyor
- **API** (`app/api/`) — Supabase + Claude + Gemini kullanan backend, hem bu sitenin hem mobil app'in tek ortak arka ucu

## Geliştirme

```bash
cp .env.example .env.local   # değerleri doldur
npm install
npm run dev                  # http://localhost:3000
```

## Doğrulama

```bash
npm run typecheck && npm run lint && npm run build
```

## Deploy

Vercel'e bağlı (`main` branch → production). Ortam değişkenleri Vercel proje ayarlarında tutuluyor, bu repo'ya taşınmaz.
