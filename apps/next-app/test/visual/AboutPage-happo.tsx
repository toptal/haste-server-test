import AboutPage from '~/pages/about'

import { HappoPageProps } from '~/lib/types/page'
import PageProvider from '~/test/lib/page-provider'

const HappoAboutPage = ({
  isDarkMode,
  isWhiteLabelVersion
}: HappoPageProps): JSX.Element => {
  return (
    <PageProvider
      url="/about"
      isDarkMode={isDarkMode}
      isWhiteLabelVersion={isWhiteLabelVersion}
    >
      <AboutPage />
    </PageProvider>
  )
}

export const HappoToptalBlueThemeAboutPage = (): JSX.Element => (
  <HappoAboutPage />
)

export const HappoDarkThemeAboutPage = (): JSX.Element => (
  <HappoAboutPage isDarkMode={true} />
)

export const HappoWhiteLabelThemeAboutPage = (): JSX.Element => (
  <HappoAboutPage isWhiteLabelVersion={true} />
)
