import { MongoClient } from 'mongodb'
import { ErrorType, StoreNames } from '@hastebin/data-store-helper'

import MongoDocumentStore from '.'

import type { MongoStoreConfig } from '~/types'

jest.mock('mongodb', () => {
  return {
    MongoClient: {
      connect: jest.fn(() => ({
        db: jest.fn(() => ({
          collection: jest.fn(() => ({
            findOne: jest.fn(() => ({ _id: 1, value: mockData })),
            updateOne: jest.fn()
          }))
        })),
        close: jest.fn()
      }))
    }
  }
})

const mockData = 'data'
const mockKey = 'key'
const mockOptions: MongoStoreConfig = {
  type: StoreNames.Mongo,
  connectionUrl: ''
}

describe('Mongo Data Store', () => {
  const connectMock = MongoClient.connect as unknown as jest.Mock

  beforeEach(() => {
    jest.clearAllMocks()
  })

  const mongoStore = new MongoDocumentStore({
    ...mockOptions,
    expire: 10
  })

  it('correctly gets document', async () => {
    const result = await mongoStore.get(mockKey)

    expect(result).toEqual(mockData)
  })

  it('correctly sets document', async () => {
    const result = await mongoStore.set(mockKey, mockData)

    expect(result).toEqual(true)
  })

  describe('throws an error', () => {
    beforeEach(() => {
      jest.clearAllMocks()
    })

    it('on connection fail', async () => {
      connectMock.mockImplementationOnce(() => {
        throw new Error(ErrorType.CONNECTION_ERROR)
      })
      const result = mongoStore.get(mockKey)

      await expect(result).rejects.toThrow(
        new Error(ErrorType.CONNECTION_ERROR)
      )
    })

    it('on invalid key in get', async () => {
      connectMock.mockImplementationOnce(() => ({
        db: jest.fn(() => ({
          collection: jest.fn(() => ({
            findOne: jest.fn(() => null)
          }))
        })),
        close: jest.fn()
      }))

      try {
        await mongoStore.get('')
      } catch (err) {
        expect((err as Error).message).toEqual(ErrorType.GET_DOCUMENT_ERROR)
      }
    })

    it('on expiration update fail', async () => {
      connectMock.mockImplementationOnce(() => ({
        db: jest.fn(() => ({
          collection: jest.fn(() => ({
            findOne: jest.fn(() => ({
              _id: 1,
              value: mockData,
              expiration: 1
            })),
            updateOne: jest.fn(() => {
              throw new Error(ErrorType.GET_DOCUMENT_ERROR)
            })
          }))
        })),
        close: jest.fn()
      }))

      try {
        await mongoStore.get('', false)
      } catch (err) {
        expect((err as Error).message).toEqual(ErrorType.GET_DOCUMENT_ERROR)
      }
    })

    it('on invalid set', async () => {
      connectMock.mockImplementationOnce(() => ({
        db: jest.fn(() => ({
          collection: jest.fn(() => ({
            findOne: jest.fn(() => ({ _id: 1, value: mockData })),
            updateOne: jest.fn(() => {
              throw new Error(ErrorType.ADD_DOCUMENT_ERROR)
            })
          }))
        })),
        close: jest.fn()
      }))

      try {
        await mongoStore.set(mockKey, mockData)
      } catch (err) {
        expect((err as Error).message).toEqual(ErrorType.ADD_DOCUMENT_ERROR)
      }
    })
  })
})
