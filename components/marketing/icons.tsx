// Line-art icon set for the marketing site — replaces emoji glyphs, which
// are the single most recognizable "AI-generated landing page" tell.
// 1.5px stroke, currentColor, no fill — matches the mono/ticket restraint
// of the rest of the design system rather than competing with it.
//
// Paths are motion.path/motion.circle with the shared `iconDraw` variant so
// the stroke draws itself in once, propagated from whichever ancestor
// motion component (a reveal card, a step) transitions hidden -> visible —
// no local initial/animate needed here, Framer's variant context handles it.

import { motion } from 'framer-motion'
import { iconDraw } from '@/lib/motion'

type IconProps = {
  size?: number
  className?: string
}

const base = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}

export function CameraIcon({ size = 22, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} {...base}>
      <motion.path
        variants={iconDraw}
        d="M4 8.5a1.5 1.5 0 0 1 1.5-1.5h2.1l1-1.6A1.5 1.5 0 0 1 9.87 4.7h4.26a1.5 1.5 0 0 1 1.27.7l1 1.6h2.1A1.5 1.5 0 0 1 20 8.5v9A1.5 1.5 0 0 1 18.5 19h-13A1.5 1.5 0 0 1 4 17.5v-9Z"
      />
      <motion.circle variants={iconDraw} cx="12" cy="13" r="3.4" />
    </svg>
  )
}

export function SparkIcon({ size = 22, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} {...base}>
      <motion.path
        variants={iconDraw}
        d="M12 3.5c.5 3.2 1.7 4.9 4.5 5.5-2.8.6-4 2.3-4.5 5.5-.5-3.2-1.7-4.9-4.5-5.5 2.8-.6 4-2.3 4.5-5.5Z"
      />
      <motion.path
        variants={iconDraw}
        d="M18.5 14.5c.3 1.6.9 2.4 2.2 2.7-1.3.3-1.9 1.1-2.2 2.7-.3-1.6-.9-2.4-2.2-2.7 1.3-.3 1.9-1.1 2.2-2.7Z"
      />
    </svg>
  )
}

export function TimerIcon({ size = 22, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} {...base}>
      <motion.circle variants={iconDraw} cx="12" cy="13" r="7.5" />
      <motion.path variants={iconDraw} d="M12 9v4l2.6 1.5" />
      <motion.path variants={iconDraw} d="M9.5 3h5" />
    </svg>
  )
}

export function CheckIcon({ size = 22, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} {...base}>
      <motion.path variants={iconDraw} d="M5 12.5 9.5 17 19 6.5" />
    </svg>
  )
}

// A filled dot rather than a stroked shape — at list-bullet size (used
// inline at ~6px), an outlined circle would just look like a smudge.
export function DotIcon({ size = 6, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 8 8" className={className} aria-hidden="true">
      <circle cx="4" cy="4" r="4" fill="currentColor" />
    </svg>
  )
}

export function ChefHatIcon({ size = 22, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} {...base}>
      <motion.path variants={iconDraw} d="M7 20h10" />
      <motion.path variants={iconDraw} d="M7.5 20v-6.2" />
      <motion.path variants={iconDraw} d="M16.5 20v-6.2" />
      <motion.path
        variants={iconDraw}
        d="M6 10.5A3.3 3.3 0 0 1 8.6 4.9 3.8 3.8 0 0 1 12 3a3.8 3.8 0 0 1 3.4 1.9 3.3 3.3 0 0 1 2.6 5.6c.6.5 1 1.3 1 2.1a2.5 2.5 0 0 1-2.5 2.4H7.5A2.5 2.5 0 0 1 5 12.6c0-.8.4-1.6 1-2.1Z"
      />
    </svg>
  )
}
