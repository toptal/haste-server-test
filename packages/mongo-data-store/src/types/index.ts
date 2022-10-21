import { BaseStoreConfig, StoreNames } from '@hastebin/data-store-helper'

export interface MongoStoreConfig extends BaseStoreConfig {
  connectionUrl: string
  type: StoreNames.Mongo
}
