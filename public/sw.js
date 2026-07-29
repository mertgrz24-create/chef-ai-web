// Tombstone service worker.
//
// This site used to be an installable PWA. It is a marketing site now, and the
// app lives in the App Store / Play Store. Deleting this file would NOT be
// enough: the worker it replaces cached pages network-first with a cache
// fallback, so every device that ever installed ChefAI would keep serving the
// retired dashboard out of its own cache, offline and indefinitely.
//
// So rather than removing the worker, we ship one that removes itself: it drops
// every cache, unregisters, and reloads any open window so it leaves the cached
// shell behind. There is deliberately no `fetch` handler — nothing is
// intercepted and nothing new is ever cached.
//
// Keep this deployed until installed clients have realistically all been
// reached (~6 months), then delete the file.

self.addEventListener('install', () => self.skipWaiting())

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys()
      await Promise.all(keys.map((key) => caches.delete(key)))

      await self.registration.unregister()

      const clients = await self.clients.matchAll({ type: 'window' })
      clients.forEach((client) => client.navigate(client.url))
    })()
  )
})
