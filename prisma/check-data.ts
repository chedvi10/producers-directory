import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const producers = await prisma.producer.findMany({
    include: { programs: true }
  });
  console.log("Found producers:", producers.length);
  console.log(JSON.stringify(producers, null, 2));
  console.log(process.env.DATABASE_URL)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
