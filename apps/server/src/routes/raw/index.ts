import { Router } from 'express'

import type { DocumentHandlerInterface } from '~/types/document-handler'

import blockedOwnerCheckerMiddleware from '~/middleware/blocked-owner-checker'

const routes = (documentHandler: DocumentHandlerInterface): Router => {
  const router = Router()

  router.get(
    '/:id',
    blockedOwnerCheckerMiddleware,
    documentHandler.getRawDocument
  )

  router.head(
    '/:id',
    blockedOwnerCheckerMiddleware,
    documentHandler.getRawDocument
  )

  return router
}

export default routes
