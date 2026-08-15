import type { Variants } from 'framer-motion'

/**
 * Shared motion vocabulary for the marketing site — one motion language
 * instead of five components each re-deriving their own fade-up.
 *
 * Curves are Emil Kowalski's strong custom eases (animations.dev): the
 * browser's built-in `easeOut` is too weak to feel intentional.
 */
export const EASE_OUT = [0.23, 1, 0.32, 1] as const
export const EASE_IN_OUT = [0.77, 0, 0.175, 1] as const

// Marketing reveals are explanatory, not frequent UI — allowed to run a
// touch longer than the <300ms rule for repeatedly-seen controls, but the
// strong easing keeps it feeling sharp rather than lazy.
const REVEAL_DURATION = 0.45

// Short stagger: long gaps between cascading items (0.15-0.2s) read as
// slow. 60ms keeps the cascade feeling like one continuous motion.
const STAGGER = 0.06

export const revealContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: STAGGER, delayChildren: 0.04 } },
}

export const revealItem: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: REVEAL_DURATION, ease: EASE_OUT },
  },
}

// Section headings get two sequential beats — eyebrow, then title — instead
// of fading in as one indistinguishable block. The small delay is what makes
// it read as two moments rather than a single blob moving together.
export const headingEyebrow: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: EASE_OUT },
  },
}

export const headingTitle: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: EASE_OUT, delay: 0.08 },
  },
}

export const headingContainer: Variants = {
  hidden: {},
  visible: { transition: { delayChildren: 0.02 } },
}

// Line-art icon stroke draw-in — plays once as the icon enters view. Only
// meaningful because the icon set (components/marketing/icons.tsx) is
// stroke-only; a filled icon wouldn't show anything animating.
export const iconDraw: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: { duration: 0.55, ease: EASE_IN_OUT },
  },
}
