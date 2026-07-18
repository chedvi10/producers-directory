import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET!;

export interface JWTPayload {
  producerId: string;
  email: string;
  role: string; // producer / coordinator / admin
}

type AuthRole = 'producer' | 'coordinator' | 'admin';

const AUTH_CURRENT_ROLE_KEY = 'authCurrentRole';
const AUTH_TOKEN_PREFIX = 'authToken:';

function isAuthRole(role: string | null | undefined): role is AuthRole {
  return role === 'producer' || role === 'coordinator' || role === 'admin';
}

function authTokenKey(role: AuthRole): string {
  return `${AUTH_TOKEN_PREFIX}${role}`;
}

function getRoleFromPathname(pathname: string): AuthRole | null {
  if (pathname.startsWith('/admin')) return 'admin';
  if (pathname.startsWith('/coordinator')) return 'coordinator';
  if (pathname.startsWith('/dashboard')) return 'producer';
  return null;
}

function getStoredActiveRole(): AuthRole | null {
  if (typeof window === 'undefined') return null;
  const role = localStorage.getItem(AUTH_CURRENT_ROLE_KEY);
  return isAuthRole(role) ? role : null;
}

function setStoredActiveRole(role: AuthRole | null) {
  if (typeof window === 'undefined') return;

  if (!role) {
    localStorage.removeItem(AUTH_CURRENT_ROLE_KEY);
    return;
  }

  localStorage.setItem(AUTH_CURRENT_ROLE_KEY, role);
}

function getPreferredStoredRole(): AuthRole | null {
  if (typeof window === 'undefined') return null;

  const storedRoles: AuthRole[] = ['admin', 'coordinator', 'producer'];
  for (const role of storedRoles) {
    if (localStorage.getItem(authTokenKey(role))) {
      return role;
    }
  }

  return null;
}

function decodeRoleFromToken(token: string): AuthRole | null {
  try {
    const segment = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    const padded = segment + '='.repeat((4 - (segment.length % 4)) % 4);
    const payload = JSON.parse(atob(padded));
    const role = roleFromPayload(payload);
    return isAuthRole(role) ? role : null;
  } catch {
    return null;
  }
}

// יצירת Token מוצפן
export function createToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

// תאימות לאחור: טוקנים שהונפקו לפני המעבר ל-role מכילים isAdmin בלבד.
// נקודת נורמליזציה יחידה - משמשת גם את השרת (verifyToken) וגם את הדפדפן (getUserRole)
function roleFromPayload(payload: { role?: string; isAdmin?: boolean }): string {
  return payload.role || (payload.isAdmin ? 'admin' : 'producer');
}

// בדיקת Token
export function verifyToken(token: string): JWTPayload {
  const payload = jwt.verify(token, JWT_SECRET) as JWTPayload & { isAdmin?: boolean };
  payload.role = roleFromPayload(payload);
  return payload;
}

// קבלת Token מבקשה
export function getTokenFromRequest(request: NextRequest): string | null {
  const authHeader = request.headers.get('authorization');
  return authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;
}

// בדיקת אימות ב-API
export function validateAuth(request: NextRequest): JWTPayload {
  const token = getTokenFromRequest(request);
  if (!token) throw new Error('No token');
  return verifyToken(token);
}

// פונקציות לדפדפן
export function setAuthToken(token: string, role?: string) {
  if (typeof window !== 'undefined') {
    const resolvedRole = isAuthRole(role) ? role : decodeRoleFromToken(token);

    if (resolvedRole) {
      localStorage.setItem(authTokenKey(resolvedRole), token);
      setStoredActiveRole(resolvedRole);
    }

    localStorage.setItem('authToken', token);
  }
}

export function getAuthToken(role?: string | null): string | null {
  if (typeof window === 'undefined') return null;

  const pathRole = getRoleFromPathname(window.location.pathname);
  const explicitRole = isAuthRole(role) ? role : null;
  const activeRole = getStoredActiveRole();
  const resolvedRole = explicitRole || pathRole || activeRole;

  if (resolvedRole) {
    return localStorage.getItem(authTokenKey(resolvedRole)) || localStorage.getItem('authToken');
  }

  return localStorage.getItem('authToken') || localStorage.getItem(authTokenKey(getPreferredStoredRole() || 'producer'));
}

export function isAuthenticated(): boolean {
  return !!getAuthToken();
}

export function clearAuth() {
  if (typeof window !== 'undefined') {
    const pathRole = getRoleFromPathname(window.location.pathname);
    const activeRole = getStoredActiveRole();
    const resolvedRole = pathRole || activeRole;

    if (resolvedRole) {
      localStorage.removeItem(authTokenKey(resolvedRole));
    }

    localStorage.removeItem('authToken');
    setStoredActiveRole(getPreferredStoredRole());
  }
}

type RouterLike = { push: (path: string) => void };

// מחזיר true אם המשתמש מחובר, אחרת מפנה להתחברות ומחזיר false
export function requireAuthOrRedirect(router: RouterLike): boolean {
  if (!isAuthenticated()) {
    router.push('/login');
    return false;
  }
  return true;
}

// מחזיר true אם התפקיד תואם, אחרת מפנה לנתיב חלופי ומחזיר false
export function requireRoleOrRedirect(
  router: RouterLike,
  requiredRole: string,
  fallbackPath = '/dashboard'
): boolean {
  if (getUserRole() !== requiredRole) {
    router.push(fallbackPath);
    return false;
  }
  return true;
}

// ניקוי התחברות + הפניה לדף התחברות
export function logoutAndRedirect(router: RouterLike) {
  clearAuth();
  router.push('/login');
}

// מפנה לאזור האישי לפי התפקיד הקיים בטוקן (או להתחברות אם אין תפקיד)
export function redirectToRoleHome(router: RouterLike) {
  const role = getUserRole();
  if (!role) {
    router.push('/login');
    return;
  }
  router.push(getHomeRoute(role));
}

// קריאת ה-role מתוך ה-Token בדפדפן (ללא אימות חתימה - לצרכי UI בלבד)
export function getUserRole(): string | null {
  const token = getAuthToken();
  if (!token) return null;
  try {
    // JWT מקודד ב-base64url; atob מקבל רק base64 רגיל - ממירים לפני הפענוח
    const segment = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    const padded = segment + '='.repeat((4 - (segment.length % 4)) % 4);
    const payload = JSON.parse(atob(padded));
    return roleFromPayload(payload);
  } catch {
    return null;
  }
}

// fetch עם כותרת ההזדהות - לשימוש בכל קריאות ה-API מהדפדפן
export function authFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const token = getAuthToken();
  return fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  });
}

// תפקיד אמיתי מהשרת, לשימוש במצבי רענון/חוסר התאמה מול הטוקן המקומי
export async function getServerUserRole(): Promise<string | null> {
  const res = await authFetch('/api/auth');
  if (!res.ok) return null;

  const data = await res.json();
  return data?.producer?.role || null;
}

// כתובת האזור האישי לפי סוג המשתמש
export function getHomeRoute(role: string | null | undefined): string {
  if (role === 'admin') return '/admin';
  if (role === 'coordinator') return '/coordinator';
  return '/dashboard';
}
