import Button from '@toptal/picasso/Button'
import Tooltip from '@toptal/picasso/Tooltip'

import { useSubmitBin } from './use-submit-bin'

import { siteCopy } from '~/lib/constants/site-copy'
import hotKeys from '~/lib/constants/hotkeys'
import useHotKeys from '~/lib/hooks/use-hot-keys'
import { trackInteractionOnce } from '~/lib/analytics'
import { InteractionEvents } from '~/lib/types/analytics'

interface Props {
  text: string
  className?: string
  onError: (error: Error) => void
  onSave: (id: string) => void
}

const SaveButton = ({
  text,
  className,
  onError,
  onSave
}: Props): JSX.Element => {
  const { submit, isLoading } = useSubmitBin()

  const handleClick = async () => {
    trackInteractionOnce(InteractionEvents.SaveText)
    const result = await submit(text)

    if (result.error) {
      onError(result.error)
    } else if (result.key) {
      onSave(result.key)
    }
  }

  useHotKeys(hotKeys.save.label, handleClick)

  return (
    <Tooltip content={hotKeys.save.description} placement="bottom">
      <Button
        className={className}
        loading={isLoading}
        onClick={handleClick}
        disabled={!text || isLoading}
      >
        {siteCopy.actions.save}
      </Button>
    </Tooltip>
  )
}

export default SaveButton
