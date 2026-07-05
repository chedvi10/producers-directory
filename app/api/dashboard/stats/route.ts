import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/api-auth';

// GET - סטטיסטיקות למפיקה: צפיות, פניות ושמירות לכל תוכנית
export async function GET(request: NextRequest) {
  const auth = requireRole(request, 'producer', 'admin');
  if (auth.response) return auth.response;
  const { producerId } = auth.payload;
  try {

    const programs = await prisma.program.findMany({
      where: { producerId },
      select: { id: true, title: true, views: true },
    });

    const programIds = programs.map((p) => p.id);

    const [inquiryCounts, savedCounts, newInquiries] = await Promise.all([
      prisma.inquiry.groupBy({
        by: ['programId'],
        where: { programId: { in: programIds } },
        _count: { _all: true },
      }),
      prisma.savedProgram.groupBy({
        by: ['programId'],
        where: { programId: { in: programIds } },
        _count: { _all: true },
      }),
      prisma.inquiry.count({
        where: { producerId, status: 'new' },
      }),
    ]);

    const inquiryMap = new Map(inquiryCounts.map((c) => [c.programId, c._count._all]));
    const savedMap = new Map(savedCounts.map((c) => [c.programId, c._count._all]));

    const stats = programs.map((p) => ({
      programId: p.id,
      title: p.title,
      views: p.views,
      inquiriesCount: inquiryMap.get(p.id) || 0,
      savedCount: savedMap.get(p.id) || 0,
    }));

    const totals = {
      views: stats.reduce((sum, s) => sum + s.views, 0),
      inquiries: stats.reduce((sum, s) => sum + s.inquiriesCount, 0),
      saved: stats.reduce((sum, s) => sum + s.savedCount, 0),
      newInquiries,
    };

    return NextResponse.json({ stats, totals });
  } catch (error) {
    console.error('GET Stats Error:', error);
    return NextResponse.json({ error: 'שגיאה בטעינת הסטטיסטיקות' }, { status: 500 });
  }
}
