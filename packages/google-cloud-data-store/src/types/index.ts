import { BaseStoreConfig, StoreNames } from '@hastebin/data-store-helper'

export interface GoogleStoreConfig extends BaseStoreConfig {
  type: StoreNames.GoogleDataStore
}
