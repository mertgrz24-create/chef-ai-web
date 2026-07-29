import { NextRequest, NextResponse } from 'next/server'
import { createApiClient } from '@/lib/supabase/api'
import { getRecipeImage } from '@/lib/pexels'

export async function GET(req: NextRequest) {
  const supabase = await createApiClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: 'Authentication required.' }, { status: 401 })
  }

  const name = req.nextUrl.searchParams.get('name')?.trim().slice(0, 100)
  if (!name) return NextResponse.json({ url: null })

  const url = await getRecipeImage(`${name} food dish`)
  return NextResponse.json({ url })
}
