import { Request } from 'express'

import { getContentType } from '~/lib/helpers/content-type'

describe('Content type', () => {
  it('gets correct content-type when it is present', () => {
    expect(
      getContentType({ headers: { 'content-type': 'one; two' } } as Request)
    ).toEqual('one')
  })

  it('returns undefined if the header is missing', () => {
    expect(getContentType({ headers: {} } as Request)).toBeUndefined()
  })
})
