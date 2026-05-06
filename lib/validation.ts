import { z } from 'zod';

// Schema לתוכנית
export const programSchema = z.object({
  title: z.string()
    .min(2, 'כותרת חייבת להיות לפחות 2 תווים')
    .max(100, 'כותרת לא יכולה להיות יותר מ-100 תווים')
    .regex(/^[א-ת\s\w\-.,!?]+$/, 'כותרת מכילה תווים לא חוקיים'),
  
  description: z.string()
    .min(10, 'תיאור חייב להיות לפחות 10 תווים')
    .max(2000, 'תיאור לא יכול להיות יותר מ-2000 תווים'),
  
  category: z.enum(['programs', 'lectures', 'attractions', 'restaurants', 'tours'], {
    errorMap: () => ({ message: 'קטגוריה לא חוקית' })
  }),
  
  targetAge: z.string()
    .min(1, 'גיל מטרה נדרש')
    .max(50, 'גיל מטרה ארוך מדי'),
  
  duration: z.string()
    .min(1, 'משך זמן נדרש')
    .max(50, 'משך זמן ארוך מדי'),
  
  price: z.number()
    .min(0, 'מחיר לא יכול להיות שלילי')
    .max(50000, 'מחיר גבוה מדי')
    .int('מחיר חייב להיות מספר שלם'),
  
  location: z.string()
    .min(2, 'מיקום חייב להיות לפחות 2 תווים')
    .max(100, 'מיקום ארוך מדי'),
  
  phone: z.string()
    .regex(/^0[2-9]\d{7,8}$/, 'מספר טלפון לא תקין')
    .optional(),
  
  email: z.string()
    .email('כתובת אימייל לא תקינה')
    .optional(),
  
  images: z.array(z.string().url('URL תמונה לא תקין'))
    .max(5, 'מקסימום 5 תמונות')
    .optional(),
  
  videos: z.array(z.string().url('URL וידאו לא תקין'))
    .max(3, 'מקסימום 3 וידאו')
    .optional()
});

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

// Schema לרישום
export const registerSchema = z.object({
  name: z.string()
    .min(2, 'שם חייב להיות לפחות 2 תווים')
    .max(50, 'שם ארוך מדי')
    .regex(/^[א-ת\s\w\-]+$/, 'שם מכיל תווים לא חוקיים'),
  
  email: z.string()
    .email('כתובת אימייל לא תקינה')
    .min(5, 'אימייל קצר מדי')
    .max(100, 'אימייל ארוך מדי'),
  
  password: z.string()
    .min(8, 'סיסמה חייבת להיות לפחות 8 תווים')
    .max(100, 'סיסמה ארוכה מדי')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'סיסמה חייבת לכלול אות קטנה, גדולה ומספר'),
  
  phone: z.string()
    .regex(/^0[2-9]\d{7,8}$/, 'מספר טלפון לא תקין'),
  
  businessName: z.string()
    .min(2, 'שם עסק חייב להיות לפחות 2 תווים')
    .max(100, 'שם עסק ארוך מדי')
});

// פונקציות עזר לvalidation
export function validateProgram(data: unknown) {
  return programSchema.parse(data);
}

export function validateLogin(data: unknown) {
  return loginSchema.parse(data);
}

export function validateRegister(data: unknown) {
  return registerSchema.parse(data);
}

// Sanitization functions
export function sanitizeString(str: string): string {
  return str
    .trim()
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove scripts
    .replace(/javascript:/gi, '') // Remove javascript: URLs
    .replace(/on\w+\s*=/gi, ''); // Remove event handlers
}

export function sanitizeHtml(html: string): string {
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
    .replace(/<embed\b[^<]*>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '');
}
