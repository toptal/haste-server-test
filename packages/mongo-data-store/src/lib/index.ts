import * as winston from 'winston'
import { ErrorType, Store } from '@hastebin/data-store-helper'

import connect from '~/lib/db'

import type { MongoStoreConfig } from '~/types'

class MongoDocumentStore extends Store {
  connectionUrl: string

  constructor(options: MongoStoreConfig) {
    super(options)
    this.connectionUrl = options.connectionUrl
  }

  get = async (key: string, skipExpire?: boolean): Promise<string> => {
    const now = Math.floor(new Date().getTime() / 1000)

    const filter = {
      entry_id: key,
      $or: [{ expiration: -1 }, { expiration: { $gt: now } }]
    }

    const client = await connect(this.connectionUrl)

    try {
      const entry = await client.db().collection('entries').findOne(filter)

      if (!entry) {
        throw new Error(ErrorType.DOCUMENT_NOT_FOUND)
      } else {
        if (entry.expiration !== -1 && this.expire && !skipExpire) {
          await client
            .db()
            .collection('entries')
            .updateOne(
              { entry_id: key },
              {
                $set: {
                  expiration: this.expire + now
                }
              }
            )
        }

        return entry.value
      }
    } catch (error) {
      winston.error('error persisting value to mongodb', { error })
      throw new Error(ErrorType.GET_DOCUMENT_ERROR)
    } finally {
      client.close()
    }
  }

  set = async (
    key: string,
    data: string,
    skipExpire?: boolean
  ): Promise<boolean> => {
    const now = Math.floor(new Date().getTime() / 1000)

    const filter = {
      entry_id: key,
      $or: [{ expiration: -1 }, { expiration: { $gt: now } }]
    }

    const updateQuery = {
      $set: {
        entry_id: key,
        value: data,
        expiration: this.expire && !skipExpire ? this.expire + now : -1
      }
    }

    const client = await connect(this.connectionUrl)

    try {
      await client
        .db()
        .collection('entries')
        .updateOne(filter, updateQuery, { upsert: true })

      return true
    } catch (error) {
      winston.error('error persisting value to mongodb', { error })
      throw new Error(ErrorType.ADD_DOCUMENT_ERROR)
    } finally {
      client.close()
    }
  }
}

export default MongoDocumentStore
