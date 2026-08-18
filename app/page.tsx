import { Navbar } from "./components/navbar";
import { Hero } from "./components/hero";
import { Features } from "./components/features";
import { HowItWorks } from "./components/how-it-works";
import { WakeUp } from "./components/wake-up";
import { AppScreens } from "./components/app-screens";
import { Pricing } from "./components/pricing";
import { Footer } from "./components/footer";

export default function Home() {
  return (
    <div>
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <WakeUp />
      <AppScreens />
      <Pricing />
      <Footer />
    </div>
  );
}
