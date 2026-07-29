-- V4.1: Freemium usage tracking
-- ⚠️ Run manually in Supabase SQL Editor

ALTER TABLE profiles
  ADD COLUMN recipe_count_this_month INT NOT NULL DEFAULT 0,
  ADD COLUMN recipe_count_reset_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  ADD COLUMN is_premium BOOLEAN NOT NULL DEFAULT false;
