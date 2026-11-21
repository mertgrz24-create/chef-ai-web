import { copy, storeUrl, type Locale } from '@/lib/marketing'

export function StoreBadges({ locale }: { locale: Locale }) {
  const text = copy[locale].access
  const stores = [
    {
      name: 'App Store',
      url: storeUrl(process.env.NEXT_PUBLIC_IOS_APP_URL, 'ios'),
    },
    {
      name: 'Google Play',
      url: storeUrl(process.env.NEXT_PUBLIC_ANDROID_APP_URL, 'android'),
    },
  ]
  return (
    <div className="store-badges" role="group" aria-label={text.storeLabel}>
      {stores.map((store) =>
        store.url ? (
          <a
            key={store.name}
            className="store-link"
            href={store.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            {store.name}
            <span className="sr-only"> — {text.external}</span>
            <span aria-hidden="true"> ↗</span>
          </a>
        ) : (
          <p key={store.name} className="store-pending">
            <span translate="no">{store.name}</span>
            <span>{text.soon}</span>
          </p>
        ),
      )}
    </div>
  )
}
