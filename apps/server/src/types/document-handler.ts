import type { Request, Response, NextFunction } from 'express'
import { Store } from '@hastebin/data-store-helper'

import KeyGenerator from '~/lib/key-generators'

import type { Config } from './config'

export type Document = {
  store: Store
  config: Config
  keyGenerator: KeyGenerator
  maxLength?: number
  keyLength?: number
}

export interface Documents {
  about: string
}

export interface DocumentHandlerInterface {
  maxLength?: number

  getDocument(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void>

  addDocument(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void>

  getRawDocument(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void>
}
