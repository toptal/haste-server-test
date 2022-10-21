import ButtonCircular from '@toptal/picasso/ButtonCircular'
import { Copy24, Check24, Exclamation24 } from '@toptal/picasso/Icon'
import classNames from 'classnames'
import { MouseEvent } from 'react'

import Notification, { NotificationVariant } from '~/components/Notification'

import styles from './copy-text-button.module.scss'
import { useConfirmation } from './use-confirmation'
import { TestIdCodeCopy } from './test-ids'

import { siteCopy } from '~/lib/constants/site-copy'
import { useCopyCode } from '~/hooks/use-copy-code.hook'
import { ANIMATION_TIMEOUT, TRANSITION_TIMEOUT } from '~/lib/constants/timeout'
import { useUIThemeContext } from '~/lib/state/use-ui-theme'
import { trackInteractionOnce } from '~/lib/analytics'
import { InteractionEvents } from '~/lib/types/analytics'

type Props = {
  text: string
  showNotificationOnLoad?: boolean

  className?: string
}

const CopyTextButton = ({
  text,
  showNotificationOnLoad = false,
  className
}: Props): JSX.Element => {
  const { isDarkMode } = useUIThemeContext()
  const { showConfirmation, showAnimation, setShowStates } = useConfirmation(
    showNotificationOnLoad,
    ANIMATION_TIMEOUT,
    TRANSITION_TIMEOUT
  )

  const colorVariant = isDarkMode ? 'black' : 'white'

  const { copyToClipboard, error } = useCopyCode()

  const closeNotificationAction = (): void => {
    setShowStates(false)
  }

  const copyCodeAction = (
    e: MouseEvent<HTMLButtonElement & HTMLAnchorElement>
  ): void => {
    trackInteractionOnce(InteractionEvents.CopyText)
    e.stopPropagation()
    copyToClipboard(text)
    setShowStates(true)
  }

  return (
    <div className={classNames(styles.container, className)}>
      <Notification
        testId={TestIdCodeCopy.MessageContainer}
        className={classNames(
          styles.notification,
          error && styles.errorNotification
        )}
        showNotification={showConfirmation}
        variant={error ? NotificationVariant.red : NotificationVariant.green}
        message={
          error
            ? siteCopy.actions.codeCopyErrorNotification
            : siteCopy.actions.codeCopyNotification
        }
        onCloseNotification={closeNotificationAction}
      />
      <ButtonCircular
        aria-label="Copy Code"
        data-testid={TestIdCodeCopy.CopyButton}
        onClick={copyCodeAction}
        className={classNames(styles.copyButton, {
          [styles.rotateIcon]: showConfirmation,
          [styles.successIcon]: showConfirmation && !error,
          [styles.errorIcon]: showConfirmation && error
        })}
        icon={
          showAnimation ? (
            error ? (
              <Exclamation24 color={colorVariant} />
            ) : (
              <Check24 color={colorVariant} />
            )
          ) : (
            <Copy24 color={colorVariant} />
          )
        }
      />
    </div>
  )
}

export default CopyTextButton
