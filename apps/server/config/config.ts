import dotenv from 'dotenv'
import { StoreNames } from '@hastebin/data-store-helper'

import { Config, StoreConfig } from '../src/types/config'

const storeConfigs: { [key in StoreNames]: StoreConfig } = {
  [StoreNames.File]: {
    type: StoreNames.File,
    basePath: process.env.FILE_PATH
  },
  [StoreNames.Postgres]: {
    type: StoreNames.Postgres,
    connectionUrl: process.env.DATABASE_URL || '',
    expire: process.env.STORAGE_EXPIRE
      ? Number(process.env.STORAGE_EXPIRE)
      : undefined
  },
  [StoreNames.Memcached]: {
    type: StoreNames.Memcached,
    host: process.env.MEMCACHED_HOST,
    port: process.env.MEMCACHED_PORT
      ? Number(process.env.MEMCACHED_PORT)
      : undefined,
    expire: process.env.STORAGE_EXPIRE
      ? Number(process.env.STORAGE_EXPIRE)
      : undefined
  },
  [StoreNames.AmazonS3]: {
    type: StoreNames.AmazonS3,
    bucket: process.env.S3_BUCKET || '',
    region: process.env.S3_REGION || '',
    expire: process.env.STORAGE_EXPIRE
      ? Number(process.env.STORAGE_EXPIRE)
      : undefined
  },
  [StoreNames.GoogleDataStore]: {
    type: StoreNames.GoogleDataStore,
    expire: process.env.STORAGE_EXPIRE
      ? Number(process.env.STORAGE_EXPIRE)
      : undefined
  },
  [StoreNames.GoogleCloudStorage]: {
    type: StoreNames.GoogleCloudStorage,
    path: process.env.GCS_PATH || '',
    bucket: process.env.GCS_BUCKET || '',
    expire: process.env.STORAGE_EXPIRE
      ? Number(process.env.STORAGE_EXPIRE)
      : undefined
  },
  [StoreNames.Mongo]: {
    type: StoreNames.Mongo,
    connectionUrl: process.env.DATABASE_URL || '',
    expire: process.env.STORAGE_EXPIRE
      ? Number(process.env.STORAGE_EXPIRE)
      : undefined
  },
  [StoreNames.Redis]: {
    type: StoreNames.Redis,
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    db: process.env.REDIS_DB ? Number(process.env.REDIS_DB) : undefined,
    username: process.env.REDIS_USERNAME,
    password: process.env.REDIS_PASSWORD,
    expire: process.env.STORAGE_EXPIRE
      ? Number(process.env.STORAGE_EXPIRE)
      : undefined
  },
  [StoreNames.RethinkDb]: {
    type: StoreNames.RethinkDb,
    host: process.env.RETHINK_HOST,
    port: process.env.RETHINK_PORT
      ? Number(process.env.RETHINK_PORT)
      : undefined,
    db: process.env.RETHINK_DB,
    user: process.env.RETHINK_USERNAME,
    password: process.env.RETHINK_PASSWORD,
    expire: process.env.STORAGE_EXPIRE
      ? Number(process.env.STORAGE_EXPIRE)
      : undefined
  }
}

export function isStoreName(test: string | undefined): test is StoreNames {
  return Object.values(StoreNames).some(storeName => storeName === test)
}

const selectedStore =
  process.env.STORAGE_TYPE && isStoreName(process.env.STORAGE_TYPE)
    ? process.env.STORAGE_TYPE
    : StoreNames.File


dotenv.config()

export const config: Config = {
  host: process.env.HOST || '0.0.0.0',
  port: process.env.SERVER_PORT ? Number(process.env.SERVER_PORT) : 7777,
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
  userAuthEnabled: process.env.NEXT_PUBLIC_FF_USER_AUTH === 'enabled',
  emailContact: process.env.EMAIL_CONTACT || '',
  documentationUrl: process.env.NEXT_PUBLIC_DOCUMENTATION_URL || 'http://localhost:3000/documentation', 

  keyLength: 10,

  maxLength: 400000,

  logging: [
    {
      level: 'verbose',
      type: 'Console',
      colorize: true
    }
  ],

  keyGenerator: {
    type: 'phonetic'
  },

  rateLimits: {
    categories: {
      normal: {
        totalRequests: 500,
        every: 60000
      }
    }
  },

  storage: storeConfigs[selectedStore]
}

export default config

