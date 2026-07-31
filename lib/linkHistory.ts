export interface RecentLink {
  token: string
  businessName: string
  amount: number | null
  createdAt: number
}

const STORAGE_KEY = 'upay:recent-links'
const MAX_ENTRIES = 20

export function getRecentLinks(): RecentLink[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function addRecentLink(link: RecentLink): RecentLink[] {
  if (typeof window === 'undefined') return []
  const updated = [link, ...getRecentLinks()].slice(0, MAX_ENTRIES)
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  return updated
}
