import { notFound } from 'next/navigation'
import { copy, homePath, inviteCode, type Locale } from '@/lib/marketing'
import { StoreBadges } from './store-badges'
import { LanguageSwitch } from './language-switch'
import { Wordmark } from './site-layout'

export function Invite({
  locale,
  rawCode,
}: {
  locale: Locale
  rawCode: string
}) {
  const code = inviteCode(rawCode)
  if (!code) notFound()
  const text = copy[locale].invite
  return (
    <div className="standalone-page">
      <header className="container standalone-header">
        <Wordmark locale={locale} />
        <LanguageSwitch locale={locale} />
      </header>
      <main id="main" className="invite-main container" tabIndex={-1}>
        <p className="eyebrow">{text.eyebrow}</p>
        <h1>{text.title}</h1>
        <p className="standalone-description">{text.description}</p>
        <div className="invite-ticket">
          <p className="eyebrow" id="code-label">
            {text.code}
          </p>
          <p
            className="invite-code"
            aria-labelledby="code-label"
            translate="no"
          >
            {code}
          </p>
        </div>
        <p className="invite-note">{text.note}</p>
        <StoreBadges locale={locale} />
        <a className="text-link" href={homePath(locale)}>
          {text.back}
          <span aria-hidden="true"> ↗</span>
        </a>
      </main>
    </div>
  )
}
