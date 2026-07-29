/**
 * Monday of the current week as YYYY-MM-DD — the key meal plans are stored under.
 * Shared by the meal-plan routes, shopping-list, and the dashboard so they all
 * agree on where "this week" starts.
 */
export function getWeekStartDate(): string {
  const now = new Date()
  const day = now.getDay() // 0=Sun, 1=Mon
  const diff = day === 0 ? -6 : 1 - day
  const monday = new Date(now)
  monday.setDate(now.getDate() + diff)
  return monday.toISOString().split('T')[0]
}
