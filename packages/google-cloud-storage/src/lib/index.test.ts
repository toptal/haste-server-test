import { ErrorType, StoreNames } from '@hastebin/data-store-helper'

import GoogleCloudStorage from '.'

const keys = {
  success: 'success_key',
  notFoundKey: 'success-not-found-key',
  failKey: 'success-fail-key'
}

jest.mock('@google-cloud/storage', () => {
  return {
    Storage: jest.fn().mockImplementation(() => {
      return {
        constructor: jest.fn().mockReturnValue('test-storage'),
        bucket: jest.fn().mockImplementation(() => ({
          file: jest.fn().mockImplementation(key => ({
            createReadStream: jest.fn().mockImplementation(() => ({
              on: (_: string, cb: any) => {
                if (key.includes(keys.success)) {
                  cb(Buffer.from('success_value', 'utf8'))
                }

                if (key.includes(keys.failKey)) {
                  throw new Error('not found')
                }

                if (key.includes(keys.notFoundKey)) {
                  cb()
                }
              }
            })),
            createWriteStream: jest.fn().mockImplementation(() => ({
              on: () => {
                if (key.includes(keys.failKey)) {
                  throw new Error('not found')
                }
              },
              once: jest.fn(),
              emit: jest.fn(),
              end: jest.fn(),
              destroy: jest.fn(),
              write: jest.fn()
            }))
          }))
        }))
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

jest.mock('stream/promises', () => {
  return {
    pipeline: jest.fn().mockImplementation(() => {
      return Promise.resolve(true)
    })
  }
})

describe('Google cloud storage', () => {
  let store: GoogleCloudStorage

  beforeEach(() => {
    store = new GoogleCloudStorage({
      type: StoreNames.GoogleCloudStorage,
      expire: 10,
      path: '/',
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
