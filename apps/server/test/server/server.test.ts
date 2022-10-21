import express from 'express'
import cors from 'cors'
import connectRateLimit from 'connect-ratelimit'
import dotenv from 'dotenv'
import winston from 'winston'
import formData from 'express-form-data'

import addLogging from '~/lib/helpers/log'
import { Config } from '~/types/config'
import buildDocumentHandler from '~/lib/document-handler/builder'
import { DocumentHandlerInterface } from '~/types/document-handler'

import { config } from '../../config/config'

import initDocumentRoutes from '~/routes/document'
import initRawRoutes from '~/routes/raw'
import tokenValidatorMiddleware from '~/middleware/token-validator'
import { server } from '~/server/server'
import initHealthCheckRoute from '~/routes/healthcheck'
import errorHandlerMiddleware from '~/middleware/error-handler'

jest.mock('express-form-data', () => ({
  __esModule: true,
  default: {
    parse: jest.fn()
  }
}))

jest.mock('winston', () => ({
  __esModule: true,
  default: {
    info: jest.fn()
  }
}))

const spiedInfoLog = jest.spyOn(winston, 'info')

jest.mock('~/routes/healthcheck')

const mockInitHealthCheckRoute = initHealthCheckRoute as jest.MockedFunction<
  typeof initHealthCheckRoute
>

const mockInitHealthCheckRouteReturn = 'mock-init-health-check-route-return'

mockInitHealthCheckRoute.mockReturnValue(
  mockInitHealthCheckRouteReturn as unknown as ReturnType<
    typeof initHealthCheckRoute
  >
)

jest.mock('~/routes/raw')

const mockInitRawRoutes = initRawRoutes as jest.MockedFunction<
  typeof initRawRoutes
>

const mockInitRawRoutesReturn = 'mock-init-raw-routes-return'

mockInitRawRoutes.mockReturnValue(
  mockInitRawRoutesReturn as unknown as ReturnType<typeof initRawRoutes>
)

jest.mock('~/routes/document')

const mockInitDocumentRoutes = initDocumentRoutes as jest.MockedFunction<
  typeof initDocumentRoutes
>

const mockInitDocumentRoutesReturn = 'mock-init-document-routes-return'

mockInitDocumentRoutes.mockReturnValue(
  mockInitDocumentRoutesReturn as unknown as ReturnType<
    typeof initDocumentRoutes
  >
)

jest.mock('~/lib/document-handler/builder', () => ({
  __esModule: true,
  default: jest.fn(() => ({ getDocument: jest.fn() }))
}))

const mockBuildDocumentHandler = buildDocumentHandler as jest.MockedFunction<
  typeof buildDocumentHandler
>

const mockBuildDocumentHandlerReturn = 'mock-build-document-handler-return'

mockBuildDocumentHandler.mockReturnValue(
  mockBuildDocumentHandlerReturn as unknown as Promise<DocumentHandlerInterface>
)

jest.mock('dotenv', () => ({ config: jest.fn() }))

jest.mock('~/middleware/token-validator', () => 'token-validator')

jest.mock('cors')

const mockCors = cors as jest.MockedFunction<typeof cors>

const mockCorsReturn = 'cors-is-mocked'

mockCors.mockReturnValue(mockCorsReturn as unknown as ReturnType<typeof cors>)

jest.mock('~/lib/helpers/log')

jest.mock('connect-ratelimit')

const mockConnectRatelimit = connectRateLimit as jest.MockedFunction<
  typeof connectRateLimit
>

const mockConnectRatelimitReturn = 'connect-ratelimit-return'

mockConnectRatelimit.mockReturnValue(
  mockConnectRatelimitReturn as unknown as ReturnType<typeof connectRateLimit>
)

jest.mock('express', () => {
  const mockListen = jest.fn((port, host, cb) => cb())
  const mockUse = jest.fn()
  const mockSet = jest.fn()
  const mockRaw = jest.fn(() => 'express-raw-return')
  const mockRouterGet = jest.fn()
  const mockRouterPost = jest.fn()
  const mockRouterHead = jest.fn()

  const mockRouter = jest.fn(() => ({
    get: mockRouterGet,
    post: mockRouterPost,
    head: mockRouterHead
  }))

  const mockApp = {
    listen: mockListen,
    use: mockUse,
    raw: mockRaw,
    set: mockSet
  }

  const mockExpress = jest.fn(() => mockApp)

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  mockExpress.Router = mockRouter
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  mockExpress.raw = mockRaw

  return {
    __esModule: true,
    default: mockExpress,
    Router: mockRouter
  }
})

