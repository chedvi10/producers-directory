import { NextResponse } from 'next/server';
import { Prisma, Audience } from '@prisma/client';
import { prisma } from '@/lib/prisma';

type PreviousApprovedData = {
  title: string;
  description: string;
  category: string;
  minAge: number;
  maxAge: number;
  duration: string;
  location: string;
  price: number | null;
  audience: 'MEN' | 'WOMEN' | 'BOTH';
  phone: string | null;
  email: string | null;
  images: string[];
  videos: string[];
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const andClauses: Prisma.ProgramWhereInput[] = [];

  // ציבורי: מציגים רק תוכניות מאושרות,
  // או תוכניות שעודכנו וממתינות לאישור (שם מציגים את הגרסה הקודמת)
  andClauses.push({
    OR: [
      { status: 'approved' },
      { status: 'pending' },
    ],
  });

  const search = searchParams.get('search');
  if (search) {
    andClauses.push({
      OR: [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ],
    });
  }

  const category = searchParams.get('category');
  if (category) andClauses.push({ category });

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
    andClauses.push({ location: { contains: location, mode: 'insensitive' } });
  }

  const maxPrice = searchParams.get('maxPrice');
  if (maxPrice) andClauses.push({ price: { lte: parseFloat(maxPrice) } });

  const where: Prisma.ProgramWhereInput = { AND: andClauses };

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

  const visiblePrograms = programs.filter(
    (program) => program.status === 'approved' || (program.status === 'pending' && !!program.previousApprovedData)
  );

  const publicPrograms = visiblePrograms.map((program) => {
    if (program.status === 'pending' && program.previousApprovedData) {
      const previous = program.previousApprovedData as PreviousApprovedData;
      return {
        ...program,
        title: previous.title,
        description: previous.description,
        category: previous.category,
        minAge: previous.minAge,
        maxAge: previous.maxAge,
        duration: previous.duration,
        location: previous.location,
        price: previous.price,
        audience: previous.audience,
        phone: previous.phone,
        email: previous.email,
        images: previous.images,
        videos: previous.videos,
        status: 'approved',
      };
    }

    return program;
  });

  return NextResponse.json(publicPrograms);
}
