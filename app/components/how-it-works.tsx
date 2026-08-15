"use client";

import { Fragment } from "react";
import { motion, type Variants } from "framer-motion";
import { EASE_OUT, EASE_IN_OUT } from "@/lib/motion";
import { CameraIcon, SparkIcon, ChefHatIcon } from "@/components/marketing/icons";
import { SectionHeading } from "@/components/marketing/section-heading";

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const stepVariant: Variants = {
  hidden: { opacity: 0, x: -16 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.45, ease: EASE_OUT } },
};

// The dashed connector between steps draws in left-to-right right after its
// preceding step reveals — it "links" the steps instead of sitting there
// fully drawn from the first frame.
const dividerVariant: Variants = {
  hidden: { scaleX: 0 },
  visible: { scaleX: 1, transition: { duration: 0.5, ease: EASE_IN_OUT } },
};

const steps = [
  {
    number: "01",
    Icon: CameraIcon,
    title: "Snap a Photo",
    description: "Take a picture of your fridge. AI identifies every ingredient instantly.",
  },
  {
    number: "02",
    Icon: SparkIcon,
    title: "AI Fires a Ticket",
    description: "Gemini reads the image and fires back a recipe built around what you have.",
  },
  {
    number: "03",
    Icon: ChefHatIcon,
    title: "Cook & Enjoy",
    description: "Follow the step-by-step recipe and enjoy a home-cooked meal.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 md:py-28 bg-[var(--bg)]">
      <div className="max-w-6xl mx-auto px-6">
        <SectionHeading eyebrow="HOW IT WORKS" title="Ready in 3 steps." className="mb-16" />

        {/* Steps */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="flex flex-col md:flex-row md:items-start gap-10 md:gap-0"
        >
          {steps.map((step, i) => (
            <Fragment key={step.number}>
              <motion.div variants={stepVariant} className="flex-1 flex flex-col gap-4">
                <div className="flex items-baseline gap-3">
                  <span className="font-mono-ticket text-5xl font-bold text-[var(--text-primary)]">
                    {step.number}
                  </span>
                  <span className="h-px flex-1 bg-[var(--border)] mb-2" />
                </div>
                <div className="flex items-center gap-3">
                  <step.Icon size={20} className="text-[var(--brand)]" />
                  <h3 className="text-base font-semibold text-[var(--text-primary)]">
                    {step.title}
                  </h3>
                </div>
                <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
                  {step.description}
                </p>
              </motion.div>

              {/* Divider — dashed, echoing the ticket perforation instead of a plain arrow glyph.
                  Draws in left-to-right after its preceding step, so the steps visibly connect. */}
              {i < steps.length - 1 && (
                <div className="hidden md:flex items-center justify-center w-12 shrink-0 mt-6">
                  <motion.span
                    variants={dividerVariant}
                    style={{ transformOrigin: "left" }}
                    className="w-full border-t border-dashed border-[var(--border)]"
                  />
                </div>
              )}
            </Fragment>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
