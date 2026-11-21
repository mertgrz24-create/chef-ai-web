import type { Locale } from "@/lib/marketing";
import { Navbar } from "./navbar";
import { Hero } from "./hero";
import { Features } from "./features";
import { HowItWorks } from "./how-it-works";
import { Development } from "./development";
import { Pricing } from "./pricing";
import { Footer } from "./footer";

export function Landing({ locale }: { locale: Locale }) {
  return (
    <>
      <Navbar locale={locale} />
      <main id="main" tabIndex={-1}>
        <Hero locale={locale} />
        <Features locale={locale} />
        <HowItWorks locale={locale} />
        <Development locale={locale} />
        <Pricing locale={locale} />
      </main>
      <Footer locale={locale} />
    </>
  );
}
