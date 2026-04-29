// Simple localStorage-based user store (no backend needed)
export interface UserData {
  name: string;
  email: string;
  createdAt: string;
}

const KEY = 'medinest_user';

export function saveUser(data: UserData) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(KEY, JSON.stringify(data));
}

export function getUser(): UserData | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function clearUser() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(KEY);
}

export function getFirstName(name: string): string {
  return name.trim().split(' ')[0] || name;
}

export function getInitials(name: string): string {
  const parts = name.trim().split(' ').filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return (parts[0]?.[0] || 'U').toUpperCase();
}
