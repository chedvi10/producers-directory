import { PrismaClient } from '@prisma/client';

// סקריפט מיגרציה חד-פעמי: מעבר מ-isAdmin ל-role
// הרצה: npx tsx prisma/migrate-admin-role.ts
//
// 1. משתמשות עם isAdmin: true מקבלות role: 'admin'
// 2. משתמשות ללא שדה role מקבלות role: 'producer'
// 3. שדה isAdmin נמחק מכל המסמכים

const prisma = new PrismaClient();

async function main() {
  const result = await prisma.$runCommandRaw({
    update: 'Producer',
    updates: [
      { q: { isAdmin: true }, u: { $set: { role: 'admin' } }, multi: true },
      { q: { role: { $exists: false } }, u: { $set: { role: 'producer' } }, multi: true },
      { q: { isAdmin: { $exists: true } }, u: { $unset: { isAdmin: '' } }, multi: true },
    ],
  });

  console.log('✅ המיגרציה הושלמה:', JSON.stringify(result));

  const admins = await prisma.producer.findMany({
    where: { role: 'admin' },
    select: { email: true, name: true },
  });
  console.log('מנהלות במערכת:', admins.map((a) => a.email).join(', ') || 'אין');
}

main()
  .catch((e) => {
    console.error('❌ שגיאה במיגרציה:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
