import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  await prisma.producer.create({
    data: {
      name: "חנה כהן",
      email: "hana@example.com",
      phone: "050-1234567",
      passwordHash: "hashed-password",
      programs: {
        create: [
          {
            title: "הצגה על ערכים",
            description: "מופע לנערות בנושא ערכים והתבגרות",
            category: "חינוך",
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
}

main()
  .then(() => console.log("Seed success!"))
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
