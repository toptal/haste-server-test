import { render, screen, fireEvent } from '@testing-library/react'
import PicassoLight from '@toptal/picasso-provider/Picasso/PicassoLight'
import { noop } from '@toptal/picasso/utils'

import { TestIdCodeCopy } from '~/components/buttons/CopyTextButton/test-ids'

import { TestIdEditor } from './test-ids'

import Editor from '.'

import { InteractionEvents } from '~/lib/types/analytics'
import { trackInteractionOnce } from '~/lib/analytics'

jest.mock('~/lib/analytics', () => ({
  trackInteractionOnce: jest.fn()
}))

jest.mock('../TextContext', () => ({
  useTextContext: jest
    .fn()
    .mockImplementation(() => ({ text: '', setText: jest.fn() }))
}))

describe('Editor', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders text', () => {
    const mockText = 'lorem'

    render(
      <PicassoLight>
        <Editor text={mockText} setText={noop} />
      </PicassoLight>
    )

    expect(screen.getByText(mockText)).toBeInTheDocument()
  })

  it('calls setText on textarea change', () => {
    const setTextMock = jest.fn()

    render(
      <PicassoLight>
        <Editor text="lorem" setText={setTextMock} />
      </PicassoLight>
    )

    const textArea = screen.getByTestId(TestIdEditor.TextArea)

    fireEvent.change(textArea, { target: { value: 'lorem520' } })

    expect(setTextMock).toHaveBeenCalledWith('lorem520')
  })

  it('shows line numbers for text', () => {
    render(
      <PicassoLight>
        <Editor text={'lorem\nlorem\nlorem\nlorem\nlorem'} setText={noop} />
      </PicassoLight>
    )

    const lineNumbers = screen
      .getByTestId(TestIdEditor.LineNumber)
      .querySelectorAll('span')

    expect(lineNumbers).toHaveLength(5)
    lineNumbers.forEach((e, i) => {
      expect(e).toHaveTextContent(`${i + 1}`)
    })
  })

  it('inserts tab character on tab keydown', () => {
    const setTextMock = jest.fn()
    const setSelectionRangeMock = jest.fn()

    render(
      <PicassoLight>
        <Editor text="text" setText={setTextMock} />
      </PicassoLight>
    )

    const textArea = screen.getByTestId(TestIdEditor.TextArea)

    fireEvent.keyDown(textArea, {
      key: 'Tab',
      target: {
        value: 'othertext',
        selectionStart: 10,
        selectionEnd: 10,
        setSelectionRange: setSelectionRangeMock
      }
    })

    expect(setTextMock).toBeCalledWith('othertext\t')
    expect(setSelectionRangeMock).toBeCalledWith(11, 11)
  })

  it('does not render CopyText button when editor is enabled', () => {
    render(
      <PicassoLight>
        <Editor text={'lorem\nlorem\nlorem\nlorem\nlorem'} setText={noop} />
      </PicassoLight>
    )

    expect(screen.queryByTestId(TestIdCodeCopy.CopyButton)).toBeFalsy()
  })

  it('does not render CopyText button when there is no text', () => {
    render(
      <PicassoLight>
        <Editor text="" setText={noop} disabled />
      </PicassoLight>
    )

    expect(screen.queryByTestId(TestIdCodeCopy.CopyButton)).toBeFalsy()
  })

  it('render CopyText button when text is not empty', () => {
    render(
      <PicassoLight>
        <Editor
          text={'lorem\nlorem\nlorem\nlorem\nlorem'}
          setText={noop}
          disabled
        />
      </PicassoLight>
    )

    expect(screen.getByTestId(TestIdCodeCopy.CopyButton)).toBeInTheDocument()
  })

  it('tracks interaction', () => {
    render(
      <PicassoLight>
        <Editor text="" setText={noop} />
      </PicassoLight>
    )

    fireEvent.change(screen.getByTestId(TestIdEditor.TextArea), {
      target: { value: 'test' }
    })

    expect(trackInteractionOnce).toBeCalledWith(InteractionEvents.EditText)
  })
})
