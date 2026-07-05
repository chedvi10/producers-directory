import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/api-auth';
import { TRACK_STATUS_VALUES } from '@/lib/constants';

// GET - כל התוכניות השמורות של הרכזת, או בדיקת תוכנית בודדת (?programId=)
export async function GET(request: NextRequest) {
  const auth = requireRole(request, 'coordinator');
  if (auth.response) return auth.response;
  const coordinatorId = auth.payload.producerId;

  try {
    const { searchParams } = new URL(request.url);
    const programId = searchParams.get('programId');

    if (programId) {
      const saved = await prisma.savedProgram.findUnique({
        where: { coordinatorId_programId: { coordinatorId, programId } },
      });
      return NextResponse.json({ saved: !!saved, savedId: saved?.id || null });
    }

    const savedPrograms = await prisma.savedProgram.findMany({
      where: { coordinatorId },
      include: {
        program: {
          include: { producer: { select: { name: true, phone: true, email: true } } },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 200, // הגבלת גודל התשובה
    });

    return NextResponse.json({ savedPrograms });
  } catch (error) {
    console.error('GET saved error:', error);
    return NextResponse.json({ error: 'שגיאה בטעינת התוכניות השמורות' }, { status: 500 });
  }
}

// POST - שמירה/הסרה של תוכנית (toggle)
export async function POST(request: NextRequest) {
  const auth = requireRole(request, 'coordinator');
  if (auth.response) return auth.response;
  const coordinatorId = auth.payload.producerId;

  try {
    const { programId } = await request.json();

    if (!programId) {
      return NextResponse.json({ error: 'Program ID required' }, { status: 400 });
    }

    const program = await prisma.program.findFirst({
      where: { id: programId, status: 'approved' },
    });
    if (!program) {
      return NextResponse.json({ error: 'התוכנית לא נמצאה' }, { status: 404 });
    }

    const existing = await prisma.savedProgram.findUnique({
      where: { coordinatorId_programId: { coordinatorId, programId } },
    });

    if (existing) {
      await prisma.savedProgram.delete({ where: { id: existing.id } });
      return NextResponse.json({ saved: false });
    }

    try {
      const savedProgram = await prisma.savedProgram.create({
        data: { coordinatorId, programId },
      });
      return NextResponse.json({ saved: true, savedProgram });
    } catch (createError) {
      // מרוץ בין שתי לחיצות מהירות: הרשומה כבר נוצרה במקביל (P2002) - התוכנית שמורה
      if (createError instanceof Prisma.PrismaClientKnownRequestError && createError.code === 'P2002') {
        return NextResponse.json({ saved: true });
      }
      throw createError;
    }
  } catch (error) {
    console.error('POST saved error:', error);
    return NextResponse.json({ error: 'שגיאה בשמירת התוכנית' }, { status: 500 });
  }
}

// PUT - עדכון הערה או סטטוס מעקב
export async function PUT(request: NextRequest) {
  const auth = requireRole(request, 'coordinator');
  if (auth.response) return auth.response;
  const coordinatorId = auth.payload.producerId;

  try {
    const { savedId, note, trackStatus } = await request.json();

    if (!savedId) {
      return NextResponse.json({ error: 'Saved ID required' }, { status: 400 });
    }

    if (trackStatus !== undefined && !TRACK_STATUS_VALUES.includes(trackStatus)) {
      return NextResponse.json({ error: 'סטטוס מעקב לא חוקי' }, { status: 400 });
    }

    const existing = await prisma.savedProgram.findFirst({
      where: { id: savedId, coordinatorId },
    });
    if (!existing) {
      return NextResponse.json({ error: 'לא נמצא' }, { status: 404 });
    }

    const updated = await prisma.savedProgram.update({
      where: { id: savedId },
      data: {
        ...(note !== undefined && { note: String(note).slice(0, 1000) }),
        ...(trackStatus !== undefined && { trackStatus }),
      },
    });

    return NextResponse.json({ savedProgram: updated });
  } catch (error) {
    console.error('PUT saved error:', error);
    return NextResponse.json({ error: 'שגיאה בעדכון' }, { status: 500 });
  }
}

// DELETE - הסרת תוכנית שמורה (?savedId=)
export async function DELETE(request: NextRequest) {
  const auth = requireRole(request, 'coordinator');
  if (auth.response) return auth.response;
  const coordinatorId = auth.payload.producerId;

  try {
    const { searchParams } = new URL(request.url);
    const savedId = searchParams.get('savedId');

    if (!savedId) {
      return NextResponse.json({ error: 'Saved ID required' }, { status: 400 });
    }

    // deleteMany עם סינון בעלות - מחיקה ובדיקת הרשאה בשאילתה אחת
    const result = await prisma.savedProgram.deleteMany({
      where: { id: savedId, coordinatorId },
    });

    if (result.count === 0) {
      return NextResponse.json({ error: 'לא נמצא' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE saved error:', error);
    return NextResponse.json({ error: 'שגיאה במחיקה' }, { status: 500 });
  }
}
