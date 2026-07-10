import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET!;

export interface JWTPayload {
  producerId: string;
  email: string;
  role: string; // producer / coordinator / admin
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
  console.log('🔍 Authorization header:', authHeader?.substring(0, 30) + '...' || 'NOT FOUND');
  const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;
  console.log('📥 Extracted token:', token?.substring(0, 20) + '...' || 'NO TOKEN');
  return token;
}

// בדיקת אימות ב-API
export function validateAuth(request: NextRequest): JWTPayload {
  const token = getTokenFromRequest(request);
  if (!token) {
    console.error('❌ No token in request headers');
    throw new Error('No token');
  }
  try {
    const payload = verifyToken(token);
    console.log('✅ Token verified for producer:', payload.producerId);
    return payload;
  } catch (error) {
    console.error('❌ Token verification failed:', error);
    throw error;
  }
}

// פונקציות לדפדפן
export function setAuthToken(token: string) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('authToken', token);
    const stored = localStorage.getItem('authToken');
    console.log('🔐 Token stored in localStorage:', stored?.substring(0, 20) + '...');
    console.log('✅ Verification - Token retrieved:', stored?.substring(0, 20) + '...');
  }
}

export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('authToken');
}

export function isAuthenticated(): boolean {
  if (typeof window === 'undefined') {
    console.log('⚠️ isAuthenticated() called on server side');
    return false;
  }
  const token = getAuthToken();
  const result = !!token;
  console.log('🔍 isAuthenticated():', result, '| Token exists:', !!token);
  return result;
}

export function clearAuth() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('authToken');
  }
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

// כתובת האזור האישי לפי סוג המשתמש
export function getHomeRoute(role: string | null | undefined): string {
  if (role === 'admin') return '/admin';
  if (role === 'coordinator') return '/coordinator';
  return '/dashboard';
}
