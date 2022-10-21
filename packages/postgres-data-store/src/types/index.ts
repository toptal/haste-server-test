import { BaseStoreConfig, StoreNames } from '@hastebin/data-store-helper'

export interface PostgresStoreConfig extends BaseStoreConfig {
  connectionUrl: string
  type: StoreNames.Postgres
}