describe('Server', () => {
  const originalEnv = { ...process.env }

  let mockUse: jest.MockedFunction<ReturnType<typeof express>['use']>

  beforeEach(async () => {
    mockUse = express().use as jest.MockedFunction<
      ReturnType<typeof express>['use']
    >

    await server()
  })

  afterEach(() => {
    process.env = { ...originalEnv }

    jest.clearAllMocks()
  })

  it('sets environment variables', () => {
    expect(dotenv.config).toHaveBeenCalled()
  })

  it('adds the logging', () => {
    expect(addLogging).toHaveBeenCalledWith(config)
  })

  it('instantiates the app', () => {
    expect(express).toHaveBeenCalled()
  })

  it('enables cors', () => {
    expect(mockUse).toHaveBeenCalledWith(mockCorsReturn)
  })

  it('enables trust proxy', () => {
    const mockSet = express().set

    expect(mockSet).toHaveBeenCalledWith('trust proxy', true)
  })

  describe('rate limits', () => {
    const originalRateLimits: Config['rateLimits'] = { ...config.rateLimits }

    beforeEach(() => {
      jest.clearAllMocks()
    })

    afterAll(() => {
      config.rateLimits = { ...originalRateLimits }
    })

    it('enables rate limits when they are set in config', async () => {
      config.rateLimits = {} as Config['rateLimits']

      await server()

      expect(mockConnectRatelimit).toHaveBeenCalledWith({ end: true })
      expect(mockUse).toHaveBeenCalledWith(mockConnectRatelimitReturn)
    })

    it('skips rate limits setup when no config provided', async () => {
      config.rateLimits = null as unknown as Config['rateLimits']

      await server()

      expect(mockUse).not.toHaveBeenCalledWith(mockConnectRatelimitReturn)
    })
  })

  describe('token validation', () => {
    beforeEach(() => {
      jest.clearAllMocks()
    })

    it('is enabled via config', async () => {
      config.userAuthEnabled = true

      await server()

      expect(mockUse).toHaveBeenCalledWith(tokenValidatorMiddleware)
    })

    it('is disabled via config', async () => {
      config.userAuthEnabled = false

      await server()

      expect(mockUse).not.toHaveBeenCalledWith(tokenValidatorMiddleware)
    })
  })

  it('enables form data parsing', () => {
    expect(formData.parse).toHaveBeenCalledWith({})
  })

  it('uses express raw', () => {
    const mockRaw = express.raw

    expect(mockRaw).toHaveBeenCalledWith({
      type: '*/*',
      limit: config.maxLength
    })
    expect(mockUse).toHaveBeenCalledWith('express-raw-return')
  })

  it('creates necessary routes', () => {
    expect(mockBuildDocumentHandler).toHaveBeenCalledWith(config)
    expect(mockInitDocumentRoutes).toHaveBeenCalledWith(
      mockBuildDocumentHandlerReturn
    )

    expect(mockInitRawRoutes).toHaveBeenCalledWith(
      mockBuildDocumentHandlerReturn
    )

    expect(mockUse).toHaveBeenCalledWith(
      `${config.basePath}/documents`,
      mockInitDocumentRoutesReturn
    )

    expect(mockUse).toHaveBeenCalledWith(
      `${config.basePath}/raw`,
      mockInitRawRoutesReturn
    )

    expect(mockUse).toHaveBeenCalledWith(
      `${config.basePath}/healthcheck`,
      mockInitHealthCheckRouteReturn
    )
  })

  it('adds error handling', () => {
    expect(mockUse).toHaveBeenCalledWith(errorHandlerMiddleware)
  })

  it('logs success message on server start', () => {
    const mockListen = express().listen as unknown as jest.MockedFunction<
      (port: number, hostname: string, callback: () => undefined) => undefined
    >

    const lastCall = mockListen.mock.calls[mockListen.mock.calls.length - 1]

    lastCall[2]()

    expect(mockListen).toHaveBeenCalledTimes(1)

    expect(mockListen).toHaveBeenCalledWith(
      config.port,
      config.host,
      expect.any(Function)
    )

    expect(spiedInfoLog).toHaveBeenCalledWith(
      `listening on ${config.host}:${config.port}`
    )
  })
})
