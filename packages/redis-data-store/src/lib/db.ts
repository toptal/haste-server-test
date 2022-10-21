import * as winston from 'winston'
import { createClient as createRedisClient, RedisClientType } from 'redis'

import type { RedisStoreConfig } from '~/types'

const createClient = ({
  host,
  port,
  db,
  username,
  password
}: RedisStoreConfig): RedisClientType => {
  winston.info('configuring redis')

  const connectionParameters = process.env.REDISTOGO_URL
    ? {
        url: process.env.REDISTOGO_URL
      }
    : {
        host: host || '127.0.0.1',
        port: port || '6379',
        database: db || 0
      }

  const config = {
    ...connectionParameters,
    ...(username ? { username: username } : {}),
    ...(password ? { username: username } : {})
  }

  return createRedisClient(config)
}

const connect = async (client: RedisClientType): Promise<void> => {
  try {
    client.connect()

    client.on('error', err => {
      winston.error('redis disconnected', err)
    })

    winston.info(`connected to redis`)
  } catch (err) {
    winston.error(`error connecting to redis`, {
      error: err
    })
    process.exit(1)
  }
}

export default {
  connect,
  createClient
}
