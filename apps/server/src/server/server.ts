import express, { Express } from 'express'
import winston from 'winston'
import connectRateLimit from 'connect-ratelimit'
import cors from 'cors'
import formData from 'express-form-data'

import buildDocumentHandler from '~/lib/document-handler/builder'
import type { DocumentHandlerInterface } from '~/types/document-handler'
import addLogging from '~/lib/helpers/log'

import { config } from '~/config/config'
import tokenValidatorMiddleware from '~/middleware/token-validator'
import errorHandlerMiddleware from '~/middleware/error-handler'
import initDocumentRoutes from '~/routes/document'
import initRawRoutes from '~/routes/raw'
import initHealthCheckRoute from '~/routes/healthcheck'

export const server = async (): Promise<void> => {
  const { rateLimits, host, port } = config

  const documentHandler: DocumentHandlerInterface = await buildDocumentHandler(
    config
  )

  addLogging(config)

  const app: Express = express()

  app.use(cors())
  app.set('trust proxy', true)

  if (rateLimits) {
    rateLimits.end = true

    app.use(connectRateLimit(rateLimits))
  }

  if (config.userAuthEnabled) {
    app.use(tokenValidatorMiddleware)
  }

  app.use(formData.parse({}))
  app.use(express.raw({ type: '*/*', limit: config.maxLength }))

  app.use(`${config.basePath}/documents`, initDocumentRoutes(documentHandler))

  app.use(`${config.basePath}/raw`, initRawRoutes(documentHandler))
  app.use(`${config.basePath}/healthcheck`, initHealthCheckRoute())

  app.use(errorHandlerMiddleware)

  app.listen(port, host, () => {
    winston.info(`listening on ${host}:${port}`)
  })
}
