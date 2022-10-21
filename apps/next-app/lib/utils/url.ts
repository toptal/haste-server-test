export const stripQueryParams = (path: string): string => path.split('?')[0]

export const removeTrailingSlash = (str: string): string =>
  str.replace(/\/$/, '')

export const generateCanonicalUrl = (
  projectUrl: string,
  pagePathWithParams: string
): string => {
  const pagePath = removeTrailingSlash(stripQueryParams(pagePathWithParams))

  return `${removeTrailingSlash(projectUrl)}${pagePath}`
}
