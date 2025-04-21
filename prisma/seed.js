import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  for (let i = 0; i <= 29; i++) {
    await prisma.vacancy.create({})
  }
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect())
