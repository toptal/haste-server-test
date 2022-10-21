import { BaseStoreConfig, StoreNames } from '@hastebin/data-store-helper'

export interface GoogleStorageConfig extends BaseStoreConfig {
  type: StoreNames.GoogleCloudStorage
  path: string
  bucket: string
}
