-- V4 security fixes: atomic referral + freemium credit RPCs
-- ⚠️ Run manually in Supabase SQL Editor
--
-- Why: the referral flow must read and update ANOTHER user's profile row
-- (find referrer by code, increment their referral_count), which own-row
-- RLS policies forbid — so /api/referral could never succeed. Both flows
-- also had read-modify-write race conditions. These SECURITY DEFINER
-- functions perform all checks and writes atomically server-side.

-- 1. apply_referral(code) — validates and applies a referral in one transaction
CREATE OR REPLACE FUNCTION public.apply_referral(p_code text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user uuid := auth.uid();
  v_my_code text;
  v_referred_by text;
  v_referrer_id uuid;
BEGIN
  IF v_user IS NULL THEN
    RETURN jsonb_build_object('status', 'unauthenticated');
  END IF;

  SELECT referral_code, referred_by INTO v_my_code, v_referred_by
  FROM profiles WHERE id = v_user FOR UPDATE;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('status', 'no_profile');
  END IF;

  IF v_referred_by IS NOT NULL THEN
    RETURN jsonb_build_object('status', 'already_referred');
  END IF;

  IF v_my_code = p_code THEN
    RETURN jsonb_build_object('status', 'self_referral');
  END IF;

  SELECT id INTO v_referrer_id FROM profiles WHERE referral_code = p_code FOR UPDATE;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('status', 'invalid_code');
  END IF;

  UPDATE profiles SET referred_by = p_code WHERE id = v_user;
  UPDATE profiles SET referral_count = referral_count + 1 WHERE id = v_referrer_id;

  RETURN jsonb_build_object('status', 'ok');
END;
$$;

REVOKE ALL ON FUNCTION public.apply_referral(text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.apply_referral(text) TO authenticated;

-- 2. consume_recipe_credit(limit) — atomic monthly reset + limit check + increment
CREATE OR REPLACE FUNCTION public.consume_recipe_credit(p_limit int)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user uuid := auth.uid();
  v_count int;
  v_premium boolean;
  v_reset_at timestamptz;
BEGIN
  IF v_user IS NULL THEN
    RETURN jsonb_build_object('allowed', false, 'reason', 'unauthenticated');
  END IF;

  SELECT recipe_count_this_month, is_premium, recipe_count_reset_at
  INTO v_count, v_premium, v_reset_at
  FROM profiles WHERE id = v_user FOR UPDATE;

  IF NOT FOUND THEN
    -- No profile row yet: don't block recipe generation
    RETURN jsonb_build_object('allowed', true, 'remaining', p_limit);
  END IF;

  -- Monthly rollover
  IF v_reset_at < date_trunc('month', now()) THEN
    v_count := 0;
    UPDATE profiles
    SET recipe_count_this_month = 0, recipe_count_reset_at = now()
    WHERE id = v_user;
  END IF;

  IF NOT v_premium AND v_count >= p_limit THEN
    RETURN jsonb_build_object('allowed', false, 'reason', 'limit_reached');
  END IF;

  UPDATE profiles SET recipe_count_this_month = v_count + 1 WHERE id = v_user;
  RETURN jsonb_build_object('allowed', true, 'remaining', GREATEST(p_limit - v_count - 1, 0));
END;
$$;

REVOKE ALL ON FUNCTION public.consume_recipe_credit(int) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.consume_recipe_credit(int) TO authenticated;

-- 3. refund_recipe_credit() — give the credit back if generation fails after consuming
CREATE OR REPLACE FUNCTION public.refund_recipe_credit()
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  UPDATE profiles
  SET recipe_count_this_month = GREATEST(recipe_count_this_month - 1, 0)
  WHERE id = auth.uid();
$$;

REVOKE ALL ON FUNCTION public.refund_recipe_credit() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.refund_recipe_credit() TO authenticated;
