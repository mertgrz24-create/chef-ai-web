import type { Metadata, Viewport } from 'next'
import {
  Bricolage_Grotesque,
  Instrument_Sans,
  Space_Mono,
} from 'next/font/google'
import { copy, homePath, type Locale } from '@/lib/marketing'
import '@/app/globals.css'

const display = Bricolage_Grotesque({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-display',
  display: 'swap',
})
const body = Instrument_Sans({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-body',
  display: 'swap',
})
const mono = Space_Mono({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '700'],
  variable: '--font-mono',
  display: 'swap',
})
const SITE_URL = 'https://chef-ai-puce-zeta.vercel.app'

export const viewport: Viewport = { themeColor: '#1E3A2F' }

export function pageMetadata(
  locale: Locale,
  path = '',
  invite = false,
): Metadata {
  const text = copy[locale]
  const title = invite ? text.invite.metaTitle : text.meta.title
  const description = invite
    ? text.invite.metaDescription
    : text.meta.description
  const trPath = path || '/'
  const enPath = `/en${path}`
  const url = locale === 'tr' ? trPath : enPath
  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    alternates: {
      canonical: url,
      languages: { tr: trPath, en: enPath, 'x-default': trPath },
    },
    openGraph: {
      title,
      description,
      url,
      siteName: 'Chef-AI',
      type: 'website',
      locale: locale === 'tr' ? 'tr_TR' : 'en_US',
      alternateLocale: locale === 'tr' ? 'en_US' : 'tr_TR',
    },
    twitter: { card: 'summary', title, description },
  }
}

export function SiteLayout({
  locale,
  children,
}: {
  locale: Locale
  children: React.ReactNode
}) {
  return (
    <html lang={locale}>
      <body className={`${display.variable} ${body.variable} ${mono.variable}`}>
        <a className="skip-link" href="#main">
          {copy[locale].nav.skip}
        </a>
        {children}
      </body>
    </html>
  )
}

export function Wordmark({ locale }: { locale: Locale }) {
  return (
    <a
      className="wordmark"
      href={homePath(locale)}
      aria-label="Chef-AI"
      translate="no"
    >
      Chef<span>AI</span>
    </a>
  )
}
