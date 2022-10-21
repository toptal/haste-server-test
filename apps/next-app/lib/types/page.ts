import type { Session } from 'next-auth'

export type PageParameters = {
  pageTitle: string
  pageDescription: string
}

export type PageProps = {
  isWhiteLabelVersion?: boolean
  session?: Session | null
  userToken?: string | null
  shouldRedirect?: boolean
}

export type HappoPageProps = {
  isWhiteLabelVersion?: boolean
  isDarkMode?: boolean
}
