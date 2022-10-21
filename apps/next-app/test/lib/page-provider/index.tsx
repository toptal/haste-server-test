import type { PropsWithChildren } from 'react'
import { MemoryRouterProvider } from 'next-router-mock/MemoryRouterProvider'
import { SessionProvider } from 'next-auth/react'
import { Session } from 'next-auth'

import TextContextProvider from '~/components/TextContext'

import UIThemeContext from '~/lib/state/use-ui-theme'

type PageProviderProps = {
  url?: string
  session?: Session | null
  isDarkMode?: boolean
  isWhiteLabelVersion?: boolean
}

const PageProvider = ({
  children,
  session = null,
  url = '/',
  isWhiteLabelVersion = false,
  isDarkMode = false
}: PropsWithChildren<PageProviderProps>): JSX.Element => {
  return (
    <SessionProvider session={session}>
      <MemoryRouterProvider url={url}>
        <TextContextProvider>
          <UIThemeContext
            isWhiteLabelVersion={isWhiteLabelVersion}
            isDarkMode={isDarkMode}
          >
            {children}
          </UIThemeContext>
        </TextContextProvider>
      </MemoryRouterProvider>
    </SessionProvider>
  )
}

export default PageProvider
