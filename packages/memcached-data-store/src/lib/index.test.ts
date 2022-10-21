import { ErrorType, StoreNames } from '@hastebin/data-store-helper'

import db from './db'

import MemcachedDocumentStore from '.'

db.createDbClient = jest.fn().mockImplementation(() => {
  return {
    on: jest.fn(),
    getAsync: jest.fn().mockImplementation(key => {
      if (key === 'successkey') {
        return 'data'
      }
      if (key === 'failkey') {
        throw new Error('error')
      }
      if (key === 'notfoundkey') {
        return undefined
      }
    }),
    setAsync: jest.fn().mockImplementation(key => {
      if (key === 'successkey') {
        return true
      }
      if (key === 'failkey') {
        return undefined
      }
    })
  }
})

const mockExpireTime = 10

describe('Memcached store', () => {
  let store: MemcachedDocumentStore

  beforeEach(() => {
    store = new MemcachedDocumentStore({
      type: StoreNames.Memcached,
      expire: mockExpireTime
    })

    jest.clearAllMocks()
  })

  describe('get document', () => {
    it('correctly expires with expire time', async () => {
      const res = await store.get('successkey')

      expect(store.client.setAsync).toHaveBeenCalledWith(
        'successkey',
        'data',
        10
      )

      expect(res).toEqual('data')
    })

    it('correctly expires without expire time', async () => {
      const res = await store.get('successkey', true)

      expect(store.client.setAsync).not.toHaveBeenCalled()
      expect(res).toEqual('data')
    })

    it('fails with an error on db request', async () => {
      try {
        await store.get('failkey')
      } catch (err) {
        expect((err as Error)?.message).toBe(ErrorType.GET_DOCUMENT_ERROR)
      }
    })

    it('fails with no record on db', async () => {
      try {
        await store.get('notfoundkey')
      } catch (err) {
        expect((err as Error)?.message).toBe(ErrorType.DOCUMENT_NOT_FOUND)
      }
    })
  })

  describe('set document', () => {
    it('correctly expires without expire time', async () => {
      const res = await store.set('successkey', 'value', true)

      expect(res).toEqual(true)

      expect(store.client.setAsync).toHaveBeenCalledWith(
        'successkey',
        'value',
        0
      )
    })

    it('correctly expires with expire time', async () => {
      const res = await store.set('successkey', 'value', false)

      expect(res).toEqual(true)

      expect(store.client.setAsync).toHaveBeenCalledWith(
        'successkey',
        'value',
        mockExpireTime
      )
    })

    it('fails with error adding document to db', async () => {
      try {
        await store.set('failkey', 'value')
      } catch (err) {
        expect((err as Error)?.message).toBe(ErrorType.ADD_DOCUMENT_ERROR)
      }
    })
  })
})
