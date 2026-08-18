"use client";

import { motion } from "framer-motion";
import { revealContainer, revealItem } from "@/lib/motion";

// The one full-background use of the accent lime on the whole page — the
// palette system names it "the one bold move" but until now it only ever
// showed up as small text/pill/button accents. One deliberate, unmissable
// break in the page rhythm between the mechanism (How it Works) and the
// proof (AppScreens).
export function WakeUp() {
  return (
    <section className="bg-[var(--accent)] py-16 md:py-24">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <motion.div
          variants={revealContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.p
            variants={revealItem}
            className="font-mono-ticket text-[11px] tracking-[0.2em] text-[#17180f]/75 mb-4"
          >
            SOUND FAMILIAR?
          </motion.p>
          <motion.p
            variants={revealItem}
            className="font-display text-[28px] md:text-[46px] font-semibold leading-[1.05] tracking-tight text-[#17180f]"
          >
            Stop opening the fridge and closing it again.
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
