import { TOKEN_KEY, USER_KEY } from './constants';

export interface JwtUser {
  userId: number;
  email: string;
  role: string;
}

export function decodeJwt(token: string): any | null {
  try {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    const json = decodeURIComponent(
      atob(base64).split('').map(c =>
        '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join('')
    );
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function getCurrentUser(): JwtUser | null {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try { return JSON.parse(raw) as JwtUser; } catch { return null; }
}

export function getUserRole(): string {
  return getCurrentUser()?.role ?? '';
}

export function normalizeRole(role: string): string {
  return (role ?? '').trim();
}

export function hasAnyRole(allowed: string[]): boolean {
  const role = normalizeRole(getUserRole());
  return allowed.includes(role);
}

export function buildUserFromToken(token: string): JwtUser | null {
  const payload = decodeJwt(token);
  if (!payload) return null;
  const role =
    payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] ??
    payload['role'] ?? '';
  const userId =
    Number(payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claimtypes/nameidentifier'] ??
           payload['nameid'] ?? 0);
  const email =
    payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claimtypes/emailaddress'] ??
    payload['email'] ?? '';
  return { userId, email, role };
}
