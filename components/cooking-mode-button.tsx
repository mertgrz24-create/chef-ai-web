'use client'

import { useState } from 'react'
import { CookingMode } from '@/components/cooking-mode'
import { ChefHatIcon } from '@/components/marketing/icons'

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
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--bg)] py-3 text-sm font-semibold text-[var(--text-secondary)] transition-[transform,border-color,color] duration-150 ease-out active:scale-[0.98] [@media(hover:hover)]:hover:border-[var(--brand)] [@media(hover:hover)]:hover:text-[var(--brand)]"
      >
        <ChefHatIcon size={16} />
        Start Cooking
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
