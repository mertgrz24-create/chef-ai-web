import { NextResponse } from 'next/server'
import { createApiClient } from '@/lib/supabase/api'
import { createAdminClient } from '@/lib/supabase/admin'

/**
 * DELETE /api/account — permanently delete the caller's own account.
 *
 * Deleting the auth user cascades to every table keyed on user_id (profiles,
 * pantry, recipes, meal_plans, meals_eaten, push_tokens — all ON DELETE
 * CASCADE), so this removes all of the user's data in one shot.
 *
 * The id comes from the verified session, never from the request body, so a
 * caller can only ever delete themselves. Irreversible.
 */
export async function DELETE() {
  const supabase = await createApiClient()
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: 'Authentication required.' }, { status: 401 })
  }

  // Service role is required to delete an auth user; scope it to this user id.
  const admin = createAdminClient()
  const { error } = await admin.auth.admin.deleteUser(user.id)

  if (error) {
    console.error('[DELETE /api/account]', error)
    return NextResponse.json({ error: 'Could not delete account.' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
