export type DietType =
  | 'omnivore'
  | 'vegetarian'
  | 'vegan'
  | 'keto'
  | 'paleo'
  | 'gluten_free'
  | 'dairy_free'
  | (string & {});

export interface Profile {
  id: string;
  email: string | null;
  created_at: string | null;
  updated_at: string | null;

  // Diet goals — all nullable (user may not have set them yet). Only the
  // fields the recipe/plan engine actually uses are collected.
  daily_calorie_goal: number | null;
  protein_goal_g: number | null;
  carbs_goal_g: number | null;
  fat_goal_g: number | null;
  water_goal_l: number | null;
  diet_type: DietType | null;
  goals_updated_at: string | null;

  // V4.1 — Freemium usage tracking
  recipe_count_this_month: number;
  recipe_count_reset_at: string;
  is_premium: boolean;

  // V4.3 — Referral program
  referral_code: string | null;
  referred_by: string | null;
  referral_count: number;
}

export type ProfileUpdatePayload = Partial<Pick<Profile,
  | 'daily_calorie_goal'
  | 'protein_goal_g'
  | 'carbs_goal_g'
  | 'fat_goal_g'
  | 'water_goal_l'
  | 'diet_type'
>>
