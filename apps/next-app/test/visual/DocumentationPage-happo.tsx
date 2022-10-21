import DocumentationPage from '~/pages/documentation'

import PageProvider from '~/test/lib/page-provider'
import { HappoPageProps } from '~/lib/types/page'

const HappoDocumentationPage = ({
  isDarkMode,
  isWhiteLabelVersion
}: HappoPageProps): JSX.Element => {
  return (
    <PageProvider
      isDarkMode={isDarkMode}
      isWhiteLabelVersion={isWhiteLabelVersion}
      url="/documentation"
    >
      <DocumentationPage />
    </PageProvider>
  )
}

export const HappoToptalBlueThemeDocumentationPage = (): JSX.Element => (
  <HappoDocumentationPage />
)

export const HappoDarkThemeDocumentationPage = (): JSX.Element => (
  <HappoDocumentationPage isDarkMode={true} />
)

export const HappoWhiteLabelThemeDocumentationPage = (): JSX.Element => (
  <HappoDocumentationPage isWhiteLabelVersion={true} />
)
