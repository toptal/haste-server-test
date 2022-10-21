import type { FileStoreConfig } from '@hastebin/file-data-store'
import type { MemcachedStoreConfig } from '@hastebin/memcached-data-store'
import type { PostgresStoreConfig } from '@hastebin/postgres-data-store'
import type { RethinkDbStoreConfig } from '@hastebin/rethinkdb-data-store'
import type { GoogleStoreConfig } from '@hastebin/google-cloud-data-store'
import type { GoogleStorageConfig } from '@hastebin/google-cloud-storage'
import type { MongoStoreConfig } from '@hastebin/mongo-data-store'
import type { AmazonS3DataStoreConfig } from '@hastebin/amazon-s3-data-store'
import type { RedisStoreConfig } from '@hastebin/redis-data-store'

import type { Logging } from '~/types/log'
import type { RateLimits } from '~/types/rate-limits'

export type DictionaryKeyGeneratorConfig = {
  type: 'dictionary'
  path: string
}

export type PhoneticKeyGeneratorConfig = {
  type: 'phonetic'
}

export type RandomKeyGeneratorConfig = {
  type: 'random'
  keyspace?: string
}

export type KeyGeneratorConfig =
  | DictionaryKeyGeneratorConfig
  | PhoneticKeyGeneratorConfig
  | RandomKeyGeneratorConfig

export type StoreConfig =
  | PostgresStoreConfig
  | MemcachedStoreConfig
  | RethinkDbStoreConfig
  | GoogleStoreConfig
  | FileStoreConfig
  | GoogleStorageConfig
  | MongoStoreConfig
  | AmazonS3DataStoreConfig
  | RedisStoreConfig
  | GoogleStoreConfig

export interface Config {
  host: string
  port: number
  basePath: string
  emailContact: string
  documentationUrl: string
  keyLength: number
  maxLength: number
  logging: Logging[]
  keyGenerator: KeyGeneratorConfig
  rateLimits: RateLimits
  storage: StoreConfig
  userAuthEnabled: boolean
}
