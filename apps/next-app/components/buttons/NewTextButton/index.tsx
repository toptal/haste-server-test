import PromptModal from '@toptal/picasso/PromptModal'
import Button, { VariantType } from '@toptal/picasso/Button'
import { noop, useModal } from '@toptal/picasso/utils'
import Tooltip from '@toptal/picasso/Tooltip'
import classNames from 'classnames'

import { TestIdNewTextButton } from './test-ids'
import styles from './new-text-button.module.scss'

import { siteCopy } from '~/lib/constants/site-copy'
import hotKeys from '~/lib/constants/hotkeys'
import useHotKeys from '~/lib/hooks/use-hot-keys'
import { trackInteractionOnce } from '~/lib/analytics'
import { InteractionEvents } from '~/lib/types/analytics'
import { useUIThemeContext } from '~/lib/state/use-ui-theme'
import themeStyles from '~/styles/theme.module.scss'

type Props = {
  disabled?: boolean
  needsConfirmation?: boolean
  variant?: VariantType
  onSuccess?: () => void
  className?: string
  defaultOpen?: boolean
}

const NewTextButton = (props: Props): JSX.Element => {
  const {
    disabled = false,
    needsConfirmation = true,
    variant = 'secondary',
    onSuccess = noop,
    className,
    defaultOpen = false
  } = props
  const { showModal, hideModal, isOpen } = useModal()
  const { isDarkMode } = useUIThemeContext()
  const handleClick = () => {
    trackInteractionOnce(InteractionEvents.StartNewText)
    if (needsConfirmation) {
      showModal()
    } else {
      onSuccess()
    }
  }

  useHotKeys(hotKeys.newText.label, handleClick)

  return (
    <>
      <Tooltip content={hotKeys.newText.description} placement="bottom">
        <Button
          id="new-text-button"
          variant={variant}
          className={className}
          disabled={disabled}
          onClick={handleClick}
        >
          {siteCopy.actions.startNewBin}
        </Button>
      </Tooltip>

      <PromptModal
        className={classNames(
          styles.modal,
          isDarkMode && themeStyles.modalDarkTheme
        )}
        open={isOpen || defaultOpen}
        title={siteCopy.actions.startNewBin}
        message={siteCopy.messages.newTextModalPrompt}
        submitText="Yes"
        testIds={{
          title: TestIdNewTextButton.NewTextButtonModalTitle,
          message: TestIdNewTextButton.NewTextButtonModalMessage
        }}
        cancelText="No"
        onSubmit={() => {
          trackInteractionOnce(InteractionEvents.StartNewTextModalConfirm)
          onSuccess()
        }}
        onClose={() => {
          trackInteractionOnce(InteractionEvents.StartNewTextModalCancel)
          hideModal()
        }}
      />
    </>
  )
}

export default NewTextButton
