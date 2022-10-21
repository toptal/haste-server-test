import type { KeyGeneratorConfig } from '~/types/config'

abstract class KeyGenerator {
  type: string

  constructor(options: KeyGeneratorConfig) {
    this.type = options.type
  }

  abstract createKey(keyLength: number): string
}

export default KeyGenerator
