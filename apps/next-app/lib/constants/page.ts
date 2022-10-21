import type { PageParameters } from '~/lib/types/page'

// TODO: [SAT-1861] [SAT-1862] [SAT-1865] [SAT-1866] [SAT-1869] Add proper meta for all pages
export const PAGE_PARAMETERS: Record<string, PageParameters> = {
  default: {
    pageTitle: 'Hastebin | Toptal®',
    pageDescription:
      'Sharing code is a good thing, and it should be really easy to do it.'
  }
}
