import { Store, ErrorType } from '@hastebin/data-store-helper'
import type { RedisClientType } from 'redis'

import db from './db'

import type { RedisStoreConfig } from '~/types'

class RedisDocumentStore extends Store {
  client: RedisClientType

  constructor(options: RedisStoreConfig) {
    super(options)
    this.client = db.createClient(options)
    db.connect(this.client)
  }

  get = async (key: string): Promise<string> => {
    let result: string | null

    try {
      result = await this.client.get(key)
    } catch (err) {
      throw new Error(ErrorType.GET_DOCUMENT_ERROR)
    }

    if (!result) {
      throw new Error(ErrorType.DOCUMENT_NOT_FOUND)
    }

    return result
  }

  set = async (
    key: string,
    data: string,
    skipExpire?: boolean | undefined
  ): Promise<boolean> => {
    try {
      const result = await this.client.set(
        key,
        data,
        skipExpire ? {} : { EX: this.expire }
      )

      return result === 'OK'
    } catch (err) {
      throw new Error(ErrorType.ADD_DOCUMENT_ERROR)
    }
  }
}
export default RedisDocumentStore
