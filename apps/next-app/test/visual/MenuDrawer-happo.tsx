import SideDrawerMenu from '~/components/SideDrawerMenu'

import PageProvider from '~/test/lib/page-provider'
import { HappoPageProps } from '~/lib/types/page'

const HappoMenuDrawer = ({
  isDarkMode,
  isWhiteLabelVersion
}: HappoPageProps): JSX.Element => {
  return (
    <PageProvider
      isDarkMode={isDarkMode}
      isWhiteLabelVersion={isWhiteLabelVersion}
    >
      <SideDrawerMenu defaultOpen currentPath="/" />
    </PageProvider>
  )
}

export const HappoToptalBlueThemeMenuDrawerPage = (): JSX.Element => (
  <HappoMenuDrawer />
)

export const HappoDarkThemeMenuDrawerPage = (): JSX.Element => (
  <HappoMenuDrawer isDarkMode={true} />
)

export const HappoWhiteLabelThemeMenuDrawerPage = (): JSX.Element => (
  <HappoMenuDrawer isWhiteLabelVersion={true} />
)
