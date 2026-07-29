export interface MealEaten {
  id: string
  user_id: string
  recipe_name: string
  calories: number | null
  protein_g: number | null
  carbs_g: number | null
  fat_g: number | null
  eaten_at: string
  source: string | null
}

export interface DailyTotals {
  calories: number
  protein_g: number
  carbs_g: number
  fat_g: number
}
