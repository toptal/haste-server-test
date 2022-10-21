import { Pool } from 'pg'
import { ErrorType, StoreNames } from '@hastebin/data-store-helper'

import PostgresDocumentStore from '.'

jest.mock('pg', () => {
  const mPool = {
    connect: function () {
      return { query: jest.fn(), release: jest.fn() }
    },
    query: jest.fn(),
    end: jest.fn(),
    on: jest.fn(),
    release: jest.fn()
  }

  return { Pool: jest.fn(() => mPool) }
})

describe('Postgres store', () => {
  let pool: Pool
  let store: PostgresDocumentStore
  const mockRow = 'test_row'
  const mockRows = [{ value: 'test_row' }, { value: 'test_row_2' }]

  beforeEach(() => {
    pool = new Pool()
    store = new PostgresDocumentStore({
      type: StoreNames.Postgres,
      connectionUrl: ''
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  const mockPool = (rows: { value: string }[]) => {
    pool.connect = jest.fn().mockResolvedValue({
      query: jest.fn().mockResolvedValueOnce({ rows }),
      release: jest.fn()
    })
  }

  describe('get document', () => {
    it('should success', async () => {
      mockPool([{ value: mockRow }])
      const res = await store.get('test')

      expect(res).toEqual(mockRow)
    })

    it('should return the first result if there is more than one record', async () => {
      mockPool(mockRows)

      const res = await store.get('test')

      expect(res).toEqual(mockRow)
    })

    it('should fail if there is no record', async () => {
      mockPool([])

      try {
        await store.get('test')
      } catch (err) {
        expect((err as Error)?.message).toBe(ErrorType.DOCUMENT_NOT_FOUND)
      }
    })

    it('should fail if there is an error', async () => {
      pool.connect = jest.fn().mockImplementation(() => {
        throw new Error()
      })

      try {
        await store.get('test')
      } catch (err) {
        expect((err as Error)?.message).toBe(ErrorType.CONNECTION_ERROR)
      }
    })

    it('should fail if there is an error when reading the record from database', async () => {
      pool.connect = jest.fn().mockResolvedValue({
        query: jest.fn().mockImplementation(() => {
          throw new Error('postgres error')
        }),
        release: jest.fn()
      })

      try {
        await store.get('test')
      } catch (err) {
        expect((err as Error)?.message).toBe('postgres error')
      }
    })
  })

  describe('save document', () => {
    it('should success', async () => {
      mockPool([{ value: mockRow }])
      const res = await store.set('test', mockRow)

      expect(res).toEqual(true)
    })

    it('should fail if there is an error on adding the record to database', async () => {
      pool.connect = jest.fn().mockResolvedValue({
        query: jest.fn().mockImplementation(() => {
          throw new Error('postgres error')
        }),
        release: jest.fn()
      })

      try {
        await store.set('test', mockRow)
      } catch (err) {
        expect((err as Error)?.message).toEqual('postgres error')
      }
    })
  })
})
