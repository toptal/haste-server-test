import { StoreNames } from './store-names'

export type BaseStoreConfig = {
  type: StoreNames
  expire?: number
}
