-- meals_eaten: tracks what the user actually ate
-- ⚠️ Run manually in Supabase SQL Editor

CREATE TABLE public.meals_eaten (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  recipe_name  TEXT NOT NULL,
  calories     INT,
  protein_g    INT,
  carbs_g      INT,
  fat_g        INT,
  eaten_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  source       TEXT -- 'manual', 'meal_plan', 'recipe'
);

ALTER TABLE public.meals_eaten ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Kullanıcı kendi kayıtlarını yönetir"
ON public.meals_eaten FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE INDEX meals_eaten_user_id_idx ON public.meals_eaten (user_id);
CREATE INDEX meals_eaten_eaten_at_idx ON public.meals_eaten (eaten_at);
