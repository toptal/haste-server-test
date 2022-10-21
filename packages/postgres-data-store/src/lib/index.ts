import * as winston from 'winston'
import { Store, ErrorType } from '@hastebin/data-store-helper'

import db from './db'

import type { PostgresStoreConfig } from '~/types'

class PostgresDocumentStore extends Store {
  constructor(options: PostgresStoreConfig) {
    super(options)
    db.createPool(options.connectionUrl)
  }

  get = async (
    key: string,
    skipExpire?: boolean | undefined
  ): Promise<string> => {
    const client = await db.connect()

    if (!client) {
      throw new Error(ErrorType.CONNECTION_ERROR)
    }

    const now = Math.floor(new Date().getTime() / 1000)

    try {
      const { rows } = await client.query(
        'SELECT id,value,expiration from entries where KEY = $1 and (expiration IS NULL or expiration > $2)',
        [key, now]
      )

      if (rows.length && this.expire && !skipExpire) {
        await client.query('UPDATE entries SET expiration = $1 WHERE ID = $2', [
          this.expire + now,
          rows[0].id
        ])
      }

      if (!rows.length) {
        throw new Error(ErrorType.DOCUMENT_NOT_FOUND)
      }

      return rows[0].value
    } catch (error) {
      winston.error('error retrieving value from postgres', {
        error
      })

      throw error
    } finally {
      client.release()
    }
  }

  set = async (
    key: string,
    data: string,
    skipExpire?: boolean | undefined
  ): Promise<boolean> => {
    const client = await db.connect()

    if (!client) {
      throw new Error(ErrorType.CONNECTION_ERROR)
    }

    const now = Math.floor(new Date().getTime() / 1000)

    try {
      await client.query(
        'INSERT INTO entries (key, value, expiration) VALUES ($1, $2, $3)',
        [key, data, this.expire && !skipExpire ? this.expire + now : null]
      )

      return true
    } catch (error) {
      winston.error('error persisting value to postgres', { error })

      throw error
    } finally {
      client.release()
    }
  }
}
export default PostgresDocumentStore
