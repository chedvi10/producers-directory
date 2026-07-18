/* eslint-disable @typescript-eslint/no-require-imports */
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const admin = await prisma.producer.findUnique({
      where: { email: 'c0556731959@gmail.com' },
      select: { id: true, email: true, name: true, isAdmin: true }
    });
    
    if (admin) {
      console.log('✅ Admin found:', admin);
    } else {
      console.log('❌ Admin not found');
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();
