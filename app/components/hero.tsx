import { copy, type Locale } from "@/lib/marketing";
import { ArrowIcon } from "@/components/marketing/icons";

export function Hero({ locale }: { locale: Locale }) {
  const text = copy[locale].hero;
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="container hero-grid">
        <div className="hero-copy">
          <p className="eyebrow">{text.eyebrow}</p>
          <h1 id="hero-title">{text.title}</h1>
          <p className="hero-description">{text.description}</p>
          <a className="button button-primary" href="#how-it-works">
            {text.cta}
            <ArrowIcon />
          </a>
          <p className="availability-note">
            <span className="status-dot" aria-hidden="true" />
            {text.note}
          </p>
        </div>
        <figure className="ingredient-story">
          <div className="workbench on-dark paper-grain">
            <p className="eyebrow">{text.pantry}</p>
            <ul className="ingredient-tags">
              {text.ingredients.map((name) => (
                <li key={name}>{name}</li>
              ))}
            </ul>
            <div className="story-connector" aria-hidden="true">
              <span />
              <ArrowIcon />
            </div>
            <div className="recipe-paper">
              <div className="ticket-top">
                <span translate="no">CHEF-AI</span>
                <span aria-hidden="true">↙</span>
              </div>
              <p className="eyebrow">{text.recipeLabel}</p>
              <h2>{text.recipe}</h2>
              <p className="recipe-note">{text.recipeNote}</p>
              <div className="ticket-end" aria-hidden="true">
                <span />
                <span />
                <span />
                <span />
                <span />
                <span />
              </div>
            </div>
            <p className="story-caption">
              {text.journey}
              <span aria-hidden="true"> ↗</span>
            </p>
          </div>
          <figcaption>{text.sample}</figcaption>
        </figure>
      </div>
    </section>
  );
}
