import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { validateAuth } from '@/lib/auth';
import { sendProgramApprovedEmail, sendProgramRejectedEmail } from '@/lib/email';
import { stripNestedProducerSecret } from '@/lib/sanitize';

const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || 'c0556731959@gmail.com').toLowerCase();

export async function GET(request: NextRequest) {
  try {
    const { producerId } = validateAuth(request);

    // בדיקה שזו באמת מנהלת
    const admin = await prisma.producer.findUnique({
      where: { id: producerId },
    });

    const isAdmin = admin?.role === 'admin' || admin?.email.toLowerCase() === ADMIN_EMAIL;

    if (!isAdmin) {
      return NextResponse.json({ error: 'אין לך הרשאות מנהלת' }, { status: 403 });
    }

    if (admin && admin.role !== 'admin' && admin.email.toLowerCase() === ADMIN_EMAIL) {
      await prisma.producer.update({
        where: { id: admin.id },
        data: { role: 'admin' },
      });
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

    if (!programId || !['approved', 'rejected'].includes(status)) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    // בדיקה שזו באמת מנהלת
    const admin = await prisma.producer.findUnique({
      where: { id: producerId },
    });

    const isAdmin = admin?.role === 'admin' || admin?.email.toLowerCase() === ADMIN_EMAIL;

    if (!isAdmin) {
      return NextResponse.json({ error: 'אין לך הרשאות מנהלת' }, { status: 403 });
    }

    if (admin && admin.role !== 'admin' && admin.email.toLowerCase() === ADMIN_EMAIL) {
      await prisma.producer.update({
        where: { id: admin.id },
        data: { role: 'admin' },
      });
    }

    const existingProgram = await prisma.program.findUnique({
      where: { id: programId },
      include: { producer: true },
    });

    if (!existingProgram) {
      return NextResponse.json({ error: 'Program not found' }, { status: 404 });
    }

    let program;
    if (status === 'approved') {
      // אישור: מפרסמים את הגרסה המעודכנת ומנקים snapshot קודם
      program = await prisma.program.update({
        where: { id: programId },
        data: {
          status: 'approved',
          previousApprovedData: null,
        },
        include: { producer: true },
      });
    } else {
      // דחייה: התוכנית לא מוצגת לציבור, ללא שחזור גרסה קודמת
      program = await prisma.program.update({
        where: { id: programId },
        data: {
          status: 'rejected',
          previousApprovedData: null,
        },
        include: { producer: true },
      });
    }

    // שליחת מייל למפיקה לפי הסטטוס
    if (status === 'approved') {
      void sendProgramApprovedEmail(program.producer.email, program.producer.name, program.title);
    } else if (status === 'rejected') {
      void sendProgramRejectedEmail(program.producer.email, program.producer.name, program.title);
    }

    return NextResponse.json(stripNestedProducerSecret(program));
  } catch (error) {
    console.error('Admin PUT error:', error);

    if (error instanceof Error && error.message === 'No token') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return NextResponse.json({ error: 'Failed to update program' }, { status: 500 });
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

    const isAdmin = admin?.role === 'admin' || admin?.email.toLowerCase() === ADMIN_EMAIL;

    if (!isAdmin) {
      return NextResponse.json({ error: 'אין לך הרשאות מנהלת' }, { status: 403 });
    }

    if (admin && admin.role !== 'admin' && admin.email.toLowerCase() === ADMIN_EMAIL) {
      await prisma.producer.update({
        where: { id: admin.id },
        data: { role: 'admin' },
      });
    }

    // מחיקת התוכנית
    await prisma.program.delete({
      where: { id: programId },
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
