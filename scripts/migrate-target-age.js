/**
 * מיגרציה חד-פעמית: המרת השדה הישן `targetAge` (טקסט חופשי)
 * לשדות החדשים `minAge` / `maxAge` (מספרים) + `audience`.
 *
 * נדרש אחרי שינוי הסכימה מ-targetAge ל-minAge/maxAge, כדי שתוכניות
 * ישנות שנוצרו לפני השינוי יהיו קריאות (Prisma נכשל על minAge=null).
 *
 * הרצה:  node scripts/migrate-target-age.js
 * הסקריפט אינו הרסני - הוא רק ממלא שדות חסרים ומסיר את targetAge המיושן.
 */
/* eslint-disable @typescript-eslint/no-require-imports */
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const HEBREW_GRADE = { 'א': 1, 'ב': 2, 'ג': 3, 'ד': 4, 'ה': 5, 'ו': 6, 'ז': 7, 'ח': 8, 'ט': 9, 'י': 10 };

// ברירת מחדל רחבה כשלא ניתן לפענח את הטקסט - ניתן לעריכה ידנית אח"כ מהאתר
const DEFAULT_RANGE = { minAge: 6, maxAge: 18 };

function parseTargetAge(targetAge) {
  if (!targetAge || typeof targetAge !== 'string') return { ...DEFAULT_RANGE };

  // טווח מספרי: "6-12", "6 - 12", "6–12"
  const range = targetAge.match(/(\d+)\s*[-–]\s*(\d+)/);
  if (range) return { minAge: Number(range[1]), maxAge: Number(range[2]) };

  // מספר בודד: "גיל 8"
  const single = targetAge.match(/(\d+)/);
  if (single) {
    const age = Number(single[1]);
    return { minAge: age, maxAge: age };
  }

  // כיתה עברית: "כיתה ט'" -> כיתה = גיל + 5
  const grade = targetAge.match(/כית[הת]?\s*['"]?\s*([א-י])/);
  if (grade && HEBREW_GRADE[grade[1]]) {
    const age = HEBREW_GRADE[grade[1]] + 5;
    return { minAge: age, maxAge: age + 1 };
  }

  return { ...DEFAULT_RANGE };
}

function inferAudience(text) {
  const t = (text || '').toString();
  if (/בנות|נשים|נערות/.test(t)) return 'WOMEN';
  if (/בנים|גברים|נערים/.test(t)) return 'MEN';
  return 'BOTH';
}

(async () => {
  // קריאה גולמית - עוקפת את בדיקת הטיפוסים של Prisma שנכשלת על השדות הישנים
  const res = await prisma.$runCommandRaw({ find: 'Program', filter: {} });
  const docs = res.cursor.firstBatch;

  const needMigration = docs.filter(
    (p) => p.minAge === undefined || p.minAge === null || p.maxAge === undefined || p.maxAge === null
  );

  console.log(`סה"כ תוכניות: ${docs.length} | דורשות מיגרציה: ${needMigration.length}`);
  if (needMigration.length === 0) {
    console.log('אין מה לעדכן - כל התוכניות תקינות.');
    await prisma.$disconnect();
    return;
  }

  let updated = 0;
  for (const p of needMigration) {
    const { minAge, maxAge } = parseTargetAge(p.targetAge);
    const audience = p.audience || inferAudience(`${p.title} ${p.targetAge}`);

    await prisma.$runCommandRaw({
      update: 'Program',
      updates: [
        {
          q: { _id: p._id },
          u: {
            $set: { minAge, maxAge, audience },
            $unset: { targetAge: '' },
          },
        },
      ],
    });

    updated++;
    console.log(`✓ "${p.title}": targetAge="${p.targetAge}" → minAge=${minAge}, maxAge=${maxAge}, audience=${audience}`);
  }

  console.log(`\nהושלם. עודכנו ${updated} תוכניות.`);
  await prisma.$disconnect();
})().catch((e) => {
  console.error('שגיאה במיגרציה:', e.message);
  process.exit(1);
});
