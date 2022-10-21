import { BaseStoreConfig, StoreNames } from '@hastebin/data-store-helper'

export interface MemcachedStoreConfig extends BaseStoreConfig {
  host?: string
  port?: number
  type: StoreNames.Memcached
}

export type MemCachedClient = {
  getAsync: (key: string) => Promise<string>
  setAsync: (key: string, data: string, expireTime: number) => Promise<boolean>
}
