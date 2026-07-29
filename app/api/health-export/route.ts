import { NextResponse } from 'next/server'
import { createApiClient } from '@/lib/supabase/api'
import type { MealEaten } from '@/types/meals-eaten'

type DailyEntry = {
  date: string
  calories: number
  protein_g: number
  carbs_g: number
  fat_g: number
}

export async function GET() {
  const supabase = await createApiClient()
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: 'Authentication required.' }, { status: 401 })
  }

  const since = new Date()
  since.setDate(since.getDate() - 30)

  const { data, error } = await supabase
    .from('meals_eaten')
    .select('calories, protein_g, carbs_g, fat_g, eaten_at')
    .eq('user_id', user.id)
    .gte('eaten_at', since.toISOString())
    .order('eaten_at', { ascending: true })

  if (error) {
    console.error('[GET /api/health-export]', error)
    return NextResponse.json({ error: 'Could not fetch data.' }, { status: 500 })
  }

  const meals = (data ?? []) as Pick<MealEaten, 'calories' | 'protein_g' | 'carbs_g' | 'fat_g' | 'eaten_at'>[]

  // Group by date and sum
  const byDate = new Map<string, DailyEntry>()

  for (const meal of meals) {
    const date = meal.eaten_at.split('T')[0]
    const existing = byDate.get(date) ?? { date, calories: 0, protein_g: 0, carbs_g: 0, fat_g: 0 }
    byDate.set(date, {
      date,
      calories: existing.calories + (meal.calories ?? 0),
      protein_g: existing.protein_g + (meal.protein_g ?? 0),
      carbs_g: existing.carbs_g + (meal.carbs_g ?? 0),
      fat_g: existing.fat_g + (meal.fat_g ?? 0),
    })
  }

  const exports = Array.from(byDate.values()).sort((a, b) => a.date.localeCompare(b.date))

  return NextResponse.json({ exports })
}
