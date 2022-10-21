import { NextRequest, NextResponse } from 'next/server'

import middleware from '../../middleware'

jest.mock('next/server', () => ({
  NextRequest: jest.fn(),
  NextResponse: {
    rewrite: jest.fn(),
    next: jest.fn()
  }
}))

const url = 'http://localhost:3000'

const createMockRequest = (basePath: string, pathname: string): NextRequest => {
  return {
    nextUrl: {
      basePath,
      pathname
    },
    url
  } as unknown as NextRequest
}

describe('Middleware function', () => {
  describe('when route is /share', () => {
    it('rewrites url when the there is no basePath', () => {
      const pathname = '/share/2'
      const basePath = ''

      middleware(createMockRequest(basePath, pathname))

      expect(NextResponse.rewrite).toHaveBeenCalledWith(
        new URL(`http://localhost:3000${pathname}`)
      )
    })

    it('rewrites url when these is basePath', () => {
      const basePath = '/developers/test'
      const pathname = '/share/2'

      middleware(createMockRequest(basePath, pathname))

      expect(NextResponse.rewrite).toHaveBeenCalledWith({
        basePath,
        pathname
      })
    })
  })

  it('calls next function for other routes', () => {
    const basePath = '/developers/test'
    const pathname = '/some-route'

    middleware(createMockRequest(basePath, pathname))

    expect(NextResponse.next).toHaveBeenCalled()
  })
})
