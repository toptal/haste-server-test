import type { RandomKeyGeneratorConfig } from '~/types/config'
import { KEYSPACE } from '~/constants/index'

import KeyGenerator from '.'

class RandomKeyGenerator extends KeyGenerator {
  keyspace: string

  // Initialize a new generator with the given keySpace
  constructor(options: RandomKeyGeneratorConfig) {
    super(options)
    this.keyspace = options.keyspace || KEYSPACE
  }

  // Generate a key of the given length
  createKey(keyLength: number): string {
    let text = ''

    for (let i = 0; i < keyLength; i += 1) {
      const index = Math.floor(Math.random() * this.keyspace.length)

      text += this.keyspace.charAt(index)
    }

    return text
  }
}

export default RandomKeyGenerator
