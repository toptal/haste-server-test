import { ErrorType, StoreNames } from '@hastebin/data-store-helper'

import RedisDataStore from '.'

const keys = {
  success: 'success-key',
  notFoundKey: 'success-not-found-key',
  failKey: 'success-fail-key'
}

jest.mock('redis', () => ({
  createClient: jest.fn().mockImplementation(() => ({
    connect: jest.fn(),
    on: jest.fn(),
    get: jest.fn().mockImplementation(key => {
      if (key === keys.success) {
        return 'success-value'
      }
      if (key === keys.notFoundKey) {
        return undefined
      }
      if (key === keys.failKey) {
        throw new Error('error')
      }
    }),
    set: jest.fn().mockImplementation(key => {
      if (key === keys.success) {
        return 'OK'
      }

      if (key === keys.notFoundKey) {
        return 'NOT OK'
      }

      if (key === keys.failKey) {
        throw new Error('error')
      }
    })
  }))
}))

describe('Redis Data Store', () => {
  const expire = 10
  let store: RedisDataStore

  beforeEach(() => {
    store = new RedisDataStore({ type: StoreNames.Redis, expire })
  })

  describe('get document', () => {
    it('correctly gets value', async () => {
      expect(await store.get(keys.success)).toEqual('success-value')
    })

    it('fails with no record on db', async () => {
      try {
        await store.get(keys.notFoundKey)
      } catch (err) {
        expect((err as Error).message).toEqual(ErrorType.DOCUMENT_NOT_FOUND)
      }
    })

    it('fails with an error on db request', async () => {
      try {
        await store.get(keys.failKey)
      } catch (err) {
        expect((err as Error).message).toEqual(ErrorType.GET_DOCUMENT_ERROR)
      }
    })
  })

  describe('set document', () => {
    it('correctly sets value', async () => {
      expect(await store.set(keys.success, 'value')).toEqual(true)
    })

    it('correctly sets value with expire time', async () => {
      expect(await store.set(keys.success, 'value', false)).toEqual(true)
      expect(store.client.set).toHaveBeenCalledWith(keys.success, 'value', {
        EX: expire
      })
    })

    it('fails with an error on db request', async () => {
      try {
        await store.set(keys.failKey, 'value')
      } catch (err) {
        expect((err as Error).message).toEqual(ErrorType.ADD_DOCUMENT_ERROR)
      }
    })
  })
})
