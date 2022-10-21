import { IS_WHITELABEL_VERSION } from '~/lib/constants/common'

export const isWhiteLabelVersion = (
  isWhiteLabel?: boolean
): boolean | undefined => IS_WHITELABEL_VERSION || isWhiteLabel
