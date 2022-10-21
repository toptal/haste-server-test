import {
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved
} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import PicassoLight from '@toptal/picasso-provider/Picasso/PicassoLight'

import { TestIdCodeCopy } from './test-ids'

import CodeCopy from '.'

import { ANIMATION_TIMEOUT, TRANSITION_TIMEOUT } from '~/lib/constants/timeout'
import { trackInteractionOnce } from '~/lib/analytics'
import { InteractionEvents } from '~/lib/types/analytics'

Object.assign(navigator, {
  clipboard: {
    writeText: jest.fn()
  }
})

jest.mock('~/lib/analytics', () => ({
  trackInteractionOnce: jest.fn()
}))

describe('Code Copy', () => {
  const timeout = ANIMATION_TIMEOUT
  const transitionTimeout = TRANSITION_TIMEOUT
  const testText = 'testText'

  beforeEach(() => {
    jest.clearAllMocks()

    render(
      <PicassoLight>
        <CodeCopy text={testText} />
      </PicassoLight>
    )
  })

  it('shows notification after clicking on "copy button"', async () => {
    await userEvent.click(screen.getByTestId(TestIdCodeCopy.CopyButton))

    await waitFor(() => {
      expect(
        screen.getByTestId(TestIdCodeCopy.MessageContainer)
      ).toBeInTheDocument()
    })
  })

  it('removes notification after x seconds', async () => {
    await userEvent.click(screen.getByTestId(TestIdCodeCopy.CopyButton))

    await waitForElementToBeRemoved(
      () => screen.queryByTestId(TestIdCodeCopy.MessageContainer),
      { timeout: timeout + transitionTimeout + 100 }
    )
  })

  it('copies code to clipboard on click', async () => {
    await userEvent.click(screen.getByTestId(TestIdCodeCopy.CopyButton))

    expect(navigator.clipboard.writeText).toHaveBeenLastCalledWith(testText)
  })

  it('tracks interaction', async () => {
    await userEvent.click(screen.getByTestId(TestIdCodeCopy.CopyButton))

    expect(trackInteractionOnce).toBeCalledWith(InteractionEvents.CopyText)
  })
})
