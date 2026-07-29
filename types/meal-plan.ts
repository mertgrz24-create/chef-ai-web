export interface MealItem {
  name: string
  prep_time_min?: number
  cook_time_min?: number
  servings?: number
  ingredients: string[]
  instructions: string
  chefs_note?: string
  macros?: {
    calories: number
    protein_g: number
    carbs_g: number
    fat_g: number
    fiber_g?: number
    net_carbs_g?: number
  }
}

export interface MealPlanDay {
  day: string
  breakfast: MealItem
  dinner: MealItem
}

export interface MealPlan {
  id: string
  user_id: string
  week_start_date: string
  meals: MealPlanDay[]
  created_at: string
  updated_at: string
}
