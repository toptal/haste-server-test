import { ReasonPhrases, StatusCodes } from 'http-status-codes'

import ApiError from './api-error'

export default class InternalServerError extends ApiError {
  constructor(message?: string) {
    super(
      ReasonPhrases.INTERNAL_SERVER_ERROR,
      StatusCodes.INTERNAL_SERVER_ERROR,
      message
    )
  }
}
