import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const where: any = { status: 'approved' };

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
    where.AND = [
      { minAge: { lte: age } },
      { maxAge: { gte: age } }
    ];
  }

  const audience = searchParams.get('audience');
  if (audience) {
    // audience filter: match BOTH or the specific audience
    if (audience === 'BOTH') {
      // nothing to add — BOTH matches all
    } else {
      where.AND = where.AND || [];
      where.AND.push({ OR: [ { audience: audience }, { audience: 'BOTH' } ] });
    }
  }

  const location = searchParams.get('location');
  if (location) {
    // 👈 שינוי: חיפוש חלקי במקום התאמה מדויקת
    where.location = { contains: location, mode: 'insensitive' };
  }

  const maxPrice = searchParams.get('maxPrice');
  if (maxPrice) where.price = { lte: parseFloat(maxPrice) };

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
