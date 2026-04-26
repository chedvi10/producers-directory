import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendProgramApprovedEmail, sendProgramRejectedEmail } from '@/lib/email';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const adminId = searchParams.get('adminId');

  if (!adminId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // בדיקה שזו באמת מנהלת
  const admin = await prisma.producer.findUnique({
    where: { id: adminId },
  });

  if (!admin?.isAdmin) {
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
}

export async function PUT(request: Request) {
  const { programId, status, adminId } = await request.json();

  if (!adminId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // בדיקה שזו באמת מנהלת
  const admin = await prisma.producer.findUnique({
    where: { id: adminId },
  });

  if (!admin?.isAdmin) {
    return NextResponse.json({ error: 'אין לך הרשאות מנהלת' }, { status: 403 });
  }

  // עדכון סטטוס התוכנית
  const program = await prisma.program.update({
    where: { id: programId },
    data: { status },
    include: { producer: true }  // 👈 כדי לקבל את פרטי המפיקה
  });

  // 👈 שליחת מייל למפיקה לפי הסטטוס
  if (status === 'approved') {
    await sendProgramApprovedEmail(program.producer.email, program.producer.name, program.title);
  } else if (status === 'rejected') {
    await sendProgramRejectedEmail(program.producer.email, program.producer.name, program.title);
  }

  return NextResponse.json(program);
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const programId = searchParams.get('programId');
  const adminId = searchParams.get('adminId');

  if (!adminId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // בדיקה שזו באמת מנהלת
  const admin = await prisma.producer.findUnique({
    where: { id: adminId! },
  });

  if (!admin?.isAdmin) {
    return NextResponse.json({ error: 'אין לך הרשאות מנהלת' }, { status: 403 });
  }

  // מחיקת התוכנית
  await prisma.program.delete({
    where: { id: programId! },
  });

  return NextResponse.json({ success: true });
}
