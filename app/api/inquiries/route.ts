import { NextResponse, after } from 'next/server';
import { NextRequest } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/api-auth';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';
import { sanitizeString, validateInquiry } from '@/lib/validation';
import { INQUIRY_STATUS_VALUES } from '@/lib/constants';
import { sendNewInquiryEmail } from '@/lib/email';

// POST - שליחת פנייה חדשה (פתוח - גם למי שלא מחוברת)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = validateInquiry(body);

    const program = await prisma.program.findFirst({
      where: { id: data.programId, status: 'approved' },
      include: { producer: true },
    });

    if (!program) {
      return NextResponse.json({ error: 'התוכנית לא נמצאה' }, { status: 404 });
    }

    // אם הפונה מחוברת - נשייך את הפנייה לחשבון שלה
    let coordinatorId: string | null = null;
    let coordinatorInstitution: string | null = null;
    const token = getTokenFromRequest(request);
    if (token) {
      try {
        coordinatorId = verifyToken(token).producerId;
        if (coordinatorId) {
          const coordinator = await prisma.producer.findUnique({
            where: { id: coordinatorId },
            select: { institution: true, role: true },
          });
          if (coordinator?.role === 'coordinator' && coordinator.institution) {
            coordinatorInstitution = coordinator.institution;
          }
        }
      } catch {
        // טוקן לא תקין - הפנייה תישמר כאנונימית
      }
    }

    const contactInstitution = coordinatorInstitution || (data.contactInstitution ? sanitizeString(data.contactInstitution) : null);

    const inquiry = await prisma.inquiry.create({
      data: {
        message: sanitizeString(data.message),
        contactName: sanitizeString(data.contactName),
        contactPhone: sanitizeString(data.contactPhone),
        contactEmail: data.contactEmail ? sanitizeString(data.contactEmail) : null,
        contactInstitution,
        coordinatorId,
        programId: program.id,
        producerId: program.producerId,
      },
    });

    // שליחת המייל אחרי החזרת התשובה - לא מעכבים את הפונה על שרת ה-SMTP
    if (program.producer.email) {
      after(() =>
        sendNewInquiryEmail(
          program.producer.email,
          program.producer.name,
          program.title,
          { name: inquiry.contactName, phone: inquiry.contactPhone, email: inquiry.contactEmail, institution: inquiry.contactInstitution },
          inquiry.message
        )
      );
    }

    return NextResponse.json({ success: true, inquiryId: inquiry.id });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        error: error.issues[0]?.message || 'נתונים לא תקינים'
      }, { status: 400 });
    }
    console.error('POST Inquiry Error:', error);
    return NextResponse.json({ error: 'שגיאה בשליחת הפנייה' }, { status: 500 });
  }
}

// GET - הפניות שקיבלה המפיקה המחוברת
export async function GET(request: NextRequest) {
  const auth = requireRole(request, 'producer', 'admin');
  if (auth.response) return auth.response;
  const producerId = auth.payload.producerId;

  try {
    const [inquiries, newCount] = await Promise.all([
      prisma.inquiry.findMany({
        where: { producerId },
        include: { program: { select: { title: true } } },
        orderBy: { createdAt: 'desc' },
        take: 100, // הגבלת גודל התשובה - הפניות האחרונות
      }),
      prisma.inquiry.count({ where: { producerId, status: 'new' } }),
    ]);

    return NextResponse.json({ inquiries, newCount });
  } catch (error) {
    console.error('GET Inquiries Error:', error);
    return NextResponse.json({ error: 'שגיאה בטעינת הפניות' }, { status: 500 });
  }
}

// PUT - עדכון סטטוס פנייה על ידי המפיקה
export async function PUT(request: NextRequest) {
  const auth = requireRole(request, 'producer', 'admin');
  if (auth.response) return auth.response;
  const producerId = auth.payload.producerId;

  try {
    const { inquiryId, status } = await request.json();

    if (!inquiryId || !INQUIRY_STATUS_VALUES.includes(status)) {
      return NextResponse.json({ error: 'נתונים לא תקינים' }, { status: 400 });
    }

    // updateMany עם סינון בעלות - עדכון ובדיקת הרשאה בשאילתה אחת
    const result = await prisma.inquiry.updateMany({
      where: { id: inquiryId, producerId },
      data: { status },
    });

    if (result.count === 0) {
      return NextResponse.json({ error: 'הפנייה לא נמצאה' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('PUT Inquiry Error:', error);
    return NextResponse.json({ error: 'שגיאה בעדכון הפנייה' }, { status: 500 });
  }
}
