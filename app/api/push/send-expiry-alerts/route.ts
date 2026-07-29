import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

const EXPO_PUSH_URL = 'https://exp.host/--/api/v2/push/send'

// Tomorrow's date in America/New_York (the app's day boundary), as YYYY-MM-DD.
// Notifying the day before expiry means each item triggers exactly one alert.
function tomorrowET(): string {
  const now = new Date()
  const et = new Date(now.toLocaleString('en-US', { timeZone: 'America/New_York' }))
  et.setDate(et.getDate() + 1)
  return et.toISOString().slice(0, 10)
}

type PantryRow = { user_id: string; name: string }
type TokenRow = { user_id: string; token: string }
type ExpoMessage = { to: string; title: string; body: string; sound: 'default' }

/**
 * POST /api/push/send-expiry-alerts — cron-only.
 *
 * Protected by CRON_SECRET (Vercel Cron sends it as a bearer token); never
 * user-authenticated. Reads every user's pantry with the service role, so the
 * secret gate is the only thing standing in front of that — keep it set.
 */
export async function POST(request: NextRequest) {
  if (!process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'CRON_SECRET is not configured.' }, { status: 500 })
  }
  if (request.headers.get('authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })
  }

  const supabase = createAdminClient()
  const target = tomorrowET()

  // Items expiring tomorrow, across all users.
  const { data: expiring, error: pantryError } = await supabase
    .from('pantry')
    .select('user_id, name')
    .eq('expiry_date', target)

  if (pantryError) {
    console.error('[send-expiry-alerts] pantry query', pantryError)
    return NextResponse.json({ error: 'Query failed.' }, { status: 500 })
  }
  if (!expiring || expiring.length === 0) {
    return NextResponse.json({ sent: 0, users: 0 })
  }

  // Group item names by user.
  const byUser = new Map<string, string[]>()
  for (const row of expiring as PantryRow[]) {
    const list = byUser.get(row.user_id) ?? []
    list.push(row.name)
    byUser.set(row.user_id, list)
  }

  // Fetch push tokens for exactly those users.
  const userIds = [...byUser.keys()]
  const { data: tokens, error: tokenError } = await supabase
    .from('push_tokens')
    .select('user_id, token')
    .in('user_id', userIds)

  if (tokenError) {
    console.error('[send-expiry-alerts] token query', tokenError)
    return NextResponse.json({ error: 'Query failed.' }, { status: 500 })
  }

  // Build one message per device token.
  const messages: ExpoMessage[] = []
  for (const { user_id, token } of (tokens ?? []) as TokenRow[]) {
    const items = byUser.get(user_id)
    if (!items || items.length === 0) continue
    const list = items.slice(0, 3).join(', ')
    const more = items.length > 3 ? ` +${items.length - 3} more` : ''
    messages.push({
      to: token,
      title: items.length === 1 ? 'Something expires tomorrow' : `${items.length} items expire tomorrow`,
      body: `Cook ${list}${more} before it goes to waste.`,
      sound: 'default',
    })
  }

  if (messages.length === 0) {
    return NextResponse.json({ sent: 0, users: byUser.size })
  }

  // Expo accepts up to 100 messages per request.
  let sent = 0
  for (let i = 0; i < messages.length; i += 100) {
    const batch = messages.slice(i, i + 100)
    try {
      const res = await fetch(EXPO_PUSH_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(batch),
      })
      if (res.ok) sent += batch.length
      else console.error('[send-expiry-alerts] expo push', res.status, await res.text())
    } catch (err) {
      console.error('[send-expiry-alerts] expo push fetch', err)
    }
  }

  return NextResponse.json({ sent, users: byUser.size, target })
}
