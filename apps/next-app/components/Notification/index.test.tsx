import { fireEvent, render, screen } from '@testing-library/react'
import PicassoLight from '@toptal/picasso-provider/Picasso/PicassoLight'

import { TestIdNotification } from './test-ids'

import Notification, { NotificationVariant } from '.'

jest.useFakeTimers()

describe('Notification', () => {
  const onCloseNotification = jest.fn()
  const notificationMessage = 'test'

  const renderNotificationComponent = (visible: boolean) => {
    render(
      <PicassoLight>
        <Notification
          showNotification={visible}
          onCloseNotification={onCloseNotification}
          message={notificationMessage}
          variant={NotificationVariant.red}
        />
      </PicassoLight>
    )
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it(`doesn't render notification when showNotification is false`, () => {
    renderNotificationComponent(false)

    expect(
      screen.queryByTestId(TestIdNotification.NotificationContainer)
    ).not.toBeInTheDocument()

    expect(
      screen.queryByTestId(TestIdNotification.NotificationMessageContainer)
    ).not.toBeInTheDocument()
  })

  it('renders notification when showNotification is true', () => {
    renderNotificationComponent(true)

    expect(
      screen.queryByTestId(TestIdNotification.NotificationContainer)
    ).toBeInTheDocument()

    expect(
      screen.queryByTestId(TestIdNotification.NotificationMessageContainer)
    ).toBeInTheDocument()

    expect(screen.getByText(notificationMessage)).toBeInTheDocument()
  })

  it('removes notification when the timer is expired', () => {
    renderNotificationComponent(false)

    jest.runAllTimers()

    expect(onCloseNotification).toHaveBeenCalled()
  })

  it('removes notification when notification is closed', () => {
    renderNotificationComponent(true)

    const notificationCloseBtn = screen
      .getByTestId(TestIdNotification.NotificationContainer)
      .getElementsByTagName('button')[0]

    fireEvent.click(notificationCloseBtn)

    expect(onCloseNotification).toHaveBeenCalled()
  })
})
