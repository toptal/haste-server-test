import DocumentationPage from '~/pages/documentation'

import PageProvider from '~/test/lib/page-provider'
import { mockSession } from '~/test/mock/session'
import { HappoPageProps } from '~/lib/types/page'

const HappoDocumentationPageAuthenticated = ({
  isDarkMode,
  isWhiteLabelVersion
}: HappoPageProps): JSX.Element => {
  return (
    <PageProvider
      isDarkMode={isDarkMode}
      isWhiteLabelVersion={isWhiteLabelVersion}
      session={mockSession}
      url="/documentation"
    >
      <DocumentationPage />
    </PageProvider>
  )
}

export const HappoToptalBlueThemeDocumentationPageAuthenticatedPage =
  (): JSX.Element => <HappoDocumentationPageAuthenticated />

export const HappoDarkThemeDocumentationPageAuthenticatedPage =
  (): JSX.Element => <HappoDocumentationPageAuthenticated isDarkMode={true} />

export const HappoWhiteLabelThemeDocumentationPageAuthenticatedPage =
  (): JSX.Element => (
    <HappoDocumentationPageAuthenticated isWhiteLabelVersion={true} />
  )
