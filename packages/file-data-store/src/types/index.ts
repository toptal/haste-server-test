import { BaseStoreConfig, StoreNames } from '@hastebin/data-store-helper'

export interface FileStoreConfig extends BaseStoreConfig {
  type: StoreNames.File
  basePath?: string
}
