import { render, screen, act, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import PicassoLight from '@toptal/picasso-provider/Picasso/PicassoLight'

import DownloadButton from '.'

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

jest.mock('~/lib/analytics', () => ({
  trackInteractionOnce: jest.fn()
}))

let windowSpy: jest.SpyInstance

describe('Download Button', () => {
  beforeEach(() => {
    jest.clearAllMocks()

    windowSpy = jest.spyOn(window, 'open')

    render(
      <PicassoLight>
        <DownloadButton binId="test-bin" />
      </PicassoLight>
    )
  })

  it('opens new tab when clicked', async () => {
    await userEvent.click(screen.getByText(siteCopy.actions.downloadRaw))

    expect(windowSpy).toHaveBeenCalledWith('/raw/test-bin', '_blank')
  })

  it('shows tooltip on hover', async () => {
    fireEvent.mouseOver(
      screen.getByRole('button', { name: siteCopy.actions.downloadRaw })
    )

    await waitFor(() =>
      expect(screen.findByRole('tooltip')).resolves.toBeInTheDocument()
    )
  })

  it('works with hotkeys', async () => {
    await act(async () => {
      fireEvent.keyDown(document, {
        keyCode: 82,
        ctrlKey: true,
        shiftKey: true
      })
    })

    expect(windowSpy).toHaveBeenCalledWith('/raw/test-bin', '_blank')
  })

  it('tracks interaction', async () => {
    const downloadRawButton = screen.getByText(siteCopy.actions.downloadRaw)

    await userEvent.click(downloadRawButton)

    expect(trackInteractionOnce).toBeCalledWith(InteractionEvents.DownloadRaw)
  })
})
