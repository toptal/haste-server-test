import { fireEvent, render, screen, waitFor, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ReactElement } from 'react'
import PicassoLight from '@toptal/picasso-provider/Picasso/PicassoLight'

import { TestIdNewTextButton } from './test-ids'

import NewTextButton from '.'

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

describe('New Text Button', () => {
  const onSuccess = jest.fn()
  let closeButton: HTMLElement | null
  let message: HTMLElement | null
  let rerender: (ui: ReactElement) => void
  let submitButton: HTMLElement | null
  let title: HTMLElement | null

  beforeEach(() => {
    const view = render(
      <PicassoLight>
        <NewTextButton onSuccess={onSuccess} />
      </PicassoLight>
    )

    rerender = view.rerender
  })

  const assertElementsAreNotOnScreen = async () => {
    closeButton = screen.queryByText('No')
    message = screen.queryByText(siteCopy.messages.newTextModalPrompt)
    submitButton = screen.queryByText('Yes')
    title = screen.queryByTestId(TestIdNewTextButton.NewTextButtonModalTitle)

    await waitFor(() => {
      expect(closeButton).not.toBeInTheDocument()
      expect(message).not.toBeInTheDocument()
      expect(submitButton).not.toBeInTheDocument()
      expect(title).not.toBeInTheDocument()
    })
  }

  const assertElementsAreOnScreen = async () => {
    closeButton = screen.queryByText('No')
    message = screen.queryByText(siteCopy.messages.newTextModalPrompt)
    submitButton = screen.queryByText('Yes')
    title = screen.queryByTestId(TestIdNewTextButton.NewTextButtonModalTitle)

    await waitFor(() => {
      expect(closeButton).toBeInTheDocument()
      expect(message).toBeInTheDocument()
      expect(submitButton).toBeInTheDocument()
      expect(title).toBeInTheDocument()
    })
  }

  it('correctly renders the button not renders modal on initial load', async () => {
    expect(screen.getByText(siteCopy.actions.startNewBin)).toBeInTheDocument()
    await assertElementsAreNotOnScreen()
  })

  it('correctly renders the modal when new text button is clicked', async () => {
    fireEvent.click(screen.getByText(siteCopy.actions.startNewBin))

    await assertElementsAreOnScreen()

    expect(
      screen.queryByTestId(TestIdNewTextButton.NewTextButtonModalMessage)
        ?.textContent
    ).toEqual(siteCopy.messages.newTextModalPrompt)

    expect(
      screen.queryByTestId(TestIdNewTextButton.NewTextButtonModalTitle)
        ?.textContent
    ).toEqual(siteCopy.actions.startNewBin)
  })

  it('shows tooltip on hover', async () => {
    fireEvent.mouseOver(
      screen.getByRole('button', { name: siteCopy.actions.startNewBin })
    )

    await waitFor(() =>
      expect(screen.findByRole('tooltip')).resolves.toBeInTheDocument()
    )
  })

  it('works with hotkeys', async () => {
    await act(async () => {
      fireEvent.keyDown(document, {
        keyCode: 78,
        altKey: true,
        ctrlKey: true
      })
    })

    await assertElementsAreOnScreen()

    expect(
      screen.queryByTestId(TestIdNewTextButton.NewTextButtonModalMessage)
        ?.textContent
    ).toEqual(siteCopy.messages.newTextModalPrompt)

    expect(
      screen.queryByTestId(TestIdNewTextButton.NewTextButtonModalTitle)
        ?.textContent
    ).toEqual(siteCopy.actions.startNewBin)
  })

  it('correctly close modal and clean text editor when submit button of modal is clicked', async () => {
    fireEvent.click(screen.getByText(siteCopy.actions.startNewBin))
    fireEvent.click(screen.getByText('Yes'))

    expect(onSuccess).toHaveBeenCalled()

    await assertElementsAreNotOnScreen()
  })

  it('correctly close modal when close button of modal is clicked', async () => {
    fireEvent.click(screen.getByText(siteCopy.actions.startNewBin))
    fireEvent.click(screen.getByText('No'))

    await assertElementsAreNotOnScreen()
  })

  it('correctly close modal and clean text editor when new text button is clicked and there is no need confirmation', async () => {
    rerender(
      <PicassoLight>
        <NewTextButton onSuccess={onSuccess} needsConfirmation={false} />
      </PicassoLight>
    )
    fireEvent.click(screen.getByText(siteCopy.actions.startNewBin))
    expect(onSuccess).toHaveBeenCalled()
  })

  it('does not open modal on click when it is disabled', async () => {
    rerender(
      <PicassoLight>
        <NewTextButton onSuccess={onSuccess} disabled={true} />
      </PicassoLight>
    )

    expect(
      screen.getByText(siteCopy.actions.startNewBin).parentElement
    ).toHaveAttribute('disabled')
    fireEvent.click(screen.getByText(siteCopy.actions.startNewBin))
    await assertElementsAreNotOnScreen()
  })

  it('tracks interaction on button click', async () => {
    const startNewBinButton = screen.getByText(siteCopy.actions.startNewBin)

    await userEvent.click(startNewBinButton)

    expect(trackInteractionOnce).toBeCalledWith(InteractionEvents.StartNewText)
  })

  it('tracks interaction on modal confirm', async () => {
    const startNewBinButton = screen.getByText(siteCopy.actions.startNewBin)

    await userEvent.click(startNewBinButton)

    const modalConfirmButton = screen.getByText('Yes')

    await userEvent.click(modalConfirmButton)

    expect(trackInteractionOnce).toBeCalledWith(
      InteractionEvents.StartNewTextModalConfirm
    )
  })

  it('tracks interaction on modal cancel', async () => {
    const startNewBinButton = screen.getByText(siteCopy.actions.startNewBin)

    await userEvent.click(startNewBinButton)

    const modalCancelButton = screen.getByText('No')

    await userEvent.click(modalCancelButton)

    expect(trackInteractionOnce).toBeCalledWith(
      InteractionEvents.StartNewTextModalCancel
    )
  })
})
