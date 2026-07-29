import { NextRequest, NextResponse } from 'next/server'
import { createApiClient } from '@/lib/supabase/api'
import type { Recipe } from '@/types/recipe'

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

// GET /api/recipes/[id] — public endpoint, returns recipe if is_public = true
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  // Reject malformed ids before hitting the DB — a non-uuid otherwise
  // raises Postgres 22P02 and surfaces as a noisy 500
  if (!UUID_RE.test(id)) {
    return NextResponse.json({ error: 'Recipe not found.' }, { status: 404 })
  }

  const supabase = await createApiClient()

  // Explicit public columns only — never expose owner user_id or diet_context
  const { data, error } = await supabase
    .from('recipes')
    .select('id, name, ingredients, instructions, macros, image_url, is_public, created_at')
    .eq('id', id)
    .single()

  if (error) {
    // PGRST116 = no row; 22P02 = invalid uuid — both mean "not found"
    if (error.code === 'PGRST116' || error.code === '22P02') {
      return NextResponse.json({ error: 'Recipe not found.' }, { status: 404 })
    }
    console.error('[GET /api/recipes/[id]]', error)
    return NextResponse.json({ error: 'Could not fetch recipe.' }, { status: 500 })
  }

  const recipe = data as Recipe

  if (!recipe.is_public) {
    return NextResponse.json({ error: 'Recipe not found.' }, { status: 404 })
  }

  return NextResponse.json({ recipe })
}
