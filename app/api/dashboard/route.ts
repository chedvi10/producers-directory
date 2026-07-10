import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/api-auth';
import { sendProgramPendingEmail } from '@/lib/email';
import { stripProducerSecret, stripNestedProducerSecret } from '@/lib/sanitize';

export async function GET(request: NextRequest) {
  // ניהול תוכניות פתוח למפיקות בלבד - רכזת לא יכולה לפרסם תוכניות
  const auth = requireRole(request, 'producer', 'admin');
  if (auth.response) return auth.response;
  const { producerId } = auth.payload;
  try {

    const producer = await prisma.producer.findUnique({
      where: { id: producerId },
      include: { subscription: true },
    });

    if (!producer) {
      return NextResponse.json({ error: 'Producer not found' }, { status: 404 });
    }

    const programs = await prisma.program.findMany({
      where: { producerId },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ producer: stripProducerSecret(producer), programs });
  } catch (error) {
    console.error('GET Dashboard Error:', error);
    return NextResponse.json({ error: 'שגיאה בטעינת הנתונים' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const auth = requireRole(request, 'producer', 'admin');
  if (auth.response) return auth.response;
  const { producerId } = auth.payload;
  try {
    const body = await request.json();
    
    if (!body.title || !body.description || !body.category || body.minAge === undefined || body.maxAge === undefined || !body.duration || !body.location) {
      return NextResponse.json({ 
        error: 'חסרים שדות חובה: כותרת, תיאור, קטגוריה, גיל מינימום, גיל מקסימום, משך, מיקום' 
      }, { status: 400 });
    }

    const minAge = parseInt(body.minAge, 10);
    const maxAge = parseInt(body.maxAge, 10);

    if (Number.isNaN(minAge) || Number.isNaN(maxAge)) {
      return NextResponse.json({ error: 'גיל מינימום וגיל מקסימום חייבים להיות מספרים תקינים' }, { status: 400 });
    }

    if (minAge < 1 || minAge > 120 || maxAge < 1 || maxAge > 120) {
      return NextResponse.json({ error: 'הגיל חייב להיות בין 1 ל-120' }, { status: 400 });
    }

    if (minAge > maxAge) {
      return NextResponse.json({ error: 'גיל מינימום לא יכול להיות גבוה מגיל מקסימום' }, { status: 400 });
    }

    const producer = await prisma.producer.findUnique({
      where: { id: producerId }
    });

    if (!producer) {
      return NextResponse.json({ error: 'Producer not found' }, { status: 404 });
    }

    const program = await prisma.program.create({
      data: {
        title: body.title,
        description: body.description,
        category: body.category,
        minAge: parseInt(body.minAge),
        maxAge: parseInt(body.maxAge),
        duration: body.duration,
        location: body.location,
        price: body.price || 0,
        audience: body.audience || 'BOTH',
        phone: body.phone || null,     // 👈 הוסף - טלפון ספציפי לתוכנית
        email: body.email || null,     // 👈 הוסף - אימייל ספציפי לתוכנית
        tags: body.tags || [],
        images: body.images || [],
        videos: body.videos || [],
        producerId,
        status: 'pending'
      },
    });

    if (producer.email) {
      try {
        await sendProgramPendingEmail(producer.email, producer.name, program.title);
      } catch (emailError) {
        console.log('שגיאה בשליחת מייל (התוכנית נשמרה):', emailError);
      }
    }

    return NextResponse.json(program);
  } catch (error) {
    console.error('POST Error:', error);
    return NextResponse.json({ 
      error: 'שגיאה בשמירת התוכנית: ' + (error as Error).message 
    }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const auth = requireRole(request, 'producer', 'admin');
  if (auth.response) return auth.response;
  const { producerId } = auth.payload;
  try {
    const body = await request.json();
    const { programId, ...updateData } = body;

    if (!programId) {
      return NextResponse.json({ error: 'Program ID required' }, { status: 400 });
    }

    const existingProgram = await prisma.program.findFirst({
      where: { id: programId, producerId }
    });

    if (!existingProgram) {
      return NextResponse.json({ error: 'Program not found' }, { status: 404 });
    }

    if (!updateData.title || !updateData.description || !updateData.category || updateData.minAge === undefined || updateData.maxAge === undefined || !updateData.duration || !updateData.location) {
      return NextResponse.json({ 
        error: 'חסרים שדות חובה: כותרת, תיאור, קטגוריה, גיל מינימום, גיל מקסימום, משך, מיקום' 
      }, { status: 400 });
    }

    const minAge = parseInt(updateData.minAge, 10);
    const maxAge = parseInt(updateData.maxAge, 10);

    if (Number.isNaN(minAge) || Number.isNaN(maxAge)) {
      return NextResponse.json({ error: 'גיל מינימום וגיל מקסימום חייבים להיות מספרים תקינים' }, { status: 400 });
    }

    if (minAge < 1 || minAge > 120 || maxAge < 1 || maxAge > 120) {
      return NextResponse.json({ error: 'הגיל חייב להיות בין 1 ל-120' }, { status: 400 });
    }

    if (minAge > maxAge) {
      return NextResponse.json({ error: 'גיל מינימום לא יכול להיות גבוה מגיל מקסימום' }, { status: 400 });
    }

    const program = await prisma.program.update({
      where: { id: programId },
      data: {
        title: updateData.title,
        description: updateData.description,
        category: updateData.category,
        minAge,
        maxAge,
        duration: updateData.duration,
        location: updateData.location,
        price: updateData.price || 0,
        audience: updateData.audience || 'BOTH',
        phone: updateData.phone || null,     // 👈 הוסף - טלפון ספציפי לתוכנית
        email: updateData.email || null,     // 👈 הוסף - אימייל ספציפי לתוכנית
        images: updateData.images || [],
        videos: updateData.videos || [],
        status: 'pending'
      },
      include: { producer: true }
    });

    if (program.producer.email) {
      try {
        await sendProgramPendingEmail(program.producer.email, program.producer.name, program.title);
      } catch (emailError) {
        console.log('שגיאה בשליחת מייל (התוכנית עודכנה):', emailError);
      }
    }

    return NextResponse.json(stripNestedProducerSecret(program));
  } catch (error) {
    console.error('PUT Error:', error);
    return NextResponse.json({ 
      error: 'שגיאה בעדכון התוכנית: ' + (error as Error).message 
    }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const auth = requireRole(request, 'producer', 'admin');
  if (auth.response) return auth.response;
  const { producerId } = auth.payload;
  try {
    const { searchParams } = new URL(request.url);
    const programId = searchParams.get('programId');

    if (!programId) {
      return NextResponse.json({ error: 'Program ID required' }, { status: 400 });
    }

    const existingProgram = await prisma.program.findFirst({
      where: { id: programId, producerId }
    });

    if (!existingProgram) {
      return NextResponse.json({ error: 'Program not found' }, { status: 404 });
    }

    await prisma.program.delete({
      where: { id: programId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE Dashboard Error:', error);
    return NextResponse.json({ error: 'שגיאה במחיקת התוכנית' }, { status: 500 });
  }
}
