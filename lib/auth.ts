import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET!;

export interface JWTPayload {
  producerId: string;
  email: string;
  isAdmin: boolean;
}

// יצירת Token מוצפן
export function createToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

// בדיקת Token
export function verifyToken(token: string): JWTPayload {
  return jwt.verify(token, JWT_SECRET) as JWTPayload;
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
export function setAuthToken(token: string) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('authToken', token);
  }
}

export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('authToken');
}

export function isAuthenticated(): boolean {
  return !!getAuthToken();
}

export function clearAuth() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('authToken');
  }
}
