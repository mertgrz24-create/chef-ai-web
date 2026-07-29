import { NextRequest, NextResponse } from 'next/server'
import { createApiClient } from '@/lib/supabase/api'

// GET /api/pantry — list all pantry items for the current user
export async function GET() {
  const supabase = await createApiClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: 'Authentication required.' }, { status: 401 })
  }

  const { data, error } = await supabase
    .from('pantry')
    .select('id, name, expiry_date, quantity, created_at')
    .eq('user_id', user.id)
    .order('expiry_date', { ascending: true })

  if (error) {
    console.error('[GET /api/pantry]', error)
    return NextResponse.json({ error: 'Could not fetch ingredients.' }, { status: 500 })
  }

  return NextResponse.json({ items: data })
}

// POST /api/pantry — add a new pantry item
export async function POST(request: NextRequest) {
  const supabase = await createApiClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: 'Authentication required.' }, { status: 401 })
  }

  let name: string
  let expiry_date: string
  let quantity: string | undefined

  try {
    const body = await request.json() as { name?: unknown; expiry_date?: unknown; quantity?: unknown }

    if (typeof body.name !== 'string' || body.name.trim() === '') {
      return NextResponse.json({ error: 'name field is required.' }, { status: 400 })
    }
    if (typeof body.expiry_date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(body.expiry_date)) {
      return NextResponse.json({ error: 'expiry_date must be in YYYY-MM-DD format.' }, { status: 400 })
    }

    name = body.name.trim()
    expiry_date = body.expiry_date
    quantity = typeof body.quantity === 'string' && body.quantity.trim() ? body.quantity.trim() : undefined
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('pantry')
    .insert({ user_id: user.id, name, expiry_date, quantity })
    .select('id, name, expiry_date, quantity, created_at')
    .single()

  if (error) {
    console.error('[POST /api/pantry]', error)
    return NextResponse.json({ error: 'Could not add ingredient.' }, { status: 500 })
  }

  return NextResponse.json({ item: data }, { status: 201 })
}
