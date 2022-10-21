import { ErrorType, StoreNames } from '@hastebin/data-store-helper'

import AmazonS3DataStore from '.'

const keys = {
  success: 'success_key',
  notFoundKey: 'success-not-found-key',
  failKey: 'success-fail-key'
}

jest.mock('@aws-sdk/client-s3', () => {
  return {
    S3Client: jest.fn().mockImplementation(() => {
      return {
        constructor: jest.fn().mockReturnValue('test-storage'),
        send: jest.fn().mockReturnValue({ Body: 'doc' })
      }
    }),
    GetObjectCommand: jest.fn().mockImplementation(() => {
      return {
        constructor: jest.fn()
      }
    }),
    PutObjectCommand: jest.fn().mockImplementation(() => {
      return {
        constructor: jest.fn()
      }
    })
  }
})

jest.mock('stream/consumers', () => {
  return {
    text: jest.fn().mockImplementation(() => {
      return Promise.resolve('success_value')
    })
  }
})

describe('Amazon S3 Data store', () => {
  let store: AmazonS3DataStore

  beforeEach(() => {
    store = new AmazonS3DataStore({
      type: StoreNames.AmazonS3,
      region: 'eu-central-1',
      bucket: 'bucket'
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

    it('fails with no record on cloud', async () => {
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

      expect(res).toEqual(true)
    })

    it('fails with an error on adding the record to cloud', async () => {
      try {
        await store.set(keys.failKey, 'data')
      } catch (err) {
        expect((err as Error)?.message).toEqual(ErrorType.ADD_DOCUMENT_ERROR)
      }
    })
  })
})
