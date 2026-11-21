import { copy, type Locale } from "@/lib/marketing";
import { SectionHeading } from "@/components/marketing/section-heading";
import { StoreBadges } from "@/components/marketing/store-badges";

export function Pricing({ locale }: { locale: Locale }) {
  const text = copy[locale].access;
  return (
    <section
      id="pricing"
      className="section access"
      aria-labelledby="access-title"
    >
      <div className="container access-grid">
        <div>
          <SectionHeading
            eyebrow={text.eyebrow}
            title={text.title}
            description={text.description}
            id="access-title"
          />
          <StoreBadges locale={locale} />
        </div>
        <div className="membership-notes">
          <article>
            <h3>{text.free}</h3>
            <p>{text.freeDetail}</p>
          </article>
          <article>
            <h3>
              {text.premium}
              <span className="inline-status">{text.soon}</span>
            </h3>
            <p>{text.premiumDetail}</p>
          </article>
        </div>
      </div>
    </section>
  );
}
