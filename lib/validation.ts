import { z } from 'zod';

// Schema להתחברות
export const loginSchema = z.object({
  email: z.string()
    .email('כתובת אימייל לא תקינה')
    .min(5, 'אימייל קצר מדי')
    .max(100, 'אימייל ארוך מדי'),
  
  password: z.string()
    .min(6, 'סיסמה חייבת להיות לפחות 6 תווים')
    .max(100, 'סיסמה ארוכה מדי')
});

// פונקציות עזר
export function validateLogin(data: unknown) {
  return loginSchema.parse(data);
}

// Sanitization
export function sanitizeString(str: string): string {
  return str
    .trim()
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '');
}
