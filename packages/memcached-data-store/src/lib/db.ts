import util from 'util'

import Memcached from 'memcached'
import * as winston from 'winston'

import type { MemCachedClient, MemcachedStoreConfig } from '~/types'

const createDbClient = (options: MemcachedStoreConfig): MemCachedClient => {
  const host = options.host || 'localhost'
  const port = options.port || 11211
  const url = `${host}:${port}`

  const client = new Memcached(url)

  const getAsync = util.promisify(client.get).bind(client)
  const setAsync = util.promisify(client.set).bind(client)

  winston.info(`connecting to memcached on ${url}`)

  client.on('failure', (error: Memcached.IssueData) => {
    winston.error('error connecting to memcached', { error })
  })

  client.on('reconnecting', ({ server, totalDownTime }) => {
    winston.info(
      'Total downtime caused by server $1 is $2 ms',
      { server },
      { totalDownTime }
    )
  })

  return {
    getAsync,
    setAsync
  }
}

export default {
  createDbClient
}
