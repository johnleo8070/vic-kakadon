"use client";

// Client-side auth helpers for the admin dashboard.
// We persist both the user info and the JWT token in localStorage so that
// authenticated API calls work reliably even if the cookie is missing/expired.

const KEY = "kakadon_admin_auth";
const TOKEN_KEY = "kakadon_admin_token";

export function setAdminAuth(user: { id: number; username: string; role: string }, token?: string) {
  try {
    localStorage.setItem(KEY, JSON.stringify(user));
    if (token) localStorage.setItem(TOKEN_KEY, token);
  } catch {
    // ignore
  }
}

export function getAdminAuth(): { id: number; username: string; role: string } | null {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function getAdminToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function isAdminAuthenticated(): boolean {
  return getAdminAuth() !== null;
}

export function clearAdminAuth() {
  try {
    localStorage.removeItem(KEY);
    localStorage.removeItem(TOKEN_KEY);
  } catch {
    // ignore
  }
  document.cookie = "admin_token=; Max-Age=0; path=/";
}

/**
 * fetch wrapper that automatically attaches the admin JWT as a Bearer token.
 * Use this for any authenticated admin API call.
 */
export async function adminFetch(input: string, init: RequestInit = {}): Promise<Response> {
  const token = getAdminToken();
  const headers = new Headers(init.headers || {});
  if (token) headers.set("Authorization", `Bearer ${token}`);
  return fetch(input, { ...init, headers });
}
