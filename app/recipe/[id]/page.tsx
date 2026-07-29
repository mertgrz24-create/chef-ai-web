import { cache } from 'react'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { CookingModeButton } from '@/components/cooking-mode-button'
import { StoreBadges } from '@/components/marketing/store-badges'
import type { Recipe } from '@/types/recipe'

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    timeZone: 'America/New_York',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

// cache() dedupes the query between generateMetadata and the page render
const getPublicRecipe = cache(async (id: string): Promise<Recipe | null> => {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('recipes')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !data) return null
  const recipe = data as Recipe
  return recipe.is_public ? recipe : null
})

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const recipe = await getPublicRecipe(id)
  if (!recipe) return { title: 'Recipe not found — Chef-AI' }

  const ingredientPreview = recipe.ingredients.slice(0, 5).join(', ')
  const description = `${ingredientPreview}${recipe.ingredients.length > 5 ? '…' : ''}${
    recipe.macros ? ` · ${recipe.macros.calories} kcal per serving` : ''
  } · Made with Chef-AI`

  return {
    title: `${recipe.name} — Chef-AI`,
    description,
    openGraph: {
      title: recipe.name,
      description,
      type: 'article',
      siteName: 'Chef-AI',
      ...(recipe.image_url && { images: [{ url: recipe.image_url }] }),
    },
    twitter: {
      card: recipe.image_url ? 'summary_large_image' : 'summary',
      title: recipe.name,
      description,
    },
  }
}

export default async function PublicRecipePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const recipe = await getPublicRecipe(id)
  if (!recipe) notFound()

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      {/* Header */}
      <header className="border-b border-[var(--border)] bg-[var(--bg-card)] px-4 py-4">
        <div className="mx-auto flex max-w-2xl items-center justify-between">
          <Link href="/" className="text-xl font-bold" style={{ color: '#ffa51f' }}>
            ChefAI
          </Link>
          <Link href="/" className="text-sm text-[var(--text-muted)] transition hover:text-[var(--text-secondary)]">
            What is ChefAI? →
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-2xl px-4 py-8">
        <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] shadow-sm">
          <div className="p-6">
            <h1 className="mb-1 text-2xl font-bold text-[var(--text-primary)]">{recipe.name}</h1>
            <p className="mb-6 text-xs text-[var(--text-muted)]">{formatDate(recipe.created_at)}</p>

            {/* Ingredients */}
            <div className="mb-6">
              <h2 className="mb-3 flex items-center gap-2 text-base font-semibold text-[var(--text-primary)]">
                <span>📝</span> Ingredients
              </h2>
              <ul className="space-y-1.5">
                {recipe.ingredients.map((ing, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-[var(--text-secondary)]">
                    <span
                      className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full"
                      style={{ backgroundColor: '#ffa51f' }}
                    />
                    {ing}
                  </li>
                ))}
              </ul>
            </div>

            {/* Instructions */}
            <div className="mb-6">
              <h2 className="mb-3 flex items-center gap-2 text-base font-semibold text-[var(--text-primary)]">
                <span>👨‍🍳</span> Instructions
              </h2>
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-[var(--text-secondary)]">
                {recipe.instructions}
              </p>
            </div>

            {/* Macros */}
            {recipe.macros && (
              <div className="mb-6 flex flex-wrap gap-x-4 gap-y-1 rounded-xl border border-[var(--accent-border)] bg-[var(--accent-light)] px-4 py-3 text-xs text-[var(--text-secondary)]">
                <span>🔥 <span className="font-semibold text-[var(--text-primary)]">{recipe.macros.calories} kcal</span></span>
                <span>💪 <span className="font-semibold text-[var(--text-primary)]">{recipe.macros.protein_g}g</span> protein</span>
                <span>🍚 <span className="font-semibold text-[var(--text-primary)]">{recipe.macros.carbs_g}g</span> carbs</span>
                <span>🧈 <span className="font-semibold text-[var(--text-primary)]">{recipe.macros.fat_g}g</span> fat</span>
              </div>
            )}

            {/* Cooking mode is entirely client-side — it needs no account, which
                makes it the best thing a visitor can actually try here. */}
            <div className="mb-6 flex flex-wrap gap-2">
              <CookingModeButton
                recipeName={recipe.name}
                instructions={recipe.instructions}
              />
            </div>

            {/* Saving, eating and tweaking recipes all live in the app now. */}
            <div className="rounded-xl border border-[var(--border)] bg-[var(--bg)] p-5">
              <p className="text-sm font-semibold text-[var(--text-primary)]">
                Get a recipe like this from your own fridge
              </p>
              <p className="mt-1 mb-4 text-xs leading-relaxed text-[var(--text-muted)]">
                Snap a photo of what you have. ChefAI does the rest — and tracks what&apos;s
                about to go bad.
              </p>
              <StoreBadges tone="light" size="compact" />
            </div>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-[var(--text-muted)]">
          This recipe was created with{' '}
          <Link href="/" className="font-medium hover:underline" style={{ color: '#ffa51f' }}>
            ChefAI
          </Link>
        </p>
      </main>
    </div>
  )
}
