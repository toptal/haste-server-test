import Head from 'next/head'
import { Header, Footer, CookieBanner } from '@toptal/site-acq-ui-library'
import { useRouter } from 'next/router'
import classNames from 'classnames'
import Container from '@toptal/picasso/Container'
import { useRef } from 'react'

import { TestIdLayout } from '~/components/Layout/test-ids'
import SideDrawerMenu from '~/components/SideDrawerMenu'

import styles from './layout.module.scss'

import { useUIThemeContext } from '~/lib/state/use-ui-theme'
import { generateCanonicalUrl } from '~/lib/utils/url'
import routes from '~/lib/constants/routes'
import {
  PROJECT_DISPLAY_NAME,
  PROJECT_URL,
  PROJECT_DESCRIPTION,
  TWITTER_HANDLE,
  OG_TITLE,
  OG_IMAGE_URL
} from '~/lib/constants/common'

interface LayoutProps {
  children: React.ReactNode
  pageTitle?: string
  pageDescription?: string
  className?: string
  noPadding?: boolean
}

interface AsideProps {
  children?: React.ReactNode
}

interface MainProps {
  children?: React.ReactNode
  className?: string
}

interface MainCtaContainerProps {
  children?: React.ReactNode
  className?: string
}

const Aside = ({ children }: AsideProps): JSX.Element => {
  return (
    <aside data-testid={TestIdLayout.Aside} className={styles.aside}>
      {children}
    </aside>
  )
}

const Main = ({ children, className }: MainProps): JSX.Element => {
  return (
    <main
      data-testid={TestIdLayout.Main}
      className={classNames(styles.main, className)}
    >
      {children}
    </main>
  )
}

const MainCtaContainer = ({
  children,
  className
}: MainCtaContainerProps): JSX.Element => {
  return (
    <div
      role="region"
      data-testid={TestIdLayout.MainCtaContainer}
      className={classNames(styles.ctaContainer, className)}
    >
      {children}
    </div>
  )
}

interface LayoutAnchor extends HTMLDivElement {
  inert: boolean
}

const Layout = ({
  children,
  pageTitle,
  pageDescription,
  className,
  noPadding
}: LayoutProps): JSX.Element => {
  const router = useRouter()
  const ref = useRef<LayoutAnchor>(null)
  const { isDarkMode, isWhiteLabelVersion } = useUIThemeContext()

  const canonicalUrl = generateCanonicalUrl(PROJECT_URL, router.asPath)

  return (
    <>
      <Head>
        <title>{PROJECT_DISPLAY_NAME}</title>
        <meta property="og:title" content={pageTitle || OG_TITLE} />
        <meta
          property="og:description"
          content={pageDescription || PROJECT_DESCRIPTION}
        />
        <meta
          name="description"
          content={pageDescription || PROJECT_DESCRIPTION}
        />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={OG_IMAGE_URL} />
        <meta property="og:url" content={PROJECT_URL} />
        <meta name="twitter:site" content={TWITTER_HANDLE} />
        <meta name="twitter:card" content="summary_large_image" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href={routes.publicRelative('/apple-touch-icon.png')}
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href={`${routes.publicRelative('/favicon-32x32.png')}`}
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href={`${routes.publicRelative('/favicon-16x16.png')}`}
        />
        <link
          rel="mask-icon"
          href={`${routes.publicRelative('/safari-pinned-tab.svg')}`}
          color="#204ecf"
        />
        <link
          rel="shortcut icon"
          href={`${routes.publicRelative('/favicon.ico')}`}
        />
        <meta name="msapplication-TileColor" content="#da532c" />
        <meta
          name="msapplication-config"
          content={`${routes.publicRelative('/browserconfig.xml')}`}
        />
        <meta name="theme-color" content="#5bbad5" />
        {process.env.noindexEnabled ? (
          <meta
            name="robots"
            content="noindex, nofollow, nosnippet, noarchive"
          />
        ) : (
          <meta name="robots" content="follow, index" />
        )}
      </Head>
      <div
        ref={ref}
        className={styles.layout}
        data-testid={TestIdLayout.Layout}
      >
        <Header
          name={PROJECT_DISPLAY_NAME}
          homeUrl={routes.publicRelative(routes.home)}
          isHomePage={router.pathname === routes.home}
          isDarkMode={isDarkMode}
          isWhitelabel={isWhiteLabelVersion}
          // TODO: make Hastebin on header h1 on home page temporary to be able to pass a11y tests
          withHeaderTag={router.pathname === routes.home}
          onClickHomeUrl={() => {
            router.push(routes.home)
          }}
        >
          <SideDrawerMenu
            currentPath={router.asPath}
            onOpenMenu={open => {
              if (!ref.current) {
                return
              }

              ref.current.inert = open
            }}
          />
        </Header>
        <Container
          className={classNames(styles.container, className, {
            [styles.noPadding]: noPadding
          })}
          flex
        >
          {children}
        </Container>
        {!isWhiteLabelVersion && <Footer isDarkMode={isDarkMode} />}
        <div data-happo-hide={true}>
          <CookieBanner />
        </div>
      </div>
    </>
  )
}

Layout.Aside = Aside
Layout.Main = Main
Layout.MainCtaContainer = MainCtaContainer

export default Layout
