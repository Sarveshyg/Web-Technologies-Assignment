import { API_BASE_URL, parseError } from './api';
import { authenticatedFetch, logout } from './authService';
import type { Book } from '../types';

export async function fetchBooks(): Promise<Book[]> {
  let response: Response;
  try {
    response = await authenticatedFetch(`${API_BASE_URL}/api/books`);
  } catch {
    throw new Error('Cannot reach backend at http://localhost:8080. Is Spring Boot running?');
  }
  if (response.status === 401) {
    // Token missing/invalid/expired -> clear state so the app redirects to login.
    logout();
    throw new Error('Please log in to view the catalogue.');
  }
  if (!response.ok) {
    throw new Error(await parseError(response, 'Failed to load books.'));
  }
  return (await response.json()) as Book[];
}
