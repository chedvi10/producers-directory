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

    const program = await prisma.program.findUnique({
      where: { id },
      select: { views: true },
    });

    if (!program) {
      return NextResponse.json({ success: false, error: 'Program not found' }, { status: 404 });
    }

    await prisma.program.update({
      where: { id },
      data: { views: (program.views ?? 0) + 1 },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Program view count error:', error);
    return NextResponse.json({ success: false }, { status: 200 });
  }
}
