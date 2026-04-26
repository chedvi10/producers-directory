import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('admin1959', 10);
  
  const admin = await prisma.producer.upsert({
    where: { email: 'c0556731959@gmail.com' },
    update: {
      isAdmin: true,
      passwordHash: passwordHash,
    },
    create: {
      name: 'מנהלת ראשית',
      email: 'c0556731959@gmail.com',
      phone: '0556731959',
      passwordHash: passwordHash,
      isAdmin: true,
    },
  });

  console.log('✅ מנהלת נוצרה בהצלחה:', admin.email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
