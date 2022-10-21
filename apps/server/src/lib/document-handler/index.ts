import type { Request, Response, NextFunction } from 'express'
import winston from 'winston'
import { StatusCodes } from 'http-status-codes'
import { ErrorType, Store } from '@hastebin/data-store-helper'

import type {
  Document,
  DocumentHandlerInterface
} from '~/types/document-handler'
import type { Config } from '~/types/config'
import { DEFAULT_KEY_LENGTH } from '~/constants/index'
import KeyGenerator from '~/lib/key-generators'
import {
  NotFoundError,
  InternalServerError,
  MissingInputError
} from '~/lib/error'

import { isForm } from '../helpers/content-type'

import { contentType } from './content-type'

class DocumentHandler implements DocumentHandlerInterface {
  keyLength: number

  maxLength?: number

  store: Store

  keyGenerator: KeyGenerator

  config: Config

  constructor({ keyLength, maxLength, store, config, keyGenerator }: Document) {
    this.keyLength = keyLength || DEFAULT_KEY_LENGTH
    this.maxLength = maxLength
    this.store = store
    this.config = config
    this.keyGenerator = keyGenerator
  }

  getDocumentInternal = async (
    request: Request,
    response: Response,
    next: NextFunction,
    raw?: boolean
  ): Promise<void> => {
    const [key] = request.params.id.split('.')
    const documentStr = raw ? 'raw document' : 'document'

    try {
      const document = await this.store.get(key, false)

      winston.info(`retrieved ${documentStr}`, { key })
      response.status(StatusCodes.OK)
      raw && response.setHeader('content-type', contentType.text)

      if (request.method === 'HEAD') {
        raw ? response.send() : response.json({})
      } else {
        raw ? response.send(document) : response.json({ data: document, key })
      }
    } catch (error) {
      if (
        error instanceof Error &&
        error.message === ErrorType.DOCUMENT_NOT_FOUND
      ) {
        winston.info(`${documentStr} not found`, { key })

        next(new NotFoundError(error.message))

        return
      }

      const errorMessage = (error as Error)?.message ?? error

      winston.error(ErrorType.GET_DOCUMENT_ERROR, {
        documentStr,
        key,
        errorMessage
      })

      next(new InternalServerError(errorMessage))
    }
  }

  getRawDocument = async (
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> => this.getDocumentInternal(request, response, next, true)

  getDocument = async (
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> => this.getDocumentInternal(request, response, next)

  addDocument = async (
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> => {
    if (!request.body || Object.keys(request.body).length === 0) {
      next(new MissingInputError(ErrorType.EMPTY_BODY))

      return
    }

    try {
      let data = ''

      if (isForm(request)) {
        data = request.body.data
      } else {
        data = request.body.toString()
      }

      const key = await this.getUniqueKey()

      await this.store.set(key, data)

      request.documentKey = key

      winston.info('added document', { key })

      response.status(StatusCodes.OK).json({ key })
      next()
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : ErrorType.ADD_DOCUMENT_ERROR

      winston.error('error adding document', { errorMessage })

      next(new InternalServerError(errorMessage))
    }
  }

  async getUniqueKey(): Promise<string> {
    const key = this.createKey()

    if (!key) {
      return ''
    }

    try {
      await this.store.get(key, true)
    } catch (error) {
      return key
    }

    return this.getUniqueKey()
  }

  createKey = (): string => this.keyGenerator.createKey(this.keyLength)
}

export default DocumentHandler
