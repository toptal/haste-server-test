import { StatusCodes, ReasonPhrases } from 'http-status-codes'

import ApiError from './api-error'

export default class NotFoundError extends ApiError {
  constructor(message?: string) {
    super(ReasonPhrases.NOT_FOUND, StatusCodes.NOT_FOUND, message)
  }
}
