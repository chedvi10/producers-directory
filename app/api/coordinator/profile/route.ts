import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/api-auth';

// GET - פרופיל הרכזת המחוברת (למילוי אוטומטי בטפסים)
export async function GET(request: NextRequest) {
  const auth = requireRole(request, 'coordinator');
  if (auth.response) return auth.response;

  try {
    const coordinator = await prisma.producer.findUnique({
      where: { id: auth.payload.producerId },
      select: {
        name: true,
        phone: true,
        email: true,
        institution: true,
      },
    });

    if (!coordinator) {
      return NextResponse.json({ error: 'רכזת לא נמצאה' }, { status: 404 });
    }

    return NextResponse.json({ coordinator });
  } catch (error) {
    console.error('Coordinator profile GET error:', error);
    return NextResponse.json({ error: 'שגיאה בטעינת פרופיל רכזת' }, { status: 500 });
  }
}
