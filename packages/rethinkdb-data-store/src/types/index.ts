import { BaseStoreConfig, StoreNames } from '@hastebin/data-store-helper'

export interface RethinkDbStoreConfig extends BaseStoreConfig {
  host?: string
  port?: number
  db?: string
  user?: string
  password?: string
  type: StoreNames.RethinkDb
}

export type GetResult = { data?: string; id?: string }

export type SetResult = { inserted: number; errors?: number; skipped?: number }
