import SharedBinPage from '~/pages/share/[binId]'

import PageProvider from '~/test/lib/page-provider'
import routes from '~/lib/constants/routes'
import { HappoPageProps } from '~/lib/types/page'

const HappoSharedBinPage = ({
  isDarkMode,
  isWhiteLabelVersion
}: HappoPageProps): JSX.Element => {
  return (
    <PageProvider
      isDarkMode={isDarkMode}
      isWhiteLabelVersion={isWhiteLabelVersion}
      url={routes.getSharePagePath('some-id')}
    >
      <SharedBinPage binId="some-id" text="Some predefined text" />
    </PageProvider>
  )
}

export const HappoToptalBlueThemeSharedBinPage = (): JSX.Element => (
  <HappoSharedBinPage />
)

export const HappoDarkThemeSharedBinPage = (): JSX.Element => (
  <HappoSharedBinPage isDarkMode={true} />
)

export const HappoWhiteLabelThemeSharedBinPage = (): JSX.Element => (
  <HappoSharedBinPage isWhiteLabelVersion={true} />
)
