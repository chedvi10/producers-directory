import { NextRequest, NextResponse } from 'next/server';
import { validateAuth, JWTPayload } from './auth';

// בדיקת הזדהות + הרשאה אחידה לכל נתיבי ה-API.
//
// החלטת אמון: לתפקידי producer/coordinator סומכים על ה-role שב-JWT (חלון של עד
// 7 ימים עד פקיעת הטוקן). פעולות מנהלת רגישות מאמתות בנוסף מול ה-DB בנתיב עצמו
// (ראו app/api/admin/programs) כשכבת הגנה נוספת.
//
// שימוש:
//   const auth = requireRole(request, 'coordinator');
//   if (auth.response) return auth.response;
//   const { producerId } = auth.payload;
export function requireRole(
  request: NextRequest,
  ...roles: string[]
): { payload: JWTPayload; response?: undefined } | { payload?: undefined; response: NextResponse } {
  let payload: JWTPayload;
  try {
    payload = validateAuth(request);
  } catch {
    return { response: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) };
  }

  if (roles.length > 0 && !roles.includes(payload.role)) {
    return { response: NextResponse.json({ error: 'אין לך הרשאה לפעולה זו' }, { status: 403 }) };
  }

  return { payload };
}
