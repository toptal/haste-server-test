import type { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import winston from 'winston'
import { getUserByBinId } from '@hastebin/db-wrapper'
import { ErrorType } from '@hastebin/data-store-helper'

import { responseMessages } from '../constants'

import { config } from '~/config/config'

const blockedUserCheckerMiddleware = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<void> => {
  const [key] = request.params.id.split('.')

  if (!config.userAuthEnabled || !key) {
    next()

    return
  }

  winston.info('Checking if user is blocked for bin', key)
  try {
    const user = await getUserByBinId(key)

    if (user.blocked) {
      winston.info('User is blocked. Responding with 403', key)

      response
        .status(StatusCodes.FORBIDDEN)
        .end(responseMessages.binOwnerBlocked())

      return
    }

    winston.info('User is not blocked. Continuing', key)

    next()
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : ErrorType.FETCH_USER_ERROR

    winston.error('Error while checking if user is blocked', errorMessage)

    response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error })
  }
}

export default blockedUserCheckerMiddleware
