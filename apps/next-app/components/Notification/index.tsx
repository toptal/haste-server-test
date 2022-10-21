import Typography from '@toptal/picasso/Typography'
import Alert from '@toptal/picasso/Alert'
import { CSSTransition } from 'react-transition-group'
import classNames from 'classnames'
import { useEffect } from 'react'

import messageTransitionStyles from './message-transition.module.scss'
import styles from './notification.module.scss'
import { TestIdNotification } from './test-ids'

import { ANIMATION_TIMEOUT, TRANSITION_TIMEOUT } from '~/lib/constants/timeout'

export enum NotificationVariant {
  green = 'green',
  blue = 'blue',
  red = 'red',
  yellow = 'yellow'
}

type NotificationProps = {
  variant: NotificationVariant
  showNotification?: boolean
  message: string
  onCloseNotification: () => void
  timeout?: number
  testId?: string
  className?: string
}

const Notification = ({
  showNotification = false,
  variant,
  message,
  onCloseNotification,
  testId,
  className,
  timeout = ANIMATION_TIMEOUT
}: NotificationProps): JSX.Element => {
  useEffect(() => {
    if (!showNotification) {
      return onCloseNotification()
    }

    const timeoutId = window.setTimeout(() => {
      onCloseNotification()
    }, timeout)

    return () => {
      clearTimeout(timeoutId)
    }
  }, [onCloseNotification, showNotification, timeout])

  return (
    <CSSTransition
      appear={showNotification}
      in={showNotification}
      unmountOnExit
      timeout={TRANSITION_TIMEOUT}
      classNames={{ ...messageTransitionStyles }}
    >
      <div
        className={styles.notificationContainer}
        data-testid={testId || TestIdNotification.NotificationContainer}
      >
        <Alert
          className={classNames(
            className,
            styles.notification,
            styles.showNotification
          )}
          onClose={() => {
            onCloseNotification()
          }}
          variant={variant}
        >
          <Typography
            data-testid={TestIdNotification.NotificationMessageContainer}
            size="medium"
            className={styles.notificationMessage}
          >
            {message.trim()}
          </Typography>
        </Alert>
      </div>
    </CSSTransition>
  )
}

export default Notification
