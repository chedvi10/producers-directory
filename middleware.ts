import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Rate limiting store
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

function rateLimit(ip: string, limit: number = 10, windowMs: number = 60000): boolean {
  const now = Date.now();
  const key = `rate_${ip}`;
  const record = rateLimitStore.get(key);
  
  if (!record || now > record.resetTime) {
    rateLimitStore.set(key, { count: 1, resetTime: now + windowMs });
    return true;
  }
  
  if (record.count >= limit) {
    return false;
  }
  
  record.count++;
  return true;
}

export function middleware(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') || 'unknown';
  
  // Rate limiting for API routes
  // 100 לדקה: גלישה רגילה (כל פתיחת תוכנית = 1-2 בקשות) לא נחנקת,
  // וגם משרד שלם מאחורי NAT עם IP משותף לא נחסם
  if (request.nextUrl.pathname.startsWith('/api/')) {
    if (!rateLimit(ip, 100, 60000)) { // 100 requests per minute
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429 }
      );
    }
  }
  
  // CSRF Protection for POST requests
  if (request.method === 'POST') {
    const origin = request.headers.get('origin');
    const host = request.headers.get('host');
    
    if (origin && host && !origin.includes(host)) {
      return NextResponse.json(
        { error: 'CSRF attack detected' },
        { status: 403 }
      );
    }
  }
  
  // Security headers
  const response = NextResponse.next();
  
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  
  return response;
}

export const config = {
  matcher: [
    '/api/:path*',
    '/dashboard/:path*',
    '/admin/:path*',
    '/coordinator/:path*'
  ]
};
