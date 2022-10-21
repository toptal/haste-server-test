import * as fs from 'fs'

import type { DictionaryKeyGeneratorConfig } from '~/types/config'

import KeyGenerator from '.'

class DictionaryGenerator extends KeyGenerator {
  dictionary: string[]

  constructor(
    options: DictionaryKeyGeneratorConfig,
    readyCallback?: () => void
  ) {
    super(options)

    this.dictionary = []

    // Load dictionary
    fs.readFile(options.path, 'utf8', (err, data) => {
      if (err) {
        throw err
      }

      this.dictionary = data.split(/[\n\r]+/)

      readyCallback?.()
    })
  }

  // Generates a dictionary-based key, of keyLength words
  createKey(keyLength: number): string {
    let text = ''

    for (let i = 0; i < keyLength; i += 1) {
      const index = Math.floor(Math.random() * this.dictionary.length)

      text += this.dictionary[index]
    }

    return text
  }
}

export default DictionaryGenerator
