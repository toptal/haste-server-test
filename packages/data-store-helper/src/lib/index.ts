import { BaseStoreConfig } from '~/types/config'

export type Callback = (data: boolean | string) => void

export abstract class Store {
  type: string

  expire?: number

  constructor({ type, expire }: BaseStoreConfig) {
    this.type = type
    this.expire = expire
  }

  abstract get: (key: string, skipExpire?: boolean) => Promise<string>

  abstract set: (
    key: string,
    data: string,
    skipExpire?: boolean
  ) => Promise<boolean>
}
