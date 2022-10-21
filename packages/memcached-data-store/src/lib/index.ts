import { Store, ErrorType } from '@hastebin/data-store-helper'

import db from './db'

import type { MemCachedClient, MemcachedStoreConfig } from '~/types'

class MemcachedDocumentStore extends Store {
  client: MemCachedClient

  constructor(options: MemcachedStoreConfig) {
    super(options)
    this.client = db.createDbClient(options)
  }

  get = async (key: string, skipExpire?: boolean): Promise<string> => {
    let data: string | null

    try {
      data = await this.client.getAsync(key)
    } catch (err) {
      throw new Error(ErrorType.GET_DOCUMENT_ERROR)
    }

    if (!data) {
      throw new Error(ErrorType.DOCUMENT_NOT_FOUND)
    }

    if (data && !skipExpire) {
      await this.set(key, data, skipExpire)
    }

    return data
  }

  set = async (
    key: string,
    data: string,
    skipExpire?: boolean | undefined
  ): Promise<boolean> => {
    try {
      return await this.client.setAsync(
        key,
        data,
        skipExpire ? 0 : this.expire || 0
      )
    } catch (err) {
      throw new Error(ErrorType.ADD_DOCUMENT_ERROR)
    }
  }
}

export default MemcachedDocumentStore
