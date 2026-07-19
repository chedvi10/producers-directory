import { NextResponse } from 'next/server';
import { Prisma, Audience } from '@prisma/client';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const where: Prisma.ProgramWhereInput = { status: { in: ['approved', 'pending'] } };
  const andClauses: Prisma.ProgramWhereInput[] = [];

  const search = searchParams.get('search');
  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } }
    ];
  }

  const category = searchParams.get('category');
  if (category) where.category = category;

  const userAge = searchParams.get('userAge');
  if (userAge) {
    const age = parseInt(userAge);
    andClauses.push(
      { minAge: { lte: age } },
      { maxAge: { gte: age } }
    );
  }

  const audienceParam = searchParams.get('audience');
  const audience =
    audienceParam === 'MEN' || audienceParam === 'WOMEN' || audienceParam === 'BOTH'
      ? (audienceParam as Audience)
      : null;

  if (audience) {
    // audience filter: match BOTH or the specific audience
    if (audience === 'BOTH') {
      // nothing to add — BOTH matches all
    } else {
      andClauses.push({ OR: [{ audience }, { audience: 'BOTH' }] });
    }
  }

  const location = searchParams.get('location');
  if (location) {
    // 👈 שינוי: חיפוש חלקי במקום התאמה מדויקת
    where.location = { contains: location, mode: 'insensitive' };
  }

  const maxPrice = searchParams.get('maxPrice');
  if (maxPrice) where.price = { lte: parseFloat(maxPrice) };

  if (andClauses.length > 0) {
    where.AND = andClauses;
  }

  const programs = await prisma.program.findMany({
    where,
    include: { 
      producer: { 
        select: { 
          name: true, 
          phone: true,
          email: true 
        } 
      } 
    },
    orderBy: { createdAt: 'desc' }
  });

  return NextResponse.json(programs);
}
