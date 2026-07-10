import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { validateAuth } from '@/lib/auth';
import { sendProgramApprovedEmail, sendProgramRejectedEmail } from '@/lib/email';
import { stripNestedProducerSecret } from '@/lib/sanitize';

export async function GET(request: NextRequest) {
  try {
    const { producerId } = validateAuth(request);

    // בדיקה שזו באמת מנהלת
    const admin = await prisma.producer.findUnique({
      where: { id: producerId },
    });

    if (admin?.role !== 'admin') {
      return NextResponse.json({ error: 'אין לך הרשאות מנהלת' }, { status: 403 });
    }

    // שליפת כל התוכניות עם פרטי המפיקה
    const programs = await prisma.program.findMany({
      include: { 
        producer: { 
          select: { 
            name: true, 
            phone: true, 
            email: true 
          } 
        } 
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(programs);
  } catch (error) {
    console.error('Admin GET error:', error);
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { producerId } = validateAuth(request);
    const { programId, status } = await request.json();

    // בדיקה שזו באמת מנהלת
    const admin = await prisma.producer.findUnique({
      where: { id: producerId },
    });

    if (admin?.role !== 'admin') {
      return NextResponse.json({ error: 'אין לך הרשאות מנהלת' }, { status: 403 });
    }

    // עדכון סטטוס התוכנית
    const program = await prisma.program.update({
      where: { id: programId },
      data: { status },
      include: { producer: true }
    });

    // שליחת מייל למפיקה לפי הסטטוס
    if (status === 'approved') {
      await sendProgramApprovedEmail(program.producer.email, program.producer.name, program.title);
    } else if (status === 'rejected') {
      await sendProgramRejectedEmail(program.producer.email, program.producer.name, program.title);
    }

    return NextResponse.json(stripNestedProducerSecret(program));
  } catch (error) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { producerId } = validateAuth(request);
    const { searchParams } = new URL(request.url);
    const programId = searchParams.get('programId');

    if (!programId) {
      return NextResponse.json({ error: 'Program ID required' }, { status: 400 });
    }

    // בדיקה שזו באמת מנהלת
    const admin = await prisma.producer.findUnique({
      where: { id: producerId },
    });

    if (admin?.role !== 'admin') {
      return NextResponse.json({ error: 'אין לך הרשאות מנהלת' }, { status: 403 });
    }

    // מחיקת התוכנית
    await prisma.program.delete({
      where: { id: programId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
