import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendProgramPendingEmail } from '@/lib/email';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const producerId = searchParams.get('producerId');

  if (!producerId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const producer = await prisma.producer.findUnique({
    where: { id: producerId },
    include: { subscription: true },
  });

  const programs = await prisma.program.findMany({
    where: { producerId },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json({ producer, programs });
}

export async function POST(request: Request) {
  const data = await request.json();
  const { producerId, ...programData } = data;

  const producer = await prisma.producer.findUnique({
    where: { id: producerId }
  });

  const program = await prisma.program.create({
    data: {
      ...programData,
      producerId,
      status: 'pending',
    },
  });

  // שליחת מייל למפיקה
  if (producer) {
    await sendProgramPendingEmail(producer.email, producer.name, program.title);
  }

  return NextResponse.json(program);
}

export async function PUT(request: Request) {
  const data = await request.json();
  const { programId, ...updateData } = data;

  const program = await prisma.program.update({
    where: { id: programId },
    data: {
      ...updateData,
      status: 'pending',  // 👈 גם אחרי עריכה חוזר לממתין
    },
    include: { producer: true }
  });

  // שליחת מייל למפיקה שהתוכנית ממתינה לאישור מחדש
  await sendProgramPendingEmail(program.producer.email, program.producer.name, program.title);

  return NextResponse.json(program);
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const programId = searchParams.get('programId');

  await prisma.program.delete({
    where: { id: programId! },
  });

  return NextResponse.json({ success: true });
}
