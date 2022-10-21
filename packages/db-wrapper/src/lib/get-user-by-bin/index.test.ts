import { ErrorType } from '~/../../data-store-helper/dist'

import db from '~/lib/db'
import tables from '~/lib/db/tables'

import getUserByBin from '.'

const mockUser = { id: 1, name: 'auser' }

const mockFirst = jest.fn()

const mockDistinct = jest.fn(() => ({
  first: mockFirst
}))

const mockWhere = jest.fn(() => ({
  distinct: mockDistinct
}))

const mockJoin = jest.fn(() => ({
  where: mockWhere
}))

jest.mock('~/lib/db', () =>
  jest.fn(() => ({
    join: mockJoin
  }))
)

describe('getUserByToken', () => {
  describe('when returns user', () => {
    beforeEach(() => {
      mockFirst.mockImplementationOnce(() => mockUser)
    })

    it('delegates querying to knex', () => {
      const binId = 'somebin'

      getUserByBin(binId)

      expect(db).toHaveBeenCalledWith(tables.USERS)
      expect(mockJoin).toHaveBeenCalledWith(
        tables.DOCUMENTS,
        `${tables.DOCUMENTS}.userId`,
        `${tables.USERS}.id`
      )
      expect(mockWhere).toHaveBeenCalledWith(`${tables.DOCUMENTS}.id`, binId)
      expect(mockDistinct).toHaveBeenCalled()
    })
  })

  describe('when user is not found', () => {
    beforeEach(() => {
      mockFirst.mockImplementationOnce(() => null)
    })

    it('returns the user', async () => {
      await expect(() => getUserByBin('invalidbin')).rejects.toThrow(
        ErrorType.USER_NOT_FOUND
      )
    })
  })
})
