'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { alternatePath, copy, type Locale } from '@/lib/marketing'

export function LanguageSwitch({ locale }: { locale: Locale }) {
  const pathname = usePathname()
  const [hash, setHash] = useState('')
  useEffect(() => {
    const sync = () => setHash(window.location.hash)
    sync()
    window.addEventListener('hashchange', sync)
    return () => window.removeEventListener('hashchange', sync)
  }, [pathname])
  const next = locale === 'tr' ? 'en' : 'tr'
  return (
    <a
      className="language-switch"
      href={`${alternatePath(pathname, locale)}${hash}`}
      lang={next}
      hrefLang={next}
      aria-label={copy[locale].nav.language}
    >
      {locale === 'tr' ? 'EN' : 'TR'}
      <span aria-hidden="true"> ↗</span>
    </a>
  )
}
