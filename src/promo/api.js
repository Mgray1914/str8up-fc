// Backend base URL for promo API calls (NEXT_PUBLIC_API_BASE_URL, without /api/v1).
const API_BASE = (process.env.NEXT_PUBLIC_API_BASE_URL || '').replace(/\/$/, '');

export const apiUrl = (path) => `${API_BASE}/api/v1/promo${path}`;

// Public (unauthenticated) GET returning parsed JSON, or null on any failure.
export async function getJson(path) {
  try {
    const res = await fetch(apiUrl(path));
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}
