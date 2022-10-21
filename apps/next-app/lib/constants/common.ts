// FIXME: fill up with actual data
const ENV = process.env.NODE_ENV
const PROJECT_DISPLAY_NAME = 'Hastebin'
const PROJECT_URL =
  ENV === 'production'
    ? process.env.NEXT_PUBLIC_PROJECT_URL || 'http://localhost:3000'
    : 'http://localhost:3000'
const PROJECT_DESCRIPTION = `${PROJECT_DISPLAY_NAME} project description`
const TWITTER_HANDLE = '@toptal'
const OG_TITLE = `${PROJECT_DISPLAY_NAME}  - Project description`
const OG_IMAGE_URL = `${PROJECT_URL}/og-image.png`
const CONTENT_GROUP = PROJECT_DISPLAY_NAME
const BOUNCE_RATE_TIMEOUT = 15000
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || ''
const BASE_API_URL = process.env.NEXT_PUBLIC_BASE_API_URL || ''
const SHARE_BIN_DOMAIN =
  ENV === 'production' ? 'https://hastebin.com' : 'http://localhost:3000'
const IS_WHITELABEL_VERSION =
  process.env.NEXT_PUBLIC_USE_TOPTAL_THEME !== 'enabled'
const HASTEBIN_DARK_THEME_STORAGE_KEY = 'hastebin-ui-dark-theme'

export enum AlertColors {
  green = 'green',
  blue = 'blue',
  red = 'red',
  yellow = 'yellow'
}

export {
  BASE_PATH,
  BOUNCE_RATE_TIMEOUT,
  CONTENT_GROUP,
  OG_IMAGE_URL,
  OG_TITLE,
  PROJECT_DESCRIPTION,
  PROJECT_DISPLAY_NAME,
  PROJECT_URL,
  TWITTER_HANDLE,
  BASE_API_URL,
  SHARE_BIN_DOMAIN,
  IS_WHITELABEL_VERSION,
  HASTEBIN_DARK_THEME_STORAGE_KEY
}
