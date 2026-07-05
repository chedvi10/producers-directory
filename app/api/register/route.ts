import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { createToken } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { name, email, phone, password, role } = await request.json();

    // רק שני סוגי הרשמה מותרים - מנהלת לא נרשמת דרך הטופס
    const userRole = role === 'coordinator' ? 'coordinator' : 'producer';

    // בדוק אם האימייל כבר קיים
    const existing = await prisma.producer.findUnique({
      where: { email },
    });

    if (existing) {
      return NextResponse.json({ error: 'האימייל כבר רשום במערכת' }, { status: 400 });
    }

    // הצפן סיסמה
    const passwordHash = await bcrypt.hash(password, 10);

    // צור משתמש חדש - מנוי נוצר רק למפיקה
    const producer = await prisma.producer.create({
      data: {
        name,
        email,
        phone,
        passwordHash,
        role: userRole,
        ...(userRole === 'producer' && {
          subscription: {
            create: {
              expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // שנה מהיום
              status: 'active',
            }
          }
        })
      }
    });

    // התחברות אוטומטית אחרי הרשמה
    const token = createToken({
      producerId: producer.id,
      email: producer.email,
      role: producer.role,
    });

    return NextResponse.json({
      producerId: producer.id,
      token,
      role: producer.role,
      message: 'נרשמת בהצלחה!'
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'שגיאה בשרת' }, { status: 500 });
  }
}
