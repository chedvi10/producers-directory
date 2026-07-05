import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';

// POST - הגדלת מונה הצפיות של תוכנית (נקרא בפתיחת המודל באלפון)
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await prisma.program.update({
      where: { id },
      data: { views: { increment: 1 } },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    // תוכנית לא קיימת או שגיאה אחרת - לא קריטי לספירת צפיות
    return NextResponse.json({ success: false }, { status: 200 });
  }
}
