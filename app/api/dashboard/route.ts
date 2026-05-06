import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { validateAuth } from '@/lib/auth';
import { sendProgramPendingEmail } from '@/lib/email';

export async function GET(request: NextRequest) {
  try {
    const { producerId } = validateAuth(request);

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

    return NextResponse.json({ producer, programs });
  } catch (error) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { producerId } = validateAuth(request);
    const body = await request.json();
    
    console.log('POST - Received data:', body);
    
    if (!body.title || !body.description || !body.category || !body.targetAge || !body.duration || !body.location) {
      return NextResponse.json({ 
        error: 'חסרים שדות חובה: כותרת, תיאור, קטגוריה, גיל מטרה, משך, מיקום' 
      }, { status: 400 });
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
        targetAge: body.targetAge,
        duration: body.duration,
        location: body.location,
        price: body.price || 0,
        tags: body.tags || [],
        images: body.images || [],
        videos: body.videos || [],
        producerId,
        status: 'pending'
      },
    });

    console.log('Program created:', program.id);

    if (producer.email) {
      await sendProgramPendingEmail(producer.email, producer.name, program.title);
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
  try {
    const { producerId } = validateAuth(request);
    const body = await request.json();
    const { programId, ...updateData } = body;

    console.log('PUT - Received data:', { programId, updateData });

    if (!programId) {
      return NextResponse.json({ error: 'Program ID required' }, { status: 400 });
    }

    const existingProgram = await prisma.program.findFirst({
      where: { id: programId, producerId }
    });

    if (!existingProgram) {
      return NextResponse.json({ error: 'Program not found' }, { status: 404 });
    }

    if (!updateData.title || !updateData.description || !updateData.category || !updateData.targetAge || !updateData.duration || !updateData.location) {
      return NextResponse.json({ 
        error: 'חסרים שדות חובה: כותרת, תיאור, קטגוריה, גיל מטרה, משך, מיקום' 
      }, { status: 400 });
    }

    const program = await prisma.program.update({
      where: { id: programId },
      data: {
        title: updateData.title,
        description: updateData.description,
        category: updateData.category,
        targetAge: updateData.targetAge,
        duration: updateData.duration,
        location: updateData.location,
        price: updateData.price || 0,
        images: updateData.images || [],
        videos: updateData.videos || [],
        status: 'pending'
      },
      include: { producer: true }
    });

    console.log('Program updated:', program.id);

    if (program.producer.email) {
      await sendProgramPendingEmail(program.producer.email, program.producer.name, program.title);
    }

    return NextResponse.json(program);
  } catch (error) {
    console.error('PUT Error:', error);
    return NextResponse.json({ 
      error: 'שגיאה בעדכון התוכנית: ' + (error as Error).message 
    }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { producerId } = validateAuth(request);
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
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
