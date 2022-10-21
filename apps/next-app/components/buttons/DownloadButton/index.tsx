import Button from '@toptal/picasso/Button'
import classNames from 'classnames'
import Tooltip from '@toptal/picasso/Tooltip'

import styles from './download-button.module.scss'

import routes from '~/lib/constants/routes'
import { siteCopy } from '~/lib/constants/site-copy'
import hotKeys from '~/lib/constants/hotkeys'
import useHotKeys from '~/lib/hooks/use-hot-keys'
import { trackInteractionOnce } from '~/lib/analytics'
import { InteractionEvents } from '~/lib/types/analytics'

interface DownloadButtonProps {
  className?: string
  binId: string
}

const DownloadButton = ({
  className,
  binId
}: DownloadButtonProps): JSX.Element => {
  const handleClick = () => {
    trackInteractionOnce(InteractionEvents.DownloadRaw)
    if (binId) {
      window.open(routes.api.rawBin(binId), '_blank')
    }
  }

  useHotKeys(hotKeys.downloadRaw.label, handleClick)

  return (
    <Tooltip content={hotKeys.downloadRaw.description} placement="bottom">
      <Button
        variant="transparent"
        className={classNames(styles.downloadRawButton, className)}
        onClick={handleClick}
      >
        {siteCopy.actions.downloadRaw}
      </Button>
    </Tooltip>
  )
}

export default DownloadButton
