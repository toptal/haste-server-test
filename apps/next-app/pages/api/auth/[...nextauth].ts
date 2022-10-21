import NextAuth, { NextAuthOptions } from 'next-auth'
import GithubProvider from 'next-auth/providers/github'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { PrismaClient } from '@prisma/client'

import { mockProvider } from '~/test/mock/provider'
import { isBypassSessionEnabled } from '~/lib/session/is-bypass-session-enabled'

const prisma = new PrismaClient()

const providers = []

providers.push(
  isBypassSessionEnabled
    ? mockProvider
    : GithubProvider({
        clientId: process.env.GITHUB_CLIENT_ID || '',
        clientSecret: process.env.GITHUB_CLIENT_SECRET || ''
      })
)

export const authOptions: NextAuthOptions = {
  pages: {},
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt'
  },
  providers,
  debug: false
}

export default NextAuth(authOptions)
