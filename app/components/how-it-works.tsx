"use client";

import { Fragment } from "react";
import { motion, type Variants } from "framer-motion";

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.2 } },
};

const stepVariant: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const steps = [
  {
    number: "01",
    icon: "📸",
    title: "Snap a Photo",
    description: "Take a picture of your fridge. AI identifies every ingredient instantly.",
  },
  {
    number: "02",
    icon: "🤖",
    title: "AI Fires a Ticket",
    description: "Gemini reads the image and fires back a recipe built around what you have.",
  },
  {
    number: "03",
    icon: "🍳",
    title: "Cook & Enjoy",
    description: "Follow the step-by-step recipe and enjoy a home-cooked meal.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 md:py-28 bg-[var(--bg)]">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mb-16"
        >
          <p className="font-mono-ticket text-[11px] tracking-[0.2em] text-[var(--brand)] mb-3">
            HOW IT WORKS
          </p>
          <h2 className="font-display text-3xl md:text-[42px] font-semibold text-[var(--text-primary)]">
            Ready in 3 steps.
          </h2>
        </motion.div>

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
                  <span className="text-2xl">{step.icon}</span>
                  <h3 className="text-base font-semibold text-[var(--text-primary)]">
                    {step.title}
                  </h3>
                </div>
                <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
                  {step.description}
                </p>
              </motion.div>

              {/* Arrow — desktop only, between steps */}
              {i < steps.length - 1 && (
                <div className="hidden md:flex items-center justify-center w-12 shrink-0 mt-6 text-xl text-[var(--text-muted)]">
                  →
                </div>
              )}
            </Fragment>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
