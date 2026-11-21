import { copy, type Locale } from "@/lib/marketing";
import { SectionHeading } from "@/components/marketing/section-heading";
import { ArrowIcon } from "@/components/marketing/icons";

export function Development({ locale }: { locale: Locale }) {
  const text = copy[locale].development;
  return (
    <section
      id="development"
      className="section development on-dark"
      aria-labelledby="development-title"
    >
      <div className="container development-grid">
        <SectionHeading
          eyebrow={text.eyebrow}
          title={text.title}
          description={text.intro}
          id="development-title"
        />
        <div className="development-list">
          {text.items.map((item) => (
            <article key={item.title}>
              <ArrowIcon />
              <div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
