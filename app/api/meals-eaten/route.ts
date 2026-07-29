import { NextRequest, NextResponse } from 'next/server'
import { createApiClient } from '@/lib/supabase/api'
import type { MealEaten, DailyTotals } from '@/types/meals-eaten'

const USER_TIMEZONE = 'America/New_York' // TODO: per-user timezone once profiles store it

// UTC instant of today's midnight in the user's timezone
function getTodayStart(): string {
  const now = new Date()
  const wallClock = new Date(now.toLocaleString('en-US', { timeZone: USER_TIMEZONE }))
  const msSinceMidnight =
    wallClock.getHours() * 3600_000 +
    wallClock.getMinutes() * 60_000 +
    wallClock.getSeconds() * 1000
  return new Date(now.getTime() - msSinceMidnight).toISOString()
}

const VALID_SOURCES = new Set(['manual', 'meal_plan', 'recipe'])

// Accept only finite, non-negative, sane macro values
function sanitizeMacro(value: unknown): number | undefined {
  if (typeof value !== 'number' || !Number.isFinite(value)) return undefined
  const rounded = Math.round(value)
  if (rounded < 0 || rounded > 100000) return undefined
  return rounded
}

// GET /api/meals-eaten — today's records + totals
export async function GET() {
  const supabase = await createApiClient()
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: 'Authentication required.' }, { status: 401 })
  }

  const { data, error } = await supabase
    .from('meals_eaten')
    .select('*')
    .eq('user_id', user.id)
    .gte('eaten_at', getTodayStart())
    .order('eaten_at', { ascending: false })

  if (error) {
    console.error('[GET /api/meals-eaten]', error)
    return NextResponse.json({ error: 'Could not fetch records.' }, { status: 500 })
  }

  const meals = (data ?? []) as MealEaten[]

  const totals: DailyTotals = meals.reduce(
    (acc, m) => ({
      calories: acc.calories + (m.calories ?? 0),
      protein_g: acc.protein_g + (m.protein_g ?? 0),
      carbs_g: acc.carbs_g + (m.carbs_g ?? 0),
      fat_g: acc.fat_g + (m.fat_g ?? 0),
    }),
    { calories: 0, protein_g: 0, carbs_g: 0, fat_g: 0 }
  )

  return NextResponse.json({ meals, totals })
}

// POST /api/meals-eaten — log a new meal
export async function POST(request: NextRequest) {
  const supabase = await createApiClient()
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: 'Authentication required.' }, { status: 401 })
  }

  let recipe_name: string
  let calories: number | undefined
  let protein_g: number | undefined
  let carbs_g: number | undefined
  let fat_g: number | undefined
  let source: string | undefined

  try {
    const body = await request.json() as {
      recipe_name?: unknown
      calories?: unknown
      protein_g?: unknown
      carbs_g?: unknown
      fat_g?: unknown
      source?: unknown
    }

    if (typeof body.recipe_name !== 'string' || body.recipe_name.trim() === '') {
      return NextResponse.json({ error: 'recipe_name field is required.' }, { status: 400 })
    }

    recipe_name = body.recipe_name.trim().slice(0, 200)
    calories = sanitizeMacro(body.calories)
    protein_g = sanitizeMacro(body.protein_g)
    carbs_g = sanitizeMacro(body.carbs_g)
    fat_g = sanitizeMacro(body.fat_g)
    source =
      typeof body.source === 'string' && VALID_SOURCES.has(body.source)
        ? body.source
        : 'manual'
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('meals_eaten')
    .insert({ user_id: user.id, recipe_name, calories, protein_g, carbs_g, fat_g, source })
    .select('*')
    .single()

  if (error) {
    console.error('[POST /api/meals-eaten]', error)
    return NextResponse.json({ error: 'Could not log meal.' }, { status: 500 })
  }

  return NextResponse.json({ meal: data as MealEaten }, { status: 201 })
}
