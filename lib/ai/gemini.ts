import { GoogleGenerativeAI } from '@google/generative-ai'
import type { MealItem, MealPlanDay } from '@/types/meal-plan'
import type { StructuredRecipe } from '@/types/recipe'

const client = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

const VISION_PROMPT = `Identify all food and drink ingredients visible in this photo.

Rules:
- Only list ingredients usable in cooking (vegetables, fruits, meat, dairy, spices, condiments, packaged goods, etc.)
- Use standard American grocery store names (e.g. "ground beef", "shredded mozzarella", "baby spinach", "rotisserie chicken")
- Use names you would find on shelves at Whole Foods, Trader Joe's, Kroger, or Walmart
- Write ingredient names in English, all lowercase
- Return ONLY a comma-separated list of ingredients, nothing else
- If no food is visible, return an empty response

Example response: chicken breast, red onion, cherry tomatoes, garlic, shredded cheddar, plain greek yogurt`

export interface VisionResult {
  ingredients: string[]
}

// ─── Recipe generation ────────────────────────────────────────────────────────

export interface RecipeMacros {
  calories: number
  protein_g: number
  carbs_g: number
  fat_g: number
  fiber_g?: number
  net_carbs_g?: number
}

export interface RecipeResult {
  text: string
  macros: RecipeMacros | null
  structured: StructuredRecipe | null
  inputTokens: number
  outputTokens: number
}

const RECIPE_SYSTEM_PROMPT = `You are Chef-AI's recipe assistant for the US market. You create practical, delicious, and achievable recipes inspired by Modern American, Mediterranean, Asian-Fusion, and Tex-Mex cuisines.

Rules:
- Always respond in English.
- Return ONLY a valid JSON object; no markdown, explanations, or extra text.
- Use only the ingredients provided; if a small pantry staple helps (olive oil, salt, garlic), mention it as optional in instructions.
- Favor approachable US formats: grain bowls, sheet-pan dinners, one-pot meals, protein-packed salads, wraps, and air-fryer recipes.
- Encourage Trader Joe's convenience items where natural (pre-cooked lentils, frozen rice, bagged greens, etc.).
- Do NOT use Turkish dish names (no Menemen, Börek, Kuymak, etc.).
- Use standard American grocery store names (Whole Foods / Trader Joe's / Kroger / Walmart shelf labels).
- Use ONLY imperial measurements: cups, oz, lbs, tbsp, tsp, °F — never grams, ml, or Celsius.
- Steps should be numbered and concise; separate them with \\n inside the instructions string.
- Where applicable, add an Air Fryer or Instant Pot alternative inline in the step (e.g., "Air fryer alternative: 400 °F for 12 min").
- Add a short meal-prep tip at the end of instructions when the dish stores/reheats well.
- Use a friendly, encouraging tone.
- Macros are per-serving estimates; provide reasonable, realistic values.
- net_carbs_g = carbs_g − fiber_g (calculate and include both).

Output format (this JSON only, nothing else):
{
  "name": "Recipe Name",
  "prep_time_min": 10,
  "cook_time_min": 20,
  "servings": 2,
  "ingredients": ["1 lb chicken breast", "1/2 cup diced onion"],
  "instructions": "1. First step.\\n2. Second step.\\n3. Third step.",
  "chefs_note": "Short tip — swap, storage advice, or flavor upgrade.",
  "macros": {
    "calories": 450,
    "protein_g": 32,
    "carbs_g": 28,
    "fiber_g": 4,
    "net_carbs_g": 24,
    "fat_g": 14
  }
}`

