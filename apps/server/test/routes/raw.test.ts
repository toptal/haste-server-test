import { Router } from 'express'

import { mockDocumentHandler } from '../mock/document-handler'

import initRawRoutes from '~/routes/raw'
import blockedUserCheckerMiddleware from '~/middleware/blocked-owner-checker'

jest.mock('express')

const mockRouter = Router as jest.MockedFunction<typeof Router>
const mockRouterInstance = {
  get: jest.fn(),
  head: jest.fn()
}

mockRouter.mockReturnValue(mockRouterInstance as unknown as Router)

const getAndHeadPath = '/:id'

describe('Raw routes', () => {
  let router: Router

  beforeEach(() => {
    router = initRawRoutes(mockDocumentHandler)
  })

  it('creates router', () => {
    expect(mockRouter).toHaveBeenCalled()
  })

  it('adds get handler', () => {
    expect(mockRouterInstance.get).toHaveBeenCalledWith(
      getAndHeadPath,
      blockedUserCheckerMiddleware,
      mockDocumentHandler.getRawDocument
    )
  })

  it('adds head handler', () => {
    expect(mockRouterInstance.head).toHaveBeenCalledWith(
      getAndHeadPath,
      blockedUserCheckerMiddleware,
      mockDocumentHandler.getRawDocument
    )
  })

  it('returns the router', () => {
    expect(router).toEqual(mockRouterInstance)
  })
})
