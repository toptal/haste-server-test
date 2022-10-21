import type { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { onCLS, onFID, onLCP, onFCP, onTTFB, onINP } from 'web-vitals'
import { SessionProvider } from 'next-auth/react'

import TextContextProvider from '~/components/TextContext'

import UIThemeContext from '~/lib/state/use-ui-theme'
import { BASE_PATH, IS_WHITELABEL_VERSION } from '~/lib/constants/common'
import { trackPageView, sendToGoogleAnalytics } from '~/lib/analytics'

import '../styles/globals.scss'
import '@toptal/site-acq-ui-library/src/index.css'

function MyApp({
  Component,
  pageProps: { session, isWhiteLabelVersion, ...pageProps }
}: AppProps): JSX.Element {
  const router = useRouter()

  useEffect(() => {
    const handleRouteChange = (url: string) => {
      trackPageView(url)
    }

    router.events.on('routeChangeComplete', handleRouteChange)

    onCLS(sendToGoogleAnalytics)
    onFCP(sendToGoogleAnalytics)
    onFID(sendToGoogleAnalytics)
    onINP(sendToGoogleAnalytics)
    onLCP(sendToGoogleAnalytics)
    onTTFB(sendToGoogleAnalytics)

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [router.events])

  return (
    <SessionProvider basePath={`${BASE_PATH}/api/auth`} session={session}>
      <TextContextProvider>
        <UIThemeContext
          isWhiteLabelVersion={isWhiteLabelVersion || IS_WHITELABEL_VERSION}
        >
          <Component {...pageProps} />
        </UIThemeContext>
      </TextContextProvider>
    </SessionProvider>
  )
}

export default MyApp
