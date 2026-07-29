import { NextRequest, NextResponse } from 'next/server'
import { createApiClient } from '@/lib/supabase/api'
import { generateRecipeWithGemini } from '@/lib/ai/gemini'

const FREE_MONTHLY_LIMIT = 10

type ProfileRow = {
  daily_calorie_goal: number | null
  protein_goal_g: number | null
  carbs_goal_g: number | null
  fat_goal_g: number | null
  water_goal_l: number | null
  diet_type: string | null
  is_premium: boolean
  recipe_count_this_month: number
  recipe_count_reset_at: string
}

function buildDietContext(profile: ProfileRow | null): string | undefined {
  if (!profile) return undefined
  const parts: string[] = []
  if (profile.daily_calorie_goal) parts.push(`daily calories ${profile.daily_calorie_goal} kcal`)
  if (profile.protein_goal_g) parts.push(`protein ${profile.protein_goal_g}g`)
  if (profile.carbs_goal_g) parts.push(`carbs ${profile.carbs_goal_g}g`)
  if (profile.fat_goal_g) parts.push(`fat ${profile.fat_goal_g}g`)
  if (profile.water_goal_l) parts.push(`water ${profile.water_goal_l} L`)
  if (profile.diet_type) parts.push(`diet type: ${profile.diet_type}`)
  if (parts.length === 0) return undefined
  return `My diet goals: ${parts.join(', ')}. Please suggest a recipe that fits these goals.`
}

function getMonthStart(): string {
  const now = new Date()
  return new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
}

export async function POST(request: NextRequest) {
  // 1. Parse body
  let ingredients: string[]
  try {
    const body = await request.json() as { ingredients?: unknown }
    if (
      !Array.isArray(body.ingredients) ||
      body.ingredients.length === 0 ||
      body.ingredients.length > 50 ||
      body.ingredients.some((i) => typeof i !== 'string' || i.length > 200)
    ) {
      return NextResponse.json(
        { error: 'ingredients must be a non-empty array of up to 50 strings (max 200 chars each).' },
        { status: 400 }
      )
    }
    // Drop blanks; bound the AI prompt cost
    ingredients = (body.ingredients as string[]).map((i) => i.trim()).filter(Boolean)
    if (ingredients.length === 0) {
      return NextResponse.json(
        { error: 'ingredients must contain at least one non-empty value.' },
        { status: 400 }
      )
    }
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 })
  }

  // 2. Auth check
  const supabase = await createApiClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: 'Authentication required.' }, { status: 401 })
  }

  // 3. Fetch profile (diet context + usage data)
  const { data: profileData } = await supabase
    .from('profiles')
    .select('daily_calorie_goal, protein_goal_g, carbs_goal_g, fat_goal_g, water_goal_l, diet_type, is_premium, recipe_count_this_month, recipe_count_reset_at')
    .eq('id', user.id)
    .single()

  const profile = profileData as ProfileRow | null

  // 4. Freemium limit check — atomic RPC first; legacy read-modify-write
  //    fallback until the 20260703 migration has been run manually
  let usedAtomicCredit = false
  let legacyCount = 0

  const { data: credit, error: creditError } = await supabase.rpc('consume_recipe_credit', {
    p_limit: FREE_MONTHLY_LIMIT,
  })

  if (!creditError && credit && typeof credit === 'object') {
    usedAtomicCredit = true
    if (!(credit as { allowed?: boolean }).allowed) {
      return NextResponse.json(
        {
          error: 'limit_reached',
          message: `You've used all ${FREE_MONTHLY_LIMIT} free recipes this month. Upgrade to Premium!`,
        },
        { status: 403 }
      )
    }
  } else {
    console.warn('[/api/recipes] consume_recipe_credit RPC unavailable, using legacy counter (run the 20260703 migration)')
    const monthStart = getMonthStart()
    legacyCount = profile?.recipe_count_this_month ?? 0

    // Reset counter if it's a new month
    if (profile && profile.recipe_count_reset_at < monthStart) {
      legacyCount = 0
      await supabase
        .from('profiles')
        .update({ recipe_count_this_month: 0, recipe_count_reset_at: new Date().toISOString() })
        .eq('id', user.id)
    }

    if (!profile?.is_premium && legacyCount >= FREE_MONTHLY_LIMIT) {
      return NextResponse.json(
        {
          error: 'limit_reached',
          message: `You've used all ${FREE_MONTHLY_LIMIT} free recipes this month. Upgrade to Premium!`,
        },
        { status: 403 }
      )
    }
  }

  // 5. Generate recipe
  const dietContext = buildDietContext(profile)

  let result: Awaited<ReturnType<typeof generateRecipeWithGemini>>
  try {
    result = await generateRecipeWithGemini(ingredients, dietContext)
  } catch (err) {
    console.error('[/api/recipes] Recipe generation error:', err)
    if (usedAtomicCredit) {
      // Give the consumed credit back (best-effort)
      await supabase.rpc('refund_recipe_credit')
    }
    return NextResponse.json(
      { error: 'Could not generate recipe. Please try again.' },
      { status: 500 }
    )
  }

  // 6. Legacy path only: increment usage counter (non-fatal)
  if (!usedAtomicCredit) {
    await supabase
      .from('profiles')
      .update({ recipe_count_this_month: legacyCount + 1 })
      .eq('id', user.id)
  }

  return NextResponse.json({
    recipe: result.text,
    structured: result.structured,
    macros: result.macros,
  })
}
