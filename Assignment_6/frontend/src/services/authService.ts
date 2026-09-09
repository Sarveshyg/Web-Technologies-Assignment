import { API_BASE_URL, authHeaders, parseError } from './api';
import type { AuthResponse, User } from '../types';

const TOKEN_KEY = 'booknest_token';
const USER_KEY = 'booknest_user';

/**
 * Simple auth state backed by localStorage.
 *
 * NOTE (viva tradeoff): the JWT is stored in localStorage for simplicity in
 * this college project. Production apps should prefer HttpOnly Secure cookies
 * so JavaScript cannot read the token (XSS protection).
 * The user's PASSWORD is never stored anywhere on the frontend.
 */
export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function getUser(): User | null {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
}

export function isLoggedIn(): boolean {
  return getToken() !== null && getUser() !== null;
}

export function logout(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export async function register(fullName: string, email: string, password: string): Promise<string> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fullName, email, password }),
    });
  } catch {
    throw new Error('Cannot reach backend at http://localhost:8080. Is Spring Boot running?');
  }
  if (!response.ok) {
    if (response.status === 409) throw new Error('Email already registered. Please log in.');
    throw new Error(await parseError(response, 'Registration failed.'));
  }
  const data = await response.json();
  return data.message ?? 'Registration successful. Please log in.';
}

export async function login(email: string, password: string): Promise<User> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
  } catch {
    throw new Error('Cannot reach backend at http://localhost:8080. Is Spring Boot running?');
  }
  if (!response.ok) {
    if (response.status === 401) throw new Error('Invalid email or password.');
    throw new Error(await parseError(response, 'Login failed.'));
  }
  const data = (await response.json()) as AuthResponse;
  // Store JWT + basic user info only. NEVER store the password.
  localStorage.setItem(TOKEN_KEY, data.token);
  localStorage.setItem(USER_KEY, JSON.stringify({ email: data.email, fullName: data.fullName } satisfies User));
  return { email: data.email, fullName: data.fullName };
}

/** Example of an authenticated request helper (used by bookService). */
export function authenticatedFetch(input: string, init: RequestInit = {}): Promise<Response> {
  return fetch(input, {
    ...init,
    headers: { ...authHeaders(), ...(init.headers ?? {}) },
  });
}
