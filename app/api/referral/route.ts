import { NextRequest, NextResponse } from 'next/server'
import { createApiClient } from '@/lib/supabase/api'

const STATUS_RESPONSES: Record<string, { error: string; status: number }> = {
  unauthenticated: { error: 'Authentication required.', status: 401 },
  no_profile: { error: 'Profile not found.', status: 404 },
  already_referred: { error: 'You have already used a referral code.', status: 409 },
  self_referral: { error: 'You cannot use your own referral code.', status: 400 },
  invalid_code: { error: 'Invalid referral code.', status: 404 },
}

// POST /api/referral — apply a referral code to the current user's profile
export async function POST(request: NextRequest) {
  const supabase = await createApiClient()
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: 'Authentication required.' }, { status: 401 })
  }

  let code: string
  try {
    const body = await request.json() as { code?: unknown }
    if (typeof body.code !== 'string' || body.code.trim() === '' || body.code.length > 20) {
      return NextResponse.json({ error: 'code field is required.' }, { status: 400 })
    }
    code = body.code.trim().toUpperCase()
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 })
  }

  // Referral touches another user's row, which own-row RLS forbids for
  // direct queries — the SECURITY DEFINER RPC does everything atomically.
  const { data, error } = await supabase.rpc('apply_referral', { p_code: code })

  if (error) {
    console.error('[POST /api/referral] RPC error (has the 20260703 migration been run?):', error)
    return NextResponse.json(
      { error: 'Referral could not be applied. Please try again later.' },
      { status: 500 }
    )
  }

  const status = (data as { status?: string } | null)?.status ?? 'unknown'

  if (status === 'ok') {
    return NextResponse.json({ success: true })
  }

  const mapped = STATUS_RESPONSES[status]
  if (mapped) {
    return NextResponse.json({ error: mapped.error }, { status: mapped.status })
  }

  console.error('[POST /api/referral] Unexpected RPC status:', status)
  return NextResponse.json({ error: 'Referral could not be applied.' }, { status: 500 })
}
