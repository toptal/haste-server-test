import type { Request, Response, NextFunction } from 'express'
import { ReasonPhrases, StatusCodes } from 'http-status-codes'

import { ApiError } from '~/lib/error'

const errorHandlerMiddleware = (
  error: string | Error | ApiError | unknown,
  request: Request,
  response: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _: NextFunction
): void => {
  if (error instanceof ApiError) {
    if (request.method === 'HEAD') {
      response.status(error.status).end()
    } else {
      response.status(error.status).json({ message: error.message })
    }
  } else if (error instanceof Error) {
    if (error.message?.toLowerCase().endsWith('request entity too large')) {
      response
        .status(StatusCodes.REQUEST_TOO_LONG)
        .json({ message: ReasonPhrases.REQUEST_TOO_LONG })
    } else {
      response
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: error.message })
    }
  } else if (typeof error === 'string') {
    response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error })
  }
}

export default errorHandlerMiddleware
