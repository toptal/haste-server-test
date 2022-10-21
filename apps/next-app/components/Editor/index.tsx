import { useState, ChangeEvent, KeyboardEvent, useEffect } from 'react'
import Container from '@toptal/picasso/Container'
import classNames from 'classnames'

import CopyTextButton from '~/components/buttons/CopyTextButton'

import { TestIdEditor } from './test-ids'
import styles from './editor.module.scss'

import { trackInteractionOnce } from '~/lib/analytics'
import { InteractionEvents } from '~/lib/types/analytics'

interface EditorProps {
  disabled?: boolean
  text: string
  setText: (text: string) => void
}

const Editor = ({ disabled, text, setText }: EditorProps): JSX.Element => {
  const [lines, setLines] = useState(1)

  useEffect(() => {
    setLines(text.split('\n').length)
  }, [text, setLines])

  const onChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    trackInteractionOnce(InteractionEvents.EditText)
    setText(e.target.value)
  }

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    const textarea = e.target as HTMLInputElement
    const { key } = e
    const { value, selectionStart, selectionEnd } = textarea

    if (key === 'Tab' && selectionStart && selectionEnd) {
      e.preventDefault()
      setText(value.slice(0, selectionStart) + '\t' + value.slice(selectionEnd))
      textarea.setSelectionRange(selectionStart + 2, selectionStart + 2)
    }
  }

  return (
    <Container className={styles.container}>
      <div
        className={classNames(styles.editor, disabled && styles.editorDisabled)}
      >
        <div
          className={styles.editorLines}
          data-testid={TestIdEditor.LineNumber}
        >
          {Array.from(Array(lines).keys()).map(el => (
            <span key={el}>{el + 1}</span>
          ))}
        </div>
        <textarea
          aria-label="Content Editor"
          className={styles.editorContent}
          onChange={onChange}
          onKeyDown={onKeyDown}
          disabled={disabled}
          value={text}
          data-testid={TestIdEditor.TextArea}
          spellCheck={false}
          data-gramm="false"
        />
      </div>
      {disabled && text && (
        <CopyTextButton className={styles.copyButton} text={text} />
      )}
    </Container>
  )
}

export default Editor
