import type { PrismaClient } from '@prisma/client'
import { mockDeep, mockReset, DeepMockProxy } from 'jest-mock-extended'

import { findUserByEmail, updateUserApiToken } from '~/lib/repositories/user'
import { userMock } from '~/test/mock/user'
import prisma from '~/prisma/client'

jest.mock('~/prisma/client', () => ({
  __esModule: true,
  default: mockDeep<PrismaClient>()
}))

export const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>

describe('findUserByEmail', () => {
  beforeEach(() => {
    mockReset(prismaMock)
  })

  beforeEach(() => {
    prismaMock.user.findUniqueOrThrow.mockResolvedValue(userMock)
  })

  it('returns the user', async () => {
    expect(await findUserByEmail('usermail@email.co')).toEqual(userMock)
  })
})

describe('updateUserApiToken', () => {
  beforeEach(() => {
    mockReset(prismaMock)
  })

  beforeEach(() => {
    prismaMock.user.update.mockResolvedValue(userMock)
  })

  it('returns the updated user', async () => {
    expect(await updateUserApiToken('usermail@email.co')).toEqual(userMock)
  })
})
