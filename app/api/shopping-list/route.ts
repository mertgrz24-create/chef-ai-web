import { NextResponse } from 'next/server'
import { createApiClient } from '@/lib/supabase/api'
import { getWeekStartDate } from '@/lib/date'
import type { MealPlanDay } from '@/types/meal-plan'

export async function GET() {
  const supabase = await createApiClient()
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: 'Authentication required.' }, { status: 401 })
  }

  const week_start_date = getWeekStartDate()

  // Fetch this week's meal plan
  const { data: planData } = await supabase
    .from('meal_plans')
    .select('meals')
    .eq('user_id', user.id)
    .eq('week_start_date', week_start_date)
    .single()

  if (!planData) {
    return NextResponse.json({
      items: [],
      fromPlan: false,
      generatedAt: new Date().toISOString(),
    })
  }

  const meals = planData.meals as MealPlanDay[]

  // Collect all ingredients from all meals
  const allIngredients = meals.flatMap((day) => [
    ...day.breakfast.ingredients,
    ...day.dinner.ingredients,
  ])

  // Deduplicate (preserve casing of first occurrence)
  const seen = new Set<string>()
  const unique: string[] = []
  for (const ing of allIngredients) {
    const key = ing.toLowerCase().trim()
    if (!seen.has(key)) {
      seen.add(key)
      unique.push(ing.trim())
    }
  }

  // Fetch pantry items to subtract
  const { data: pantryData } = await supabase
    .from('pantry')
    .select('name')
    .eq('user_id', user.id)

  const pantryNames = new Set(
    (pantryData ?? []).map((p: { name: string }) => p.name.toLowerCase().trim())
  )

  // Filter: remove exact case-insensitive matches
  const filtered = unique.filter((ing) => !pantryNames.has(ing.toLowerCase().trim()))

  const sorted = filtered.sort((a, b) => a.localeCompare(b, 'en'))

  return NextResponse.json({
    items: sorted,
    fromPlan: true,
    generatedAt: new Date().toISOString(),
  })
}
