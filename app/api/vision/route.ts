import { NextRequest, NextResponse } from 'next/server'
import { createApiClient } from '@/lib/supabase/api'
import { analyzeIngredients } from '@/lib/ai/gemini'

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'] as const
type AllowedMimeType = (typeof ALLOWED_TYPES)[number]

const MAX_SIZE_BYTES = 10 * 1024 * 1024 // 10 MB

export async function POST(request: NextRequest) {
  // 1. Auth check
  const supabase = await createApiClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: 'Authentication required.' }, { status: 401 })
  }

  // 2. Parse multipart form data
  let file: File
  try {
    const formData = await request.formData()
    const raw = formData.get('image')

    if (!(raw instanceof File)) {
      return NextResponse.json(
        { error: 'The image field is required and must be a file.' },
        { status: 400 }
      )
    }
    file = raw
  } catch {
    return NextResponse.json({ error: 'Invalid form data.' }, { status: 400 })
  }

  // 3. Validate type and size
  if (!ALLOWED_TYPES.includes(file.type as AllowedMimeType)) {
    return NextResponse.json(
      { error: 'Only JPEG, PNG, or WebP files are accepted.' },
      { status: 415 }
    )
  }

  if (file.size > MAX_SIZE_BYTES) {
    return NextResponse.json(
      { error: 'File size exceeds the 10 MB limit.' },
      { status: 413 }
    )
  }

  // 4. Convert to base64 and call Gemini
  try {
    const buffer = await file.arrayBuffer()
    const base64 = Buffer.from(buffer).toString('base64')

    const { ingredients } = await analyzeIngredients(
      base64,
      file.type as AllowedMimeType
    )

    return NextResponse.json({ ingredients })
  } catch (err) {
    console.error('[/api/vision] Image analysis error:', err)
    return NextResponse.json(
      { error: 'Could not analyze the photo. Please try again.' },
      { status: 500 }
    )
  }
}
