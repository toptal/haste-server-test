import { EventParams, ViewPageParams } from '~/lib/analytics'

declare global {
  declare interface Window {
    gtag: (
      event: 'js' | 'config' | 'event',
      action: string,
      params: EventParams | ViewPageParams
    ) => void
    dataLayer?: (string | number | Record<string, unknown>)[][]
  }
}
