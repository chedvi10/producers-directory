const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function deleteAllPrograms() {
  try {
    const result = await prisma.program.deleteMany({});
    console.log(`✅ נמחקו ${result.count} תוכניות בהצלחה!`);
  } catch (error) {
    console.error('❌ שגיאה במחיקה:', error);
  } finally {
    await prisma.$disconnect();
  }
}

deleteAllPrograms();
