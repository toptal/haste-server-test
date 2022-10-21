/* eslint-disable no-console */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const defaultUserData = {
    email: 'johndoe@email.com',
    name: 'John Doe',
    apiToken: 'originaltoken'
  }
  const john = await prisma.user.upsert({
    where: { email: 'johndoe@email.com' },
    update: { ...defaultUserData },
    create: { ...defaultUserData }
  })

  console.log({ john })
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
