"use client";

import { useRef } from "react";
import {
  motion,
  useMotionTemplate,
  useScroll,
  useSpring,
  useTransform,
  type Variants,
} from "framer-motion";
import { StoreBadges } from "@/components/marketing/store-badges";
import { revealContainer as container, revealItem as item, EASE_OUT } from "@/lib/motion";

// Subtle scroll parallax on the ticket — decorative, so a spring (not a
// direct 1:1 scroll tie) gives it weight instead of feeling glued to the
// scrollbar. Kept on its own element so it never fights the entrance
// animation's own transform on the wrapping motion.div.
function useTicketParallax() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const ySpring = useSpring(useTransform(scrollYProgress, [0, 1], [0, -36]), {
    stiffness: 120,
    damping: 22,
    mass: 0.4,
  });
  const rotateSpring = useSpring(useTransform(scrollYProgress, [0, 1], [0, -2]), {
    stiffness: 120,
    damping: 22,
    mass: 0.4,
  });
  // A literal transform string, not x/y/rotate props — Framer Motion's
  // shorthand transform props aren't hardware-accelerated.
  const transform = useMotionTemplate`translateY(${ySpring}px) rotate(${rotateSpring}deg)`;
  return { ref, transform };
}

// The ticket "prints" in — one orchestrated moment, kept restrained.
const ticketVariant: Variants = {
  hidden: { opacity: 0, y: 28, rotate: -1.5 },
  visible: {
    opacity: 1,
    y: 0,
    rotate: -1.5,
    transition: { duration: 0.65, ease: EASE_OUT, delay: 0.2 },
  },
};

// What you have — the raw input. Mono labels, like pantry tags.
const pantry = ["spinach", "chicken", "garlic", "rice", "lemon"];

// What you get — the fired ticket.
const ticketIngredients = [
  "2 chicken breasts",
  "3 cups spinach",
  "4 garlic cloves",
  "1 cup jasmine rice",
];

function RecipeTicket() {
  return (
    <div className="relative w-full max-w-[340px] font-mono-ticket">
      {/* subtle stacked paper behind, for depth */}
      <div
        className="absolute inset-0 translate-x-2 translate-y-2 rounded-[14px] bg-black/20"
        aria-hidden
      />
      <div className="ticket-edge shadow-brand relative rounded-[14px] bg-white text-[#17180f] overflow-hidden">
        {/* Ticket header — ink bar */}
        <div className="bg-[#17180f] text-[#f5f6f1] px-4 py-2.5 flex items-center justify-between text-[11px] tracking-widest">
          <span>ORDER #0428</span>
          <span className="text-[#cdf23e]">⏱ 35 MIN</span>
        </div>

        <div className="px-5 pt-4 pb-5">
          <span className="text-[10px] tracking-[0.2em] text-[#1e3a2f] font-bold">
            TONIGHT&apos;S PICK
          </span>
          <h3 className="font-display text-[26px] leading-[1.05] mt-1.5 mb-3">
            Garlic Chicken
            <br />& Spinach Rice
          </h3>

          {/* ingredient checklist */}
          <ul className="flex flex-col gap-1.5 text-[12px] text-[#4a4e42]">
            {ticketIngredients.map((line) => (
              <li key={line} className="flex items-center gap-2">
                <span className="text-[#1e3a2f]">▪</span>
                {line}
              </li>
            ))}
          </ul>

          {/* perforated divider */}
          <div className="my-4 border-t border-dashed border-[#cbcdc2]" />

          {/* macros — mono data row */}
          <div className="flex justify-between text-[11px] text-[#8a8e80] mb-4">
            <span>520 KCAL</span>
            <span>42 P</span>
            <span>48 C</span>
            <span>14 F</span>
          </div>

          <div className="bg-[#cdf23e] text-[#17180f] text-center text-[12px] font-bold tracking-wide py-2.5 rounded-md">
            VIEW RECIPE →
          </div>
        </div>
      </div>
    </div>
  );
}

export function Hero() {
  const { ref: parallaxRef, transform: ticketTransform } = useTicketParallax();

  return (
    <section className="paper-grain bg-[#1e3a2f] text-[#f5f6f1]">
      <div className="max-w-6xl mx-auto px-6 py-20 md:py-28 grid md:grid-cols-[1.1fr_0.9fr] md:gap-14 items-center">
        {/* Left — the thesis */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="visible"
          className="flex flex-col gap-6"
        >
          {/* eyebrow — honest category label, in mono */}
          <motion.div variants={item}>
            <span className="font-mono-ticket text-[11px] tracking-[0.2em] text-[#cdf23e]">
              AI KITCHEN DECISION ENGINE
            </span>
          </motion.div>

          {/* headline — the thesis, display face */}
          <motion.h1
            variants={item}
            className="font-display text-[38px] md:text-[52px] leading-[1.02] font-semibold"
          >
            Tonight&apos;s dinner is
            <br />
            already in your{" "}
            <span className="text-[#cdf23e]">fridge.</span>
          </motion.h1>

          {/* subtitle — plain, from the user's side */}
          <motion.p
            variants={item}
            className="text-[15px] md:text-base max-w-[440px] text-[#c3c8ba] leading-relaxed"
          >
            Snap what you&apos;ve got. Chef-AI reads your ingredients and fires
            back a recipe you can actually make — no shopping trip, no wasted
            food.
          </motion.p>

          {/* CTAs */}
          <motion.div variants={item} className="flex flex-col gap-3 mt-1">
            <StoreBadges />
            <a
              href="#how-it-works"
              className="self-start px-7 py-3 rounded-full text-sm font-medium border border-[#f5f6f1]/25 text-[#f5f6f1] transition-[transform,background-color] duration-150 ease-out active:scale-[0.97] [@media(hover:hover)]:hover:bg-white/5"
            >
              See how it works
            </a>
          </motion.div>

          {/* the raw input — pantry tags */}
          <motion.div variants={item} className="mt-3">
            <p className="font-mono-ticket text-[10px] tracking-[0.18em] text-[#8fa093] mb-2.5">
              IN YOUR PANTRY
            </p>
            <div className="flex flex-wrap gap-2">
              {pantry.map((ing) => (
                <span
                  key={ing}
                  className="font-mono-ticket text-[12px] px-3 py-1 rounded-full border border-[#f5f6f1]/20 text-[#e4e8dd]"
                >
                  {ing}
                </span>
              ))}
              <span className="font-mono-ticket text-[12px] px-3 py-1 rounded-full bg-[#f5f6f1]/10 text-[#cdf23e]">
                +6
              </span>
            </div>
          </motion.div>
        </motion.div>

        {/* Right — the fired ticket */}
        <motion.div
          ref={parallaxRef}
          variants={ticketVariant}
          initial="hidden"
          animate="visible"
          className="hidden md:flex justify-center items-center"
        >
          {/* Separate element for scroll parallax so its `transform` string
              never competes with the entrance variant's own transform. */}
          <motion.div style={{ transform: ticketTransform }}>
            <RecipeTicket />
          </motion.div>
        </motion.div>
      </div>

      {/* Torn edge — the ticket motif carried past the Hero card itself,
          so the section boundary reads as torn paper instead of a flat
          color cut into Features below. */}
      <div className="ticket-tear h-4 w-full bg-[#1e3a2f]" aria-hidden="true" />
    </section>
  );
}
