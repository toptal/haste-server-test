import { render, screen, fireEvent, act, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import PicassoLight from '@toptal/picasso-provider/Picasso/PicassoLight'

import DuplicateButton from '.'

import { trackInteractionOnce } from '~/lib/analytics'
import { InteractionEvents } from '~/lib/types/analytics'

global.window = Object.create(window)

Object.defineProperty(window, 'matchMedia', {
  value: jest.fn().mockImplementation(query => ({
    matches: true,
    media: query,
    onchange: null
  }))
})

jest.mock('~/lib/analytics', () => ({
  trackInteractionOnce: jest.fn()
}))

const mockOnClick = jest.fn()

describe('Duplicate Button', () => {
  let duplicateButton: HTMLElement

  beforeEach(() => {
    render(
      <PicassoLight>
        <DuplicateButton onClick={mockOnClick} />
      </PicassoLight>
    )
    duplicateButton = screen.getByRole('button')
  })

  it('correctly renders component', () => {
    expect(duplicateButton).toBeInTheDocument()
  })

  it('correctly handles click', async () => {
    await act(async () => {
      fireEvent.click(duplicateButton)
    })

    expect(mockOnClick).toHaveBeenCalled()
  })

  it('shows tooltip on hover', async () => {
    fireEvent.mouseOver(duplicateButton)

    await waitFor(() =>
      expect(screen.findByRole('tooltip')).resolves.toBeInTheDocument()
    )
  })

  it('works with hotkeys', async () => {
    await act(async () => {
      fireEvent.keyDown(document, {
        keyCode: 68,
        ctrlKey: true
      })
    })

    expect(mockOnClick).toHaveBeenCalled()
  })

  it('tracks interaction', async () => {
    await userEvent.click(duplicateButton)

    expect(trackInteractionOnce).toBeCalledWith(InteractionEvents.DuplicateText)
  })
})
