import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const { name, email, phone, password } = await request.json();

    // בדוק אם האימייל כבר קיים
    const existing = await prisma.producer.findUnique({
      where: { email },
    });

    if (existing) {
      return NextResponse.json({ error: 'האימייל כבר רשום במערכת' }, { status: 400 });
    }

    // הצפן סיסמה
    const passwordHash = await bcrypt.hash(password, 10);

    // צור מפיקה חדשה
    const producer = await prisma.producer.create({
      data: {
        name,
        email,
        phone,
        passwordHash,
        subscription: {
          create: {
            expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // שנה מהיום
            status: 'active',
          }
        }
      }
    });

    return NextResponse.json({ 
      producerId: producer.id,
      message: 'נרשמת בהצלחה!' 
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'שגיאה בשרת' }, { status: 500 });
  }
}
