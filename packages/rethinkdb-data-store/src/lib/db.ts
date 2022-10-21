import { ErrorType, md5 } from '@hastebin/data-store-helper'
import rethink from 'rethinkdb'

import type { GetResult } from '~/types'

const TABLE_NAME = 'uploads'

const createDbClient = async (
  host?: string,
  port?: number,
  db?: string,
  user?: string,
  password?: string
): Promise<rethink.Connection> => {
  try {
    return rethink.connect({
      host: host || '127.0.0.1',
      port: port || 28015,
      db: db || 'haste',
      user: user || 'admin',
      password: password || ''
    })
  } catch (err) {
    throw new Error(ErrorType.CONNECTION_ERROR)
  }
}

const getData = async (
  connection: rethink.Connection,
  key: string
): Promise<string> => {
  const result = await rethink
    .table(TABLE_NAME)
    .get<GetResult>(md5(key))
    .run(connection)

  if (!result || !result.data) {
    connection.close()
    throw new Error(ErrorType.DOCUMENT_NOT_FOUND)
  }
  const data = result?.data

  connection.close()

  return data
}

const insertData = async (
  connection: rethink.Connection,
  key: string,
  data: string
): Promise<boolean> => {
  const result = await rethink
    .table(TABLE_NAME)
    .insert({ id: md5(key), data })
    .run(connection)

  if (!result || result.errors) {
    connection.close()
    throw new Error(ErrorType.ADD_DOCUMENT_ERROR)
  }
  connection.close()

  return result.inserted > 0
}

export default {
  createDbClient,
  getData,
  insertData
}
