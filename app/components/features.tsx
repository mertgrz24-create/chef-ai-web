"use client";

import { motion, type Variants } from "framer-motion";

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const cardVariant: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const cards = [
  {
    icon: "📷",
    title: "Visual Pantry",
    description: "Snap your fridge and let AI identify every ingredient — no typing.",
    featured: false,
  },
  {
    icon: "✨",
    title: "Smart Recipes",
    description: "Get personalized recipes from what you already have, in seconds.",
    featured: true,
  },
  {
    icon: "⏰",
    title: "Zero Waste",
    description: "Alerts for expiring items — cook before you toss, save money.",
    featured: false,
  },
];

export function Features() {
  return (
    <section id="features" className="py-20 md:py-28 bg-[var(--bg-card)]">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mb-14"
        >
          <p className="font-mono-ticket text-[11px] tracking-[0.2em] text-[var(--brand)] mb-3">
            WHY CHEF-AI
          </p>
          <h2 className="font-display text-3xl md:text-[42px] font-semibold text-[var(--text-primary)]">
            Your kitchen, smarter.
          </h2>
        </motion.div>

        {/* Cards */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-5"
        >
          {cards.map((card) => (
            <motion.div
              key={card.title}
              variants={cardVariant}
              className="rounded-2xl p-7 flex flex-col gap-5"
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
                className="w-11 h-11 rounded-xl flex items-center justify-center text-xl"
                style={{
                  backgroundColor: card.featured ? "#ffffff1a" : "var(--accent-light)",
                }}
              >
                {card.icon}
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
                <div>
                  <span className="font-mono-ticket text-[10px] tracking-wider px-3 py-1 rounded-full bg-[#cdf23e] text-[#17180f]">
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
