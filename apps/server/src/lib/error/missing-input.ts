import { ReasonPhrases, StatusCodes } from 'http-status-codes'

import ApiError from './api-error'

export default class MissingInputError extends ApiError {
  constructor(message?: string) {
    super(ReasonPhrases.BAD_REQUEST, StatusCodes.BAD_REQUEST, message)
  }
}
