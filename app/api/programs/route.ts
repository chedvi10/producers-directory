import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const where: any = {};

  const search = searchParams.get('search');
  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } }
    ];
  }

  const category = searchParams.get('category');
  if (category) where.category = category;

  const targetAge = searchParams.get('targetAge');
  if (targetAge) where.targetAge = targetAge;

  const location = searchParams.get('location');
  if (location) where.location = location;

  const maxPrice = searchParams.get('maxPrice');
  if (maxPrice) where.price = { lte: parseFloat(maxPrice) };

  const programs = await prisma.program.findMany({
    where,
    include: { producer: { select: { name: true, phone: true } } },
    orderBy: { createdAt: 'desc' }
  });

  return NextResponse.json(programs);
}
