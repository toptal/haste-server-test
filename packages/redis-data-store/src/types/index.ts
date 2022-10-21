import { BaseStoreConfig, StoreNames } from '@hastebin/data-store-helper'

export interface RedisStoreConfig extends BaseStoreConfig {
  type: StoreNames.Redis
  db?: number
  host?: string
  port?: string
  username?: string
  password?: string
}
