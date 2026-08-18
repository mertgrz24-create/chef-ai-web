"use client";

import Image from "next/image";
import { motion, type Variants } from "framer-motion";
import { revealContainer, EASE_OUT } from "@/lib/motion";
import { SectionHeading } from "@/components/marketing/section-heading";

const screens = [
  {
    src: "/app-screens/today.png",
    alt: "Today screen — pantry count, expiring-soon alert, and quick actions to scan or cook",
    caption: "Your kitchen, at a glance.",
    tilt: -0.6,
  },
  {
    src: "/app-screens/pantry.png",
    alt: "Pantry screen — a list of ingredients with expiry countdowns",
    caption: "What's in the fridge, tracked automatically.",
    tilt: 0.6,
  },
  {
    src: "/app-screens/cook.png",
    alt: "Cook screen — pantry ingredients selected as chips, ready to fire a recipe",
    caption: "Pick what you have. Fire a recipe.",
    tilt: -0.6,
  },
];

// Each card gets a slightly different tilt so three real screenshots don't
// read as one copy-pasted unit — restrained (±0.6°), not a showy effect.
function screenCardVariant(tilt: number): Variants {
  return {
    hidden: { opacity: 0, y: 14, scale: 0.97, rotate: tilt },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      rotate: 0,
      transition: { duration: 0.5, ease: EASE_OUT },
    },
  };
}

export function AppScreens() {
  return (
    <section className="paper-grain py-20 md:py-28 bg-[#1e3a2f] text-[#f5f6f1] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeading
          eyebrow="THE REAL APP"
          title="Not a mockup. This is it."
          eyebrowClassName="text-[#cdf23e]"
          titleClassName="text-[#f5f6f1]"
          align="center"
          className="mb-14"
        />

        <motion.div
          variants={revealContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-6"
        >
          {screens.map((screen, i) => (
            // The vertical stagger lives on this plain wrapper, not the
            // motion.figure inside — Framer already writes its own
            // transform inline style onto the figure for entrance/hover,
            // and an inline style always wins over a CSS class, so a
            // static offset class on the same element would be silently
            // ignored. Keeping it on an outer, non-animated element avoids
            // that fight entirely.
            <div key={screen.src} className={i === 1 ? "md:-translate-y-6" : undefined}>
              <motion.figure
                variants={screenCardVariant(screen.tilt)}
                whileHover={{ y: -6, transition: { duration: 0.2, ease: EASE_OUT } }}
                className="flex flex-col gap-4"
              >
                <div className="shadow-brand rounded-2xl overflow-hidden border border-[#f5f6f1]/10 bg-black/10 [@media(hover:hover)]:hover:shadow-[0_28px_70px_-20px_rgba(0,0,0,0.65)] transition-shadow duration-200">
                  <Image
                    src={screen.src}
                    alt={screen.alt}
                    width={1206}
                    height={2622}
                    sizes="(max-width: 768px) 90vw, 30vw"
                    className="w-full h-auto"
                  />
                </div>
                <figcaption className="text-center text-[13px] text-[#c3c8ba]">
                  {screen.caption}
                </figcaption>
              </motion.figure>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
