import { ErrorType, StoreNames } from '@hastebin/data-store-helper'

import GoogleCloudDataStore from '.'

const keys = {
  success: 'success-key',
  expiredKey: 'expired-key',
  notFoundKey: 'success-not-found-key',
  failKey: 'success-fail-key'
}

jest.mock('@google-cloud/datastore', () => {
  return {
    Datastore: jest.fn().mockImplementation(() => {
      return {
        constructor: jest.fn().mockReturnValue('test-storage'),
        update: jest.fn().mockResolvedValue(true),
        get: jest.fn().mockImplementation(taskKey => {
          if (taskKey === keys.success) {
            return [
              {
                value: 'success_value'
              }
            ]
          }

          if (taskKey === keys.expiredKey) {
            return [
              {
                value: 'success_value',
                expiration: '12.02.2000'
              }
            ]
          }

          if (taskKey === keys.failKey) {
            throw new Error('error')
          }

          if (taskKey === keys.notFoundKey) {
            return undefined
          }
        }),
        insert: jest.fn().mockImplementation(taskKey => {
          if (taskKey.key === keys.success) {
            return [
              {
                indexUpdates: 1
              }
            ]
          }

          if (taskKey.key === keys.failKey) {
            throw new Error('error')
          }

          if (taskKey.key === keys.notFoundKey) {
            return [
              {
                indexUpdates: 0
              }
            ]
          }
        }),
        key: jest.fn().mockImplementation(key => key[1])
      }
    })
  }
})

describe('Google Cloud Data Store', () => {
  let store: GoogleCloudDataStore

  beforeEach(() => {
    store = new GoogleCloudDataStore({
      type: StoreNames.GoogleDataStore,
      expire: 10
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('get document', () => {
    it('has correct response on success', async () => {
      const res = await store.get(keys.success)

      expect(res).toEqual('success_value')
    })

    it('has correct response on success with expiration', async () => {
      const res = await store.get(keys.expiredKey)

      expect(store.datastore.update).toHaveBeenCalledWith(
        expect.objectContaining({
          key: keys.expiredKey
        })
      )

      expect(res).toEqual('success_value')
    })

    it('fails with no record on db', async () => {
      try {
        await store.get(keys.failKey)
      } catch (err) {
        expect((err as Error)?.message).toBe(ErrorType.GET_DOCUMENT_ERROR)
      }
    })

    it('fails with an error', async () => {
      try {
        await store.get(keys.notFoundKey)
      } catch (err) {
        expect((err as Error)?.message).toBe(ErrorType.DOCUMENT_NOT_FOUND)
      }
    })
  })

  describe('save document', () => {
    it('has correct response on success', async () => {
      const res = await store.set(keys.success, 'data')

      expect(store.datastore.insert).toHaveBeenCalledWith(
        expect.objectContaining({
          key: keys.success
        })
      )

      expect(res).toEqual(true)
    })

    it('fails with an error on adding the record to database', async () => {
      try {
        await store.set(keys.failKey, 'data')
      } catch (err) {
        expect((err as Error)?.message).toEqual(ErrorType.ADD_DOCUMENT_ERROR)
      }
    })

    it('fails with no record on db', async () => {
      const res = await store.set(keys.notFoundKey, 'data')

      expect(res).toEqual(false)
    })
  })
})
