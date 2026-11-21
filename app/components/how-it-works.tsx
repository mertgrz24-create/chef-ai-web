import { copy, type Locale } from "@/lib/marketing";
import { SectionHeading } from "@/components/marketing/section-heading";

export function HowItWorks({ locale }: { locale: Locale }) {
  const text = copy[locale].how;
  return (
    <section
      id="how-it-works"
      className="section how-it-works"
      aria-labelledby="how-title"
    >
      <div className="container">
        <SectionHeading
          eyebrow={text.eyebrow}
          title={text.title}
          id="how-title"
        />
        <ol className="steps">
          {text.steps.map((step, index) => (
            <li key={step.title}>
              <span className="step-number" aria-hidden="true">
                0{index + 1}
              </span>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </li>
          ))}
        </ol>
        <p className="recipe-check-note">{text.note}</p>
      </div>
    </section>
  );
}
