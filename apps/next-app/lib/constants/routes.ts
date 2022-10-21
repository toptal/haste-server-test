import {
  BASE_API_URL,
  BASE_PATH,
  SHARE_BIN_DOMAIN,
  PROJECT_URL
} from '~/lib/constants/common'

const routes = {
  developers: 'https://www.toptal.com/developers',
  freelance: 'https://www.toptal.com/freelance-jobs',
  home: `/`,
  tos: 'https://www.toptal.com/tos',
  privacy: 'https://www.toptal.com/privacy',
  toptalHome: 'https://www.toptal.com/',
  utilities: 'https://www.toptal.com/utilities-tools',
  about: '/about',
  share: '/share',
  bin: '/bin',
  documentation: '/documentation',
  publicRelative: (fileName: string): string => `${BASE_PATH}${fileName}`,
  getSharePagePath: (binId: string): string => `/share/${binId}`,
  shareBinUrl: (binId: string): string => `${SHARE_BIN_DOMAIN}/share/${binId}`,
  getDuplicatePagePath: (
    binId: string | null,
    shouldRedirect?: boolean
  ): string => {
    if (!binId) {
      return BASE_PATH
    }

    if (shouldRedirect) {
      return `${PROJECT_URL}${BASE_PATH}?binId=${binId}`
    }

    return `${BASE_PATH}?binId=${binId}`
  },
  api: {
    url: BASE_API_URL,
    getToken: (): string => `${BASE_PATH}/api/token`,
    createBin: (): string => `${BASE_API_URL}/documents`,
    fetchBin: (binId: string): string => `/documents/${binId}`,
    rawBin: (binId?: string): string => `${BASE_API_URL}/raw/${binId}`
  }
}

export default routes