function parseRecipeJson(raw: string): {
  text: string
  macros: RecipeMacros | null
  structured: StructuredRecipe | null
} {
  // Strip markdown code fence in case the model wraps the JSON
  let jsonStr = raw.trim()
  if (jsonStr.startsWith('```')) {
    jsonStr = jsonStr.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '').trim()
  }

  const parsed = JSON.parse(jsonStr) as {
    name?: string
    prep_time_min?: number
    cook_time_min?: number
    servings?: number
    ingredients?: string[]
    instructions?: string
    chefs_note?: string
    macros?: Partial<RecipeMacros>
  }

  const lines: string[] = []
  if (parsed.name) lines.push(`🍽️ ${parsed.name}`)

  // Timing + servings line
  const timeParts: string[] = []
  if (typeof parsed.prep_time_min === 'number') timeParts.push(`Prep ${parsed.prep_time_min} min`)
  if (typeof parsed.cook_time_min === 'number') timeParts.push(`Cook ${parsed.cook_time_min} min`)
  if (typeof parsed.servings === 'number') timeParts.push(`Serves ${parsed.servings}`)
  if (timeParts.length) lines.push(`⏱ ${timeParts.join(' · ')}`)

  if (parsed.ingredients?.length) {
    lines.push('\n📝 Ingredients')
    parsed.ingredients.forEach((i) => lines.push(`• ${i}`))
  }
  if (parsed.instructions) {
    lines.push('\n👨‍🍳 Instructions')
    lines.push(parsed.instructions)
  }
  if (parsed.chefs_note) {
    lines.push(`\n💡 Chef's Note: ${parsed.chefs_note}`)
  }

  const m = parsed.macros
  const macros: RecipeMacros | null =
    m &&
    typeof m.calories === 'number' &&
    typeof m.protein_g === 'number' &&
    typeof m.carbs_g === 'number' &&
    typeof m.fat_g === 'number'
      ? {
          calories: m.calories,
          protein_g: m.protein_g,
          carbs_g: m.carbs_g,
          fat_g: m.fat_g,
          ...(typeof m.fiber_g === 'number' && { fiber_g: m.fiber_g }),
          ...(typeof m.net_carbs_g === 'number' && { net_carbs_g: m.net_carbs_g }),
        }
      : null

  const structured: StructuredRecipe | null =
    typeof parsed.name === 'string' &&
    parsed.name.trim() !== '' &&
    Array.isArray(parsed.ingredients) &&
    parsed.ingredients.length > 0 &&
    parsed.ingredients.every((i) => typeof i === 'string') &&
    typeof parsed.instructions === 'string' &&
    parsed.instructions.trim() !== ''
      ? {
          name: parsed.name.trim(),
          ingredients: parsed.ingredients,
          instructions: parsed.instructions,
          ...(typeof parsed.prep_time_min === 'number' && { prep_time_min: parsed.prep_time_min }),
          ...(typeof parsed.cook_time_min === 'number' && { cook_time_min: parsed.cook_time_min }),
          ...(typeof parsed.servings === 'number' && { servings: parsed.servings }),
          ...(typeof parsed.chefs_note === 'string' && { chefs_note: parsed.chefs_note }),
        }
      : null

  return { text: lines.join('\n'), macros, structured }
}

export async function generateRecipeWithGemini(
  ingredients: string[],
  dietContext?: string
): Promise<RecipeResult> {
  const model = client.getGenerativeModel({
    model: 'gemini-2.5-pro',
    systemInstruction: RECIPE_SYSTEM_PROMPT,
  })

  const userMessage = `I have these ingredients: ${ingredients.join(', ')}.${
    dietContext ? `\n${dietContext}` : ''
  }\nCan you suggest a recipe?`

  const result = await model.generateContent(userMessage)
  const rawText = result.response.text().trim()

  let text: string
  let macros: RecipeMacros | null = null
  let structured: StructuredRecipe | null = null

  try {
    const parsed = parseRecipeJson(rawText)
    text = parsed.text
    macros = parsed.macros
    structured = parsed.structured
  } catch {
    text = rawText
  }

  return {
    text,
    macros,
    structured,
    inputTokens: result.response.usageMetadata?.promptTokenCount ?? 0,
    outputTokens: result.response.usageMetadata?.candidatesTokenCount ?? 0,
  }
}

// ─── Weekly meal plan ─────────────────────────────────────────────────────────

const MEAL_PLAN_SYSTEM_PROMPT = `You are Chef-AI's weekly meal plan assistant for the US market. You create varied, balanced 7-day meal plans tailored to the user's dietary goals.

Rules:
- Always write recipe names and instructions in English.
- Return ONLY a valid JSON array; no markdown, explanations, or extra text.
- Generate a 7-day plan. Day values in order: monday, tuesday, wednesday, thursday, friday, saturday, sunday.
- Each day has a breakfast and a dinner meal.
- Favor Modern American, Mediterranean, Asian-Fusion, and Tex-Mex cuisine styles.
- Preferred formats: grain bowls, sheet-pan dinners, one-pot meals, protein-packed salads, wraps, and air-fryer recipes.
- Encourage Trader Joe's convenience items where natural (frozen rice, pre-cooked lentils, bagged greens, etc.).
- Do NOT use Turkish dish names (no Menemen, Börek, Kuymak, etc.).
- Use standard American grocery store names (Whole Foods / Trader Joe's / Kroger / Walmart shelf labels).
- Use ONLY imperial measurements: cups, oz, lbs, tbsp, tsp, °F — never grams, ml, or Celsius.
- Ensure variety; don't repeat the same recipe on two different days.
- Macros are per-serving estimates; provide reasonable, realistic values.
- net_carbs_g = carbs_g − fiber_g (calculate and include both).

Output format (this JSON array only, nothing else):
[
  {
    "day": "monday",
    "breakfast": {
      "name": "Recipe Name",
      "prep_time_min": 5,
      "cook_time_min": 10,
      "servings": 1,
      "ingredients": ["1 cup rolled oats", "1/2 cup milk"],
      "instructions": "1. First step.\\n2. Second step.",
      "chefs_note": "Optional tip or swap.",
      "macros": { "calories": 350, "protein_g": 15, "carbs_g": 45, "fiber_g": 6, "net_carbs_g": 39, "fat_g": 10 }
    },
    "dinner": {
      "name": "Recipe Name",
      "prep_time_min": 10,
      "cook_time_min": 25,
      "servings": 2,
      "ingredients": ["1 lb chicken breast", "2 tbsp olive oil"],
      "instructions": "1. First step.\\n2. Second step.",
      "chefs_note": "Optional tip or swap.",
      "macros": { "calories": 550, "protein_g": 35, "carbs_g": 40, "fiber_g": 5, "net_carbs_g": 35, "fat_g": 18 }
    }
  }
]`

