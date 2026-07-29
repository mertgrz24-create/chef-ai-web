-- push_tokens: Expo push tokens per device, used to send expiry alerts.
-- ⚠️ Run manually in Supabase SQL Editor

CREATE TABLE public.push_tokens (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  token       TEXT NOT NULL UNIQUE,          -- Expo push token (ExponentPushToken[...])
  platform    TEXT,                          -- 'ios' | 'android'
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.push_tokens ENABLE ROW LEVEL SECURITY;

-- A user manages only their own device tokens. The expiry-alert sender uses the
-- service role, which bypasses RLS.
CREATE POLICY "Users manage their own push tokens"
ON public.push_tokens FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE INDEX push_tokens_user_id_idx ON public.push_tokens (user_id);
