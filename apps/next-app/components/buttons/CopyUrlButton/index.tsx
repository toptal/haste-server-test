import { useState, MouseEvent } from 'react'
import Container from '@toptal/picasso/Container'
import Button from '@toptal/picasso/Button'
import classNames from 'classnames'
import Tooltip from '@toptal/picasso/Tooltip'

import Notification, { NotificationVariant } from '~/components/Notification'

import styles from './copy-url-button.module.scss'
import { TestIdCopyUrlButton } from './test-ids'

import { siteCopy } from '~/lib/constants/site-copy'
import routes from '~/lib/constants/routes'
import { useCopyCode } from '~/hooks/use-copy-code.hook'
import useHotKeys from '~/lib/hooks/use-hot-keys'
import hotKeys from '~/lib/constants/hotkeys'
import { trackInteractionOnce } from '~/lib/analytics'
import { InteractionEvents } from '~/lib/types/analytics'

interface Props {
  className?: string
  binId: string
}

const CopyUrlButton = ({ className, binId }: Props): JSX.Element => {
  const [showNotification, setShowNotification] = useState<boolean>(false)
  const { copyToClipboard, error, setError } = useCopyCode()

  const copyCodeAction = (
    e: MouseEvent<HTMLButtonElement> | KeyboardEvent
  ): void => {
    trackInteractionOnce(InteractionEvents.CopyURL)
    e.stopPropagation()
    if (!binId) {
      setError(true)
    } else {
      copyToClipboard(routes.shareBinUrl(binId))
    }
    setShowNotification(true)
  }

  useHotKeys(hotKeys.copyUrl.label, e => copyCodeAction(e))

  return (
    <>
      <Container className={styles.container}>
        <Container className={styles.notificationContainer}>
          <Notification
            className={classNames(
              styles.notification,
              error && styles.errorNotification
            )}
            testId={TestIdCopyUrlButton.CopyUrlNotificationContainer}
            showNotification={showNotification}
            variant={
              error ? NotificationVariant.red : NotificationVariant.green
            }
            message={
              error
                ? siteCopy.actions.urlCopyErrorNotification
                : siteCopy.actions.urlCopyNotification
            }
            onCloseNotification={() => setShowNotification(false)}
          />
        </Container>
      </Container>
      <Tooltip content={hotKeys.copyUrl.description} placement="bottom">
        <Button
          data-testid={TestIdCopyUrlButton.CopyUrlButton}
          className={className}
          onClick={copyCodeAction}
        >
          {siteCopy.actions.copyURL}
        </Button>
      </Tooltip>
    </>
  )
}

export default CopyUrlButton
