export async function getRecipeImage(recipeName: string): Promise<string | null> {
  const key = process.env.PEXELS_API_KEY
  if (!key) return null

  try {
    const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(recipeName)}&per_page=1&orientation=landscape`
    const res = await fetch(url, {
      headers: { Authorization: key },
      next: { revalidate: 86400 },
    })

    if (!res.ok) return null

    const data = (await res.json()) as {
      photos: Array<{ src: { medium: string } }>
    }

    return data.photos[0]?.src?.medium ?? null
  } catch {
    return null
  }
}
