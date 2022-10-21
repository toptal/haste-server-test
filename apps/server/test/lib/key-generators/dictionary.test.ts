import { readFile } from 'fs'

import Generator from '~/lib/key-generators/dictionary'

jest.mock('fs', () => ({
  readFile: jest.fn((_, a, callback) => callback(null, 'cat'))
}))

describe('DictionaryGenerator', () => {
  let generator: Generator

  beforeEach(() => {
    const path = '/tmp/haste-server-test-dictionary'

    generator = new Generator({ path, type: 'dictionary' })
  })

  it('should return a key of the proper number of words from the given dictionary', () => {
    expect(generator.createKey(3)).toEqual('catcatcat')
  })

  it('throws an error if reading the file fails', () => {
    const mockReadFile = readFile as jest.MockedFunction<typeof readFile>
    const cb = (
      mockReadFile.mock.lastCall as unknown as [
        unknown,
        ...Parameters<typeof readFile>
      ]
    )[2]

    expect(() => cb(Error('hello there'), null as unknown as Buffer)).toThrow(
      'hello there'
    )
  })
})
