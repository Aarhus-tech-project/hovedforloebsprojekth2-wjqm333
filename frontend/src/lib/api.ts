const BASE = 'http://localhost:5000/api';

export async function apiFetch(path: string, options?: RequestInit) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  const text = await res.text();
  let data: unknown;
  try { data = JSON.parse(text); } catch { data = text; }
  if (!res.ok) throw new Error(typeof data === 'string' ? data : JSON.stringify(data));
  return data;
}

export function getUser(): { id: number; username: string } | null {
  if (typeof localStorage === 'undefined') return null;
  const raw = localStorage.getItem('user');
  return raw ? JSON.parse(raw) : null;
}

export function setUser(u: { id: number; username: string }) {
  localStorage.setItem('user', JSON.stringify(u));
}

export function logout() {
  localStorage.removeItem('user');
}
