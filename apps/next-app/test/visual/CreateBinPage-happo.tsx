import TextContextProvider from '~/components/TextContext'
import CreateBinPage from '~/pages/index'

import { HappoPageProps } from '~/lib/types/page'
import PageProvider from '~/test/lib/page-provider'

const HappoCreateBinPage = ({
  isDarkMode,
  isWhiteLabelVersion
}: HappoPageProps): JSX.Element => {
  return (
    <PageProvider
      isDarkMode={isDarkMode}
      isWhiteLabelVersion={isWhiteLabelVersion}
    >
      <TextContextProvider>
        <CreateBinPage />
      </TextContextProvider>
    </PageProvider>
  )
}

export const HappoToptalBlueThemeCreateBinPage = (): JSX.Element => (
  <HappoCreateBinPage />
)

export const HappoDarkThemeCreateBinPage = (): JSX.Element => (
  <HappoCreateBinPage isDarkMode={true} />
)

export const HappoWhiteLabelThemeCreateBinPage = (): JSX.Element => (
  <HappoCreateBinPage isWhiteLabelVersion={true} />
)
