import build from '~/lib/key-generators/builder'

jest.mock('fs', () => ({
  readFile: jest.fn()
}))

describe('Key Generator Builder', () => {
  describe('based on type', () => {
    it('correctly returns dictionary key generator', async () => {
      const generator = await build({ type: 'dictionary', path: '/' })

      expect(generator).toHaveProperty('dictionary')
    })

    it('correctly returns phonetic key generator', async () => {
      const generator = await build({ type: 'phonetic' })

      expect(generator.type).toEqual('phonetic')
    })

    it('correctly returns random key generator', async () => {
      const generator = await build({ type: 'random' })

      expect(generator).toHaveProperty('keyspace')
    })
  })
})
