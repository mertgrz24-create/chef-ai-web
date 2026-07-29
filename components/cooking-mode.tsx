'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// ─── Helpers ────────────────────────────────────────────────────────────────

function parseSteps(raw: string): string[] {
  const lines = raw.split('\n').map((l) => l.trim()).filter(Boolean)

  // Numbered list: lines starting with "1." or "1)"
  const numbered = lines.filter((l) => /^\d+[.)]\s/.test(l))
  if (numbered.length >= 2) {
    return numbered.map((l) => l.replace(/^\d+[.)]\s*/, '').trim()).filter(Boolean)
  }

  // Use all non-empty lines if there are enough
  if (lines.length >= 2) return lines

  // Last resort: split on sentence boundary
  const bySentence = raw
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 6)
  return bySentence.length >= 2 ? bySentence : [raw.trim()]
}

function extractMinutes(text: string): number | null {
  let total = 0
  const hourMatch = text.match(/(\d+)\s*hours?/)
  const minMatch = text.match(/(\d+)\s*minutes?/)
  if (hourMatch) total += parseInt(hourMatch[1]) * 60
  if (minMatch) total += parseInt(minMatch[1])
  return total > 0 ? total : null
}

function fmtTime(s: number): string {
  const m = Math.floor(s / 60)
  const sec = s % 60
  return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`
}

// ─── Component ──────────────────────────────────────────────────────────────

interface CookingModeProps {
  recipeName: string
  instructions: string
  open: boolean
  onClose: () => void
}

const slideVariants = {
  enter: (dir: number) => ({ x: dir * 60, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir * -60, opacity: 0 }),
}

export function CookingMode({ recipeName, instructions, open, onClose }: CookingModeProps) {
  const steps = parseSteps(instructions)

  const [step, setStep] = useState(0)
  const [direction, setDirection] = useState<1 | -1>(1)

  // Timer state
  const [timerSeconds, setTimerSeconds] = useState(0)
  const [timerInitial, setTimerInitial] = useState(0)
  const [timerRunning, setTimerRunning] = useState(false)

  // Reset step when modal opens
  useEffect(() => {
    if (open) setStep(0)
  }, [open])

  // Detect timer in current step
  useEffect(() => {
    const mins = extractMinutes(steps[step] ?? '')
    if (mins !== null) {
      setTimerSeconds(mins * 60)
      setTimerInitial(mins * 60)
    } else {
      setTimerSeconds(0)
      setTimerInitial(0)
    }
    setTimerRunning(false)
  }, [step]) // eslint-disable-line react-hooks/exhaustive-deps

  // Countdown tick
  useEffect(() => {
    if (!timerRunning || timerSeconds <= 0) return
    const id = setInterval(() => {
      setTimerSeconds((s) => {
        if (s <= 1) { setTimerRunning(false); return 0 }
        return s - 1
      })
    }, 1000)
    return () => clearInterval(id)
  }, [timerRunning, timerSeconds])

  const goNext = useCallback(() => {
    if (step < steps.length - 1) { setDirection(1); setStep((s) => s + 1) }
  }, [step, steps.length])

  const goPrev = useCallback(() => {
    if (step > 0) { setDirection(-1); setStep((s) => s - 1) }
  }, [step])

  // Keyboard navigation
  useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'ArrowRight') goNext()
      else if (e.key === 'ArrowLeft') goPrev()
      else if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, goNext, goPrev, onClose])

  if (!open) return null

  const hasTimer = timerInitial > 0
  const isLast = step === steps.length - 1
  const isFirst = step === 0

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col bg-gray-950 text-white"
      style={{ overscrollBehavior: 'none' }}
    >
      {/* Top bar */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
        <div className="text-sm font-medium text-white/60 truncate max-w-[70%]">{recipeName}</div>
        <button
          type="button"
          onClick={onClose}
          className="flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-sm font-medium text-white/60 transition hover:bg-white/10 hover:text-white"
        >
          ✕ Close
        </button>
      </div>

      {/* Step counter */}
      <div className="px-5 pt-6 pb-2 text-center">
        <span className="text-xs font-semibold tracking-widest text-white/40 uppercase">
          Step {step + 1} / {steps.length}
        </span>
        {/* Progress bar */}
        <div className="mt-2 mx-auto max-w-xs h-1 rounded-full bg-white/10 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{
              width: `${((step + 1) / steps.length) * 100}%`,
              backgroundColor: '#ffa51f',
            }}
          />
        </div>
      </div>

      {/* Step content */}
      <div className="relative flex-1 overflow-hidden flex items-center justify-center px-6">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={step}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="w-full max-w-lg text-center"
          >
            {/* Big step number */}
            <div
              className="mb-6 text-7xl font-black tabular-nums"
              style={{ color: '#ffa51f', opacity: 0.15 }}
            >
              {step + 1}
            </div>

            {/* Step text */}
            <p className="text-xl font-medium leading-relaxed text-white sm:text-2xl">
              {steps[step]}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Timer (shown when step has time mention) */}
      {hasTimer && (
        <div className="mx-auto mb-4 flex flex-col items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-8 py-5 w-fit">
          <span
            className="text-4xl font-bold tabular-nums"
            style={{ color: timerSeconds === 0 ? '#22c55e' : '#ffa51f' }}
          >
            {timerSeconds === 0 ? '✓ Done!' : fmtTime(timerSeconds)}
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setTimerRunning((r) => !r)}
              disabled={timerSeconds === 0}
              className="rounded-xl px-4 py-2 text-sm font-semibold text-white transition disabled:opacity-40"
              style={{ backgroundColor: '#ffa51f' }}
            >
              {timerRunning ? '⏸ Pause' : '▶ Start'}
            </button>
            <button
              type="button"
              onClick={() => { setTimerSeconds(timerInitial); setTimerRunning(false) }}
              className="rounded-xl bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/20"
            >
              🔄 Reset
            </button>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center gap-3 px-5 pb-8 pt-2">
        <button
          type="button"
          onClick={goPrev}
          disabled={isFirst}
          className="flex-1 rounded-2xl border border-white/20 py-4 text-sm font-semibold text-white transition hover:bg-white/10 disabled:opacity-30"
        >
          ← Previous
        </button>

        {isLast ? (
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-2xl py-4 text-sm font-semibold text-white transition hover:opacity-90"
            style={{ backgroundColor: '#ffa51f' }}
          >
            🎉 Bon Appétit!
          </button>
        ) : (
          <button
            type="button"
            onClick={goNext}
            className="flex-1 rounded-2xl py-4 text-sm font-semibold text-white transition hover:opacity-90"
            style={{ backgroundColor: '#ffa51f' }}
          >
            Next →
          </button>
        )}
      </div>
    </div>
  )
}
