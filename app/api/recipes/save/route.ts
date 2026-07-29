import { NextRequest, NextResponse } from 'next/server'
import { createApiClient } from '@/lib/supabase/api'
import type { Recipe } from '@/types/recipe'

const MACRO_FIELDS = ['calories', 'protein_g', 'carbs_g', 'fat_g', 'fiber_g', 'net_carbs_g'] as const

// Keep only known numeric macro fields — reject arbitrary jsonb payloads
function sanitizeMacros(input: unknown): Record<string, number> | null {
  if (typeof input !== 'object' || input === null || Array.isArray(input)) return null
  const out: Record<string, number> = {}
  for (const key of MACRO_FIELDS) {
    const value = (input as Record<string, unknown>)[key]
    if (typeof value === 'number' && Number.isFinite(value) && value >= 0 && value <= 100000) {
      out[key] = Math.round(value)
    }
  }
  return Object.keys(out).length > 0 ? out : null
}

export async function POST(request: NextRequest) {
  const supabase = await createApiClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: 'Authentication required.' }, { status: 401 })
  }

  let body: Record<string, unknown>
  try {
    body = await request.json() as Record<string, unknown>
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 })
  }

  if (typeof body.name !== 'string' || body.name.trim() === '') {
    return NextResponse.json({ error: 'name field is required.' }, { status: 400 })
  }
  if (
    !Array.isArray(body.ingredients) ||
    body.ingredients.length === 0 ||
    body.ingredients.length > 100 ||
    body.ingredients.some((i) => typeof i !== 'string' || i.length > 300)
  ) {
    return NextResponse.json(
      { error: 'ingredients must be a non-empty array of strings.' },
      { status: 400 }
    )
  }
  if (typeof body.instructions !== 'string' || body.instructions.trim() === '') {
    return NextResponse.json({ error: 'instructions field is required.' }, { status: 400 })
  }
  if (body.instructions.length > 20000) {
    return NextResponse.json({ error: 'instructions is too long.' }, { status: 400 })
  }

  const recipeName = body.name.trim().slice(0, 200)

  const { data, error } = await supabase
    .from('recipes')
    .insert({
      user_id: user.id,
      name: recipeName,
      ingredients: body.ingredients as string[],
      instructions: body.instructions.trim(),
      macros: sanitizeMacros(body.macros),
      diet_context: typeof body.diet_context === 'string' ? body.diet_context.slice(0, 500) : null,
      image_url: null,
      is_public: true,
    })
    .select()
    .single()

  if (error) {
    console.error('[POST /api/recipes/save]', error)
    return NextResponse.json({ error: 'Could not save recipe.' }, { status: 500 })
  }

  return NextResponse.json({ recipe: data as Recipe }, { status: 201 })
}
