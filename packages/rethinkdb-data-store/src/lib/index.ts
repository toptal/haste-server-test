import { Store } from '@hastebin/data-store-helper'
import { Connection } from 'rethinkdb'

import db from './db'

import type { RethinkDbStoreConfig } from '~/types'

class RethinkDBStore extends Store {
  host?: string
  port?: number
  db?: string
  user?: string
  password?: string

  constructor(options: RethinkDbStoreConfig) {
    super(options)
    this.host = options.host
    this.port = options.port
    this.db = options.db
    this.user = options.user
    this.password = options.password
  }

  createConnection = async (): Promise<Connection> => {
    return db.createDbClient(
      this.host,
      this.port,
      this.db,
      this.user,
      this.password
    )
  }

  get = async (key: string): Promise<string> => {
    const connection = await this.createConnection()

    return db.getData(connection, key)
  }

  set = async (key: string, data: string): Promise<boolean> => {
    const connection = await this.createConnection()

    return db.insertData(connection, key, data)
  }
}

export default RethinkDBStore
