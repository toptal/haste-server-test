import type { NextFunction, Request, Response } from 'express'
import winston from 'winston'
import { getUserByToken } from '@hastebin/db-wrapper'
import { StatusCodes } from 'http-status-codes'
import { ErrorType } from '@hastebin/data-store-helper'

import { responseMessages } from '../constants'

import { config } from '~/config/config'

const extractTokenFromHeader = (request: Request): string | null => {
  const bearerHeader = request.headers.authorization

  if (typeof bearerHeader !== 'undefined') {
    const [, bearerToken] = bearerHeader.split(' ')

    return bearerToken
  } else {
    return null
  }
}

const tokenValidatorMiddleware = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<void> => {
  winston.info('Starting token validation')

  const bearerToken = extractTokenFromHeader(request)

  if (!bearerToken) {
    winston.info('No token present. Return 401 Unauthorized.')

    response.status(StatusCodes.UNAUTHORIZED).json({
      error: new Error(responseMessages.unauthorizedRequest()).toString()
    })

    return
  }

  let user

  try {
    user = await getUserByToken(bearerToken)

    winston.info('Valid token present. Proceed as authenticated request.')
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : ErrorType.FETCH_USER_ERROR

    if (errorMessage === ErrorType.USER_NOT_FOUND) {
      winston.info('Invalid token present. Return 401 Unauthorized.')
      response.sendStatus(StatusCodes.UNAUTHORIZED)

      return
    }

    winston.error('An error has occurred while validating the token', error)
    response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error })

    return
  }

  const userBlocked = user.blocked

  if (userBlocked) {
    winston.info('User is blocked. Exiting with 403.')

    response
      .status(StatusCodes.FORBIDDEN)
      .json({ message: responseMessages.userBlocked(config.emailContact) })

    return
  }

  request.userId = user.id
  next()
}

export default tokenValidatorMiddleware
