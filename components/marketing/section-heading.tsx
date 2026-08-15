"use client";

import { motion } from "framer-motion";
import { headingContainer, headingEyebrow, headingTitle } from "@/lib/motion";

type Props = {
  eyebrow: string;
  title: string;
  eyebrowClassName?: string;
  titleClassName?: string;
  align?: "left" | "center";
  className?: string;
};

// Shared two-beat section header: eyebrow leads, title follows a beat later.
// Replaces the identical single-block fade that was copy-pasted across
// Features/HowItWorks/Pricing/AppScreens.
export function SectionHeading({
  eyebrow,
  title,
  eyebrowClassName = "text-[var(--brand)]",
  titleClassName = "text-[var(--text-primary)]",
  align = "left",
  className = "",
}: Props) {
  return (
    <motion.div
      variants={headingContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className={`${align === "center" ? "text-center" : ""} ${className}`}
    >
      <motion.p
        variants={headingEyebrow}
        className={`font-mono-ticket text-[11px] tracking-[0.2em] mb-3 ${eyebrowClassName}`}
      >
        {eyebrow}
      </motion.p>
      <motion.h2
        variants={headingTitle}
        className={`font-display text-3xl md:text-[42px] font-semibold ${titleClassName}`}
      >
        {title}
      </motion.h2>
    </motion.div>
  );
}
