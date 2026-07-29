-- Data minimization: drop profile columns that were collected but never used
-- by any feature (recipe/plan generation only reads calorie + macro + water +
-- diet_type). Removing sensitive data (weight) we don't need.
-- ⚠️ Run manually in Supabase SQL Editor. IRREVERSIBLE — existing values are lost.
--
-- Safe re: signup: the new-user trigger only sets id/email/timestamps, so it
-- does not reference any of these columns.

ALTER TABLE public.profiles
  DROP COLUMN IF EXISTS full_name,
  DROP COLUMN IF EXISTS current_weight_kg,
  DROP COLUMN IF EXISTS target_weight_kg,
  DROP COLUMN IF EXISTS daily_steps_goal;

-- NOTE: profiles.email is also redundant (auth.users already holds it) but the
-- new-user trigger writes it, so dropping it requires editing that trigger
-- first. Left for a separate, careful change.
