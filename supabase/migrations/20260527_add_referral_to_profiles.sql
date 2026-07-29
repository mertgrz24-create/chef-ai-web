-- V4.3: Referral program
-- ⚠️ Run manually in Supabase SQL Editor

ALTER TABLE profiles
  ADD COLUMN referral_code TEXT UNIQUE,
  ADD COLUMN referred_by TEXT,
  ADD COLUMN referral_count INT NOT NULL DEFAULT 0;
