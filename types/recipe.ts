export interface RecipeMacros {
  calories: number
  protein_g: number
  carbs_g: number
  fat_g: number
  fiber_g?: number
  net_carbs_g?: number
}

// Structured recipe as returned by the AI (before DB persistence)
export interface StructuredRecipe {
  name: string
  prep_time_min?: number
  cook_time_min?: number
  servings?: number
  ingredients: string[]
  instructions: string
  chefs_note?: string
}

export interface Recipe {
  id: string
  user_id: string
  name: string
  ingredients: string[]
  instructions: string
  macros?: RecipeMacros
  diet_context?: string
  image_url?: string | null
  is_public: boolean
  created_at: string
}
