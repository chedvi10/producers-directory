import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { createToken } from '@/lib/auth';
import { validateLogin, sanitizeString } from '@/lib/validation';
import { z } from 'zod';

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

    const token = createToken({
      producerId: producer.id,
      email: producer.email,
      role: producer.role
    });

    return NextResponse.json({
      token,
      producer: {
        name: producer.name,
        role: producer.role
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
