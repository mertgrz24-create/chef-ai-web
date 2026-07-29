"use client";

import { motion, type Variants } from "framer-motion";
import { StoreBadges } from "@/components/marketing/store-badges";

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.2 } },
};

const cardVariant: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const freeItems = ["Manual ingredient entry", "10 recipes per month", "Core features"];

const premiumItems = [
  "Unlimited photo analysis",
  "Calorie & macro tracking",
  "Weekly meal planning",
  "Ad-free experience",
];

export function Pricing() {
  return (
    <section id="pricing" className="py-20 md:py-28 bg-[var(--bg-card)]">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="text-center mb-14"
        >
          <p className="font-mono-ticket text-[11px] tracking-[0.2em] text-[var(--brand)] mb-3">
            PRICING
          </p>
          <h2 className="font-display text-3xl md:text-[42px] font-semibold text-[var(--text-primary)]">
            Free to get started.
          </h2>
        </motion.div>

        {/* Cards */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 gap-5 max-w-2xl mx-auto"
        >
          {/* Free plan */}
          <motion.div
            variants={cardVariant}
            className="rounded-2xl p-8 flex flex-col gap-6"
            style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border)" }}
          >
            <div>
              <h3 className="text-base font-semibold mb-4 text-[var(--text-primary)]">Free</h3>
              <div className="flex items-baseline gap-1">
                <span className="font-display text-4xl font-bold text-[var(--text-primary)]">$0</span>
                <span className="text-sm text-[var(--text-muted)]">/ month</span>
              </div>
            </div>
            <ul className="flex flex-col gap-3 flex-1">
              {freeItems.map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                  <span className="text-[var(--brand)]">✓</span>
                  {item}
                </li>
              ))}
            </ul>
            <StoreBadges tone="light" size="compact" />
          </motion.div>

          {/* Premium plan */}
          <motion.div
            variants={cardVariant}
            className="rounded-2xl p-8 flex flex-col gap-6 relative"
            style={{ backgroundColor: "var(--brand)" }}
          >
            {/* MOST POPULAR badge */}
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
              <span className="font-mono-ticket text-[10px] font-bold tracking-wider px-4 py-1 rounded-full whitespace-nowrap bg-[#cdf23e] text-[#17180f]">
                MOST POPULAR
              </span>
            </div>

            <div>
              <h3 className="text-base font-semibold mb-4 text-[#f5f6f1]">Premium</h3>
              <div className="flex items-baseline gap-1">
                <span className="font-display text-4xl font-bold text-[#f5f6f1]">$9.99</span>
                <span className="text-sm text-[#a5b0a0]">/ month</span>
              </div>
            </div>
            <ul className="flex flex-col gap-3 flex-1">
              {premiumItems.map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm text-[#c3c8ba]">
                  <span className="text-[#cdf23e]">✓</span>
                  {item}
                </li>
              ))}
            </ul>
            {/* Upgrading is an in-app purchase — the web can only point at the store. */}
            <div className="flex flex-col gap-2.5">
              <p className="font-mono-ticket text-[10px] tracking-[0.14em] text-[#8fa093]">
                UPGRADE INSIDE THE APP
              </p>
              <StoreBadges size="compact" />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
