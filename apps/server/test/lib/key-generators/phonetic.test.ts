/* eslint-disable jest/no-conditional-expect */
import { CONSONANTS, VOWELS } from '~/constants/index'
import Generator from '~/lib/key-generators/phonetic'

describe('PhoneticKeyGenerator', () => {
  describe('generation', () => {
    it('should return a key of the proper length', () => {
      const gen = new Generator({ type: 'phonetic' })

      expect(gen.createKey(6)).toHaveLength(6)
    })

    it('should alternate consonants and vowels', () => {
      const gen = new Generator({ type: 'phonetic' })
      const key = gen.createKey(3)

      // if it starts with a consonant, we expect cvc
      // if it starts with a vowel, we expect vcv
      if (CONSONANTS.includes(key[0])) {
        expect(CONSONANTS.includes(key[0])).toBeTruthy()
        expect(CONSONANTS.includes(key[2])).toBeTruthy()
        expect(VOWELS.includes(key[1])).toBeTruthy()
      } else {
        expect(VOWELS.includes(key[0])).toBeTruthy()
        expect(VOWELS.includes(key[2])).toBeTruthy()
        expect(CONSONANTS.includes(key[1])).toBeTruthy()
      }
    })
  })
})