const SINGLE_MEAL_SYSTEM_PROMPT = `You are Chef-AI's meal assistant for the US market. You suggest original recipes for a single meal.

Rules:
- Always respond in English.
- Return ONLY a valid JSON object; no markdown, explanations, or extra text.
- Favor Modern American, Mediterranean, Asian-Fusion, and Tex-Mex cuisine styles.
- Preferred formats: grain bowls, sheet-pan dinners, one-pot meals, protein-packed salads, wraps, and air-fryer recipes.
- Encourage Trader Joe's convenience items where natural (frozen rice, pre-cooked lentils, bagged greens, etc.).
- Do NOT use Turkish dish names (no Menemen, Börek, Kuymak, etc.).
- Use standard American grocery store names (Whole Foods / Trader Joe's / Kroger / Walmart shelf labels).
- Use ONLY imperial measurements: cups, oz, lbs, tbsp, tsp, °F — never grams, ml, or Celsius.
- Where applicable, add an Air Fryer or Instant Pot alternative inline in the relevant step.
- Macros are per-serving estimates; provide reasonable, realistic values.
- net_carbs_g = carbs_g − fiber_g (calculate and include both).

Output format (this JSON object only, nothing else):
{
  "name": "Recipe Name",
  "prep_time_min": 10,
  "cook_time_min": 20,
  "servings": 2,
  "ingredients": ["1 lb ground beef", "1/2 cup breadcrumbs"],
  "instructions": "1. First step.\\n2. Second step.",
  "chefs_note": "Optional tip or swap.",
  "macros": { "calories": 450, "protein_g": 30, "carbs_g": 35, "fiber_g": 4, "net_carbs_g": 31, "fat_g": 15 }
}`

function parseMealPlanJson(raw: string): MealPlanDay[] {
  let jsonStr = raw.trim()
  if (jsonStr.startsWith('```')) {
    jsonStr = jsonStr.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '').trim()
  }
  const parsed = JSON.parse(jsonStr) as unknown
  if (!Array.isArray(parsed)) throw new Error('Expected JSON array')
  return parsed as MealPlanDay[]
}

function parseMealItemJson(raw: string): MealItem {
  let jsonStr = raw.trim()
  if (jsonStr.startsWith('```')) {
    jsonStr = jsonStr.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '').trim()
  }
  return JSON.parse(jsonStr) as MealItem
}

export async function generateWeeklyMealPlan(dietContext?: string): Promise<MealPlanDay[]> {
  const model = client.getGenerativeModel({
    model: 'gemini-2.5-pro',
    systemInstruction: MEAL_PLAN_SYSTEM_PROMPT,
  })

  const userMessage = `Create a 7-day weekly meal plan for me.${
    dietContext ? `\n${dietContext}` : ''
  }`

  console.log('[gemini] generateWeeklyMealPlan starting...')
  const result = await model.generateContent(userMessage)
  const rawText = result.response.text().trim()
  console.log('[gemini] generateWeeklyMealPlan raw response (first 300 chars):', rawText.slice(0, 300))

  try {
    return parseMealPlanJson(rawText)
  } catch (parseErr) {
    console.error('[gemini] generateWeeklyMealPlan JSON parse error:', parseErr)
    console.error('[gemini] Full raw response:', rawText)
    throw parseErr
  }
}

export async function generateSingleMeal(
  day: string,
  mealType: 'breakfast' | 'dinner',
  dietContext?: string
): Promise<MealItem> {
  const model = client.getGenerativeModel({
    model: 'gemini-2.5-pro',
    systemInstruction: SINGLE_MEAL_SYSTEM_PROMPT,
  })

  const mealLabel = mealType === 'breakfast' ? 'breakfast' : 'dinner'
  const userMessage = `Suggest a ${mealLabel} recipe for ${day}.${
    dietContext ? `\n${dietContext}` : ''
  }`

  const result = await model.generateContent(userMessage)
  const rawText = result.response.text().trim()
  return parseMealItemJson(rawText)
}

