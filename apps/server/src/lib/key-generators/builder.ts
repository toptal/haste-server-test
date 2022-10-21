import type { KeyGeneratorConfig } from '~/types/config'

import KeyGenerator from '.'

const build = async (config: KeyGeneratorConfig): Promise<KeyGenerator> => {
  const type = config.type || 'random'
  const Generator = (await import(`../key-generators/${type}`)).default
  const keyGenerator = new Generator(config)

  return keyGenerator
}

export default build
