import NewTextButton from '~/components/buttons/NewTextButton'

import { HappoPageProps } from '~/lib/types/page'
import UIThemeContext from '~/lib/state/use-ui-theme'

const HappoNewTextButton = ({
  isDarkMode,
  isWhiteLabelVersion
}: HappoPageProps): JSX.Element => {
  return (
    <UIThemeContext
      isDarkMode={isDarkMode}
      isWhiteLabelVersion={isWhiteLabelVersion}
    >
      <NewTextButton defaultOpen />
    </UIThemeContext>
  )
}

export const HappoToptalBlueThemeNewTextButton = (): JSX.Element => (
  <HappoNewTextButton />
)

export const HappoDarkThemeNewTextButton = (): JSX.Element => (
  <HappoNewTextButton isDarkMode={true} />
)

export const HappoWhiteLabelThemeNewTextButton = (): JSX.Element => (
  <HappoNewTextButton isWhiteLabelVersion={true} />
)
