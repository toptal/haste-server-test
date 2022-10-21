import { BASE_PATH } from '~/lib/constants/common'

export const withBasePath = (href: string): string => {
  return `${BASE_PATH}${href}`
}
