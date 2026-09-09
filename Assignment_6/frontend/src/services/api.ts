export const API_BASE_URL = 'http://localhost:8080';

/** Build headers for a request, attaching the JWT when present. */
export function authHeaders(): HeadersInit {
  const token = localStorage.getItem('booknest_token');
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

/** Extract a friendly message from a failed fetch response. */
export async function parseError(response: Response, fallback: string): Promise<string> {
  try {
    const data = await response.json();
    if (data && typeof data.message === 'string') return data.message;
  } catch {
    // ignore JSON parse errors
  }
  if (response.status === 401) return 'Unauthorized. Please log in again.';
  return fallback;
}
