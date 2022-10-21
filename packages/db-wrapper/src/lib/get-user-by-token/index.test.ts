import { ErrorType } from '~/../../data-store-helper/dist'

import db from '~/lib/db'
import tables from '~/lib/db/tables'

import getUserByToken from '.'

const mockUser = { id: 1, name: 'auser' }

const mockFirst = jest.fn()

const mockWhere = jest.fn(() => ({
  first: mockFirst
}))

jest.mock('~/lib/db', () =>
  jest.fn(() => ({
    where: mockWhere
  }))
)

describe('getUserByToken', () => {
  describe('when returns user', () => {
    beforeEach(() => {
      mockFirst.mockImplementationOnce(() => mockUser)
    })

    it('delegates querying to knex', () => {
      getUserByToken('sometoken')
      expect(db).toHaveBeenCalledWith(tables.USERS)
      expect(mockWhere).toHaveBeenCalledWith({ apiToken: 'sometoken' })
    })

    it('returns the user', async () => {
      expect(await getUserByToken('sometoken')).toEqual(mockUser)
    })
  })

  describe('when user is not found', () => {
    beforeEach(() => {
      mockFirst.mockImplementationOnce(() => null)
    })

    it('returns the user', async () => {
      await expect(() => getUserByToken('sometoken')).rejects.toThrow(
        ErrorType.USER_NOT_FOUND
      )
    })
  })
})
