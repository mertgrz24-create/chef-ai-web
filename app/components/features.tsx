import { copy, type Locale } from "@/lib/marketing";
import {
  CameraIcon,
  ChefHatIcon,
  CalendarIcon,
} from "@/components/marketing/icons";
import { SectionHeading } from "@/components/marketing/section-heading";

const icons = [ChefHatIcon, CameraIcon, CalendarIcon];

export function Features({ locale }: { locale: Locale }) {
  const text = copy[locale].features;
  return (
    <section
      id="features"
      className="section features"
      aria-labelledby="features-title"
    >
      <div className="container">
        <SectionHeading
          eyebrow={text.eyebrow}
          title={text.title}
          description={text.intro}
          id="features-title"
        />
        <div className="feature-grid">
          {text.items.map((item, index) => {
            const Icon = icons[index];
            return (
              <article
                className={`feature-card ${index === 0 ? "feature-lead on-dark" : ""}`}
                key={item.title}
              >
                <div className="feature-icon">
                  <Icon size={28} />
                </div>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
