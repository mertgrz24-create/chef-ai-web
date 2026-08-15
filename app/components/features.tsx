"use client";

import { motion } from "framer-motion";
import { revealContainer, revealItem, EASE_OUT } from "@/lib/motion";
import { CameraIcon, SparkIcon, TimerIcon } from "@/components/marketing/icons";
import { SectionHeading } from "@/components/marketing/section-heading";

// Featured card leads the array so it renders first — it spans the full
// row below, with the two supporting cards sitting side by side under it.
const cards = [
  {
    Icon: SparkIcon,
    title: "Smart Recipes",
    description: "Get personalized recipes from what you already have, in seconds.",
    featured: true,
  },
  {
    Icon: CameraIcon,
    title: "Visual Pantry",
    description: "Snap your fridge and let AI identify every ingredient — no typing.",
    featured: false,
  },
  {
    Icon: TimerIcon,
    title: "Zero Waste",
    description: "Alerts for expiring items — cook before you toss, save money.",
    featured: false,
  },
];

export function Features() {
  return (
    <section id="features" className="py-20 md:py-28 bg-[var(--bg-card)]">
      <div className="max-w-6xl mx-auto px-6">
        <SectionHeading eyebrow="WHY CHEF-AI" title="Your kitchen, smarter." className="mb-14" />

        {/* Cards — the lead feature spans the full row instead of sitting
            in an equal three-column grid; the two supporting cards share
            the row below it. */}
        <motion.div
          variants={revealContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 gap-5"
        >
          {cards.map((card) => (
            <motion.div
              key={card.title}
              variants={revealItem}
              whileHover={{ y: -2, transition: { duration: 0.2, ease: EASE_OUT } }}
              className={`rounded-2xl p-7 flex gap-5 ${
                card.featured ? "md:col-span-2 flex-col md:flex-row md:items-center" : "flex-col"
              }`}
              style={
                card.featured
                  ? { backgroundColor: "var(--brand)" }
                  : {
                      backgroundColor: "var(--bg-card)",
                      border: "1px solid var(--border)",
                    }
              }
            >
              {/* Icon box */}
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                style={{
                  backgroundColor: card.featured ? "#ffffff1a" : "var(--accent-light)",
                  color: card.featured ? "#f5f6f1" : "var(--brand)",
                }}
              >
                <card.Icon size={20} />
              </div>

              {/* Title + description */}
              <div className="flex flex-col gap-2 flex-1">
                <h3
                  className="text-base font-semibold"
                  style={{ color: card.featured ? "#f5f6f1" : "var(--text-primary)" }}
                >
                  {card.title}
                </h3>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: card.featured ? "#c3c8ba" : "var(--text-secondary)" }}
                >
                  {card.description}
                </p>
              </div>

              {/* Most popular badge — only on featured card */}
              {card.featured && (
                <div className="shrink-0">
                  <span className="font-mono-ticket text-[10px] tracking-wider px-3 py-1 rounded-full bg-[#cdf23e] text-[#17180f] whitespace-nowrap">
                    MOST POPULAR
                  </span>
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