// ─── Recipe modification ──────────────────────────────────────────────────────

const MODIFY_RECIPE_SYSTEM_PROMPT = `You are Chef-AI's recipe editing assistant for the US market. You modify existing recipes based on the user's request.

Rules:
- Always respond in English.
- Return ONLY a valid JSON object; no markdown, explanations, or extra text.
- Edit the existing recipe according to the user's request (reduce calories, make vegetarian, change servings, make it air-fryer friendly, etc.).
- Maintain Modern American, Mediterranean, Asian-Fusion, or Tex-Mex style where appropriate.
- Do NOT use Turkish dish names (no Menemen, Börek, Kuymak, etc.).
- Use standard American grocery store names (Whole Foods / Trader Joe's / Kroger / Walmart shelf labels).
- Use ONLY imperial measurements: cups, oz, lbs, tbsp, tsp, °F — never grams, ml, or Celsius.
- Update the recipe name if needed; separate instruction steps with \\n.
- Macros are per-serving estimates; reflect the changes made accurately.
- net_carbs_g = carbs_g − fiber_g (calculate and include both).

Output format (this JSON only, nothing else):
{
  "name": "Updated Recipe Name",
  "prep_time_min": 10,
  "cook_time_min": 20,
  "servings": 2,
  "ingredients": ["2 cups flour", "1/2 tsp salt"],
  "instructions": "1. First step.\\n2. Second step.\\n3. Third step.",
  "chefs_note": "Optional tip or swap.",
  "macros": {
    "calories": 350,
    "protein_g": 25,
    "carbs_g": 30,
    "fiber_g": 3,
    "net_carbs_g": 27,
    "fat_g": 10
  }
}`

export interface ModifyRecipeInput {
  name: string
  ingredients: string[]
  instructions: string
}

export interface ModifyRecipeResult {
  name: string
  ingredients: string[]
  instructions: string
  macros: RecipeMacros | null
}

export async function modifyRecipe(
  recipe: ModifyRecipeInput,
  instruction: string,
  dietContext?: string
): Promise<ModifyRecipeResult> {
  const model = client.getGenerativeModel({
    model: 'gemini-2.5-pro',
    systemInstruction: MODIFY_RECIPE_SYSTEM_PROMPT,
  })

  const userMessage = `Current recipe:
Name: ${recipe.name}
Ingredients: ${recipe.ingredients.join(', ')}
Instructions: ${recipe.instructions}

User request: ${instruction}${dietContext ? `\nDiet goals: ${dietContext}` : ''}

Please modify this recipe according to the user's request.`

  const result = await model.generateContent(userMessage)
  const rawText = result.response.text().trim()

  let jsonStr = rawText
  if (jsonStr.startsWith('```')) {
    jsonStr = jsonStr.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '').trim()
  }

  const parsed = JSON.parse(jsonStr) as {
    name?: string
    prep_time_min?: number
    cook_time_min?: number
    servings?: number
    ingredients?: string[]
    instructions?: string
    chefs_note?: string
    macros?: Partial<RecipeMacros>
  }

  const m = parsed.macros
  const macros: RecipeMacros | null =
    m &&
    typeof m.calories === 'number' &&
    typeof m.protein_g === 'number' &&
    typeof m.carbs_g === 'number' &&
    typeof m.fat_g === 'number'
      ? {
          calories: m.calories,
          protein_g: m.protein_g,
          carbs_g: m.carbs_g,
          fat_g: m.fat_g,
          ...(typeof m.fiber_g === 'number' && { fiber_g: m.fiber_g }),
          ...(typeof m.net_carbs_g === 'number' && { net_carbs_g: m.net_carbs_g }),
        }
      : null

  return {
    name: parsed.name ?? recipe.name,
    ingredients: parsed.ingredients ?? recipe.ingredients,
    instructions: parsed.instructions ?? recipe.instructions,
    macros,
  }
}

export async function analyzeIngredients(
  imageBase64: string,
  mimeType: 'image/jpeg' | 'image/png' | 'image/webp'
): Promise<VisionResult> {
  const model = client.getGenerativeModel({ model: 'gemini-2.5-pro' })

  const result = await model.generateContent([
    VISION_PROMPT,
    {
      inlineData: {
        data: imageBase64,
        mimeType,
      },
    },
  ])

  const text = result.response.text().trim()

  if (!text) return { ingredients: [] }

  const ingredients = text
    .split(',')
    .map((s) => s.trim().toLowerCase())
    .filter((s) => s.length > 0)

  return { ingredients }
}
