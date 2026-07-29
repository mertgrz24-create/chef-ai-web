'use client'

import { useState } from 'react'
import { CookingMode } from '@/components/cooking-mode'

interface CookingModeButtonProps {
  recipeName: string
  instructions: string
}

export function CookingModeButton({ recipeName, instructions }: CookingModeButtonProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--bg)] py-3 text-sm font-semibold text-[var(--text-secondary)] transition hover:border-amber-300 hover:text-amber-600 dark:hover:text-amber-400"
      >
        👨‍🍳 Start Cooking
      </button>

      <CookingMode
        recipeName={recipeName}
        instructions={instructions}
        open={open}
        onClose={() => setOpen(false)}
      />
    </>
  )
}
