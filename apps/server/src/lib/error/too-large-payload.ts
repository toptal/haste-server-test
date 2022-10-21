import { ReasonPhrases, StatusCodes } from 'http-status-codes'

import ApiError from './api-error'

export default class TooLargePayloadError extends ApiError {
  constructor(message?: string) {
    super(ReasonPhrases.REQUEST_TOO_LONG, StatusCodes.REQUEST_TOO_LONG, message)
  }
}
