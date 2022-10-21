import CredentialsProvider from 'next-auth/providers/credentials'

import { userMock } from '~/test/mock/user'

export const mockProvider = CredentialsProvider({
  id: 'mock',
  name: 'Mock',
  credentials: {},

  async authorize() {
    return userMock
  }
})
