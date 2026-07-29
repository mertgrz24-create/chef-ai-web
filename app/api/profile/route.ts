import { NextRequest, NextResponse } from 'next/server'
import { createApiClient } from '@/lib/supabase/api'
import { customAlphabet } from 'nanoid'
import type { Profile } from '@/types/profile'

const genCode = customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', 6)

const NUMERIC_FIELD_LIST = [
  'daily_calorie_goal', 'protein_goal_g', 'carbs_goal_g', 'fat_goal_g',
  'water_goal_l',
]

const NUMERIC_FIELDS = new Set<string>(NUMERIC_FIELD_LIST)
const ALLOWED_FIELDS = new Set<string>([...NUMERIC_FIELD_LIST, 'diet_type'])

// GET /api/profile — fetch current user's profile
export async function GET() {
  const supabase = await createApiClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: 'Authentication required.' }, { status: 401 })
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      return NextResponse.json({ error: 'Profile not found.' }, { status: 404 })
    }
    console.error('[GET /api/profile]', error)
    return NextResponse.json({ error: 'Could not fetch profile.' }, { status: 500 })
  }

  const profile = data as Profile

  // Auto-generate referral_code if missing
  if (!profile.referral_code) {
    const referral_code = `CHEF-${genCode()}`
    const { data: updated } = await supabase
      .from('profiles')
      .update({ referral_code })
      .eq('id', user.id)
      .select()
      .single()
    if (updated) return NextResponse.json({ profile: updated as Profile })
  }

  return NextResponse.json({ profile })
}

// PUT /api/profile — update current user's profile
export async function PUT(request: NextRequest) {
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

  const now = new Date().toISOString()
  const patch: Record<string, unknown> = { updated_at: now, goals_updated_at: now }

  for (const [key, value] of Object.entries(body)) {
    if (!ALLOWED_FIELDS.has(key)) continue

    if (NUMERIC_FIELDS.has(key)) {
      if (value !== null && (typeof value !== 'number' || value <= 0)) {
        return NextResponse.json(
          { error: `${key} must be null or a positive number.` },
          { status: 400 }
        )
      }
    } else {
      if (value !== null && typeof value !== 'string') {
        return NextResponse.json(
          { error: `${key} must be a string or null.` },
          { status: 400 }
        )
      }
      if (typeof value === 'string' && value.length > 120) {
        return NextResponse.json(
          { error: `${key} must be at most 120 characters.` },
          { status: 400 }
        )
      }
    }

    patch[key] = typeof value === 'string' ? value.trim() : value
  }

  const { data, error } = await supabase
    .from('profiles')
    .update(patch)
    .eq('id', user.id)
    .select()
    .single()

  if (error) {
    console.error('[PUT /api/profile]', error)
    return NextResponse.json({ error: 'Could not update profile.' }, { status: 500 })
  }

  return NextResponse.json({ profile: data as Profile })
}
