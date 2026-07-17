import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { createToken } from '@/lib/auth';
import { validateLogin, sanitizeString } from '@/lib/validation';
import { z } from 'zod';

// אימייל המנהלת - רשומה קיימת עם האימייל הזה מקודמת ל-role admin בהתחברות.
// מתקן מצב שבו חשבון המנהלת בפרודקשן נשמר עם role שגוי (למשל 'producer').
const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || 'c0556731959@gmail.com').toLowerCase();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // בדיקת תקינות הנתונים
    const validatedData = validateLogin(body);
    const email = sanitizeString(validatedData.email.toLowerCase());
    const password = sanitizeString(validatedData.password);

    let producer = await prisma.producer.findUnique({
      where: { email },
    });

    // Fallback for legacy records that were saved with mixed-case email
    if (!producer) {
      producer = await prisma.producer.findFirst({
        where: { email: { equals: email, mode: 'insensitive' } },
      });
    }

    if (!producer) {
      return NextResponse.json({ error: 'אימייל או סיסמה שגויים' }, { status: 401 });
    }

    const isValid = await bcrypt.compare(password, producer.passwordHash);

    if (!isValid) {
      return NextResponse.json({ error: 'אימייל או סיסמה שגויים' }, { status: 401 });
    }

    let role = producer.role;
    if (producer.email.toLowerCase() === ADMIN_EMAIL && role !== 'admin') {
      await prisma.producer.update({
        where: { id: producer.id },
        data: { role: 'admin' },
      });
      role = 'admin';
    }

    const token = createToken({
      producerId: producer.id,
      email: producer.email,
      role
    });

    return NextResponse.json({
      token,
      producer: {
        name: producer.name,
        role
      }
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ 
        error: error.issues[0]?.message || 'נתונים לא תקינים' 
      }, { status: 400 });
    }
    
    return NextResponse.json({ error: 'שגיאה בשרת' }, { status: 500 });
  }
}
