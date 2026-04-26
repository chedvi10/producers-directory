import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    const producer = await prisma.producer.findUnique({
      where: { email },
    });

    if (!producer) {
      return NextResponse.json({ error: 'אימייל או סיסמה שגויים' }, { status: 401 });
    }

    const isValid = await bcrypt.compare(password, producer.passwordHash);

    if (!isValid) {
      return NextResponse.json({ error: 'אימייל או סיסמה שגויים' }, { status: 401 });
    }

    return NextResponse.json({ 
      producerId: producer.id,
      name: producer.name,
      isAdmin: producer.isAdmin  // 👈 הוסיפי את השורה הזו
    });
  } catch (error) {
    return NextResponse.json({ error: 'שגיאה בשרת' }, { status: 500 });
  }
}
