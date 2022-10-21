import Button from '@toptal/picasso/Button'
import Tooltip from '@toptal/picasso/Tooltip'

import { siteCopy } from '~/lib/constants/site-copy'
import hotKeys from '~/lib/constants/hotkeys'
import useHotKeys from '~/lib/hooks/use-hot-keys'
import { trackInteractionOnce } from '~/lib/analytics'
import { InteractionEvents } from '~/lib/types/analytics'

interface DuplicateButtonProps {
  className?: string
  onClick: () => void
}

const DuplicateButton = ({
  className,
  onClick
}: DuplicateButtonProps): JSX.Element => {
  const handleClick = async () => {
    trackInteractionOnce(InteractionEvents.DuplicateText)
    onClick()
  }

  useHotKeys(hotKeys.duplicate.label, handleClick)

  return (
    <Tooltip content={hotKeys.duplicate.description} placement="bottom">
      <Button variant="secondary" className={className} onClick={handleClick}>
        {siteCopy.actions.duplicateText}
      </Button>
    </Tooltip>
  )
}

export default DuplicateButton
