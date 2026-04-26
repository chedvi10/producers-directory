import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const admin = await prisma.producer.update({
    where: { email: 'c0556731959@gmail.com' },
    data: { isAdmin: true }
  });

  console.log('✅ המנהלת עודכנה:', admin.email, '- isAdmin:', admin.isAdmin);
}

main()
  .catch((e) => {
    console.error('❌ שגיאה:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
