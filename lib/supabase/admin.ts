import { createClient } from '@supabase/supabase-js'

/**
 * Service-role Supabase client — bypasses RLS. SERVER-ONLY.
 *
 * Only for trusted server tasks that legitimately act across users, e.g. the
 * expiry-alert cron reading every user's pantry + push tokens. Never import
 * this into anything that runs on the client, and never expose its results
 * without an auth/authorization gate of your own.
 */
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } }
  )
}
