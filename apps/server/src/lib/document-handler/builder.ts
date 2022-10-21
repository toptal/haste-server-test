import type { Config } from '~/types/config'
import buildGenerator from '~/lib/key-generators/builder'
import buildStore from '~/lib/document-stores/builder'
import type { DocumentHandlerInterface } from '~/types/document-handler'

import DocumentHandler from '.'

const build = async (config: Config): Promise<DocumentHandlerInterface> => {
  const storage = await buildStore(config)
  const keyGenerator = await buildGenerator(config.keyGenerator)

  const documentHandler = new DocumentHandler({
    store: storage,
    config,
    maxLength: config.maxLength,
    keyLength: config.keyLength,
    keyGenerator
  })

  return documentHandler
}

export default build
