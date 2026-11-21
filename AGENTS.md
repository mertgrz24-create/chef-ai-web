> Güncel düzen: mobil ve sunucu `chef-ai/mobile/` + `chef-ai/backend/` olarak aynı repodadır. Bu repo yalnız tanıtımdır. Önceki standalone-backend referansları tarihsel; aktif API kaynağı `chef-ai/backend/`.

# Chef-AI — Tanıtım sitesi

Bu repo yalnız tanıtım sitesi ve statik davet sayfasıdır. Mobil ürün `chef-ai`, API/sunucu/şema `chef-ai` reposunun `backend/` dizinindedir.

- Kurulu Next sürümünün `node_modules/next/dist/docs/` belgelerini koddan önce oku.
- Buraya mobil API, AI/Supabase sunucu istemcisi, migration, auth/dashboard veya sunucu anahtarı ekleme.
- `.env.example` yalnız isteğe bağlı public mağaza bağlantıları içerir; normal geliştirme için dotenv gerekmez.
- Tasarımın krem/koyu yeşil/lime dilini koru.
- Mobil/backend ve tanıtım arasında filesystem import, symlink veya file dependency oluşturma.
- `npm run dev` tanıtımı3001 portunda açar; backend ayrı3000 portundadır.
- Kullanıcının yeni build almama talimatı sürüyor. Mevcut hosted web/staging deployment'larını değiştirme.
- Geçmiş belgelerdeki API referansları tarihsel konumdur; aktif sahibi backend'dir.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
