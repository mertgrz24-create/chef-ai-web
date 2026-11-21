import { copy, homePath, type Locale } from '@/lib/marketing'
import { LanguageSwitch } from './language-switch'
import { Wordmark } from './site-layout'

export function MissingPage({ locale }: { locale: Locale }) {
  const text = copy[locale].notFound
  return (
    <div className="standalone-page">
      <header className="container standalone-header">
        <Wordmark locale={locale} />
        <LanguageSwitch locale={locale} />
      </header>
      <main id="main" className="missing-main container" tabIndex={-1}>
        <p className="eyebrow">CHEF-AI / 404</p>
        <h1>{text.title}</h1>
        <p className="standalone-description">{text.description}</p>
        <a className="button button-primary" href={homePath(locale)}>
          {text.back}
        </a>
      </main>
    </div>
  )
}
