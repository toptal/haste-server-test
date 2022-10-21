import { NextRequest, NextResponse } from 'next/server'

import routes from './lib/constants/routes'

import { BASE_PATH } from '~/lib/constants/common'

export default function middleware(request: NextRequest): NextResponse {
  const { nextUrl, url } = request

  if (nextUrl.pathname.startsWith(routes.share)) {
    if (!nextUrl.basePath) {
      return NextResponse.rewrite(
        new URL(`${BASE_PATH}${nextUrl.pathname}`, url)
      )
    } else {
      if (process.env.NEXT_PUBLIC_BIN_ON_BASEPATH === 'disabled') {
        return NextResponse.rewrite(new URL(`${BASE_PATH}/404`, url))
      }

      return NextResponse.rewrite(nextUrl)
    }
  }

  return NextResponse.next()
}
