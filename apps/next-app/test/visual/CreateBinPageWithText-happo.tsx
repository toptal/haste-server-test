import TextContextProvider from '~/components/TextContext'
import CreateBinPage from '~/pages/index'

import PageProvider from '~/test/lib/page-provider'
import { HappoPageProps } from '~/lib/types/page'

const HappoCreateBinPageWithText = ({
  isDarkMode,
  isWhiteLabelVersion
}: HappoPageProps): JSX.Element => {
  return (
    <PageProvider
      isDarkMode={isDarkMode}
      isWhiteLabelVersion={isWhiteLabelVersion}
    >
      <TextContextProvider initialTextValueForTests="Some predefined text">
        <CreateBinPage />
      </TextContextProvider>
    </PageProvider>
  )
}

export const HappoToptalBlueThemeCreateBinWithTextPage = (): JSX.Element => (
  <HappoCreateBinPageWithText />
)

export const HappoDarkThemeCreateBinWithTextPage = (): JSX.Element => (
  <HappoCreateBinPageWithText isDarkMode={true} />
)

export const HappoWhiteLabelThemeCreateBinWithTextPage = (): JSX.Element => (
  <HappoCreateBinPageWithText isWhiteLabelVersion={true} />
)
