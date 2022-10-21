import { StoreNames } from '@hastebin/data-store-helper'
import FileDocumentStore from '@hastebin/file-data-store'

import build from '~/lib/document-stores/builder'
import { Config } from '~/types/config'

describe('Document stores builder', () => {
  it('retrieves correct document store', async () => {
    const store = await build({
      storage: { type: StoreNames.File }
    } as Config)

    expect(store instanceof FileDocumentStore).toBe(true)
  })
})
