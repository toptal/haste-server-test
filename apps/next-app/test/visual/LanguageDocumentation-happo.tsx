import LanguageDocumentationPage from '~/pages/documentation/[slug]'

import PageProvider from '~/test/lib/page-provider'
import { LANGUAGES } from '~/lib/constants/languages'
import { CodeType, LanguageTitles } from '~/lib/types/language'
import { HappoPageProps } from '~/lib/types/page'

const HappoPythonDocumentationPage = ({
  isDarkMode,
  isWhiteLabelVersion
}: HappoPageProps): JSX.Element => {
  const code = LANGUAGES.find(
    x => x.title === LanguageTitles.Python
  )?.codes?.find(x => x.type === CodeType.StringOutput)

  return (
    <PageProvider
      isDarkMode={isDarkMode}
      isWhiteLabelVersion={isWhiteLabelVersion}
      url="/documentation/python"
    >
      <LanguageDocumentationPage
        codes={code && [code]}
        pageTitle="Python"
        pageDescription="Python Documentation"
      />
    </PageProvider>
  )
}

export const HappoToptalBlueThemePythonDocumentationPage = (): JSX.Element => (
  <HappoPythonDocumentationPage />
)

export const HappoDarkThemePythonDocumentationPage = (): JSX.Element => (
  <HappoPythonDocumentationPage isDarkMode={true} />
)

export const HappoWhiteLabelThemePythonDocumentationPage = (): JSX.Element => (
  <HappoPythonDocumentationPage isWhiteLabelVersion={true} />
)
