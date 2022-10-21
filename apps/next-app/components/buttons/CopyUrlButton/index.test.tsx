import {
  render,
  screen,
  waitFor,
  act,
  fireEvent,
  waitForElementToBeRemoved
} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import PicassoLight from '@toptal/picasso-provider/Picasso/PicassoLight'

import { TestIdCopyUrlButton } from './test-ids'

import CopyUrlButton from '.'

import { useBinId } from '~/hooks/use-bin-id.hook'
import { ANIMATION_TIMEOUT, TRANSITION_TIMEOUT } from '~/lib/constants/timeout'
import { siteCopy } from '~/lib/constants/site-copy'
import { trackInteractionOnce } from '~/lib/analytics'
import { InteractionEvents } from '~/lib/types/analytics'

global.window = Object.create(window)

Object.defineProperty(window, 'matchMedia', {
  value: jest.fn().mockImplementation(query => ({
    matches: true,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn()
  }))
})

jest.mock('~/hooks/use-bin-id.hook', () => ({
  useBinId: jest.fn()
}))

const useBinMock = useBinId as jest.Mock

useBinMock.mockImplementation(() => ({
  binId: 'test-bin'
}))

jest.mock('~/lib/analytics', () => ({
  trackInteractionOnce: jest.fn()
}))

const originalNavigator = { ...global.navigator }

describe('Copy Url Button', () => {
  const timeout = ANIMATION_TIMEOUT
  const transitionTimeout = TRANSITION_TIMEOUT

  beforeAll(() => {
    Object.assign(global.navigator, {
      clipboard: {
        writeText: jest.fn()
      }
    })
  })

  afterAll(() => {
    Object.assign(global.navigator, originalNavigator)
  })

  beforeEach(() => {
    jest.clearAllMocks()

    render(
      <PicassoLight>
        <CopyUrlButton binId="testBin" />
      </PicassoLight>
    )
  })

  it('shows notification after click', async () => {
    await userEvent.click(screen.getByTestId(TestIdCopyUrlButton.CopyUrlButton))

    await waitFor(() => {
      expect(
        screen.getByTestId(TestIdCopyUrlButton.CopyUrlNotificationContainer)
      ).toBeInTheDocument()
    })
  })

  it('removes notification after x seconds', async () => {
    await userEvent.click(screen.getByTestId(TestIdCopyUrlButton.CopyUrlButton))

    await waitForElementToBeRemoved(
      () =>
        screen.queryByTestId(TestIdCopyUrlButton.CopyUrlNotificationContainer),
      { timeout: timeout + transitionTimeout + 100 }
    )
  })

  it('shows tooltip on hover', async () => {
    fireEvent.mouseOver(
      screen.getByRole('button', { name: siteCopy.actions.copyURL })
    )

    await waitFor(() =>
      expect(screen.findByRole('tooltip')).resolves.toBeInTheDocument()
    )
  })

  it('works with hotkeys', async () => {
    await act(async () => {
      fireEvent.keyDown(document, {
        keyCode: 85,
        ctrlKey: true
      })
    })

    await waitFor(() => {
      expect(
        screen.getByTestId(TestIdCopyUrlButton.CopyUrlNotificationContainer)
      ).toBeInTheDocument()
    })
  })

  it('tracks interaction', async () => {
    await userEvent.click(screen.getByTestId(TestIdCopyUrlButton.CopyUrlButton))

    expect(trackInteractionOnce).toBeCalledWith(InteractionEvents.CopyURL)
  })
})
