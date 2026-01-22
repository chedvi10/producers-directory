import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const programs = await prisma.program.findMany({
      include: { producer: true }
    });
    return NextResponse.json({ success: true, programs });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, error: "DB Error" }, { status: 500 });
  }
}



