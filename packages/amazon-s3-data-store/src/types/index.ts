import { BaseStoreConfig, StoreNames } from '@hastebin/data-store-helper'

export interface AmazonS3DataStoreConfig extends BaseStoreConfig {
  type: StoreNames.AmazonS3
  bucket: string
  region: string
}
