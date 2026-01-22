import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // מחק נתונים קיימים
  await prisma.program.deleteMany({});
  await prisma.subscription.deleteMany({});
  await prisma.producer.deleteMany({});

  // צור סיסמה מוצפנת
  const passwordHash = await bcrypt.hash("123456", 10);

  await prisma.producer.create({
    data: {
      name: "חנה כהן",
      email: "hana@example.com",
      phone: "050-1234567",
      passwordHash,
      subscription: {
        create: {
          expiryDate: new Date("2025-12-31"),
          status: "active",
        }
      },
      programs: {
        create: [
          {
            title: "הצגה על ערכים",
            description: "מופע לנערות בנושא ערכים והתבגרות",
            category: "תוכניות",
            targetAge: "כיתה ט'",
            duration: "60 דקות",
            location: "כל הארץ",
            price: 1200,
            tags: ["ערכים", "נוער", "הצגה"]
          }
        ]
      }
    }
  });

  console.log("✅ נוצרה מפיקה!");
  console.log("📧 אימייל: hana@example.com");
  console.log("🔑 סיסמה: 123456");
}

main()
  .then(() => console.log("Seed success!"))
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
