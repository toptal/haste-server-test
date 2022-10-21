import { StatusCodes } from 'http-status-codes'
import { testApiHandler } from 'next-test-api-route-handler'
import type { PageConfig } from 'next'
import { NotFoundError } from '@prisma/client/runtime'

import endpoint from '~/pages/api/token'

import { mockSession } from '~/test/mock/session'
import { userMock } from '~/test/mock/user'

jest.mock('~/lib/repositories/user')
jest.mock('next-auth/next')
jest.mock('~/lib/log')

const findUserByEmailSpy = jest.spyOn(
  require('~/lib/repositories/user'),
  'findUserByEmail'
)

const updateUserApiTokenSpy = jest.spyOn(
  require('~/lib/repositories/user'),
  'updateUserApiToken'
)

const useSessionSpy = jest.spyOn(
  require('next-auth/next'),
  'unstable_getServerSession'
)

const handler: typeof endpoint & { config?: PageConfig } = endpoint

describe('Token handling api', () => {
  describe('when there is no session', () => {
    beforeAll(() => {
      useSessionSpy.mockImplementation(() => null)
    })

    it('returns unauthorized', async () => {
      expect.hasAssertions()

      await testApiHandler({
        handler,
        test: async ({ fetch }) => {
          const res = await fetch({ method: 'GET' })

          expect(res.status).toEqual(StatusCodes.UNAUTHORIZED)
        }
      })
    })
  })

  describe('when session is present', () => {
    beforeAll(() => {
      useSessionSpy.mockImplementation(() => mockSession)
    })

    it.each(['PUT', 'PATCH', 'DELETE'])(
      'does not accept %p method',
      async () => {
        expect.hasAssertions()

        await testApiHandler({
          handler,
          test: async ({ fetch }) => {
            const res = await fetch({ method: 'PUT' })

            expect(res.status).toEqual(StatusCodes.METHOD_NOT_ALLOWED)
          }
        })
      }
    )

    describe('get token', () => {
      describe('when user exists', () => {
        beforeEach(() => {
          findUserByEmailSpy.mockImplementationOnce(() => userMock)
        })

        it('returns user token', async () => {
          expect.hasAssertions()

          await testApiHandler({
            handler,
            test: async ({ fetch }) => {
              const res = await fetch({ method: 'GET' })

              expect(res.status).toEqual(StatusCodes.OK)
              await expect(res.json()).resolves.toMatchObject({
                apiToken: userMock.apiToken
              })
            }
          })
        })
      })

      describe('when user does not exist', () => {
        beforeEach(() => {
          findUserByEmailSpy.mockImplementationOnce(() => {
            throw new NotFoundError('User not found')
          })
        })

        it('returns 404', async () => {
          expect.hasAssertions()

          await testApiHandler({
            handler,
            test: async ({ fetch }) => {
              const res = await fetch({ method: 'GET' })

              expect(res.status).toEqual(StatusCodes.NOT_FOUND)
            }
          })
        })
      })
    })

    describe('generate token', () => {
      describe('when user exists', () => {
        beforeEach(() => {
          updateUserApiTokenSpy.mockImplementationOnce(() => userMock)
        })

        it('returns new token', async () => {
          expect.hasAssertions()

          await testApiHandler({
            handler,
            test: async ({ fetch }) => {
              const res = await fetch({ method: 'POST' })

              expect(res.status).toEqual(StatusCodes.OK)
              await expect(res.json()).resolves.toMatchObject({
                apiToken: userMock.apiToken
              })
            }
          })
        })
      })

      describe('when user does not exist', () => {
        beforeEach(() => {
          findUserByEmailSpy.mockImplementationOnce(() => {
            throw new Error('User not found')
          })
        })

        it('returns 500', async () => {
          expect.hasAssertions()

          await testApiHandler({
            handler,
            test: async ({ fetch }) => {
              const res = await fetch({ method: 'GET' })

              expect(res.status).toEqual(StatusCodes.INTERNAL_SERVER_ERROR)
            }
          })
        })
      })
    })
  })
})
