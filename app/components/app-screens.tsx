"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { revealContainer, revealItem, EASE_OUT } from "@/lib/motion";

const screens = [
  {
    src: "/app-screens/today.png",
    alt: "Today screen — pantry count, expiring-soon alert, and quick actions to scan or cook",
    caption: "Your kitchen, at a glance.",
  },
  {
    src: "/app-screens/pantry.png",
    alt: "Pantry screen — a list of ingredients with expiry countdowns",
    caption: "What's in the fridge, tracked automatically.",
  },
  {
    src: "/app-screens/cook.png",
    alt: "Cook screen — pantry ingredients selected as chips, ready to fire a recipe",
    caption: "Pick what you have. Fire a recipe.",
  },
];

export function AppScreens() {
  return (
    <section className="py-20 md:py-28 bg-[#1e3a2f] text-[#f5f6f1] overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, ease: EASE_OUT }}
          className="text-center mb-14"
        >
          <p className="font-mono-ticket text-[11px] tracking-[0.2em] text-[#cdf23e] mb-3">
            THE REAL APP
          </p>
          <h2 className="font-display text-3xl md:text-[42px] font-semibold">
            Not a mockup. This is it.
          </h2>
        </motion.div>

        <motion.div
          variants={revealContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-6"
        >
          {screens.map((screen) => (
            <motion.figure key={screen.src} variants={revealItem} className="flex flex-col gap-4">
              <div className="rounded-2xl overflow-hidden border border-[#f5f6f1]/10 shadow-2xl bg-black/10">
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
          ))}
        </motion.div>
      </div>
    </section>
  );
}
