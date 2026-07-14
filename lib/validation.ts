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

// Schema לפנייה למפיקה
export const inquirySchema = z.object({
  programId: z.string().min(1, 'מזהה תוכנית חסר'),

  contactName: z.string()
    .min(2, 'יש להזין שם מלא')
    .max(100, 'שם ארוך מדי'),

  contactPhone: z.string()
    .min(7, 'מספר טלפון לא תקין')
    .max(30, 'מספר טלפון ארוך מדי'),

  contactEmail: z.string()
    .email('כתובת אימייל לא תקינה')
    .max(100, 'אימייל ארוך מדי')
    .optional()
    .or(z.literal('')),

  contactInstitution: z.string()
    .min(2, 'יש להזין שם מוסד')
    .max(150, 'שם המוסד ארוך מדי')
    .optional()
    .or(z.literal('')),

  message: z.string()
    .min(2, 'יש להזין הודעה')
    .max(2000, 'ההודעה ארוכה מדי'),
});

// פונקציות עזר
export function validateLogin(data: unknown) {
  return loginSchema.parse(data);
}

export function validateInquiry(data: unknown) {
  return inquirySchema.parse(data);
}

// Sanitization
export function sanitizeString(str: string): string {
  return str
    .trim()
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '');
}
