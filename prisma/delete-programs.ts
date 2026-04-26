import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // מחיקה ישירה של כל התוכניות
  const result = await prisma.$runCommandRaw({
    delete: 'Program',
    deletes: [{ q: {}, limit: 0 }]
  });

  console.log('✅ כל התוכניות נמחקו!', result);
}

main()
  .catch((e) => {
    console.error('❌ שגיאה:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
