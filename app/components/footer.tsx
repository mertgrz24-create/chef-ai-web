import { copy, homePath, type Locale } from "@/lib/marketing";
import { LanguageSwitch } from "@/components/marketing/language-switch";

export function Footer({ locale }: { locale: Locale }) {
  const text = copy[locale];
  return (
    <footer className="site-footer on-dark">
      <div className="container">
        <div className="footer-top">
          <div>
            <a
              href={homePath(locale)}
              className="wordmark"
              aria-label="Chef-AI"
              translate="no"
            >
              Chef<span>AI</span>
            </a>
            <p>{text.footer.tagline}</p>
          </div>
          <nav aria-label={text.footer.nav}>
            <a href="#features">{text.nav.features}</a>
            <a href="#development">{text.nav.development}</a>
            <a href="#pricing">{text.nav.pricing}</a>
          </nav>
        </div>
        <div className="footer-bottom">
          <p>
            © 2026 <span translate="no">Chef-AI.</span> {text.footer.rights}
          </p>
          <LanguageSwitch locale={locale} />
        </div>
      </div>
    </footer>
  );
}
