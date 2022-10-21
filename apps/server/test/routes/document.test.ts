import { Router } from 'express'

import { mockDocumentHandler } from '../mock/document-handler'

import initDocumentRoutes from '~/routes/document'
import blockedUserCheckerMiddleware from '~/middleware/blocked-owner-checker'
import documentRecorderMiddleware from '~/middleware/document-recorder'

jest.mock('express')

const mockRouter = Router as jest.MockedFunction<typeof Router>
const mockRouterInstance = {
  get: jest.fn(),
  head: jest.fn(),
  post: jest.fn()
}

mockRouter.mockReturnValue(mockRouterInstance as unknown as Router)

const getAndHeadPath = '/:id'
const postPath = '/'

describe('Document routes', () => {
  let router: Router

  beforeEach(() => {
    router = initDocumentRoutes(mockDocumentHandler)
  })

  it('creates router', () => {
    expect(mockRouter).toHaveBeenCalled()
  })

  it('adds get handler', () => {
    expect(mockRouterInstance.get).toHaveBeenCalledWith(
      getAndHeadPath,
      blockedUserCheckerMiddleware,
      mockDocumentHandler.getDocument
    )
  })

  it('adds head handler', () => {
    expect(mockRouterInstance.head).toHaveBeenCalledWith(
      getAndHeadPath,
      blockedUserCheckerMiddleware,
      mockDocumentHandler.getDocument
    )
  })

  it('adds post handler', () => {
    expect(mockRouterInstance.post).toHaveBeenCalledWith(
      postPath,
      mockDocumentHandler.addDocument,
      documentRecorderMiddleware
    )
  })

  it('returns the router', () => {
    expect(router).toEqual(mockRouterInstance)
  })
})
