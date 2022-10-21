import crypto from 'crypto'

import { User } from '@prisma/client'

import prisma from '~/prisma/client'

export const findUserByEmail = async (email: string): Promise<User> => {
  return await prisma.user.findUniqueOrThrow({
    where: { email }
  })
}

export const updateUserApiToken = async (email: string): Promise<User> => {
  return await prisma.user.update({
    where: { email },
    data: { apiToken: crypto.randomBytes(64).toString('hex') }
  })
}
