import Typography from '@toptal/picasso/Typography'
import Container from '@toptal/picasso/Container'
import Switch from '@toptal/picasso/Switch'

import styles from './dark-mode-selector.module.scss'
import { TestIdDarkModeSelector } from './test-ids'

import { useUIThemeContext } from '~/lib/state/use-ui-theme'
import { trackInteractionOnce } from '~/lib/analytics'
import { InteractionEvents } from '~/lib/types/analytics'

const DarkModeSelector = (): JSX.Element => {
  const { changeDarkMode, isDarkMode } = useUIThemeContext()

  return (
    <Container className={styles.selector} flex justifyContent="space-between">
      <Typography
        data-testid={TestIdDarkModeSelector.DarkModeSelectorText}
        className={styles.text}
        size="xlarge"
      >
        Dark Mode: {isDarkMode ? 'On' : 'Off'}
      </Typography>
      <Switch
        data-testid={TestIdDarkModeSelector.DarkModeSelectorSwitch}
        checked={isDarkMode}
        onChange={() => {
          trackInteractionOnce(
            isDarkMode
              ? InteractionEvents.DisableDarkMode
              : InteractionEvents.EnableDarkMode
          )
          changeDarkMode()
        }}
      />
    </Container>
  )
}

export default DarkModeSelector
