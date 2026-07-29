import { createClient as createSupabaseClient, type SupabaseClient } from '@supabase/supabase-js'
import { headers } from 'next/headers'
import { createClient as createCookieClient } from './server'

/**
 * Supabase client for API route handlers.
 *
 * Two callers, two auth transports:
 *  - Web (browser): cookie session, handled by @supabase/ssr.
 *  - Mobile (Expo/RN): `Authorization: Bearer <access_token>`, since a native
 *    client has no cookie jar.
 *
 * The bearer token is forwarded to PostgREST as-is, so RLS still evaluates
 * against the caller's own JWT — a mobile client gets no more reach than a
 * browser one. Cookies remain the fallback, so existing web flows are
 * unchanged.
 *
 * Reads the header via next/headers rather than a Request argument so route
 * handlers that take no parameters (plain `GET()`) work without a signature
 * change.
 */
export async function createApiClient(): Promise<SupabaseClient> {
  const authorization = (await headers()).get('authorization')

  if (authorization?.startsWith('Bearer ')) {
    return createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        global: { headers: { Authorization: authorization } },
        // Stateless: the native client owns the session, not the server.
        auth: { persistSession: false, autoRefreshToken: false },
      }
    )
  }

  return createCookieClient()
}
