import { NextRequest, NextResponse } from 'next/server'
import { createApiClient } from '@/lib/supabase/api'

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

// DELETE /api/pantry/[id] — remove a pantry item (RLS enforces ownership)
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createApiClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: 'Authentication required.' }, { status: 401 })
  }

  const { id } = await params

  // Reject malformed ids before hitting the DB — a non-uuid otherwise raises a
  // Postgres 22P02 and leaks out as a noisy 500.
  if (!UUID_RE.test(id)) {
    return NextResponse.json({ error: 'Ingredient not found.' }, { status: 404 })
  }

  const { error } = await supabase
    .from('pantry')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id) // redundant with RLS but explicit is safer

  if (error) {
    console.error('[DELETE /api/pantry/[id]]', error)
    return NextResponse.json({ error: 'Could not delete ingredient.' }, { status: 500 })
  }

  return new NextResponse(null, { status: 204 })
}
