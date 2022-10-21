// Draws inspiration from pwgen and http://tools.arantius.com/password
import { VOWELS, CONSONANTS } from '~/constants/index'

import KeyGenerator from '.'

const randOf = (collection: string) => () =>
  collection[Math.floor(Math.random() * collection.length)]

// Helper methods to get an random vowel or consonant
const randVowel = randOf(VOWELS)
const randConsonant = randOf(CONSONANTS)

class PhoneticKeyGenerator extends KeyGenerator {
  // Generate a phonetic key of alternating consonant & vowel
  // eslint-disable-next-line class-methods-use-this
  createKey(keyLength: number): string {
    let text = ''
    const start = Math.round(Math.random())

    for (let i = 0; i < keyLength; i += 1) {
      text += i % 2 === start ? randConsonant() : randVowel()
    }

    return text
  }
}

export default PhoneticKeyGenerator
