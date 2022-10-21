import type { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import winston from 'winston'
import { recordDocument } from '@hastebin/db-wrapper'
import { ErrorType } from '@hastebin/data-store-helper'

import { config } from '~/config/config'

const documentRecorderMiddleware = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<void> => {
  if (
    !config.userAuthEnabled ||
    response.statusCode !== StatusCodes.OK ||
    !request.userId ||
    !request.documentKey
  ) {
    next()

    return
  }
  winston.info('Recording document-user relationship')

  const { userId, documentKey } = request

  try {
    await recordDocument(documentKey, userId, request.ip)

    winston.info(
      'Document-user relationship recorded',
      request.userId,
      request.documentKey
    )
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : ErrorType.ADD_DOCUMENT_ERROR

    winston.error(
      'Error while recording document-user relationship',
      errorMessage
    )
  }

  next()
}

export default documentRecorderMiddleware
