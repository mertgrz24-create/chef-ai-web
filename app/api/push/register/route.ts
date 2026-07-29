import { NextRequest, NextResponse } from 'next/server'
import { createApiClient } from '@/lib/supabase/api'

// POST /api/push/register — store this device's Expo push token for the user.
export async function POST(request: NextRequest) {
  const supabase = await createApiClient()
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: 'Authentication required.' }, { status: 401 })
  }

  let token: string
  let platform: string | undefined
  try {
    const body = (await request.json()) as { token?: unknown; platform?: unknown }

    if (typeof body.token !== 'string' || !body.token.startsWith('ExponentPushToken')) {
      return NextResponse.json({ error: 'A valid Expo push token is required.' }, { status: 400 })
    }
    token = body.token
    platform =
      body.platform === 'ios' || body.platform === 'android' ? body.platform : undefined
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 })
  }

  // Upsert on the unique token: if this device was previously registered to
  // another account, the row moves to the current user.
  const { error } = await supabase
    .from('push_tokens')
    .upsert(
      { user_id: user.id, token, platform, updated_at: new Date().toISOString() },
      { onConflict: 'token' }
    )

  if (error) {
    console.error('[POST /api/push/register]', error)
    return NextResponse.json({ error: 'Could not register for notifications.' }, { status: 500 })
  }

  return NextResponse.json({ ok: true }, { status: 201 })
}
