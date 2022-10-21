import db from '~/lib/db'
import tables from '~/lib/db/tables'

import recordDocument from '.'

const mockInsert = jest.fn()

jest.mock('~/lib/db', () =>
  jest.fn(() => ({
    insert: mockInsert
  }))
)

describe('recordDocument', () => {
  it('delegates inserting to knex', () => {
    recordDocument('documentId', 'userId', 'ipaddress')
    expect(db).toHaveBeenCalledWith(tables.DOCUMENTS)
    expect(mockInsert).toHaveBeenCalledWith({
      id: 'documentId',
      userId: 'userId',
      ipaddress: 'ipaddress'
    })
  })
})
