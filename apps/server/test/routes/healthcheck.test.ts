import { Router } from 'express'
import { StatusCodes } from 'http-status-codes'

import healthcheck from '~/lib/healthcheck'

import initHealthCheckRoute from '~/routes/healthcheck'

jest.mock('express')
jest.mock('~/lib/healthcheck')

const mockHealthcheck = healthcheck as jest.MockedFunction<typeof healthcheck>

const mockHealthcheckReturn = 'mock-healthcheck'

mockHealthcheck.mockReturnValue(
  mockHealthcheckReturn as unknown as ReturnType<typeof healthcheck>
)

const mockRouter = Router as jest.MockedFunction<typeof Router>
const mockRouterInstance = {
  get: jest.fn()
}

mockRouter.mockReturnValue(mockRouterInstance as unknown as Router)

describe('Healthcheck route', () => {
  let router: Router

  beforeEach(() => {
    router = initHealthCheckRoute()
  })

  it('creates router', () => {
    expect(mockRouter).toHaveBeenCalled()
  })

  it('adds get handler', async () => {
    const mockJson = { json: jest.fn() }
    const mockStatus = jest.fn(() => mockJson)
    const mockRes = { status: mockStatus }
    const cb = mockRouterInstance.get.mock.lastCall[1]

    await cb(null, mockRes)

    expect(mockRouterInstance.get).toHaveBeenCalledWith(
      '/',
      expect.any(Function)
    )
    expect(mockHealthcheck).toHaveBeenCalled()
    expect(mockStatus).toHaveBeenCalledWith(StatusCodes.OK)
    expect(mockJson.json).toHaveBeenCalledWith(mockHealthcheckReturn)
  })

  it('returns the router', () => {
    expect(router).toEqual(mockRouterInstance)
  })
})
