import { render, screen, fireEvent, act, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useRouter } from 'next/router'
import PicassoLight from '@toptal/picasso-provider/Picasso/PicassoLight'

import SaveButton from '.'

import { siteCopy } from '~/lib/constants/site-copy'
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

jest.mock('next/router', () => ({
  useRouter: jest.fn()
}))

const useRouterMock = useRouter as jest.Mock

useRouterMock.mockImplementation(() => ({
  push: jest.fn(route => {
    Object.defineProperty(window, 'location', {
      ...window,
      value: {
        pathname: route
      }
    })
  })
}))

jest.mock('~/lib/analytics', () => ({
  trackInteractionOnce: jest.fn()
}))

const fetchMock = jest.fn()

const originalFetch = global.fetch
const mockText = 'text'
const mockOnError = jest.fn()
const mockOnSave = jest.fn()

const arrangeTest = () => {
  const { rerender } = render(
    <PicassoLight>
      <SaveButton onSave={mockOnSave} text={mockText} onError={mockOnError} />
    </PicassoLight>
  )

  return rerender
}

describe('Save Button', () => {
  let saveButton: HTMLElement
  let rerender: (ui: React.ReactElement) => void

  beforeAll(() => {
    global.fetch = fetchMock
  })

  afterAll(() => {
    global.fetch = originalFetch
  })

  beforeEach(() => {
    rerender = arrangeTest()
    saveButton = screen.getByRole('button')
  })

  it('correctly renders component', () => {
    expect(saveButton).toBeInTheDocument()
  })

  it('correctly handles click', async () => {
    const mockKey = 'testbin'

    fetchMock.mockImplementationOnce(
      () =>
        new Promise(resolve => {
          resolve({ ok: true, json: () => ({ key: mockKey }) })
        })
    )

    await act(async () => {
      fireEvent.click(saveButton)
    })

    expect(fetchMock).toHaveBeenCalledWith('/documents', {
      body: 'text',
      headers: { 'Content-Type': 'text/plain' },
      method: 'POST'
    })
    expect(mockOnSave).toBeCalledWith(mockKey)
  })

  it('shows tooltip on hover', async () => {
    fireEvent.mouseOver(
      screen.getByRole('button', { name: siteCopy.actions.save })
    )

    await waitFor(() =>
      expect(screen.findByRole('tooltip')).resolves.toBeInTheDocument()
    )
  })

  it('works with hotkeys', async () => {
    await act(async () => {
      fireEvent.keyDown(document, {
        keyCode: 83,
        ctrlKey: true
      })
    })

    expect(fetchMock).toHaveBeenCalledWith('/documents', {
      body: 'text',
      headers: { 'Content-Type': 'text/plain' },
      method: 'POST'
    })
  })

  it('disables button with no text', () => {
    rerender(
      <PicassoLight>
        <SaveButton onSave={mockOnSave} text="" onError={mockOnError} />
      </PicassoLight>
    )
    expect(saveButton).toBeDisabled()
  })

  it('calls onError on failed response', async () => {
    fetchMock.mockImplementationOnce(() => {
      throw new Error('err')
    })

    rerender(
      <PicassoLight>
        <SaveButton onSave={mockOnSave} text={mockText} onError={mockOnError} />
      </PicassoLight>
    )

    await act(async () => {
      fireEvent.click(saveButton)
    })

    expect(mockOnError).toHaveBeenCalledWith(new Error('err'))
  })

  it('tracks interaction', async () => {
    await userEvent.click(saveButton)

    expect(trackInteractionOnce).toBeCalledWith(InteractionEvents.SaveText)
  })
})
