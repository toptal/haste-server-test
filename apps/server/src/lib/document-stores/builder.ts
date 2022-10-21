import { Store } from '@hastebin/data-store-helper'

import type { Config } from '~/types/config'

const build = async ({ storage }: Config): Promise<Store> => {
  const DocumentStore = (await import(`@hastebin/${storage.type}`)).default

  return new DocumentStore(storage)
}

export default build
