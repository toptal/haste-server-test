import { ErrorType, StoreNames } from '@hastebin/data-store-helper'

import RethinkDbDocumentStore from '..'

const md5Ids = {
  'success-test': '84a60983ffda897da7be74593a71ddb9',
  'fail-test': '64f2ae29cee323a96576e0b9d8520e84',
  'not-found-test': '670295da9868e68a343a54daea62ab95'
}

jest.mock('rethinkdb', () => {
  return {
    connect: jest.fn().mockResolvedValue({
      close: jest.fn()
    }),
    table: () => {
      return {
        get: (id: string) => {
          return {
            run: jest.fn().mockImplementation(() => {
              if (id === md5Ids['success-test']) {
                return {
                  data: 'test-value',
                  id: '1'
                }
              }

              if (id === md5Ids['fail-test']) {
                throw new Error('error')
              }

              if (id === md5Ids['not-found-test']) {
                return {
                  data: undefined,
                  id: '1'
                }
              }
            })
          }
        },
        insert: ({ id }: { id: string }) => {
          return {
            run: jest.fn().mockImplementation(() => {
              if (id === md5Ids['success-test']) {
                return {
                  inserted: 1,
                  errors: 0
                }
              }

              if (id === md5Ids['fail-test']) {
                throw new Error('error')
              }

              if (id === md5Ids['not-found-test']) {
                return {
                  inserted: 0,
                  errors: 1
                }
              }
            })
          }
        }
      }
    }
  }
})

describe('Rethinkdb store', () => {
  let store: RethinkDbDocumentStore

  beforeEach(() => {
    store = new RethinkDbDocumentStore({
      type: StoreNames.RethinkDb
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('get document', () => {
    it('has correct response on success', async () => {
      const res = await store.get('success-test')

      expect(res).toEqual('test-value')
    })

    it('fails with no record on db', async () => {
      try {
        await store.get('fail-test')
      } catch (err) {
        expect((err as Error)?.message).toBe('error')
      }
    })

    it('fails with an error', async () => {
      try {
        await store.get('not-found-test')
      } catch (err) {
        expect((err as Error)?.message).toBe(ErrorType.DOCUMENT_NOT_FOUND)
      }
    })
  })

  describe('save document', () => {
    it('has correct response on success', async () => {
      const res = await store.set('success-test', 'data')

      expect(res).toEqual(true)
    })

    it('fails with an error on adding the record to database', async () => {
      try {
        await store.set('fail-test', 'data')
      } catch (err) {
        expect((err as Error)?.message).toEqual('error')
      }
    })

    it('fails with no record on db', async () => {
      try {
        await store.set('not-found-test', 'data')
      } catch (err) {
        expect((err as Error)?.message).toEqual(ErrorType.ADD_DOCUMENT_ERROR)
      }
    })
  })
})
